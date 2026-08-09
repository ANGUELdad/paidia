from __future__ import annotations

import hashlib
import hmac
import re
import secrets
import time
from typing import Any

from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel, Field

from armonia.auth.limits import assert_not_locked, clear_login_fails, note_login_fail, rate_limit
from armonia.auth.passkeys import (
    PasskeyProfileBody,
    PasskeyVerifyBody,
    authentication_options,
    list_passkeys,
    passkeys_available,
    registration_options,
    remove_passkeys,
    verify_authentication,
    verify_registration,
)
from armonia.auth.security import (
    clear_session_cookie,
    current_session,
    hash_pin,
    mint_session,
    require_session,
    set_session_cookie,
    verify_pin,
)
from armonia.config import get_settings
from armonia.domains.email import send_email
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginBody(BaseModel):
    profileId: str
    mode: str = "staff"
    pin: str = Field(min_length=4, max_length=6)


@router.get("/health")
def auth_health() -> dict[str, Any]:
    settings = get_settings()
    state = snapshot()
    return {
        "ok": True,
        "configuredProfiles": len(state.get("profiles") or {}),
        "passkeysAvailable": passkeys_available(),
        "passkeyOrigin": settings.webauthn_origin,
        "passkeyRpId": settings.webauthn_rp_id,
        "durableStorage": True,
        "platform": "armonia-v2",
    }


def _session_payload(session: dict[str, Any]) -> dict[str, Any]:
    profile = (snapshot().get("profiles") or {}).get(session["profile_id"]) or {}
    prefs = (snapshot().get("prefs") or {}).get(session["profile_id"]) or {}
    return {
        "authenticated": True,
        "profileId": session["profile_id"],
        "mode": session["mode"],
        "admin": bool(session.get("admin")),
        "name": profile.get("name"),
        "role": profile.get("role"),
        "color": prefs.get("color") or profile.get("color"),
        "emoji": prefs.get("emoji") or "",
        "nickname": prefs.get("nickname") or profile.get("name"),
        "lang": prefs.get("lang") or "de",
        "widgets": prefs.get("widgets")
        or (snapshot().get("widgetLayouts") or {}).get(session["profile_id"]),
        "sessionId": session["session_id"],
        "expiresAt": int(session["expires_at"] * 1000),
        "profile": {
            "id": profile.get("id"),
            "name": profile.get("name"),
            "role": profile.get("role"),
            "mode": profile.get("mode"),
            "nickname": prefs.get("nickname") or profile.get("name"),
            "emoji": prefs.get("emoji") or "",
            "color": prefs.get("color") or profile.get("color"),
            "lang": prefs.get("lang") or "de",
        },
    }


@router.get("/session")
@router.get("/me")
def auth_session(request: Request) -> dict[str, Any]:
    session = current_session(request)
    if not session:
        return {"authenticated": False}
    return _session_payload(session)


@router.get("/profiles")
def list_profiles(request: Request, mode: str | None = None) -> dict[str, Any]:
    session = current_session(request)
    if session and session.get("mode") == "child" and mode == "staff":
        raise HTTPException(status_code=403, detail={"code": "forbidden", "error": "Staff profiles hidden"})
    profiles = snapshot().get("profiles") or {}
    rows = []
    for p in profiles.values():
        if mode and p.get("mode") != mode:
            continue
        row = {
            "id": p["id"],
            "name": p["name"],
            "mode": p["mode"],
            "role": p.get("role"),
            "color": p.get("color"),
        }
        # Admin flag only after authentication (avoids targeting admins pre-login).
        if session:
            row["admin"] = bool(p.get("admin"))
        rows.append(row)
    return {"profiles": rows}


@router.post("/passkey/register/options")
def passkey_register_options(request: Request) -> dict[str, Any]:
    rate_limit(request, key="passkey-register", limit=20, window_sec=60)
    session = require_session(request)
    return registration_options(session["profile_id"])


@router.post("/passkey/register/verify")
def passkey_register_verify(body: PasskeyVerifyBody, request: Request) -> dict[str, Any]:
    rate_limit(request, key="passkey-register", limit=20, window_sec=60)
    session = require_session(request)
    return verify_registration(session["profile_id"], body.credential)


@router.post("/passkey/login/options")
def passkey_login_options(body: PasskeyProfileBody, request: Request) -> dict[str, Any]:
    rate_limit(request, key="passkey-login", limit=30, window_sec=60)
    profile_id = body.profileId.strip()
    if not profile_id:
        raise HTTPException(status_code=400, detail={"code": "missing_profile"})
    return authentication_options(profile_id)


