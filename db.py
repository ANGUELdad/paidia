"""Durable app state — SQLite locally, Postgres on Vercel when DATABASE_URL is set.

UI/code deploys freely. Predetermined + operational data lives here:
auth profiles, PIN overrides, passkeys, shared ops (lists/stock), talk,
onboarding, security pepper/IPs, and security event log.
"""

from __future__ import annotations

import json
import os
import sqlite3
import threading
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator
from urllib.parse import urlparse, unquote

_LOCK = threading.RLock()
_INITIALIZED = False

# Vercel has no IPv6 egress. Direct db.<ref>.supabase.co:5432 and unpooled Neon
# hosts resolve to IPv6 and fail with "Cannot assign requested address".
POOLER_REQUIRED_HINT = (
    "DATABASE_URL is a direct (non-pooled) host. Vercel cannot open IPv6 sockets. "
    "Use an IPv4 pooler: Supabase Transaction mode "
    "postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-0-<REGION>.pooler.supabase.com:6543/postgres?sslmode=require "
    "or a Neon pooled host that contains '-pooler' (not db.<ref>.supabase.co:5432 / ep-*.neon.tech:5432)."
)


def postgres_pooler_error(url: str) -> str | None:
    """Return a hard error if this Postgres URL will fail on Vercel (direct / IPv6)."""
    raw = (url or "").strip()
    if not raw.lower().startswith(("postgres://", "postgresql://")):
        return None
    parsed = urlparse(raw)
    host = (parsed.hostname or "").lower()
    port = parsed.port or 5432
    if "pooler.supabase.com" in host:
        return None
    if "neon.tech" in host and "pooler" in host:
        return None
    if host.startswith("db.") and host.endswith("supabase.co"):
        return POOLER_REQUIRED_HINT
    if host.endswith("neon.tech") and "pooler" not in host:
        return POOLER_REQUIRED_HINT
    if port == 5432 and ("supabase.co" in host or host.endswith("neon.tech")):
        return POOLER_REQUIRED_HINT
    return None


# Vercel's Postgres integrations each inject their own variable names, and a
# project can carry more than one at a time: a retired Neon store keeps
# re-supplying DATABASE_URL on every deploy while the live Supabase install
# lands as (optionally prefixed) POSTGRES_URL. Name order alone would pick the
# dead one, so candidates are filtered through postgres_pooler_error first and
# only fall back to name order when nothing is reachable.
def _postgres_candidates() -> Iterator[str]:
    for name in ("PAIDIA_DATABASE_URL", "DATABASE_URL", "POSTGRES_URL", "POSTGRES_PRISMA_URL"):
        value = (os.environ.get(name) or "").strip()
        if value:
            yield value
    # Marketplace installs allow a custom variable prefix, so a Supabase store
    # can arrive as A_POSTGRES_URL. POSTGRES_URL_NON_POOLING is excluded by
    # construction: it does not end in _POSTGRES_URL.
    for name in sorted(os.environ):
        if name.endswith("_POSTGRES_URL"):
            value = (os.environ.get(name) or "").strip()
            if value:
                yield value


# The retired Neon store still accepts TCP connections — it fails later, on
# quota — so reachability alone will not demote it. Rank it below any other
# provider and let name order break ties inside a rank.
def _postgres_rank(url: str) -> int:
    host = (urlparse(url).hostname or "").lower()
    retired = host.endswith("neon.tech")
    unreachable = postgres_pooler_error(url) is not None
    return (2 if unreachable else 0) + (1 if retired else 0)


def _discover_postgres_url() -> str:
    """Prefer a Postgres URL Vercel can actually use over one it merely found first."""
    override = (os.environ.get("PAIDIA_DATABASE_URL") or "").strip()
    if override:
        return override
    candidates = list(dict.fromkeys(_postgres_candidates()))
    if not candidates:
        return ""
    return min(enumerate(candidates), key=lambda pair: (_postgres_rank(pair[1]), pair[0]))[1]


DATABASE_URL = _discover_postgres_url()


def assert_pooled_database_url(url: str | None = None) -> None:
    """Startup assertion: refuse direct Postgres hosts that Vercel cannot reach."""
    err = postgres_pooler_error(url if url is not None else DATABASE_URL)
    if err:
        raise RuntimeError(err)

def _default_sqlite_path() -> Path:
    if os.environ.get("VERCEL") == "1":
        path = Path("/tmp/paidia/paidia.db")
        path.parent.mkdir(parents=True, exist_ok=True)
        return path
    return Path(os.environ.get("PAIDIA_SQLITE_PATH", ".paidia.db"))


SQLITE_PATH = _default_sqlite_path()


