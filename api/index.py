"""Vercel Flask entry — auth API + static Armonia frontend."""

from __future__ import annotations

import mimetypes
import os
import re
import sys
from pathlib import Path

from flask import Flask, jsonify, make_response, request, send_from_directory

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import server as paidia  # noqa: E402

app = Flask(__name__)

STATIC_NAMES = {
    "index.html", "gate.js", "app.js", "sw.js", "manifest.webmanifest",
    "email-preview.html", "paidia-preview.html",
}


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


def _normalize_api_path(path: str) -> str:
    """Accept /api/auth/login, /auth/login, api/auth/login, etc."""
    value = "/" + (path or "").lstrip("/")
    if value.startswith("/api/"):
        value = value[4:]  # keep leading slash via next line
        value = "/" + value.lstrip("/")
    if value.startswith("/index/"):
        value = value[len("/index"):]
    if value == "/index":
        value = "/"
    return value if value.startswith("/") else "/" + value


def _auth_health():
    delivery = paidia.email_delivery_status()
    return _json(200, {
        "ok": True,
        "configuredProfiles": len(paidia.AUTH_USERS),
        "profilesWithEmail": sum(1 for user in paidia.AUTH_USERS.values() if user["email"]),
        "emailConfigured": delivery["configured"],
        "emailProvider": delivery["provider"],
        "runtime": "vercel-flask",
        "onboardingVersion": paidia.ONBOARDING_VERSION,
        "path": request.path,
    })


def _auth_session():
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


def _auth_login():
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
    if not paidia.AUTH_USERS:
        return _json(503, {
            "error": "Auth users are not configured on the server",
            "code": "auth_not_configured",
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


def _auth_logout():
    return _json(200, {"loggedOut": True}, cookie=_cookie_header("", max_age=0))


def _serve_static(rel: str):
    rel = rel.lstrip("/") or "index.html"
    if ".." in rel.split("/"):
        return _json(400, {"error": "Invalid path"})
    target = (ROOT / rel).resolve()
    if not str(target).startswith(str(ROOT.resolve())):
        return _json(400, {"error": "Invalid path"})
    if target.is_file():
        response = send_from_directory(ROOT, rel)
        if rel.endswith((".html", ".js")):
            response.headers["Cache-Control"] = "no-store"
        return response
    # SPA-style fallback
    return send_from_directory(ROOT, "index.html")


@app.route("/", defaults={"path": ""}, methods=["GET", "POST", "OPTIONS", "HEAD"])
@app.route("/<path:path>", methods=["GET", "POST", "OPTIONS", "HEAD"])
def entry(path: str = ""):
    if request.method == "OPTIONS":
        response = make_response("", 204)
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
        return response

    raw = path or ""
    api_path = _normalize_api_path(raw if raw.startswith("api/") or raw.startswith("auth/") or raw.startswith("health") else request.path)

    # Also inspect the raw request path Vercel actually sent.
    candidates = {
        _normalize_api_path(request.path),
        _normalize_api_path(raw),
        _normalize_api_path("api/" + raw) if raw and not raw.startswith("api/") else "",
    }
    candidates.discard("")

    for candidate in candidates:
        if candidate in {"/health", "/api/health"} or candidate.endswith("/health") and "auth" not in candidate:
            if request.method == "GET":
                return _json(200, {"ok": True, "runtime": "vercel-flask", "path": request.path})
        if candidate in {"/auth/health", "/api/auth/health"} or candidate.endswith("/auth/health"):
            if request.method == "GET":
                return _auth_health()
        if candidate in {"/auth/session", "/api/auth/session"} or candidate.endswith("/auth/session"):
            if request.method == "GET":
                return _auth_session()
        if candidate in {"/auth/login", "/api/auth/login"} or candidate.endswith("/auth/login"):
            if request.method == "POST":
                return _auth_login()
        if candidate in {"/auth/logout", "/api/auth/logout"} or candidate.endswith("/auth/logout"):
            if request.method == "POST":
                return _auth_logout()

    # Non-API: serve frontend assets from the repo root.
    if request.method in {"GET", "HEAD"}:
        if not raw or raw in STATIC_NAMES or "." in Path(raw).name or raw.endswith("/"):
            return _serve_static(raw)
        return _serve_static("index.html")

    return _json(404, {"error": "Not found", "path": request.path, "raw": raw})