@router.post("/passkey/login/verify")
def passkey_login_verify(body: PasskeyVerifyBody, request: Request, response: Response) -> dict[str, Any]:
    rate_limit(request, key="passkey-login", limit=30, window_sec=60)
    profile_id = body.profileId.strip()
    if not profile_id:
        raise HTTPException(status_code=400, detail={"code": "missing_profile"})
    return verify_authentication(profile_id, body.credential, response)


class PasskeyRemoveBody(BaseModel):
    pin: str = Field(min_length=4, max_length=6)


@router.get("/passkey/list")
def passkey_list(request: Request) -> dict[str, Any]:
    session = require_session(request)
    return list_passkeys(session["profile_id"])


@router.post("/passkey/remove")
def passkey_remove(body: PasskeyRemoveBody, request: Request) -> dict[str, Any]:
    rate_limit(request, key="passkey-remove", limit=20, window_sec=60)
    session = require_session(request)
    profile = (snapshot().get("profiles") or {}).get(session["profile_id"]) or {}
    if not verify_pin(profile.get("pinHash"), body.pin, profile.get("pin")):
        raise HTTPException(status_code=401, detail={"code": "invalid_pin", "error": "PIN required"})
    return remove_passkeys(session["profile_id"])


class PinResetRequestBody(BaseModel):
    profileId: str = Field(default="", max_length=80)
    email: str = Field(default="", max_length=320)


class PinResetConfirmBody(BaseModel):
    token: str = Field(default="", max_length=200)
    pin: str = Field(min_length=4, max_length=6)
    confirmPin: str = Field(min_length=4, max_length=6)


def _pin_fingerprint(pin_hash: str) -> str:
    return hashlib.sha256((pin_hash or "").encode("utf-8")).hexdigest()[:32]


def _mint_reset_token(profile_id: str, pin_hash: str) -> str:
    raw = secrets.token_urlsafe(32)
    digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    now = int(time.time())

    def apply(st: dict[str, Any]) -> None:
        tokens = st.setdefault("pinResetTokens", {})
        # Cap token map.
        if len(tokens) > 200:
            for key in list(tokens.keys())[:50]:
                tokens.pop(key, None)
        tokens[digest] = {
            "profileId": profile_id,
            "fingerprint": _pin_fingerprint(pin_hash),
            "exp": now + 3600,
            "createdAt": now,
        }

    mutate(apply)
    return raw


@router.post("/pin-reset/request")
def pin_reset_request(body: PinResetRequestBody, request: Request) -> dict[str, Any]:
    """Always return the same message — no email/profile enumeration."""
    rate_limit(request, key="pin-reset", limit=8, window_sec=60)
    generic = {
        "accepted": True,
        "message": "If the email matches this profile, a reset link will be sent.",
    }
    profile_id = body.profileId.strip()
    email = body.email.strip().lower()
    if not profile_id or not email:
        return generic
    profile = (snapshot().get("profiles") or {}).get(profile_id) or {}
    stored_email = str(profile.get("email") or "").strip().lower()
    if not stored_email or not hmac.compare_digest(email, stored_email):
        return generic
    settings = get_settings()
    public = (settings.paidia_public_url or "").rstrip("/")
    if not public:
        return generic
    token = _mint_reset_token(profile_id, str(profile.get("pinHash") or ""))
    reset_url = f"{public}/?reset={token}"
    send_email(
        stored_email,
        "Armonia PIN Reset",
        html=f"<p>PIN zurücksetzen: <a href=\"{reset_url}\">{reset_url}</a></p>",
        text=f"PIN reset: {reset_url}",
    )
    return generic


