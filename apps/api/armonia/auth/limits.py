from __future__ import annotations

import time
from collections import defaultdict
from threading import Lock

from fastapi import HTTPException, Request

_LOCK = Lock()
_BUCKETS: dict[str, list[float]] = defaultdict(list)


def rate_limit(request: Request, *, key: str, limit: int, window_sec: int) -> None:
    """Sliding-window rate limit. key is logical bucket (auth|ai|broadcast)."""
    ip = request.client.host if request.client else "unknown"
    bucket = f"{key}:{ip}"
    now = time.time()
    with _LOCK:
        hits = [t for t in _BUCKETS[bucket] if now - t < window_sec]
        if len(hits) >= limit:
            raise HTTPException(
                status_code=429,
                detail={"error": "Too many requests", "code": "rate_limited", "retryAfter": window_sec},
            )
        hits.append(now)
        _BUCKETS[bucket] = hits


# Login lockout by profile
_FAILS: dict[str, list[float]] = defaultdict(list)


def note_login_fail(profile_id: str) -> None:
    with _LOCK:
        now = time.time()
        fails = [t for t in _FAILS[profile_id] if now - t < 900]
        fails.append(now)
        _FAILS[profile_id] = fails


def clear_login_fails(profile_id: str) -> None:
    with _LOCK:
        _FAILS.pop(profile_id, None)


def assert_not_locked(profile_id: str, max_fails: int = 8) -> None:
    with _LOCK:
        now = time.time()
        fails = [t for t in _FAILS.get(profile_id, []) if now - t < 900]
        _FAILS[profile_id] = fails
        if len(fails) >= max_fails:
            raise HTTPException(
                status_code=429,
                detail={"error": "Account temporarily locked", "code": "locked", "retryAfter": 900},
            )
