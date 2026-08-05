"""Vercel Flask entry — auth API + static Armonia frontend."""

from __future__ import annotations

import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import unquote

from flask import Flask, jsonify, make_response, request, send_from_directory

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


def _incoming_path() -> str:
    """Recover the browser path across Vercel rewrites / catch-all routing."""
    for key in ("__p", "path"):
        value = request.args.get(key)
        if value:
            return "/" + unquote(value).lstrip("/")
    for header in (
        "x-forwarded-uri",
        "x-vercel-forwarded-path",
        "x-invoke-path",
        "x-matched-path",
        "x-original-uri",
        "x-rewrite-url",
    ):
        value = request.headers.get(header)
        if value:
            raw = "/" + unquote(value.split("?", 1)[0]).lstrip("/")
            if raw not in {"/", "/api", "/api/"}:
                return raw

    path = request.path or "/"
    # Asset rewrite: /api/_asset/gate.js or /_asset/gate.js → /gate.js
    for prefix in ("/api/_asset/", "/_asset/"):
        if path.startswith(prefix):
            rest = path[len(prefix):]
            return "/" + rest if rest else "/"
    # Catch-all may expose /auth/... without the /api prefix.
    if path.startswith("/auth/") or path == "/auth":
        return "/api" + path
    if path in {"/api", "/api/", "/", ""}:
        return "/"
    return path


def _api_path(path: str) -> str:
    api = path
    if api.startswith("/api/"):
        api = api[4:]
    if not api.startswith("/"):
        api = "/" + api
    return api


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
        "usersConfigured": bool(paidia.AUTH_USERS),
    })


def _auth_session():
    session = _session_from_request()
    if not session:
        return _json(200, {"authenticated": False})
    contact = paidia.profile_contact(session["profile_id"])
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
        "email": contact["email"],
        "phone": contact["phone"],
        "contactComplete": bool(contact["email"] and contact["phone"]),
        "emailConfigured": paidia.email_delivery_status()["configured"],
        "emailProvider": paidia.email_delivery_status()["provider"],
        "passkeys": len(paidia.profile_passkeys(session["profile_id"], session["mode"])),
    })


def _auth_profiles():
    session = _session_from_request()
    if not session:
        return _json(401, {"error": "Authentication required", "code": "auth_required"})
    profile_ids = list(paidia.AUTH_USERS) if session.get("admin") else [session["profile_id"]]
    delivery = paidia.email_delivery_status()
    return _json(200, {
        "profiles": [{
            "profileId": profile_id,
            "mode": paidia.AUTH_USERS[profile_id]["mode"],
            "email": paidia.AUTH_USERS[profile_id].get("email", ""),
            "phone": paidia.AUTH_USERS[profile_id].get("phone", ""),
        } for profile_id in profile_ids if profile_id in paidia.AUTH_USERS],
        "canManageAll": bool(session.get("admin")),
        "emailConfigured": delivery["configured"],
        "emailProvider": delivery["provider"],
    })


def _auth_login():
    if not paidia.AUTH_USERS:
        return _json(503, {
            "error": "Set PAIDIA_AUTH_USERS_JSON in environment",
            "code": "auth_not_configured",
        })
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
    contact = paidia.profile_contact(profile_id)
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
        "email": contact["email"],
        "phone": contact["phone"],
        "contactComplete": bool(contact["email"] and contact["phone"]),
    }, cookie=_cookie_header(token))


def _auth_logout():
    return _json(200, {"loggedOut": True}, cookie=_cookie_header("", max_age=0))


