from __future__ import annotations

import hashlib
import hmac
import secrets
import time
from typing import Any

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import HTTPException, Request, Response

from armonia.config import get_settings
from armonia.store import mutate, snapshot

ph = PasswordHasher()
SESSION_TTL = 60 * 60 * 24 * 14


def hash_pin(pin: str) -> str:
    return ph.hash(pin)


def verify_pin(pin_hash: str | None, pin: str, fallback_plain: str | None = None) -> bool:
    if pin_hash:
        try:
            return ph.verify(pin_hash, pin)
        except VerifyMismatchError:
            return False
    if fallback_plain is not None:
        return hmac.compare_digest(str(fallback_plain), str(pin))
    return False


def _sign(payload: str) -> str:
    secret = get_settings().session_secret.encode("utf-8")
    return hmac.new(secret, payload.encode("utf-8"), hashlib.sha256).hexdigest()


def mint_session(profile_id: str, mode: str, admin: bool) -> tuple[str, dict[str, Any]]:
    sid = secrets.token_urlsafe(24)
    exp = int(time.time()) + SESSION_TTL
    token_body = f"{sid}.{profile_id}.{mode}.{int(admin)}.{exp}"
    token = f"{token_body}.{_sign(token_body)}"
    session = {
        "session_id": sid,
        "profile_id": profile_id,
        "mode": mode,
        "admin": admin,
        "expires_at": exp,
    }

    def apply(state: dict[str, Any]) -> None:
        state.setdefault("sessions", {})[sid] = session

    mutate(apply)
    return token, session


def parse_session_token(token: str | None) -> dict[str, Any] | None:
    if not token:
        return None
    parts = token.split(".")
    if len(parts) != 6:
        return None
    sid, profile_id, mode, admin_s, exp_s, sig = parts
    body = f"{sid}.{profile_id}.{mode}.{admin_s}.{exp_s}"
    if not hmac.compare_digest(_sign(body), sig):
        return None
    try:
        exp = int(exp_s)
    except ValueError:
        return None
    if exp < time.time():
        return None
    state = snapshot()
    stored = (state.get("sessions") or {}).get(sid)
    if not stored:
        return None
    # Token fields must match the server-side session record (prevents cookie tampering).
    if stored.get("profile_id") != profile_id or stored.get("mode") != mode:
        return None
    if bool(stored.get("admin")) != (admin_s == "1"):
        return None
    return {
        "session_id": sid,
        "profile_id": profile_id,
        "mode": mode,
        "admin": admin_s == "1",
        "expires_at": exp,
    }


def set_session_cookie(response: Response, token: str) -> None:
    settings = get_settings()
    response.set_cookie(
        key="armonia_session",
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        max_age=SESSION_TTL,
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie("armonia_session", path="/")


def current_session(request: Request) -> dict[str, Any] | None:
    return parse_session_token(request.cookies.get("armonia_session"))


def require_session(request: Request) -> dict[str, Any]:
    session = current_session(request)
    if not session:
        raise HTTPException(status_code=401, detail={"error": "Authentication required", "code": "auth_required"})
    return session


def require_staff(request: Request) -> dict[str, Any]:
    session = require_session(request)
    if session.get("mode") != "staff":
        raise HTTPException(status_code=403, detail={"error": "Staff only", "code": "staff_required"})
    return session


def require_admin(request: Request) -> dict[str, Any]:
    session = require_staff(request)
    if not session.get("admin"):
        raise HTTPException(status_code=403, detail={"error": "Admin only", "code": "admin_required"})
    return session


def require_child(request: Request) -> dict[str, Any]:
    session = require_session(request)
    if session.get("mode") != "child":
        raise HTTPException(status_code=403, detail={"error": "Child only", "code": "child_required"})
    return session
