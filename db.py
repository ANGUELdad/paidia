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

DATABASE_URL = (
    os.environ.get("DATABASE_URL")
    or os.environ.get("POSTGRES_URL")
    or os.environ.get("POSTGRES_PRISMA_URL")
    or ""
).strip()

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


def db_enabled() -> bool:
    """Always on: SQLite locally, Postgres when DATABASE_URL points at postgres."""
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