class _FlaskHandlerBridge:
    """Adapt Flask request/response so we can reuse paidia.Handler auth methods."""

    def __init__(self):
        self._status = 200
        self._payload = {"error": "Empty response"}
        self._extra_headers = {}

    @property
    def headers(self):
        return request.headers

    @property
    def client_address(self):
        forwarded = (request.headers.get("X-Forwarded-For") or "").split(",", 1)[0].strip()
        return (forwarded or request.remote_addr or "0.0.0.0", 0)

    def auth_cookie(self) -> str:
        return request.cookies.get(paidia.AUTH_COOKIE, "")

    def client_ip(self) -> str:
        return self.client_address[0]

    def current_auth_session(self):
        return _session_from_request()

    def set_session_cookie(self, token: str, max_age: int = paidia.AUTH_SESSION_TTL) -> str:
        return _cookie_header(token, max_age=max_age)

    def json_response(self, status: int, payload: dict, headers: dict | None = None) -> None:
        self._status = status
        self._payload = payload
        self._extra_headers = headers or {}

    def finish_authentication(self, profile_id: str, mode: str, method: str = "pin") -> None:
        token, payload = paidia.encode_session_token(profile_id, mode, method)
        contact = paidia.profile_contact(profile_id)
        self.json_response(200, {
            "authenticated": True,
            "profileId": profile_id,
            "mode": mode,
            "admin": bool(payload["admin"]),
            "sessionId": payload["session_id"],
            "expiresAt": int(payload["expires_at"] * 1000),
            "authenticationMethod": method,
            "onboardingComplete": paidia.onboarding_complete(profile_id, mode),
            "onboardingVersion": paidia.ONBOARDING_VERSION,
            "email": contact["email"],
            "phone": contact["phone"],
            "contactComplete": bool(contact["email"] and contact["phone"]),
        }, {"Set-Cookie": self.set_session_cookie(token)})

    def editable_profile(self, body: dict):
        return paidia.Handler.editable_profile(self, body)

    def as_response(self):
        cookie = self._extra_headers.get("Set-Cookie")
        return _json(self._status, self._payload, cookie=cookie)


def _call_handler(method_name: str, body: dict | None = None):
    bridge = _FlaskHandlerBridge()
    method = getattr(paidia.Handler, method_name)
    if body is None:
        method(bridge)
    else:
        method(bridge, body)
    return bridge.as_response()


def _auth_onboarding_complete():
    session = _session_from_request()
    if not session:
        return _json(401, {"error": "Authentication required", "code": "auth_required"})
    body = _body()
    if body.get("version") != paidia.ONBOARDING_VERSION:
        return _json(409, {
            "error": "Tutorial version changed. Please restart the tutorial.",
            "code": "onboarding_version",
            "version": paidia.ONBOARDING_VERSION,
        })
    with paidia.ONBOARDING_LOCK:
        previous = paidia.ONBOARDING_STATE["profiles"].get(session["profile_id"])
        paidia.ONBOARDING_STATE["profiles"][session["profile_id"]] = {
            "version": paidia.ONBOARDING_VERSION,
            "mode": session["mode"],
            "completed_at": int(time.time()),
        }
        try:
            paidia.persist_onboarding_state()
        except OSError:
            if os.environ.get("VERCEL") != "1":
                if previous is None:
                    paidia.ONBOARDING_STATE["profiles"].pop(session["profile_id"], None)
                else:
                    paidia.ONBOARDING_STATE["profiles"][session["profile_id"]] = previous
                return _json(500, {
                    "error": "Tutorial progress could not be saved.",
                    "code": "onboarding_storage",
                })
    return _json(200, {"completed": True, "version": paidia.ONBOARDING_VERSION})


def _serve_static(rel: str):
    rel = (rel or "index.html").lstrip("/")
    if not rel or rel.endswith("/"):
        rel = (rel or "") + "index.html"
    if ".." in rel.split("/"):
        return _json(400, {"error": "Invalid path"})
    target = (ROOT / rel).resolve()
    root = ROOT.resolve()
    if root != target and root not in target.parents:
        return _json(400, {"error": "Invalid path"})
    if target.is_file():
        response = send_from_directory(root, rel)
        if rel.endswith((".html", ".js", ".webmanifest")):
            response.headers["Cache-Control"] = "no-store"
        return response
    return send_from_directory(root, "index.html")


