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


def _json(status: int, payload: dict, cookie=None):
    response = make_response(jsonify(payload), status)
    response.headers["Cache-Control"] = "no-store"
    if cookie is not None:
        if isinstance(cookie, (list, tuple)):
            for item in cookie:
                response.headers.add("Set-Cookie", item)
        else:
            response.headers["Set-Cookie"] = cookie
    return response


def _body() -> dict:
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}


def _cookie_header(token: str, max_age: int = paidia.AUTH_SESSION_TTL) -> str:
    return _cookie_header_named(paidia.AUTH_COOKIE, token, max_age=max_age)


def _cookie_header_named(name: str, token: str, max_age: int) -> str:
    secure = (
        os.environ.get("PAIDIA_COOKIE_SECURE", "false").lower() in {"1", "true", "yes"}
        or os.environ.get("VERCEL", "") == "1"
    )
    parts = [
        f"{name}={token}",
        "Path=/",
        f"Max-Age={max_age}",
        "HttpOnly",
        "SameSite=Lax",
    ]
    if secure:
        parts.append("Secure")
    return "; ".join(parts)


def _session_from_request() -> dict | None:
    paidia.hydrate_auth_from_cookie(request.cookies.get(paidia.AUTH_OVERRIDE_COOKIE, ""))
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


def _drive_configured():
    """Boolean only — never surfaces any Drive credential."""
    try:
        import drive_gallery
        return bool(drive_gallery.drive_configured())
    except Exception:
        return False


def _db_health():
    try:
        import db as paidia_db
        return paidia_db.health()
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "backend": "unknown", "error": str(exc)[:200]}


def _auth_health():
    delivery = paidia.email_delivery_status()
    reset = paidia.pin_reset_status()
    db_info = _db_health()
    payload = {
        "ok": True,
        "configuredProfiles": len(paidia.AUTH_USERS),
        "emailConfigured": delivery["configured"],
        "pinResetReady": reset["ready"],
        "publicUrlConfigured": reset["publicUrlConfigured"],
        "runtime": "vercel-flask",
        "onboardingVersion": paidia.ONBOARDING_VERSION,
        "usersConfigured": bool(paidia.AUTH_USERS),
        "passkeysAvailable": paidia.WEBAUTHN_AVAILABLE,
        "database": db_info,
        "durableStorage": bool(db_info.get("ok") and db_info.get("backend") == "postgres"),
    }
    # Detailed origin/RP IDs only when authenticated as admin.
    session = _session_from_request()
    if session and session.get("admin"):
        payload.update({
            "profilesWithEmail": sum(1 for user in paidia.AUTH_USERS.values() if user["email"]),
            "emailProvider": delivery["provider"],
            "passkeyCredentials": len(paidia.PASSKEYS.get("credentials", {})),
            "passkeyOrigin": paidia.WEBAUTHN_ORIGIN,
            "passkeyRpId": paidia.WEBAUTHN_RP_ID,
        })
    return _json(200, payload)