@router.post("/pin-reset/confirm")
def pin_reset_confirm(body: PinResetConfirmBody, request: Request) -> dict[str, Any]:
    rate_limit(request, key="pin-reset-confirm", limit=12, window_sec=60)
    if body.pin != body.confirmPin or not re.fullmatch(r"\d{4,6}", body.pin):
        raise HTTPException(status_code=400, detail={"code": "invalid_pin", "error": "PINs must match (4–6 digits)"})
    digest = hashlib.sha256(body.token.encode("utf-8")).hexdigest()
    state = snapshot()
    row = (state.get("pinResetTokens") or {}).get(digest)
    if not row or int(row.get("exp") or 0) < int(time.time()):
        raise HTTPException(status_code=400, detail={"code": "invalid_token", "error": "Reset link invalid or expired"})
    profile = (state.get("profiles") or {}).get(row["profileId"]) or {}
    if _pin_fingerprint(str(profile.get("pinHash") or "")) != row.get("fingerprint"):
        raise HTTPException(status_code=400, detail={"code": "invalid_token", "error": "Reset link invalid or expired"})
    new_hash = hash_pin(body.pin)

    def apply(st: dict[str, Any]) -> None:
        p = st.get("profiles", {}).get(row["profileId"])
        if not p:
            return
        p["pinHash"] = new_hash
        p.pop("pin", None)
        st.get("pinResetTokens", {}).pop(digest, None)
        st.setdefault("auditLog", []).append(
            {
                "at": int(time.time() * 1000),
                "type": "PIN_RESET",
                "profileId": row["profileId"],
                "text": "PIN reset via email token",
            }
        )

    mutate(apply)
    return {"ok": True}


@router.post("/login")
def login(body: LoginBody, request: Request, response: Response) -> dict[str, Any]:
    rate_limit(request, key="auth", limit=30, window_sec=60)
    assert_not_locked(body.profileId)
    existing = current_session(request)
    state = snapshot()
    profile = (state.get("profiles") or {}).get(body.profileId)
    if not profile or profile.get("mode") != body.mode:
        note_login_fail(body.profileId)
        raise HTTPException(status_code=401, detail={"error": "Invalid profile or PIN", "code": "invalid_pin"})
    if not verify_pin(profile.get("pinHash"), body.pin, profile.get("pin")):
        note_login_fail(body.profileId)
        raise HTTPException(status_code=401, detail={"error": "Invalid profile or PIN", "code": "invalid_pin"})
    clear_login_fails(body.profileId)
    # Profile/mode switch always requires PIN; drop any prior session first.
    if existing:

        def drop_old(st: dict[str, Any]) -> None:
            st.get("sessions", {}).pop(existing["session_id"], None)

        mutate(drop_old)
    # Upgrade plain seed PIN to argon2 hash on successful login
    if not profile.get("pinHash") and profile.get("pin"):

        def hash_apply(st: dict[str, Any]) -> None:
            row = st.get("profiles", {}).get(body.profileId)
            if row and not row.get("pinHash"):
                row["pinHash"] = hash_pin(body.pin)
                row.pop("pin", None)

        mutate(hash_apply)
    token, session = mint_session(profile["id"], profile["mode"], bool(profile.get("admin")))
    set_session_cookie(response, token)

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("auditLog", []).append(
            {
                "at": int(time.time() * 1000),
                "type": "LOGIN",
                "profileId": profile["id"],
                "text": f"Login {profile['name']}",
            }
        )

    mutate(apply)
    return {
        "ok": True,
        "profileId": profile["id"],
        "mode": profile["mode"],
        "admin": bool(profile.get("admin")),
        "name": profile["name"],
        "color": profile.get("color"),
    }


@router.post("/logout")
def logout(request: Request, response: Response) -> dict[str, Any]:
    session = current_session(request)
    if session:

        def apply(st: dict[str, Any]) -> None:
            st.get("sessions", {}).pop(session["session_id"], None)

        mutate(apply)
    clear_session_cookie(response)
    return {"ok": True}


class PrefsBody(BaseModel):
    nickname: str | None = None
    emoji: str | None = None
    color: str | None = None
    lang: str | None = None
    widgets: list[str] | None = None


@router.post("/prefs")
def save_prefs(body: PrefsBody, request: Request) -> dict[str, Any]:
    session = require_session(request)

    def apply(st: dict[str, Any]) -> None:
        prefs = st.setdefault("prefs", {})
        row = dict(prefs.get(session["profile_id"]) or {})
        if body.nickname is not None:
            row["nickname"] = body.nickname.strip()[:40]
        if body.emoji is not None:
            row["emoji"] = body.emoji.strip()[:8]
        if body.color is not None:
            row["color"] = body.color.strip()[:20]
        if body.lang in {"de", "el"}:
            row["lang"] = body.lang
        if body.widgets is not None:
            row["widgets"] = body.widgets[:12]
            st.setdefault("widgetLayouts", {})[session["profile_id"]] = body.widgets[:12]
        prefs[session["profile_id"]] = row

    mutate(apply)
    return {"ok": True, "prefs": (snapshot().get("prefs") or {}).get(session["profile_id"])}
