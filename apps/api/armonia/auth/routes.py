from __future__ import annotations

import time
from typing import Any

from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel, Field

from armonia.auth.limits import assert_not_locked, clear_login_fails, note_login_fail, rate_limit
from armonia.auth.security import (
    clear_session_cookie,
    current_session,
    mint_session,
    require_session,
    set_session_cookie,
    verify_pin,
)
from armonia.config import get_settings
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
        "passkeysAvailable": False,  # wired in biometrics module when library present
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
        from armonia.auth.security import hash_pin

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