@app.route("/", defaults={"flask_path": ""}, methods=["GET", "POST", "OPTIONS", "HEAD"])
@app.route("/<path:flask_path>", methods=["GET", "POST", "OPTIONS", "HEAD"])
def entry(flask_path: str = ""):
    if request.method == "OPTIONS":
        response = make_response("", 204)
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
        return response

    path = _incoming_path()
    api = _api_path(path)

    if request.method == "GET" and api in {"/health", "/api/health"}:
        return _json(200, {
            "ok": True,
            "runtime": "vercel-flask",
            "path": path,
            "flask_path": flask_path,
            "request_path": request.path,
        })
    if request.method == "GET" and api in {"/auth/health", "/api/auth/health"}:
        return _auth_health()
    if request.method == "GET" and api in {"/auth/session", "/api/auth/session"}:
        return _auth_session()
    if request.method == "GET" and api in {"/auth/profiles", "/api/auth/profiles"}:
        return _auth_profiles()
    if request.method == "POST" and api in {"/auth/login", "/api/auth/login"}:
        return _auth_login()
    if request.method == "POST" and api in {"/auth/logout", "/api/auth/logout"}:
        return _auth_logout()
    if request.method == "POST" and api in {
        "/auth/onboarding/complete",
        "/api/auth/onboarding/complete",
    }:
        return _auth_onboarding_complete()

    handler_routes = {
        "/auth/profile/email": ("handle_profile_email", True),
        "/api/auth/profile/email": ("handle_profile_email", True),
        "/auth/profile/email/test": ("handle_profile_email_test", True),
        "/api/auth/profile/email/test": ("handle_profile_email_test", True),
        "/auth/passkey/register/options": ("handle_passkey_register_options", True),
        "/api/auth/passkey/register/options": ("handle_passkey_register_options", True),
        "/auth/passkey/register/verify": ("handle_passkey_register_verify", True),
        "/api/auth/passkey/register/verify": ("handle_passkey_register_verify", True),
        "/auth/passkey/login/options": ("handle_passkey_login_options", True),
        "/api/auth/passkey/login/options": ("handle_passkey_login_options", True),
        "/auth/passkey/login/verify": ("handle_passkey_login_verify", True),
        "/api/auth/passkey/login/verify": ("handle_passkey_login_verify", True),
        "/auth/passkey/remove": ("handle_passkey_remove", True),
        "/api/auth/passkey/remove": ("handle_passkey_remove", True),
        "/auth/request-reset": ("handle_auth_request_reset", True),
        "/api/auth/request-reset": ("handle_auth_request_reset", True),
        "/auth/reset": ("handle_auth_reset", True),
        "/api/auth/reset": ("handle_auth_reset", True),
        "/notify/event-email": ("handle_event_email", True),
        "/api/notify/event-email": ("handle_event_email", True),
        "/whatsapp/event": ("handle_whatsapp_event", True),
        "/api/whatsapp/event": ("handle_whatsapp_event", True),
        "/whatsapp/test": ("handle_whatsapp_test", True),
        "/api/whatsapp/test": ("handle_whatsapp_test", True),
    }
    if request.method == "POST" and api in handler_routes:
        method_name, needs_body = handler_routes[api]
        return _call_handler(method_name, _body() if needs_body else None)

    if request.method == "GET" and api in {"/talk", "/api/talk"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        if session.get("mode") != "staff":
            return _json(403, {"error": "Staff only", "code": "staff_required"})
        return _json(200, paidia.talk_snapshot())

    if request.method == "POST" and api in {"/talk", "/api/talk"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        body = _body()
        status, payload = paidia.mutate_talk(str(body.get("action") or "").strip(), body, session)
        return _json(status, payload)

    if request.method == "GET" and api in {"/ops", "/api/ops"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        if session.get("mode") != "staff":
            return _json(403, {"error": "Staff only", "code": "staff_required"})
        try:
            since = int(request.args.get("since") or 0)
        except (TypeError, ValueError):
            since = 0
        return _json(200, paidia.get_ops(since))

    if request.method == "POST" and api in {"/ops", "/api/ops"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        status, payload = paidia.put_ops(_body(), session)
        return _json(status, payload)

    if request.method == "POST" and api in {"/ai-shopping", "/api/ai-shopping"}:
        api_key = os.environ.get("GROQ_API_KEY", "").strip()
        if not api_key:
            return _json(503, {
                "error": "Groq is not configured",
                "code": "configuration",
                "setup": "Set GROQ_API_KEY in Vercel env",
            })
        status, payload = paidia.run_shopping(_body(), api_key)
        return _json(status, payload)

    if request.method == "POST" and api in {"/chat", "/api/chat"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        api_key = os.environ.get("GROQ_API_KEY", "").strip()
        if not api_key:
            return _json(503, {
                "error": "Groq is not configured",
                "code": "configuration",
                "setup": "Set GROQ_API_KEY in Vercel env",
            })
        body = _body()
        # Children may ask questions but must not receive mutate proposals.
        context = body.get("context") if isinstance(body.get("context"), dict) else {}
        if session.get("mode") == "child":
            context = {**context, "canMutate": False}
            body = {**body, "context": context}
        status, payload = paidia.run_chat(body, api_key)
        return _json(status, payload)

    if request.method in {"GET", "HEAD"}:
        static_rel = path.lstrip("/") or "index.html"
        if static_rel.startswith("api/"):
            return _json(404, {"error": "Not found", "path": path})
        return _serve_static(static_rel)

    return _json(404, {
        "error": "Not found",
        "path": path,
        "flask_path": flask_path,
        "request_path": request.path,
        "api": api,
    })
