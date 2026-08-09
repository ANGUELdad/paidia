from __future__ import annotations

import base64
import json
import time
from typing import Any

from fastapi import HTTPException, Response
from pydantic import BaseModel, Field

from armonia.auth.security import mint_session, set_session_cookie
from armonia.config import get_settings
from armonia.store import mutate, snapshot

try:  # pragma: no cover - exercised only when optional dependency is installed
    from webauthn import (
        generate_authentication_options,
        generate_registration_options,
        options_to_json,
        verify_authentication_response,
        verify_registration_response,
    )
    from webauthn.helpers.parse import parse_authentication_credential_json, parse_registration_credential_json
except Exception as exc:  # pragma: no cover - normal in lightweight local installs
    generate_authentication_options = None  # type: ignore[assignment]
    generate_registration_options = None  # type: ignore[assignment]
    options_to_json = None  # type: ignore[assignment]
    verify_authentication_response = None  # type: ignore[assignment]
    verify_registration_response = None  # type: ignore[assignment]
    parse_authentication_credential_json = None  # type: ignore[assignment]
    parse_registration_credential_json = None  # type: ignore[assignment]
    _WEBAUTHN_IMPORT_ERROR: Exception | None = exc
else:
    _WEBAUTHN_IMPORT_ERROR = None


class PasskeyProfileBody(BaseModel):
    profileId: str = Field(default="", max_length=80)


class PasskeyVerifyBody(BaseModel):
    profileId: str = Field(default="", max_length=80)
    credential: dict[str, Any] = Field(default_factory=dict)


def passkeys_available() -> bool:
    settings = get_settings()
    return bool(settings.webauthn_origin.strip()) and _WEBAUTHN_IMPORT_ERROR is None


def require_passkeys_available() -> None:
    if not passkeys_available():
        raise HTTPException(
            status_code=503,
            detail={"code": "passkeys_unavailable", "error": "Passkeys are not configured on this API"},
        )


def _b64url(data: bytes | str | None) -> str:
    if data is None:
        return ""
    if isinstance(data, str):
        return data
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _unb64url(raw: str | bytes | None) -> bytes:
    if raw is None:
        return b""
    if isinstance(raw, bytes):
        return raw
    value = raw.encode("ascii")
    value += b"=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value)


def _json_options(options: Any) -> dict[str, Any]:
    raw = options_to_json(options) if options_to_json else "{}"
    return json.loads(raw)


def _challenge_from_options(options: Any, payload: dict[str, Any]) -> str:
    challenge = getattr(options, "challenge", None) or payload.get("challenge")
    if not challenge and isinstance(payload.get("publicKey"), dict):
        challenge = payload["publicKey"].get("challenge")
    return _b64url(challenge)


def _passkey_row(state: dict[str, Any], profile_id: str) -> dict[str, Any]:
    all_rows = state.setdefault("passkeys", {})
    row = all_rows.get(profile_id)
    if isinstance(row, list):
        row = {"credentials": row}
        all_rows[profile_id] = row
    if not isinstance(row, dict):
        row = {"credentials": []}
        all_rows[profile_id] = row
    row.setdefault("credentials", [])
    return row


def registration_options(profile_id: str) -> dict[str, Any]:
    require_passkeys_available()
    settings = get_settings()
    profile = (snapshot().get("profiles") or {}).get(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail={"code": "profile_not_found"})
    options = generate_registration_options(  # type: ignore[misc]
        rp_id=settings.webauthn_rp_id,
        rp_name=settings.webauthn_rp_name,
        user_id=profile_id.encode("utf-8"),
        user_name=profile_id,
        user_display_name=profile.get("name") or profile_id,
    )
    payload = _json_options(options)
    challenge = _challenge_from_options(options, payload)

    def apply(st: dict[str, Any]) -> None:
        row = _passkey_row(st, profile_id)
        row["registerChallenge"] = challenge
        row["registerAt"] = int(time.time() * 1000)

    mutate(apply)
    return payload


def verify_registration(profile_id: str, credential: dict[str, Any]) -> dict[str, Any]:
    require_passkeys_available()
    settings = get_settings()
    state = snapshot()
    profile = (state.get("profiles") or {}).get(profile_id)
    row = _passkey_row(state, profile_id)
    challenge = row.get("registerChallenge")
    if not profile or not challenge:
        raise HTTPException(status_code=400, detail={"code": "missing_challenge"})
    try:
        parsed = (
            parse_registration_credential_json(json.dumps(credential))
            if parse_registration_credential_json
            else credential
        )
        verification = verify_registration_response(  # type: ignore[misc]
            credential=parsed,
            expected_challenge=_unb64url(challenge),
            expected_origin=settings.webauthn_origin,
            expected_rp_id=settings.webauthn_rp_id,
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail={"code": "passkey_verify_failed", "error": str(exc)}) from exc

    credential_id = _b64url(getattr(verification, "credential_id", None) or credential.get("id"))
    public_key = _b64url(getattr(verification, "credential_public_key", None))
    sign_count = int(getattr(verification, "sign_count", 0) or 0)
    now_ms = int(time.time() * 1000)

    def apply(st: dict[str, Any]) -> None:
        row = _passkey_row(st, profile_id)
        credentials = [c for c in row.get("credentials") or [] if c.get("credentialId") != credential_id]
        credentials.append(
            {
                "credentialId": credential_id,
                "publicKey": public_key,
                "signCount": sign_count,
                "createdAt": now_ms,
                "lastUsedAt": None,
            }
        )
        row["credentials"] = credentials
        row.pop("registerChallenge", None)
        row["updatedAt"] = now_ms

    mutate(apply)
    return {"ok": True, "profileId": profile_id, "credentialId": credential_id}