def _auth_session():
    session = _session_from_request()
    if not session:
        return _json(200, {"authenticated": False})
    contact = paidia.profile_contact(session["profile_id"])
    remember = bool(session.get("remember"))
    cookie = None
    expires_ms = int(session["expires_at"] * 1000)
    session_id = session["session_id"]
    try:
        token, payload = paidia.encode_session_token(
            session["profile_id"], session["mode"],
            method=session.get("method", "pin"),
            remember=remember,
            session_id=session.get("session_id"),
        )
        max_age = int(payload.get("ttl") or paidia.AUTH_SESSION_TTL)
        cookie = _cookie_header(token, max_age=max_age)
        expires_ms = int(payload["expires_at"] * 1000)
        session_id = payload.get("session_id", session_id)
    except RuntimeError:
        pass
    return _json(200, {
        "authenticated": True,
        "profileId": session["profile_id"],
        "mode": session["mode"],
        "admin": bool(session.get("admin")),
        "sessionId": session_id,
        "expiresAt": expires_ms,
        "remember": remember,
        "authenticationMethod": session.get("method", "pin"),
        "onboardingComplete": paidia.onboarding_complete(session["profile_id"], session["mode"]),
        "onboardingVersion": paidia.ONBOARDING_VERSION,
        "email": contact["email"],
        "phone": contact["phone"],
        "contactComplete": bool(contact["email"] and contact["phone"]),
        "emailConfigured": paidia.email_delivery_status()["configured"],
        "emailProvider": paidia.email_delivery_status()["provider"],
        "passkeys": len(paidia.profile_passkeys(
            session["profile_id"],
            session["mode"],
            store=paidia.merge_passkey_stores(
                paidia.PASSKEYS,
                paidia.decode_passkey_device_bundle(request.cookies.get(paidia.PASSKEY_COOKIE, "")),
            ),
        )),
    }, cookie=cookie)


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
    # Reuse Handler.handle_auth_login — lockouts, alerts, session minting.
    return _call_handler("handle_auth_login", _body())


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
        # On Vercel the edge sets X-Forwarded-For; elsewhere do not trust client-supplied XFF.
        if os.environ.get("VERCEL") == "1":
            forwarded = (request.headers.get("X-Forwarded-For") or "").split(",", 1)[0].strip()
            if forwarded:
                try:
                    import ipaddress
                    ipaddress.ip_address(forwarded)
                    return (forwarded, 0)
                except ValueError:
                    pass
        return (request.remote_addr or "0.0.0.0", 0)

    def auth_cookie(self) -> str:
        return request.cookies.get(paidia.AUTH_COOKIE, "")

    def passkey_device_cookie(self) -> str:
        return request.cookies.get(paidia.PASSKEY_COOKIE, "")

    def auth_override_cookie(self) -> str:
        return request.cookies.get(paidia.AUTH_OVERRIDE_COOKIE, "")

    def passkey_store_for_request(self) -> dict:
        return paidia.merge_passkey_stores(
            paidia.PASSKEYS,
            paidia.decode_passkey_device_bundle(self.passkey_device_cookie()),
        )

    def client_ip(self) -> str:
        return self.client_address[0]

    def current_auth_session(self):
        paidia.hydrate_auth_from_cookie(self.auth_override_cookie())
        return _session_from_request()

    def set_cookie_header(self, name: str, token: str, max_age: int) -> str:
        return _cookie_header_named(name, token, max_age=max_age)

    def set_session_cookie(self, token: str, max_age: int = paidia.AUTH_SESSION_TTL) -> str:
        return _cookie_header(token, max_age=max_age)

    def set_passkey_cookie(self, token: str, max_age: int = paidia.PASSKEY_COOKIE_TTL) -> str:
        return _cookie_header_named(paidia.PASSKEY_COOKIE, token, max_age=max_age)

    def set_auth_override_cookie(self, token: str, max_age: int = paidia.AUTH_OVERRIDE_COOKIE_TTL) -> str:
        return _cookie_header_named(paidia.AUTH_OVERRIDE_COOKIE, token, max_age=max_age)

    def json_response(self, status: int, payload: dict, headers: dict | None = None) -> None:
        self._status = status
        self._payload = payload
        self._extra_headers = headers or {}

    def finish_authentication(self, profile_id: str, mode: str, method: str = "pin",
                               extra_cookies: list | None = None,
                               remember: bool = False) -> None:
        # Reuse Handler alerts (new IP / untrusted IP) + cookie minting.
        paidia.Handler.finish_authentication(
            self, profile_id, mode, method, extra_cookies, remember=remember,
        )

    def editable_profile(self, body: dict):
        return paidia.Handler.editable_profile(self, body)

    def as_response(self):
        cookie = self._extra_headers.get("Set-Cookie")
        return _json(self._status, self._payload, cookie=cookie)


