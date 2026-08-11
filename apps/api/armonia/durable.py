"""Durable KV for Armonia v2 — Neon Postgres when DATABASE_URL is set, else none.

Mirrors root db.py kv_store so the API can survive Vercel cold starts without
shipping the whole legacy module into the apps/api deploy.
"""

from __future__ import annotations

import json
import os
import threading
import time
from contextlib import contextmanager
from typing import Any, Iterator
from urllib.parse import urlparse

from armonia.env_aliases import apply_env_aliases

_LOCK = threading.RLock()
_INITIALIZED = False
KV_KEY = "armonia_v2_state"


def _database_url() -> str:
    apply_env_aliases()
    return (
        os.environ.get("DATABASE_URL")
        or os.environ.get("POSTGRES_URL")
        or os.environ.get("POSTGRES_PRISMA_URL")
        or ""
    ).strip()


def using_postgres() -> bool:
    url = _database_url().lower()
    return url.startswith("postgres://") or url.startswith("postgresql://")


def durable_available() -> bool:
    return using_postgres()


@contextmanager
def _connect() -> Iterator[Any]:
    import psycopg
    from psycopg.rows import dict_row

    conn = psycopg.connect(_database_url(), connect_timeout=8, row_factory=dict_row)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_schema() -> None:
    global _INITIALIZED
    if not using_postgres():
        return
    with _LOCK:
        if _INITIALIZED:
            return
        with _connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS kv_store (
                  key TEXT PRIMARY KEY,
                  value JSONB NOT NULL,
                  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
                """
            )
        _INITIALIZED = True


def get_json(key: str, default: Any = None) -> Any:
    if not using_postgres():
        return default
    init_schema()
    with _LOCK:
        with _connect() as conn:
            row = conn.execute("SELECT value FROM kv_store WHERE key = %s", (key,)).fetchone()
            if not row:
                return default
            value = row["value"]
            return value if value is not None else default


def set_json(key: str, value: Any) -> None:
    if not using_postgres():
        return
    init_schema()
    payload = json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False)
    with _LOCK:
        with _connect() as conn:
            conn.execute(
                """
                INSERT INTO kv_store (key, value, updated_at)
                VALUES (%s, %s::jsonb, NOW())
                ON CONFLICT (key) DO UPDATE
                  SET value = EXCLUDED.value, updated_at = NOW()
                """,
                (key, payload),
            )


def health() -> dict[str, Any]:
    if not using_postgres():
        return {"ok": False, "backend": "memory", "error": "DATABASE_URL not set"}
    try:
        init_schema()
        with _connect() as conn:
            conn.execute("SELECT 1")
        host = urlparse(_database_url()).hostname or ""
        return {"ok": True, "backend": "postgres", "host": host}
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "backend": "postgres", "error": str(exc)[:200]}


def load_state_blob() -> dict[str, Any] | None:
    raw = get_json(KV_KEY)
    return raw if isinstance(raw, dict) else None


def save_state_blob(state: dict[str, Any]) -> bool:
    if not using_postgres():
        return False
    set_json(KV_KEY, state)
    return True