# ── Redis-REST backend (Vercel KV / Upstash) ──────────────────────────────
# A second durable option that is not Postgres. The store is key-value, which is
# exactly the shape this module already exposes, and it is private + token
# authenticated — unlike Blob, whose objects are served over URLs.
# Vercel injects KV_REST_API_URL / KV_REST_API_TOKEN when a KV store is linked.
# Marketplace integrations inject different names for the same REST endpoint:
# the legacy Vercel KV pair, and Upstash's own pair. Accept either.
KV_URL = (
    os.environ.get("KV_REST_API_URL")
    or os.environ.get("UPSTASH_REDIS_REST_URL")
    or ""
).strip().rstrip("/")
KV_TOKEN = (
    os.environ.get("KV_REST_API_TOKEN")
    or os.environ.get("UPSTASH_REDIS_REST_TOKEN")
    or ""
).strip()
KV_PREFIX = os.environ.get("PAIDIA_KV_PREFIX", "paidia:")
KV_TIMEOUT = float(os.environ.get("PAIDIA_KV_TIMEOUT", "8") or 8)


def using_kv() -> bool:
    """True when a Redis-REST store is configured and Postgres is not."""
    return bool(KV_URL and KV_TOKEN) and not DATABASE_URL


def _kv_command(*args: Any) -> Any:
    """Run one Redis command over the REST API. Raises on transport failure."""
    import urllib.error
    import urllib.request

    payload = json.dumps([str(a) for a in args]).encode("utf-8")
    req = urllib.request.Request(
        KV_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {KV_TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=KV_TIMEOUT) as res:
            body = json.loads(res.read() or b"{}")
    except urllib.error.HTTPError as exc:
        detail = ""
        try:
            detail = (exc.read() or b"").decode("utf-8", "replace")[:200]
        except Exception:  # noqa: BLE001
            pass
        raise RuntimeError(f"KV HTTP {exc.code}: {detail}") from exc
    if isinstance(body, dict) and body.get("error"):
        raise RuntimeError(f"KV error: {body['error']}")
    return body.get("result") if isinstance(body, dict) else body


def db_enabled() -> bool:
    """Always on: SQLite locally, Postgres or Redis-REST when configured."""
    return True


def using_postgres() -> bool:
    url = DATABASE_URL.lower()
    return url.startswith("postgres://") or url.startswith("postgresql://")


def _sqlite_path() -> Path:
    if DATABASE_URL.lower().startswith("sqlite:///"):
        raw = DATABASE_URL[10:]
        return Path(unquote(raw) or str(SQLITE_PATH))
    if DATABASE_URL.lower().startswith("sqlite://"):
        raw = DATABASE_URL[9:]
        return Path(unquote(raw) or str(SQLITE_PATH))
    return SQLITE_PATH


@contextmanager
def connect() -> Iterator[Any]:
    if using_postgres():
        import socket
        import psycopg
        from psycopg.rows import dict_row

        assert_pooled_database_url(DATABASE_URL)
        # Vercel serverless has no IPv6 egress. Prefer an A (IPv4) address so
        # psycopg does not waste the connect timeout on AAAA failures first.
        kwargs: dict[str, Any] = {"connect_timeout": 8, "row_factory": dict_row}
        try:
            host = urlparse(DATABASE_URL).hostname
            if host:
                infos = socket.getaddrinfo(host, None, socket.AF_INET, socket.SOCK_STREAM)
                if infos:
                    kwargs["hostaddr"] = infos[0][4][0]
        except OSError:
            pass
        conn = psycopg.connect(DATABASE_URL, **kwargs)
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()
    else:
        path = _sqlite_path()
        path.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(str(path), check_same_thread=False, timeout=30)
        conn.row_factory = sqlite3.Row
        try:
            conn.execute("PRAGMA journal_mode=WAL")
            conn.execute("PRAGMA synchronous=NORMAL")
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()


def init_schema() -> None:
    if using_kv():
        _kv_command("PING")      # fail loudly here rather than on first write
        return
    global _INITIALIZED
    with _LOCK:
        if _INITIALIZED:
            return
        with connect() as conn:
            if using_postgres():
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS kv_store (
                      key TEXT PRIMARY KEY,
                      value JSONB NOT NULL,
                      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                    )
                    """
                )
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS security_events (
                      id BIGSERIAL PRIMARY KEY,
                      ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                      event TEXT NOT NULL,
                      profile_id TEXT,
                      ip TEXT,
                      details JSONB NOT NULL DEFAULT '{}'::jsonb
                    )
                    """
                )
            else:
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS kv_store (
                      key TEXT PRIMARY KEY,
                      value TEXT NOT NULL,
                      updated_at REAL NOT NULL
                    )
                    """
                )
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS security_events (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      ts REAL NOT NULL,
                      event TEXT NOT NULL,
                      profile_id TEXT,
                      ip TEXT,
                      details TEXT NOT NULL DEFAULT '{}'
                    )
                    """
                )
        _INITIALIZED = True