def _call_handler(method_name: str, body: dict | None = None):
    paidia.hydrate_auth_from_cookie(request.cookies.get(paidia.AUTH_OVERRIDE_COOKIE, ""))
    bridge = _FlaskHandlerBridge()
    method = getattr(paidia.Handler, method_name)
    try:
        if body is None:
            method(bridge)
        else:
            method(bridge, body)
    except TypeError as exc:
        # Bridge drift vs Handler (e.g. missing remember kwarg) — never return HTML 500.
        return _json(500, {
            "error": "Authentication handler mismatch",
            "code": "auth_handler",
            "detail": str(exc)[:200],
        })
    except Exception as exc:  # noqa: BLE001
        return _json(500, {
            "error": "Authentication failed",
            "code": "auth_server",
            "detail": str(exc)[:200],
        })
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


_STATIC_EXACT = frozenset({
    "",
    "index.html",
    "app.js",
    "gate.js",
    "ui-v110.css",
    "sw.js",
    "manifest.webmanifest",
    # Login shows the running version + DE/EL "what changed" from this.
    "build.json",
    # Calendar + native-style notification helpers (window.PaidiaNotify).
    "notifications.js",
})
_ICON_SUFFIXES = frozenset({".png", ".svg", ".ico", ".webp", ".jpg", ".jpeg"})


def _static_allowed(rel: str) -> bool:
    """Allowlist-only static serving — never expose .env, source, or store files."""
    rel = (rel or "index.html").lstrip("/")
    if not rel:
        return True
    if any(part.startswith(".") for part in rel.split("/")):
        return False
    if ".." in rel.split("/"):
        return False
    if rel in _STATIC_EXACT:
        return True
    if rel.startswith("icons/") and Path(rel).suffix.lower() in _ICON_SUFFIXES:
        return True
    return False


def _serve_static(rel: str):
    rel = (rel or "index.html").lstrip("/")
    if not rel or rel.endswith("/"):
        rel = (rel or "") + "index.html"
    if not _static_allowed(rel):
        return _json(404, {"error": "Not found"})
    target = (ROOT / rel).resolve()
    root = ROOT.resolve()
    if root != target and root not in target.parents:
        return _json(400, {"error": "Invalid path"})
    if target.is_file():
        response = send_from_directory(root, rel)
        # A ?v=<build> URL is immutable: the next release changes the URL, so the
        # client cannot be served a stale bundle. Marking these no-store meant
        # app.js (~730 KB) was re-downloaded on every single load.
        versioned = re.fullmatch(r"\d+", (request.args.get("v") or "").strip())
        shell = rel in ("", "index.html", "build.json")
        if versioned and not shell:
            response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        elif rel.endswith((".html", ".js", ".webmanifest", ".json")):
            response.headers["Cache-Control"] = "no-store"
        return response
    # Unknown allowlisted path → SPA shell, never arbitrary repo files.
    return send_from_directory(root, "index.html")


