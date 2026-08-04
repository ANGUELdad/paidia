"""Vercel Flask entry — auth API for the static Armonia frontend."""

from __future__ import annotations

import json
import os
import re
import sys
import time
from pathlib import Path

from flask import Flask, jsonify, make_response, request

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import server as paidia  # noqa: E402

app = Flask(__name__)


def _json(status: int, payload: dict, cookie: str | None = None):
    response = make_response(jsonify(payload), status)
    response.headers["Cache-Control"] = "no-store"
    if cookie is not None:
        response.headers["Set-Cookie"] = cookie
    return response


def _body() -> dict:
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}


def _cookie_header(token: str, max_age: int = paidia.AUTH_SESSION_TTL) -> str:
    secure = (
        os.environ.get("PAIDIA_COOKIE_SECURE", "false").lower() in {"1", "true", "yes"}
        or os.environ.get("VERCEL", "") == "1"
    )
    parts = [
        f"{paidia.AUTH_COOKIE}={token}",
        "Path=/",
        f"Max-Age={max_age}",
        "HttpOnly",
        "SameSite=Lax",
    ]
    if secure:
        parts.append("Secure")
    return "; ".join(parts)


def _session_from_request() -> dict | None:
    token = request.cookies.get(paidia.AUTH_COOKIE, "")
    if not token:
        return None
    return paidia.decode_session_token(token)


@app.get("/api/auth/health")
@app.get("/auth/health")
def auth_health():
    delivery = paidia.email_delivery_status()
    return _json(200, {
        "ok": True,
        "configuredProfiles": len(paidia.AUTH_USERS),
        "profilesWithEmail": sum(1 for user in paidia.AUTH_USERS.values() if user["email"]),
        "emailConfigured": delivery["configured"],
        "emailProvider": delivery["provider"],
        "runtime": "vercel-flask",
        "onboardingVersion": paidia.ONBOARDING_VERSION,
    })


@app.get("/api/auth/session")
@app.get("/auth/session")
def auth_session():
    session = _session_from_request()
    if not session:
        return _json(200, {"authenticated": False})
    return _json(200, {
        "authenticated": True,
        "profileId": session["profile_id"],
        "mode": session["mode"],
        "admin": bool(session.get("admin")),
        "sessionId": session["session_id"],
        "expiresAt": int(session["expires_at"] * 1000),
        "authenticationMethod": session.get("method", "pin"),
        "onboardingComplete": paidia.onboarding_complete(session["profile_id"], session["mode"]),
        "onboardingVersion": paidia.ONBOARDING_VERSION,
        "email": paidia.AUTH_USERS.get(session["profile_id"], {}).get("email", ""),
        "emailConfigured": paidia.email_delivery_status()["configured"],
        "emailProvider": paidia.email_delivery_status()["provider"],
        "passkeys": len(paidia.profile_passkeys(session["profile_id"], session["mode"])),
    })


@app.post("/api/auth/login")
@app.post("/auth/login")
def auth_login():
    body = _body()
    profile_id = str(body.get("profileId", "")).strip()[:64]
    mode = "child" if body.get("mode") == "child" else "staff"
    pin = str(body.get("pin", ""))[:12]
    user = paidia.AUTH_USERS.get(profile_id)
    valid = bool(
        user
        and user["mode"] == mode
        and re.fullmatch(r"\d{4,6}", pin)
        and paidia.verify_pin(pin, user["pin_hash"])
    )
    if not valid:
        return _json(401, {
            "error": "Invalid profile or PIN",
            "code": "invalid_pin",
            "attemptsRemaining": 4,
        })
    token, payload = paidia.encode_session_token(profile_id, mode, "pin")
    return _json(200, {
        "authenticated": True,
        "profileId": profile_id,
        "mode": mode,
        "admin": bool(payload["admin"]),
        "sessionId": payload["session_id"],
        "expiresAt": int(payload["expires_at"] * 1000),
        "authenticationMethod": "pin",
        "onboardingComplete": paidia.onboarding_complete(profile_id, mode),
        "onboardingVersion": paidia.ONBOARDING_VERSION,
    }, cookie=_cookie_header(token))


@app.post("/api/auth/logout")
@app.post("/auth/logout")
def auth_logout():
    return _json(200, {"loggedOut": True}, cookie=_cookie_header("", max_age=0))


@app.get("/api/health")
@app.get("/health")
def health():
    return _json(200, {"ok": True, "runtime": "vercel-flask"})