def authentication_options(profile_id: str) -> dict[str, Any]:
    require_passkeys_available()
    state = snapshot()
    if profile_id not in (state.get("profiles") or {}):
        raise HTTPException(status_code=404, detail={"code": "profile_not_found"})
    row = _passkey_row(state, profile_id)
    if not row.get("credentials"):
        raise HTTPException(status_code=404, detail={"code": "no_passkeys"})
    options = generate_authentication_options(rp_id=get_settings().webauthn_rp_id)  # type: ignore[misc]
    payload = _json_options(options)
    challenge = _challenge_from_options(options, payload)

    def apply(st: dict[str, Any]) -> None:
        row = _passkey_row(st, profile_id)
        row["loginChallenge"] = challenge
        row["loginAt"] = int(time.time() * 1000)

    mutate(apply)
    return payload


def _credential_id_from_response(credential: dict[str, Any]) -> str:
    raw_id = credential.get("rawId") or credential.get("id") or ""
    return _b64url(raw_id)


def remove_passkeys(profile_id: str) -> dict[str, Any]:
    require_passkeys_available()
    now_ms = int(time.time() * 1000)
    removed = 0

    def apply(st: dict[str, Any]) -> None:
        nonlocal removed
        row = _passkey_row(st, profile_id)
        removed = len(row.get("credentials") or [])
        row["credentials"] = []
        row.pop("registerChallenge", None)
        row.pop("loginChallenge", None)
        row["updatedAt"] = now_ms
        st.setdefault("auditLog", []).append(
            {
                "at": now_ms,
                "type": "PASSKEY_REMOVE",
                "profileId": profile_id,
                "text": f"Removed {removed} passkey(s)",
            }
        )

    mutate(apply)
    return {"ok": True, "removed": removed}


def list_passkeys(profile_id: str) -> dict[str, Any]:
    row = _passkey_row(snapshot(), profile_id)
    credentials = [
        {
            "credentialId": c.get("credentialId"),
            "createdAt": c.get("createdAt"),
            "lastUsedAt": c.get("lastUsedAt"),
        }
        for c in (row.get("credentials") or [])
    ]
    return {"ok": True, "count": len(credentials), "credentials": credentials}


def verify_authentication(profile_id: str, credential: dict[str, Any], response: Response) -> dict[str, Any]:
    require_passkeys_available()
    settings = get_settings()
    state = snapshot()
    profile = (state.get("profiles") or {}).get(profile_id)
    row = _passkey_row(state, profile_id)
    challenge = row.get("loginChallenge")
    credential_id = _credential_id_from_response(credential)
    stored = next((c for c in row.get("credentials") or [] if c.get("credentialId") == credential_id), None)
    if not profile or not challenge or not stored:
        raise HTTPException(status_code=400, detail={"code": "missing_passkey"})
    try:
        parsed = (
            parse_authentication_credential_json(json.dumps(credential))
            if parse_authentication_credential_json
            else credential
        )
        verification = verify_authentication_response(  # type: ignore[misc]
            credential=parsed,
            expected_challenge=_unb64url(challenge),
            expected_origin=settings.webauthn_origin,
            expected_rp_id=settings.webauthn_rp_id,
            credential_public_key=_unb64url(stored.get("publicKey")),
            credential_current_sign_count=int(stored.get("signCount") or 0),
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail={"code": "passkey_verify_failed", "error": str(exc)}) from exc

    new_sign_count = int(getattr(verification, "new_sign_count", None) or getattr(verification, "sign_count", 0) or 0)
    now_ms = int(time.time() * 1000)

    def apply(st: dict[str, Any]) -> None:
        row = _passkey_row(st, profile_id)
        for item in row.get("credentials") or []:
            if item.get("credentialId") == credential_id:
                item["signCount"] = new_sign_count
                item["lastUsedAt"] = now_ms
        row.pop("loginChallenge", None)
        row["updatedAt"] = now_ms

    mutate(apply)
    token, session = mint_session(profile["id"], profile["mode"], bool(profile.get("admin")))
    set_session_cookie(response, token)
    return {
        "ok": True,
        "profileId": profile["id"],
        "mode": profile["mode"],
        "admin": bool(profile.get("admin")),
        "name": profile.get("name"),
        "sessionId": session["session_id"],
    }