@app.route("/", defaults={"flask_path": ""}, methods=["GET", "POST", "OPTIONS", "HEAD"])
@app.route("/<path:flask_path>", methods=["GET", "POST", "OPTIONS", "HEAD"])
def entry(flask_path: str = ""):
    if request.method == "OPTIONS":
        origin = request.headers.get("Origin", "")
        allowed = (os.environ.get("PAIDIA_PUBLIC_URL") or "").rstrip("/")
        response = make_response("", 204)
        if origin and allowed and origin.rstrip("/") == allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Vary"] = "Origin"
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
            "aiConfigured": bool(os.environ.get("GROQ_API_KEY", "").strip()),
            "ai": paidia.llm_health(),
            "chatModel": paidia.CHAT_MODEL,
            "ocrModel": paidia.OCR_MODEL,
            "database": _db_health(),
            "driveConfigured": _drive_configured(),
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
        "/auth/profile/pin": ("handle_profile_pin", True),
        "/api/auth/profile/pin": ("handle_profile_pin", True),
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
        "/notify/broadcast": ("handle_broadcast_email", True),
        "/api/notify/broadcast": ("handle_broadcast_email", True),
        "/notify/broadcast-preview": ("handle_broadcast_preview", True),
        "/api/notify/broadcast-preview": ("handle_broadcast_preview", True),
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

    if request.method == "GET" and api in {"/gallery", "/api/gallery"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        return _json(200, paidia.gallery_snapshot())

    if request.method == "GET" and (
        api.startswith("/gallery/media/") or api.startswith("/api/gallery/media/")
    ):
        session = _session_from_request()
        file_id = api.rsplit("/", 1)[-1]
        status, payload, content_type = paidia.gallery_media_response(file_id, session)
        if isinstance(payload, (bytes, bytearray)):
            response = make_response(bytes(payload), status)
            response.headers["Content-Type"] = content_type
            response.headers["Cache-Control"] = "private, max-age=86400"
            return response
        return _json(status, payload)

    if request.method == "POST" and api in {"/gallery", "/api/gallery"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        body = _body()
        status, payload = paidia.mutate_gallery(str(body.get("action") or "").strip(), body, session)
        return _json(status, payload)

    if request.method == "GET" and api in {"/ops", "/api/ops"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        try:
            since = int(request.args.get("since") or 0)
        except (TypeError, ValueError):
            since = 0
        return _json(200, paidia.get_ops_for_session(since, session))

    if request.method == "POST" and api in {"/ops", "/api/ops"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        status, payload = paidia.put_ops(_body(), session)
        return _json(status, payload)

    if request.method == "POST" and api in {"/ai-shopping", "/api/ai-shopping"}:
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
        status, payload = paidia.run_shopping(_body(), api_key)
        return _json(status, payload)

    if request.method == "POST" and api in {"/chat", "/api/chat"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        api_key = os.environ.get("GROQ_API_KEY", "").strip()
        # Local OmniRoute or Groq — run_chat picks the live provider.
        if not api_key and not getattr(paidia, "omniroute_reachable", lambda: False)():
            return _json(503, {
                "error": "AI is not configured",
                "code": "configuration",
                "setup": "Set GROQ_API_KEY (or OMNIROUTE_BASE_URL for local OmniRoute)",
            })
        body = _body()
        client_ip = (request.headers.get("X-Forwarded-For") or request.remote_addr or "").split(",")[0].strip()
        status, payload = paidia.run_chat(body, api_key or None, session=session, client_ip=client_ip)
        return _json(status, payload)

    if request.method == "POST" and api in {"/learn", "/api/learn", "/quiz", "/api/quiz", "/gallery/caption", "/api/gallery/caption"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        api_key = os.environ.get("GROQ_API_KEY", "").strip()
        if not api_key and not getattr(paidia, "omniroute_reachable", lambda: False)():
            return _json(503, {
                "error": "AI is not configured",
                "code": "configuration",
                "setup": "Set GROQ_API_KEY (or OMNIROUTE_BASE_URL for local OmniRoute)",
            })
        body = _body()
        if api in {"/learn", "/api/learn"}:
            status, payload = paidia.run_learn(body, api_key)
        elif api in {"/quiz", "/api/quiz"}:
            status, payload = paidia.run_quiz(body, api_key)
        else:
            status, payload = paidia.run_gallery_caption(body, api_key)
        return _json(status, payload)

    if request.method == "POST" and api in {"/kid-ops", "/api/kid-ops"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        status, payload = paidia.put_kid_ops(_body(), session)
        return _json(status, payload)

    if request.method == "POST" and api in {"/chore-verify", "/api/chore-verify"}:
        session = _session_from_request()
        if not session:
            return _json(401, {"error": "Authentication required", "code": "auth_required"})
        api_key = os.environ.get("GROQ_API_KEY", "").strip()
        if not api_key and not getattr(paidia, "omniroute_reachable", lambda: False)():
            return _json(503, {
                "error": "AI is not configured",
                "code": "configuration",
                "setup": "Set GROQ_API_KEY (or OMNIROUTE_BASE_URL for local OmniRoute)",
            })
        status, payload = paidia.run_chore_verify(_body(), api_key or None)
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