def get_json(key: str, default: Any = None) -> Any:
    if using_kv():
        raw = _kv_command("GET", KV_PREFIX + key)
        if raw is None:
            return default
        try:
            return json.loads(raw)
        except (TypeError, ValueError):
            return default
    init_schema()
    with _LOCK:
        with connect() as conn:
            if using_postgres():
                row = conn.execute(
                    "SELECT value FROM kv_store WHERE key = %s", (key,)
                ).fetchone()
                if not row:
                    return default
                value = row["value"]
                return value if value is not None else default
            row = conn.execute(
                "SELECT value FROM kv_store WHERE key = ?", (key,)
            ).fetchone()
            if not row:
                return default
            try:
                return json.loads(row["value"])
            except (TypeError, json.JSONDecodeError):
                return default


def set_json(key: str, value: Any) -> None:
    if using_kv():
        _kv_command("SET", KV_PREFIX + key, json.dumps(value, ensure_ascii=False))
        return
    init_schema()
    payload = value
    with _LOCK:
        with connect() as conn:
            if using_postgres():
                conn.execute(
                    """
                    INSERT INTO kv_store (key, value, updated_at)
                    VALUES (%s, %s::jsonb, NOW())
                    ON CONFLICT (key) DO UPDATE
                      SET value = EXCLUDED.value, updated_at = NOW()
                    """,
                    (key, json.dumps(payload, ensure_ascii=False, separators=(",", ":"))),
                )
            else:
                raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
                conn.execute(
                    """
                    INSERT INTO kv_store (key, value, updated_at)
                    VALUES (?, ?, ?)
                    ON CONFLICT(key) DO UPDATE SET
                      value = excluded.value,
                      updated_at = excluded.updated_at
                    """,
                    (key, raw, time.time()),
                )


def has_key(key: str) -> bool:
    if using_kv():
        return bool(_kv_command("EXISTS", KV_PREFIX + key))
    init_schema()
    with _LOCK:
        with connect() as conn:
            if using_postgres():
                row = conn.execute(
                    "SELECT 1 AS ok FROM kv_store WHERE key = %s", (key,)
                ).fetchone()
            else:
                row = conn.execute(
                    "SELECT 1 AS ok FROM kv_store WHERE key = ?", (key,)
                ).fetchone()
            return bool(row)


def append_security_event(event: str, profile_id: str | None, ip: str | None, details: dict) -> None:
    if using_kv():
        entry = json.dumps({"ts": int(time.time() * 1000), "event": event,
                            "profile_id": profile_id, "ip": ip, "details": details},
                           ensure_ascii=False)
        listkey = KV_PREFIX + "security_events"
        _kv_command("LPUSH", listkey, entry)
        _kv_command("LTRIM", listkey, 0, 999)   # cap, same intent as the SQL cap
        return
    init_schema()
    details = details if isinstance(details, dict) else {}
    with _LOCK:
        with connect() as conn:
            if using_postgres():
                conn.execute(
                    """
                    INSERT INTO security_events (event, profile_id, ip, details)
                    VALUES (%s, %s, %s, %s::jsonb)
                    """,
                    (
                        event,
                        profile_id,
                        ip,
                        json.dumps(details, ensure_ascii=False, separators=(",", ":")),
                    ),
                )
            else:
                conn.execute(
                    """
                    INSERT INTO security_events (ts, event, profile_id, ip, details)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (
                        time.time(),
                        event,
                        profile_id,
                        ip,
                        json.dumps(details, ensure_ascii=False, separators=(",", ":")),
                    ),
                )


def health() -> dict:
    if using_kv():
        try:
            _kv_command("PING")
            return {"ok": True, "backend": "kv"}
        except Exception as exc:                       # noqa: BLE001
            return {"ok": False, "backend": "kv", "error": str(exc)[:200]}
    try:
        if using_postgres():
            host = urlparse(DATABASE_URL).hostname or ""
            err = postgres_pooler_error(DATABASE_URL)
            if err:
                return {
                    "ok": False,
                    "backend": "postgres",
                    "host": host,
                    "poolerRequired": True,
                    "error": err,
                }
        init_schema()
        with connect() as conn:
            if using_postgres():
                conn.execute("SELECT 1")
                backend = "postgres"
                host = urlparse(DATABASE_URL).hostname or ""
            else:
                conn.execute("SELECT 1")
                backend = "sqlite"
                host = str(_sqlite_path())
        return {"ok": True, "backend": backend, "host": host}
    except Exception as exc:  # noqa: BLE001 — surface to health endpoint
        return {"ok": False, "backend": "postgres" if using_postgres() else "sqlite", "error": str(exc)[:400]}


# Well-known keys used by server.py
KEY_AUTH_USERS = "auth_users"
KEY_AUTH_OVERRIDES = "auth_overrides"
KEY_PASSKEYS = "passkeys"
KEY_OPS = "ops"
KEY_TALK = "talk"
KEY_GALLERY = "gallery"
KEY_ONBOARDING = "onboarding"
KEY_SECURITY = "security_state"
