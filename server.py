#!/usr/bin/env python3
"""PAIDIA local server with server-side Groq OCR and contextual help chat."""

from __future__ import annotations

import json
import hashlib
import hmac
import ipaddress
import os
import re
import secrets
import smtplib
import ssl
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from email.message import EmailMessage
from email.utils import parseaddr
from http.cookies import SimpleCookie
from pathlib import Path

try:
    from webauthn import (
        generate_authentication_options, generate_registration_options, options_to_json,
        verify_authentication_response, verify_registration_response,
    )
    from webauthn.helpers.exceptions import InvalidAuthenticationResponse, InvalidRegistrationResponse
    from webauthn.helpers.structs import (
        AuthenticatorAttachment, AuthenticatorSelectionCriteria, PublicKeyCredentialDescriptor,
        ResidentKeyRequirement, UserVerificationRequirement,
    )
    WEBAUTHN_AVAILABLE = True
except ImportError:  # The app still starts with PIN login until requirements are installed.
    WEBAUTHN_AVAILABLE = False


def load_env(path: str = ".env") -> None:
    """Load local .env. File values win so restarting always picks up new PINs/secrets."""
    try:
        with open(path, encoding="utf-8") as env_file:
            for raw_line in env_file:
                line = raw_line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                if not key:
                    continue
                os.environ[key] = value.strip().strip("'\"")
    except FileNotFoundError:
        pass


load_env()
HOST = os.environ.get("PAIDIA_HOST", "127.0.0.1")
PORT = int(os.environ.get("PAIDIA_PORT", "5173"))
OCR_MODEL = os.environ.get("GROQ_OCR_MODEL", "qwen/qwen3.6-27b")
CHAT_MODEL = os.environ.get("GROQ_CHAT_MODEL", "llama-3.3-70b-versatile")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MAX_BODY = 12 * 1024 * 1024
WHATSAPP_GRAPH_VERSION = os.environ.get("WHATSAPP_GRAPH_VERSION", "v23.0")
WHATSAPP_GRAPH_URL = "https://graph.facebook.com"
WHATSAPP_DEDUPE_WINDOW = 10 * 60
WHATSAPP_SENT: dict[str, float] = {}
AUTH_SESSION_TTL = 12 * 60 * 60
RESET_TOKEN_TTL = 30 * 60
PIN_ITERATIONS = 600_000
AUTH_COOKIE = "paidia_session"
AUTH_LOCK = threading.Lock()
SECURITY_FILE_LOCK = threading.Lock()
ONBOARDING_LOCK = threading.Lock()
AUTH_SESSIONS: dict[str, dict] = {}
RESET_TOKENS: dict[str, dict] = {}
LOGIN_FAILURES: dict[str, list[float]] = {}
IP_LOGIN_FAILURES: dict[str, list[float]] = {}
PROFILE_LOGIN_FAILURES: dict[str, list[float]] = {}
LOGIN_LOCKS: dict[str, float] = {}
SECURITY_ALERTS: dict[str, float] = {}
RESET_REQUESTS: dict[str, float] = {}
PASSKEY_CHALLENGES: dict[str, dict] = {}  # local-dev fallback only; Vercel uses signed ceremonies
USED_PASSKEY_CEREMONIES: dict[str, float] = {}
PASSKEY_CHALLENGE_TTL = 5 * 60
PASSKEY_COOKIE = "paidia_pk"
PASSKEY_COOKIE_TTL = 400 * 24 * 3600


def env_int(name: str, default: int, minimum: int = 1) -> int:
    try:
        return max(minimum, int(os.environ.get(name, str(default))))
    except ValueError:
        return default


LOGIN_WINDOW = env_int("PAIDIA_LOGIN_WINDOW_SECONDS", 600)
LOGIN_LOCK_TTL = env_int("PAIDIA_LOGIN_LOCK_SECONDS", 900)
LOGIN_MAX_ATTEMPTS = env_int("PAIDIA_LOGIN_MAX_ATTEMPTS", 5)
IP_MAX_FAILURES = env_int("PAIDIA_IP_MAX_FAILURES", 20)
PROFILE_MAX_FAILURES = env_int("PAIDIA_PROFILE_MAX_FAILURES", 12)
SECURITY_ALERT_AFTER = env_int("PAIDIA_SECURITY_ALERT_AFTER", 3)
SECURITY_ALERT_COOLDOWN = env_int("PAIDIA_SECURITY_ALERT_COOLDOWN", 3600)
SECURITY_STATE_PATH = Path(os.environ.get("PAIDIA_SECURITY_STATE_PATH", ".paidia-security-state.json"))
SECURITY_LOG_PATH = Path(os.environ.get("PAIDIA_SECURITY_LOG_PATH", ".paidia-security-events.jsonl"))
PASSKEY_STORE_PATH = Path(os.environ.get("PAIDIA_PASSKEY_STORE_PATH", ".paidia-passkeys.json"))
ONBOARDING_STATE_PATH = Path(os.environ.get("PAIDIA_ONBOARDING_STATE_PATH", ".paidia-onboarding.json"))
TALK_STATE_PATH = Path(os.environ.get("PAIDIA_TALK_STATE_PATH", ".paidia-talk.json"))
OPS_STATE_PATH = Path(os.environ.get("PAIDIA_OPS_STATE_PATH", ".paidia-ops.json"))

# Vercel serverless FS is read-only except /tmp — always keep writable state there.
if os.environ.get("VERCEL") == "1":
    _tmp = Path("/tmp/paidia")
    _tmp.mkdir(parents=True, exist_ok=True)
    ONBOARDING_STATE_PATH = _tmp / "onboarding.json"
    PASSKEY_STORE_PATH = _tmp / "passkeys.json"
    SECURITY_STATE_PATH = _tmp / "security-state.json"
    SECURITY_LOG_PATH = _tmp / "security-events.jsonl"
    TALK_STATE_PATH = _tmp / "talk.json"
    OPS_STATE_PATH = _tmp / "ops.json"
ONBOARDING_VERSION = 2
TALK_MESSAGE_LIMIT = 200
TALK_TOPIC_LIMIT = 120
TALK_LOCK = threading.Lock()
OPS_LOCK = threading.Lock()
OPS_KEYS = (
    "listEntries",
    "shoppingTrips",
    "stock",
    "customProducts",
    "customCategories",
    "customReasons",
    "profilePrefs",
)
OPS_DICT_KEYS = {"stock", "profilePrefs"}
def resolve_webauthn_origin() -> str:
    explicit = os.environ.get("PAIDIA_WEBAUTHN_ORIGIN", "").strip()
    if explicit:
        return explicit.rstrip("/")
    public = os.environ.get("PAIDIA_PUBLIC_URL", "").strip()
    if public:
        return public.rstrip("/")
    if os.environ.get("VERCEL") == "1":
        host = (
            os.environ.get("VERCEL_PROJECT_PRODUCTION_URL")
            or os.environ.get("VERCEL_URL")
            or ""
        ).strip().split("/")[0]
        if host:
            return f"https://{host}"
    return f"http://localhost:{PORT}"


WEBAUTHN_ORIGIN = resolve_webauthn_origin()
WEBAUTHN_RP_ID = os.environ.get(
    "PAIDIA_WEBAUTHN_RP_ID", urllib.parse.urlsplit(WEBAUTHN_ORIGIN).hostname or "localhost"
)


def load_trusted_networks() -> list[ipaddress.IPv4Network | ipaddress.IPv6Network]:
    networks = []
    for value in os.environ.get("PAIDIA_TRUSTED_NETWORKS", "").split(","):
        value = value.strip()
        if not value:
            continue
        try:
            networks.append(ipaddress.ip_network(value, strict=False))
        except ValueError:
            continue
    return networks


TRUSTED_NETWORKS = load_trusted_networks()


def load_trusted_proxy_networks() -> list[ipaddress.IPv4Network | ipaddress.IPv6Network]:
    networks = []
    for value in os.environ.get("PAIDIA_TRUSTED_PROXY_NETWORKS", "").split(","):
        value = value.strip()
        if not value:
            continue
        try:
            networks.append(ipaddress.ip_network(value, strict=False))
        except ValueError:
            continue
    return networks


TRUSTED_PROXY_NETWORKS = load_trusted_proxy_networks()


def load_security_state() -> dict:
    try:
        state = json.loads(SECURITY_STATE_PATH.read_text(encoding="utf-8"))
        if isinstance(state, dict) and isinstance(state.get("known_ips"), dict) and state.get("pepper"):
            return state
    except (OSError, json.JSONDecodeError):
        pass
    return {"pepper": secrets.token_hex(32), "known_ips": {}}


SECURITY_STATE = load_security_state()


def persist_security_state() -> None:
    with SECURITY_FILE_LOCK:
        SECURITY_STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
        temp_path = SECURITY_STATE_PATH.with_name(SECURITY_STATE_PATH.name + ".tmp")
        temp_path.write_text(json.dumps(SECURITY_STATE, separators=(",", ":")), encoding="utf-8")
        os.chmod(temp_path, 0o600)
        os.replace(temp_path, SECURITY_STATE_PATH)


def ip_fingerprint(ip: str) -> str:
    return hmac.new(SECURITY_STATE["pepper"].encode(), ip.encode(), hashlib.sha256).hexdigest()


def is_trusted_ip(ip: str) -> bool:
    if not TRUSTED_NETWORKS:
        return True
    try:
        address = ipaddress.ip_address(ip)
    except ValueError:
        return False
    return any(address in network for network in TRUSTED_NETWORKS)


def remember_profile_ip(profile_id: str, ip: str) -> tuple[bool, bool]:
    """Return (new_ip, first_ip) while retaining only non-reversible fingerprints."""
    fingerprint = ip_fingerprint(ip)
    known = SECURITY_STATE["known_ips"].setdefault(profile_id, [])
    first_ip = not known
    new_ip = fingerprint not in known
    if new_ip:
        known.append(fingerprint)
        del known[:-20]
        persist_security_state()
    return new_ip, first_ip


def append_security_event(event: str, profile_id: str, ip: str, details: dict | None = None) -> None:
    record = {
        "ts": int(time.time()), "event": event, "profileId": profile_id,
        "ip": ip, "details": details or {},
    }
    try:
        with SECURITY_FILE_LOCK:
            SECURITY_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
            with SECURITY_LOG_PATH.open("a", encoding="utf-8") as log_file:
                log_file.write(json.dumps(record, ensure_ascii=False, separators=(",", ":")) + "\n")
            os.chmod(SECURITY_LOG_PATH, 0o600)
    except OSError:
        pass


def hash_pin(pin: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", pin.encode(), salt, PIN_ITERATIONS)
    return f"pbkdf2_sha256${PIN_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_pin(pin: str, encoded: str) -> bool:
    try:
        algorithm, iterations, salt_hex, digest_hex = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        candidate = hashlib.pbkdf2_hmac(
            "sha256", pin.encode(), bytes.fromhex(salt_hex), int(iterations)
        ).hex()
        return hmac.compare_digest(candidate, digest_hex)
    except (ValueError, TypeError):
        return False


def load_auth_users() -> dict[str, dict]:
    """Auth profiles come only from PAIDIA_AUTH_USERS_JSON (local .env or Vercel env)."""
    try:
        raw = json.loads(os.environ.get("PAIDIA_AUTH_USERS_JSON", "{}") or "{}")
    except json.JSONDecodeError:
        return {}
    users: dict[str, dict] = {}
    if not isinstance(raw, dict):
        return users
    for profile_id, record in raw.items():
        if not isinstance(record, dict):
            continue
        mode = "child" if record.get("mode") == "child" else "staff"
        email = str(record.get("email", "")).strip().lower()
        phone = str(record.get("phone", "")).strip()
        pin_hash = str(record.get("pin_hash", "")).strip()
        if pin_hash:
            users[str(profile_id)] = {
                "mode": mode, "email": email, "phone": phone, "pin_hash": pin_hash,
            }
    return users


AUTH_USERS = load_auth_users()
ADMIN_PROFILE_IDS = {
    value.strip() for value in os.environ.get("PAIDIA_ADMIN_PROFILE_IDS", "e3,e4,e8").split(",")
    if value.strip()
}


def session_secret() -> bytes:
    raw = os.environ.get("PAIDIA_SESSION_SECRET", "").strip()
    if not raw:
        # Local/dev fallback — set PAIDIA_SESSION_SECRET in production (Vercel).
        raw = "paidia-dev:" + os.environ.get("PAIDIA_AUTH_USERS_JSON", " unpaid")[:96]
    return hashlib.sha256(raw.encode("utf-8")).digest()


def encode_session_token(profile_id: str, mode: str, method: str = "pin") -> tuple[str, dict]:
    import base64
    now = time.time()
    expires_at = now + AUTH_SESSION_TTL
    session_id = "ses-" + secrets.token_urlsafe(12)
    payload = {
        "session_id": session_id,
        "profile_id": profile_id,
        "mode": mode,
        "admin": mode == "staff" and profile_id in ADMIN_PROFILE_IDS,
        "expires_at": expires_at,
        "method": method,
    }
    raw = base64.urlsafe_b64encode(
        json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    ).decode("ascii").rstrip("=")
    sig = hmac.new(session_secret(), raw.encode("ascii"), hashlib.sha256).hexdigest()
    return f"v1.{raw}.{sig}", payload


def decode_session_token(token: str) -> dict | None:
    import base64
    try:
        version, raw, sig = token.split(".", 2)
        if version != "v1":
            return None
        expected = hmac.new(session_secret(), raw.encode("ascii"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, sig):
            return None
        padded = raw + "=" * (-len(raw) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded.encode("ascii")))
        if not isinstance(payload, dict):
            return None
        if float(payload.get("expires_at", 0)) <= time.time():
            return None
        profile_id = str(payload.get("profile_id", ""))
        mode = "child" if payload.get("mode") == "child" else "staff"
        if profile_id not in AUTH_USERS or AUTH_USERS[profile_id]["mode"] != mode:
            return None
        return {
            "session_id": str(payload.get("session_id", "")),
            "profile_id": profile_id,
            "mode": mode,
            "admin": bool(payload.get("admin")),
            "expires_at": float(payload["expires_at"]),
            "method": str(payload.get("method", "pin")),
        }
    except (ValueError, TypeError, json.JSONDecodeError, KeyError):
        return None



def load_onboarding_state() -> dict:
    try:
        value = json.loads(ONBOARDING_STATE_PATH.read_text(encoding="utf-8"))
        if isinstance(value, dict) and isinstance(value.get("profiles"), dict):
            return value
    except (OSError, json.JSONDecodeError):
        pass
    return {"profiles": {}}


ONBOARDING_STATE = load_onboarding_state()


def onboarding_complete(profile_id: str, mode: str) -> bool:
    with ONBOARDING_LOCK:
        record = ONBOARDING_STATE["profiles"].get(profile_id, {})
        return record.get("version") == ONBOARDING_VERSION and record.get("mode") == mode


def persist_onboarding_state() -> None:
    ONBOARDING_STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    temp_path = ONBOARDING_STATE_PATH.with_name(ONBOARDING_STATE_PATH.name + ".tmp")
    temp_path.write_text(json.dumps(ONBOARDING_STATE, separators=(",", ":")), encoding="utf-8")
    try:
        os.chmod(temp_path, 0o600)
    except OSError:
        pass
    os.replace(temp_path, ONBOARDING_STATE_PATH)


def default_video_room_url() -> str:
    configured = os.environ.get("PAIDIA_VIDEO_ROOM_URL", "").strip()
    if configured:
        return configured
    host = urllib.parse.urlsplit(WEBAUTHN_ORIGIN).hostname or "armonia-thassos"
    if host in {"localhost", "127.0.0.1", "::1"}:
        host = "armonia-thassos"
    safe = re.sub(r"[^a-zA-Z0-9-]", "-", host).strip("-") or "armonia-thassos"
    return f"https://meet.jit.si/ArmoniaThassos-{safe}"


def load_talk_state() -> dict:
    try:
        value = json.loads(TALK_STATE_PATH.read_text(encoding="utf-8"))
        if isinstance(value, dict):
            messages = value.get("messages") if isinstance(value.get("messages"), list) else []
            topics = value.get("topics") if isinstance(value.get("topics"), list) else []
            return {
                "messages": messages[-TALK_MESSAGE_LIMIT:],
                "topics": topics[-TALK_TOPIC_LIMIT:],
                "updatedAt": int(value.get("updatedAt") or 0),
            }
    except (OSError, json.JSONDecodeError, TypeError, ValueError):
        pass
    return {"messages": [], "topics": [], "updatedAt": 0}


TALK_STATE = load_talk_state()


def persist_talk_state() -> None:
    TALK_STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    temp_path = TALK_STATE_PATH.with_name(TALK_STATE_PATH.name + ".tmp")
    temp_path.write_text(json.dumps(TALK_STATE, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    try:
        os.chmod(temp_path, 0o600)
    except OSError:
        pass
    os.replace(temp_path, TALK_STATE_PATH)


def talk_snapshot() -> dict:
    with TALK_LOCK:
        return {
            "messages": list(TALK_STATE.get("messages") or []),
            "topics": list(TALK_STATE.get("topics") or []),
            "updatedAt": int(TALK_STATE.get("updatedAt") or 0),
            "videoUrl": default_video_room_url(),
            "videoProvider": "jitsi",
        }


def mutate_talk(action: str, body: dict, session: dict) -> tuple[int, dict]:
    """Staff team talk: chat messages + meeting topics. Returns (status, payload)."""
    profile_id = str(session.get("profile_id") or "")
    if session.get("mode") != "staff" or not profile_id:
        return 403, {"error": "Staff only", "code": "staff_required"}

    by_name = str(body.get("byName") or profile_id).strip()[:80] or profile_id
    now_ms = int(time.time() * 1000)

    with TALK_LOCK:
        messages = list(TALK_STATE.get("messages") or [])
        topics = list(TALK_STATE.get("topics") or [])

        if action == "send":
            text = str(body.get("text") or "").strip()[:1200]
            if not text:
                return 400, {"error": "Message required", "code": "input"}
            messages.append({
                "id": "tm-" + secrets.token_urlsafe(8),
                "text": text,
                "by": profile_id,
                "byName": by_name,
                "at": now_ms,
                "kind": "chat",
            })
            messages = messages[-TALK_MESSAGE_LIMIT:]
        elif action == "add_topic":
            text = str(body.get("text") or "").strip()[:400]
            if not text:
                return 400, {"error": "Topic required", "code": "input"}
            date = str(body.get("date") or "").strip()[:12]
            source = str(body.get("source") or "manual").strip()[:40] or "manual"
            # Avoid near-duplicate open topics for the same day.
            exists = next(
                (t for t in topics
                 if not t.get("done") and t.get("date") == date and t.get("text", "").lower() == text.lower()),
                None,
            )
            if not exists:
                topics.append({
                    "id": "tt-" + secrets.token_urlsafe(8),
                    "text": text,
                    "by": profile_id,
                    "byName": by_name,
                    "date": date,
                    "done": False,
                    "source": source,
                    "createdAt": now_ms,
                })
                topics = topics[-TALK_TOPIC_LIMIT:]
        elif action == "toggle_topic":
            topic_id = str(body.get("topicId") or "").strip()
            topic = next((t for t in topics if t.get("id") == topic_id), None)
            if not topic:
                return 404, {"error": "Topic not found", "code": "not_found"}
            topic["done"] = not bool(topic.get("done"))
            topic["doneAt"] = now_ms if topic["done"] else None
            topic["doneBy"] = profile_id if topic["done"] else None
        elif action == "clear_done":
            date = str(body.get("date") or "").strip()[:12]
            topics = [t for t in topics if not (t.get("done") and (not date or t.get("date") == date))]
        else:
            return 400, {"error": "Unknown action", "code": "input"}

        TALK_STATE["messages"] = messages
        TALK_STATE["topics"] = topics
        TALK_STATE["updatedAt"] = now_ms
        try:
            persist_talk_state()
        except OSError:
            return 507, {"error": "Talk state could not be saved", "code": "storage"}

    return 200, talk_snapshot()


def empty_ops_state() -> dict:
    return {
        "revision": 0,
        "updatedAt": 0,
        "listEntries": [],
        "shoppingTrips": [],
        "stock": {},
        "customProducts": [],
        "customCategories": [],
        "customReasons": [],
        "profilePrefs": {},
    }


def _normalize_ops_state(value: object) -> dict:
    if not isinstance(value, dict):
        return empty_ops_state()
    out = empty_ops_state()
    try:
        out["revision"] = max(0, int(value.get("revision") or 0))
        out["updatedAt"] = int(value.get("updatedAt") or 0)
    except (TypeError, ValueError):
        pass
    for key in OPS_KEYS:
        raw = value.get(key)
        if key in OPS_DICT_KEYS:
            out[key] = raw if isinstance(raw, dict) else {}
        else:
            out[key] = raw if isinstance(raw, list) else []
    return out


def load_ops_state() -> dict:
    # Env survives Vercel deploys when seeded; file covers local / warm /tmp.
    raw = os.environ.get("PAIDIA_OPS_JSON", "").strip()
    if raw:
        try:
            return _normalize_ops_state(json.loads(raw))
        except json.JSONDecodeError:
            pass
    try:
        return _normalize_ops_state(json.loads(OPS_STATE_PATH.read_text(encoding="utf-8")))
    except (OSError, json.JSONDecodeError, TypeError, ValueError):
        return empty_ops_state()


OPS_STATE = load_ops_state()


def persist_ops_state() -> None:
    raw = json.dumps(OPS_STATE, ensure_ascii=False, separators=(",", ":"))
    os.environ["PAIDIA_OPS_JSON"] = raw
    try:
        OPS_STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
        temp_path = OPS_STATE_PATH.with_name(OPS_STATE_PATH.name + ".tmp")
        temp_path.write_text(raw, encoding="utf-8")
        try:
            os.chmod(temp_path, 0o600)
        except OSError:
            pass
        os.replace(temp_path, OPS_STATE_PATH)
    except OSError:
        if os.environ.get("VERCEL") != "1":
            raise


def refresh_ops_state_from_disk() -> None:
    """Pick up /tmp or env writes from another warm request on the same instance."""
    loaded = load_ops_state()
    with OPS_LOCK:
        current_rev = int(OPS_STATE.get("revision") or 0)
        loaded_rev = int(loaded.get("revision") or 0)
        if loaded_rev >= current_rev:
            OPS_STATE.clear()
            OPS_STATE.update(loaded)


def ops_snapshot(changed: bool = True) -> dict:
    with OPS_LOCK:
        payload = {
            "revision": int(OPS_STATE.get("revision") or 0),
            "updatedAt": int(OPS_STATE.get("updatedAt") or 0),
            "changed": bool(changed),
        }
        if changed:
            for key in OPS_KEYS:
                payload[key] = OPS_STATE.get(key)
        return payload


def get_ops(since: int = 0) -> dict:
    refresh_ops_state_from_disk()
    with OPS_LOCK:
        revision = int(OPS_STATE.get("revision") or 0)
        if since and since >= revision:
            return {
                "revision": revision,
                "updatedAt": int(OPS_STATE.get("updatedAt") or 0),
                "changed": False,
            }
    return ops_snapshot(True)


def put_ops(body: dict, session: dict) -> tuple[int, dict]:
    """Replace shared shopping/stock ops data. Staff only. Optimistic concurrency via revision."""
    if session.get("mode") != "staff":
        return 403, {"error": "Staff only", "code": "staff_required"}
    if not isinstance(body, dict):
        return 400, {"error": "JSON object required", "code": "input"}

    try:
        client_rev = int(body.get("revision") or 0)
    except (TypeError, ValueError):
        return 400, {"error": "revision required", "code": "input"}

    refresh_ops_state_from_disk()
    with OPS_LOCK:
        server_rev = int(OPS_STATE.get("revision") or 0)
        if client_rev != server_rev:
            payload = {
                "error": "Revision conflict",
                "code": "conflict",
                "revision": server_rev,
                "updatedAt": int(OPS_STATE.get("updatedAt") or 0),
                "changed": True,
            }
            for key in OPS_KEYS:
                payload[key] = OPS_STATE.get(key)
            return 409, payload

        next_state = empty_ops_state()
        next_state["revision"] = server_rev + 1
        next_state["updatedAt"] = int(time.time() * 1000)
        for key in OPS_KEYS:
            raw = body.get(key, OPS_STATE.get(key))
            if key in OPS_DICT_KEYS:
                next_state[key] = raw if isinstance(raw, dict) else {}
            else:
                rows = raw if isinstance(raw, list) else []
                if key in {"listEntries", "shoppingTrips"}:
                    rows = rows[-4000:]
                elif key.startswith("custom"):
                    rows = rows[-500:]
                next_state[key] = rows

        OPS_STATE.clear()
        OPS_STATE.update(next_state)
        try:
            persist_ops_state()
        except OSError:
            return 507, {"error": "Ops state could not be saved", "code": "storage"}

    return 200, ops_snapshot(True)


def run_shopping(body: dict, api_key: str) -> tuple[int, dict]:
    """Shared shopping OCR/AI handler for local server and Vercel Flask."""
    source_type = body.get("sourceType")
    purpose = body.get("purpose", "list")
    content = body.get("content", "")
    if source_type not in {"text", "image"} or not isinstance(content, str) or not content:
        return 400, {"error": "sourceType and content are required"}

    purpose_prompt = ("\nThe image is a supermarket receipt: extract purchased product lines, "
                      "ignore totals, tax, payment, store metadata, and discount-only lines."
                      if purpose == "receipt" else "")
    user_content = [{"type": "text", "text": PROMPT + purpose_prompt}]
    if source_type == "image":
        if not content.startswith("data:image/"):
            return 400, {"error": "Image must be a data URL"}
        user_content.append({"type": "image_url", "image_url": {"url": content}})
    else:
        user_content.append({"type": "text", "text": "SOURCE LIST:\n" + content[:50000]})

    shopping_model = OCR_MODEL if source_type == "image" else CHAT_MODEL
    request_body = {
        "model": shopping_model,
        "messages": [{"role": "user", "content": user_content}],
        "temperature": 0.1,
        "max_completion_tokens": 2000 if source_type == "image" else 1600,
        "response_format": {"type": "json_object"},
    }
    if source_type == "image":
        request_body.update({
            "reasoning_effort": "none",
            "reasoning_format": "hidden",
        })
    try:
        response = groq_completion(api_key, request_body)
        parsed = parse_json_output(completion_text(response))
        return 200, {
            **parsed,
            "model": response.get("model", shopping_model),
            "responseId": response.get("id"),
        }
    except urllib.error.HTTPError as exc:
        status, payload = provider_error(exc)
        return status, payload
    except (urllib.error.URLError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
        code = "timeout" if isinstance(exc, TimeoutError) else "provider"
        return (504 if code == "timeout" else 502), {
            "error": "AI extraction failed",
            "code": code,
        }


def _empty_passkey_store() -> dict:
    return {"credentials": {}, "user_handles": {}}


def _normalize_passkey_store(value: object) -> dict | None:
    if not isinstance(value, dict) or not isinstance(value.get("credentials"), dict):
        return None
    value.setdefault("user_handles", {})
    if not isinstance(value["user_handles"], dict):
        value["user_handles"] = {}
    return value


def load_passkeys() -> dict:
    # Env survives Vercel deploys; file covers local / warm /tmp instances.
    raw = os.environ.get("PAIDIA_PASSKEYS_JSON", "").strip()
    if raw:
        try:
            normalized = _normalize_passkey_store(json.loads(raw))
            if normalized:
                return normalized
        except json.JSONDecodeError:
            pass
    try:
        normalized = _normalize_passkey_store(json.loads(PASSKEY_STORE_PATH.read_text(encoding="utf-8")))
        if normalized:
            return normalized
    except (OSError, json.JSONDecodeError):
        pass
    return _empty_passkey_store()


PASSKEYS = load_passkeys()


def persist_passkeys() -> None:
    raw = json.dumps(PASSKEYS, separators=(",", ":"), ensure_ascii=False)
    os.environ["PAIDIA_PASSKEYS_JSON"] = raw
    try:
        PASSKEY_STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
        temp_path = PASSKEY_STORE_PATH.with_name(PASSKEY_STORE_PATH.name + ".tmp")
        temp_path.write_text(raw, encoding="utf-8")
        os.chmod(temp_path, 0o600)
        os.replace(temp_path, PASSKEY_STORE_PATH)
    except OSError:
        if os.environ.get("VERCEL") != "1":
            raise


def b64url(value: bytes) -> str:
    import base64
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def unb64url(value: str) -> bytes:
    import base64
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def mint_passkey_ceremony(data: dict) -> str:
    """Stateless WebAuthn ceremony — survives Vercel multi-instance / cold starts."""
    import base64
    payload = {
        "kind": data["kind"],
        "profile_id": data["profile_id"],
        "mode": data["mode"],
        "challenge": data["challenge"],
        "exp": int(data.get("expires_at", time.time() + PASSKEY_CHALLENGE_TTL)),
    }
    if data.get("session_id"):
        payload["session_id"] = data["session_id"]
    if data.get("label"):
        payload["label"] = data["label"]
    raw = base64.urlsafe_b64encode(
        json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    ).decode("ascii").rstrip("=")
    sig = hmac.new(session_secret(), raw.encode("ascii"), hashlib.sha256).hexdigest()
    return f"pk1.{raw}.{sig}"


def parse_passkey_ceremony(token: str) -> dict | None:
    import base64
    if not token or not token.startswith("pk1.") or len(token) > 8000:
        return None
    try:
        _, raw, sig = token.split(".", 2)
        expect = hmac.new(session_secret(), raw.encode("ascii"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expect, sig):
            return None
        padded = raw + "=" * (-len(raw) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded.encode("ascii")))
        if not isinstance(payload, dict):
            return None
        if int(payload.get("exp", 0)) <= int(time.time()):
            return None
        kind = payload.get("kind")
        if kind not in {"register", "login"}:
            return None
        challenge = str(payload.get("challenge") or "")
        if not challenge:
            return None
        return {
            "kind": kind,
            "profile_id": str(payload.get("profile_id") or ""),
            "mode": "child" if payload.get("mode") == "child" else "staff",
            "challenge": challenge,
            "session_id": str(payload.get("session_id") or ""),
            "label": str(payload.get("label") or "This device")[:80] or "This device",
            "expires_at": float(payload["exp"]),
        }
    except (ValueError, TypeError, json.JSONDecodeError, KeyError):
        return None


def encode_passkey_device_bundle(bundle: dict) -> str:
    import base64
    normalized = _normalize_passkey_store(bundle) or _empty_passkey_store()
    raw = base64.urlsafe_b64encode(
        json.dumps(normalized, separators=(",", ":"), sort_keys=True).encode("utf-8")
    ).decode("ascii").rstrip("=")
    sig = hmac.new(session_secret(), raw.encode("ascii"), hashlib.sha256).hexdigest()
    return f"pkd1.{raw}.{sig}"


def decode_passkey_device_bundle(token: str) -> dict:
    import base64
    if not token or not token.startswith("pkd1.") or len(token) > 12000:
        return _empty_passkey_store()
    try:
        _, raw, sig = token.split(".", 2)
        expect = hmac.new(session_secret(), raw.encode("ascii"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expect, sig):
            return _empty_passkey_store()
        padded = raw + "=" * (-len(raw) % 4)
        normalized = _normalize_passkey_store(json.loads(base64.urlsafe_b64decode(padded.encode("ascii"))))
        return normalized or _empty_passkey_store()
    except (ValueError, TypeError, json.JSONDecodeError):
        return _empty_passkey_store()


def merge_passkey_stores(*stores: dict) -> dict:
    merged = _empty_passkey_store()
    for store in stores:
        if not store:
            continue
        for key, record in (store.get("credentials") or {}).items():
            if isinstance(record, dict) and record.get("credential_id"):
                existing = merged["credentials"].get(key)
                if not existing or int(record.get("sign_count", 0)) >= int(existing.get("sign_count", 0)):
                    merged["credentials"][key] = dict(record)
        for profile_id, handle in (store.get("user_handles") or {}).items():
            if profile_id and handle and profile_id not in merged["user_handles"]:
                merged["user_handles"][profile_id] = handle
    return merged


def profile_passkeys(profile_id: str, mode: str | None = None, store: dict | None = None) -> list[dict]:
    source = store or PASSKEYS
    return [record for record in source["credentials"].values()
            if record.get("profile_id") == profile_id and (mode is None or record.get("mode") == mode)]


def passkey_user_handle(profile_id: str) -> bytes:
    encoded = PASSKEYS["user_handles"].get(profile_id)
    if not encoded:
        encoded = b64url(secrets.token_bytes(32))
        PASSKEYS["user_handles"][profile_id] = encoded
        try:
            persist_passkeys()
        except OSError:
            pass
    return unb64url(encoded)


def prune_passkey_challenges() -> None:
    now = time.time()
    for key, value in list(PASSKEY_CHALLENGES.items()):
        if value.get("expires_at", 0) <= now:
            PASSKEY_CHALLENGES.pop(key, None)
    for key, expires_at in list(USED_PASSKEY_CEREMONIES.items()):
        if expires_at <= now:
            USED_PASSKEY_CEREMONIES.pop(key, None)


def remember_passkey_challenge(ceremony_id: str, payload: dict) -> None:
    """Best-effort local cache; signed ceremonyId is the source of truth on Vercel."""
    with AUTH_LOCK:
        prune_passkey_challenges()
        PASSKEY_CHALLENGES[ceremony_id] = payload


def take_passkey_challenge(ceremony_id: str) -> dict | None:
    parsed = parse_passkey_ceremony(ceremony_id)
    with AUTH_LOCK:
        prune_passkey_challenges()
        if ceremony_id in USED_PASSKEY_CEREMONIES:
            return None
        if parsed:
            USED_PASSKEY_CEREMONIES[ceremony_id] = time.time() + PASSKEY_CHALLENGE_TTL
            PASSKEY_CHALLENGES.pop(ceremony_id, None)
            return parsed
        challenge = PASSKEY_CHALLENGES.pop(ceremony_id, None)
        if challenge:
            USED_PASSKEY_CEREMONIES[ceremony_id] = time.time() + PASSKEY_CHALLENGE_TTL
        return challenge


def security_alert_recipients() -> list[str]:
    recipients = []
    for profile_id in ADMIN_PROFILE_IDS:
        email = AUTH_USERS.get(profile_id, {}).get("email", "")
        if email:
            recipients.append(email)
    recipients.extend(
        value.strip().lower() for value in os.environ.get("PAIDIA_SECURITY_ALERT_EMAIL", "").split(",")
        if value.strip()
    )
    return list(dict.fromkeys(recipients))


def persist_auth_users() -> None:
    value = json.dumps(AUTH_USERS, ensure_ascii=False, separators=(",", ":"))
    os.environ["PAIDIA_AUTH_USERS_JSON"] = value
    # Vercel has a read-only filesystem — keep the in-process update so email/phone
    # work for the lifetime of the instance (same as session cookies).
    if os.environ.get("VERCEL") == "1":
        return
    env_path = Path(os.environ.get("PAIDIA_ENV_PATH", ".env"))
    try:
        lines = env_path.read_text(encoding="utf-8").splitlines() if env_path.exists() else []
        replacement = "PAIDIA_AUTH_USERS_JSON=" + value
        found = False
        for index, line in enumerate(lines):
            if line.startswith("PAIDIA_AUTH_USERS_JSON="):
                lines[index] = replacement
                found = True
                break
        if not found:
            lines.extend(["", "# Server-only profile emails, phones, and salted PIN hashes", replacement])
        temp_path = env_path.with_name(env_path.name + ".tmp")
        temp_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        os.chmod(temp_path, 0o600)
        os.replace(temp_path, env_path)
    except OSError as exc:
        raise RuntimeError("Could not persist the new PIN") from exc


def valid_phone(value: str) -> bool:
    cleaned = re.sub(r"[\s\-().]", "", value or "")
    return bool(re.fullmatch(r"\+?\d{8,16}", cleaned))


def normalize_phone(value: str) -> str:
    return re.sub(r"[\s\-().]", "", (value or "").strip())[:24]


def smtp_config() -> dict:
    return {
        "host": os.environ.get("SMTP_HOST", "").strip(),
        "port": int(os.environ.get("SMTP_PORT", "587")),
        "user": os.environ.get("SMTP_USER", "").strip(),
        "password": os.environ.get("SMTP_PASSWORD", ""),
        "sender": os.environ.get("SMTP_FROM", "").strip(),
        "starttls": os.environ.get("SMTP_STARTTLS", "true").lower() in {"1", "true", "yes"},
    }


def resend_config() -> dict:
    return {
        "api_key": os.environ.get("RESEND_API_KEY", "").strip(),
        "sender": os.environ.get("RESEND_FROM", "").strip(),
        "reply_to": os.environ.get("RESEND_REPLY_TO", "").strip(),
        "url": os.environ.get("RESEND_API_URL", "https://api.resend.com/emails").strip(),
    }


def profile_contact(profile_id: str) -> dict:
    user = AUTH_USERS.get(profile_id) or {}
    return {
        "email": str(user.get("email", "") or ""),
        "phone": str(user.get("phone", "") or ""),
    }


def valid_email(value: str) -> bool:
    _, address = parseaddr(value)
    return address == value and len(value) <= 320 and bool(re.fullmatch(
        r"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+",
        value,
    ))


def email_providers() -> list[str]:
    """Ordered delivery backends. On Vercel prefer Resend — outbound SMTP is often blocked."""
    smtp = smtp_config()
    resend = resend_config()
    have_smtp = bool(smtp["host"] and smtp["sender"])
    have_resend = bool(resend["api_key"] and resend["sender"])
    on_vercel = os.environ.get("VERCEL") == "1"
    if on_vercel:
        ordered = (["resend"] if have_resend else []) + (["smtp"] if have_smtp else [])
    else:
        ordered = (["smtp"] if have_smtp else []) + (["resend"] if have_resend else [])
    return ordered


def email_delivery_status() -> dict:
    providers = email_providers()
    if not providers:
        return {"configured": False, "provider": "none", "providers": []}
    return {"configured": True, "provider": providers[0], "providers": providers}


def public_base_url(headers=None) -> str:
    """Public site origin for reset links — never leak localhost when Host is production."""
    configured = (os.environ.get("PAIDIA_PUBLIC_URL") or "").rstrip("/")
    host = ""
    scheme = "https"
    if headers is not None:
        host = (headers.get("X-Forwarded-Host") or headers.get("Host") or "").split(",", 1)[0].strip()
        scheme = (headers.get("X-Forwarded-Proto") or "https").split(",", 1)[0].strip() or "https"
    localish = any(x in configured for x in ("127.0.0.1", "localhost", "0.0.0.0")) if configured else True
    if configured and not localish:
        return configured
    if host and not any(x in host for x in ("127.0.0.1", "localhost", "0.0.0.0")):
        return f"{scheme}://{host}".rstrip("/")
    if configured:
        return configured
    return f"http://{HOST}:{PORT}"


def pin_fingerprint(pin_hash: str) -> str:
    return hashlib.sha256((pin_hash or "").encode("utf-8")).hexdigest()[:16]


def mint_reset_token(profile_id: str, pin_hash: str) -> str:
    """Stateless signed reset token — survives Vercel cold starts / multi-instance."""
    import base64
    exp = int(time.time()) + RESET_TOKEN_TTL
    payload = f"{profile_id}.{exp}.{pin_fingerprint(pin_hash)}"
    sig = hmac.new(session_secret(), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    raw = f"{payload}.{sig}"
    return base64.urlsafe_b64encode(raw.encode("utf-8")).decode("ascii").rstrip("=")


def parse_reset_token(token: str) -> tuple[str, str] | None:
    """Return (profile_id, pin_fingerprint) if the token is valid and unexpired."""
    import base64
    if not token or len(token) > 512:
        return None
    try:
        padded = token + "=" * (-len(token) % 4)
        raw = base64.urlsafe_b64decode(padded.encode("ascii")).decode("utf-8")
        profile_id, exp_s, fingerprint, sig = raw.rsplit(".", 3)
        exp = int(exp_s)
    except (ValueError, UnicodeError, OSError):
        return None
    if exp <= int(time.time()):
        return None
    payload = f"{profile_id}.{exp_s}.{fingerprint}"
    expect = hmac.new(session_secret(), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expect, sig):
        return None
    return profile_id, fingerprint


class EmailDeliveryError(RuntimeError):
    """A safe, user-actionable email failure without leaking provider responses."""

    def __init__(self, message: str, code: str = "delivery_failed") -> None:
        super().__init__(message)
        self.code = code


def resend_error(exc: urllib.error.HTTPError) -> EmailDeliveryError:
    try:
        payload = json.loads(exc.read().decode("utf-8", errors="replace"))
        detail = str(payload.get("message", "")).lower()
    except (OSError, UnicodeError, json.JSONDecodeError):
        detail = ""
    if exc.code in {401, 403} and not any(term in detail for term in ("testing email", "own email", "verify a domain")):
        return EmailDeliveryError("The Resend API key was rejected", "email_auth_failed")
    if exc.code == 429:
        return EmailDeliveryError("Resend is rate limiting email delivery", "email_rate_limited")
    if any(term in detail for term in ("testing email", "own email", "only send", "verify a domain")):
        return EmailDeliveryError("Resend test mode only allows the account email", "email_recipient_restricted")
    if any(term in detail for term in ("domain is not verified", "domain not verified", "invalid `from`", "invalid from")):
        return EmailDeliveryError("The Resend sender domain is not verified", "email_sender_unverified")
    return EmailDeliveryError(f"Resend rejected the email (HTTP {exc.code})")


def send_via_smtp(recipient: str, subject: str, text_body: str, html_body: str | None = None) -> None:
    config = smtp_config()
    if not config["host"] or not config["sender"]:
        raise EmailDeliveryError("Email delivery is not configured", "email_not_configured")
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = config["sender"]
    message["To"] = recipient
    message.set_content(text_body)
    if html_body:
        message.add_alternative(html_body, subtype="html")
    context = ssl.create_default_context()
    try:
        if config["port"] == 465:
            with smtplib.SMTP_SSL(config["host"], config["port"], timeout=30, context=context) as smtp:
                if config["user"]:
                    smtp.login(config["user"], config["password"])
                smtp.send_message(message)
            return
        with smtplib.SMTP(config["host"], config["port"], timeout=30) as smtp:
            smtp.ehlo()
            if config["starttls"]:
                smtp.starttls(context=context)
                smtp.ehlo()
            if config["user"]:
                smtp.login(config["user"], config["password"])
            smtp.send_message(message)
    except smtplib.SMTPAuthenticationError as exc:
        raise EmailDeliveryError("SMTP login was rejected", "email_auth_failed") from exc
    except smtplib.SMTPRecipientsRefused as exc:
        raise EmailDeliveryError("The recipient was rejected by the mail server", "email_recipient_restricted") from exc
    except smtplib.SMTPSenderRefused as exc:
        raise EmailDeliveryError("The SMTP sender address was rejected", "email_sender_unverified") from exc
    except (TimeoutError, smtplib.SMTPException, OSError) as exc:
        raise EmailDeliveryError("The mail server could not be reached", "email_network") from exc


def send_via_resend(recipient: str, subject: str, text_body: str, html_body: str | None = None) -> None:
    resend = resend_config()
    if not resend["api_key"] or not resend["sender"]:
        raise EmailDeliveryError("Email delivery is not configured", "email_not_configured")
    payload = {"from": resend["sender"], "to": [recipient], "subject": subject, "text": text_body}
    if html_body:
        payload["html"] = html_body
    if resend["reply_to"]:
        payload["reply_to"] = resend["reply_to"]
    request = urllib.request.Request(
        resend["url"], data=json.dumps(payload).encode("utf-8"), method="POST",
        headers={
            "Authorization": f"Bearer {resend['api_key']}",
            "Content-Type": "application/json",
            "User-Agent": "Armonia-Thassos/1.0",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            if response.status < 200 or response.status >= 300:
                raise RuntimeError(f"Resend returned HTTP {response.status}")
    except urllib.error.HTTPError as exc:
        raise resend_error(exc) from exc
    except urllib.error.URLError as exc:
        raise EmailDeliveryError("Resend could not be reached", "email_network") from exc


def send_email(recipient: str, subject: str, text_body: str, html_body: str | None = None) -> None:
    providers = email_providers()
    if not providers:
        raise EmailDeliveryError("Email delivery is not configured", "email_not_configured")
    last_error: EmailDeliveryError | None = None
    for provider in providers:
        try:
            if provider == "smtp":
                send_via_smtp(recipient, subject, text_body, html_body)
                return
            if provider == "resend":
                send_via_resend(recipient, subject, text_body, html_body)
                return
        except EmailDeliveryError as exc:
            last_error = exc
            # Try the next provider on network / auth / generic delivery failures.
            if exc.code not in {"email_network", "email_auth_failed", "delivery_failed"}:
                raise
            continue
    if last_error:
        raise last_error
    raise EmailDeliveryError("Email delivery is not configured", "email_not_configured")


def email_shell(title: str, eyebrow: str, body_html: str, footer: str | None = None) -> str:
    """Shared branded HTML wrapper for transactional mail."""
    foot = footer or "Armonia Thassos · Thasos · Automatische Nachricht"
    return f"""<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title></head>
<body style="margin:0;padding:0;background:#e8eef2;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#e8eef2;padding:28px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(15,40,55,.12)">
        <tr><td style="padding:28px 28px 18px;background:linear-gradient(135deg,#0f3d4c 0%,#146b73 55%,#1d8a7a 100%)">
          <div style="display:inline-block;width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.14);color:#ecfeff;font-weight:800;font-size:20px;line-height:42px;text-align:center">A</div>
          <div style="margin-top:14px;color:#99f6e4;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase">{eyebrow}</div>
          <h1 style="margin:8px 0 0;color:#f8fafc;font-size:26px;line-height:1.2;letter-spacing:-.02em">{title}</h1>
        </td></tr>
        <tr><td style="padding:26px 28px 8px;color:#1e293b;font-size:15px;line-height:1.65">{body_html}</td></tr>
        <tr><td style="padding:18px 28px 26px;color:#64748b;font-size:12px;line-height:1.55;border-top:1px solid #eef2f6">{foot}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""


def email_button(url: str, label: str) -> str:
    return (
        f'<p style="margin:22px 0 8px">'
        f'<a href="{url}" style="display:inline-block;padding:14px 22px;background:linear-gradient(135deg,#0d9488,#0284c7);'
        f'color:#ffffff;text-decoration:none;border-radius:12px;font-weight:700;font-size:14px">{label}</a></p>'
    )


def send_pin_reset_email(recipient: str, reset_url: str) -> None:
    text_body = (
        "Du hast eine Änderung deiner Armonia-Thassos-PIN angefordert.\n\n"
        f"Öffne innerhalb von 30 Minuten diesen einmaligen Link:\n{reset_url}\n\n"
        "Wenn du das nicht angefordert hast, ignoriere diese Nachricht."
    )
    html_body = email_shell(
        "PIN sicher ändern",
        "Armonia Thassos",
        (
            "<p style=\"margin:0 0 12px\">Du hast eine Änderung deiner PIN angefordert.</p>"
            "<p style=\"margin:0 0 4px;color:#475569\">Der Link gilt <b>30 Minuten</b> und kann nur einmal verwendet werden.</p>"
            f"{email_button(reset_url, 'PIN jetzt ändern')}"
            f'<p style="margin:14px 0 0;font-size:12px;color:#94a3b8;word-break:break-all">{reset_url}</p>'
            "<p style=\"margin:18px 0 0;color:#64748b\">Wenn du das nicht warst, ignoriere diese Nachricht.</p>"
        ),
    )
    send_email(recipient, "Armonia Thassos – PIN ändern", text_body, html_body)


def send_security_alert_email(recipient: str, profile_id: str, event: str,
                              ip: str, details: dict) -> None:
    labels = {
        "repeated_failures": "Mehrere falsche PIN-Versuche",
        "login_locked": "Anmeldung vorübergehend gesperrt",
        "new_ip_login": "Anmeldung von einer neuen IP-Adresse",
        "untrusted_ip_login": "Anmeldung außerhalb des vertrauenswürdigen Netzwerks",
    }
    label = labels.get(event, "Ungewöhnliche Anmeldung")
    when = time.strftime("%Y-%m-%d %H:%M:%S %Z")
    attempts = details.get("attempts", 0)
    text_body = (
        f"Profil: {profile_id}\n"
        f"Ereignis: {label}\n"
        f"IP-Adresse: {ip}\n"
        f"Zeit: {when}\n"
        f"Fehlversuche: {attempts}\n\n"
        "Wenn du das nicht warst, ändere deine PIN über den Link auf der Anmeldeseite "
        "und informiere die verantwortliche Person. Antworte nicht auf diese automatische Nachricht."
    )
    html_body = email_shell(
        "Sicherheitswarnung",
        "Armonia Thassos · Alert",
        (
            f"<p style=\"margin:0 0 16px\">Es gab eine ungewöhnliche Anmeldung:</p>"
            "<table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" "
            "style=\"background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px\">"
            f"<tr><td style=\"padding:12px 14px;border-bottom:1px solid #eef2f6;color:#64748b;font-size:12px\">Ereignis</td>"
            f"<td style=\"padding:12px 14px;border-bottom:1px solid #eef2f6;text-align:right;font-weight:700\">{label}</td></tr>"
            f"<tr><td style=\"padding:12px 14px;border-bottom:1px solid #eef2f6;color:#64748b;font-size:12px\">Profil</td>"
            f"<td style=\"padding:12px 14px;border-bottom:1px solid #eef2f6;text-align:right;font-weight:700\">{profile_id}</td></tr>"
            f"<tr><td style=\"padding:12px 14px;border-bottom:1px solid #eef2f6;color:#64748b;font-size:12px\">IP</td>"
            f"<td style=\"padding:12px 14px;border-bottom:1px solid #eef2f6;text-align:right;font-weight:700\">{ip}</td></tr>"
            f"<tr><td style=\"padding:12px 14px;color:#64748b;font-size:12px\">Zeit</td>"
            f"<td style=\"padding:12px 14px;text-align:right;font-weight:700\">{when}</td></tr>"
            "</table>"
            "<p style=\"margin:18px 0 0;color:#64748b\">Wenn du das nicht warst, ändere deine PIN und informiere die Leitung.</p>"
        ),
        "Keine Antwort nötig · Nur für Admins / Profil-Recovery",
    )
    send_email(recipient, f"Armonia Thassos – Sicherheitswarnung: {label}", text_body, html_body)


def send_test_profile_email(recipient: str) -> None:
    text_body = (
        "Deine Profil-E-Mail ist verbunden. "
        "PIN-Links und Sicherheitsmeldungen können zugestellt werden."
    )
    html_body = email_shell(
        "E-Mail funktioniert",
        "Armonia Thassos · Test",
        (
            "<p style=\"margin:0 0 12px\">Deine Profil-E-Mail ist erfolgreich verbunden.</p>"
            "<p style=\"margin:0;color:#475569\">PIN-Reset-Links und Sicherheitsmeldungen "
            "können jetzt an diese Adresse gesendet werden.</p>"
            "<div style=\"margin:20px 0 0;padding:14px 16px;border-radius:14px;background:#ecfeff;border:1px solid #99f6e4;color:#0f766e;font-weight:700\">"
            "✓ E-Mail bereit · PIN-Links & Sicherheitsmeldungen</div>"
        ),
    )
    send_email(recipient, "Armonia Thassos – E-Mail funktioniert", text_body, html_body)


def send_pin_changed_email(recipient: str, profile_name: str) -> None:
    text_body = (
        f"Die PIN für {profile_name} wurde erfolgreich geändert.\n\n"
        "Wenn du das nicht warst, setze die PIN sofort zurück und informiere die Leitung."
    )
    html_body = email_shell(
        "PIN geändert",
        "Armonia Thassos · Sicherheit",
        (
            f"<p style=\"margin:0 0 12px\">Die PIN für <b>{profile_name}</b> wurde erfolgreich geändert.</p>"
            "<p style=\"margin:0;color:#475569\">Wenn du das nicht warst, setze die PIN sofort zurück "
            "über die Anmeldeseite und informiere die Leitung.</p>"
        ),
    )
    send_email(recipient, "Armonia Thassos – PIN geändert", text_body, html_body)


def send_event_announcement_email(recipient: str, title: str, date: str, start: str, end: str,
                                  location: str, children: str, note: str) -> None:
    text_body = (
        f"Neues Event: {title}\n"
        f"Datum: {date}\n"
        f"Zeit: {start}–{end}\n"
        f"Ort: {location or '—'}\n"
        f"Kinder: {children or '—'}\n"
        f"Hinweis: {note or '—'}\n"
    )
    rows = "".join(
        f"<tr><td style=\"padding:10px 14px;border-bottom:1px solid #eef2f6;color:#64748b;font-size:12px\">{label}</td>"
        f"<td style=\"padding:10px 14px;border-bottom:1px solid #eef2f6;text-align:right;font-weight:700\">{value or '—'}</td></tr>"
        for label, value in (
            ("Datum", date),
            ("Zeit", f"{start}–{end}" if start or end else ""),
            ("Ort", location),
            ("Kinder", children),
        )
    )
    html_body = email_shell(
        title or "Neues Event",
        "Armonia Thassos · Event",
        (
            "<p style=\"margin:0 0 14px\">Ein neues Event wurde veröffentlicht.</p>"
            "<table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" "
            f"style=\"background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px\">{rows}</table>"
            + (f"<p style=\"margin:16px 0 0;color:#475569\">{note}</p>" if note else "")
        ),
        "Bitte im PAIDIA Events-Tab nachsehen",
    )
    send_email(recipient, f"Armonia Thassos – Event: {title}", text_body, html_body)


def queue_security_alert(profile_id: str, event: str, ip: str, details: dict | None = None) -> bool:
    details = details or {}
    append_security_event(event, profile_id, ip, details)
    recipients = security_alert_recipients()
    if not recipients or not email_delivery_status()["configured"]:
        return False
    alert_key = f"{profile_id}:{event}:{ip_fingerprint(ip)}"
    now = time.time()
    with AUTH_LOCK:
        if now - SECURITY_ALERTS.get(alert_key, 0) < SECURITY_ALERT_COOLDOWN:
            return False
        SECURITY_ALERTS[alert_key] = now

    def deliver() -> None:
        failed = 0
        for recipient in recipients:
            try:
                send_security_alert_email(recipient, profile_id, event, ip, details)
            except (RuntimeError, OSError, smtplib.SMTPException):
                failed += 1
        if failed:
            append_security_event("alert_delivery_failed", profile_id, ip,
                                  {"sourceEvent": event, "failedRecipients": failed})

    threading.Thread(target=deliver, daemon=True, name="paidia-security-email").start()
    return True


def whatsapp_config() -> dict:
    return {
        "access_token": os.environ.get("WHATSAPP_ACCESS_TOKEN", "").strip(),
        "phone_number_id": os.environ.get("WHATSAPP_PHONE_NUMBER_ID", "").strip(),
        "business_account_id": os.environ.get("WHATSAPP_BUSINESS_ACCOUNT_ID", "").strip(),
        "verify_token": os.environ.get("WHATSAPP_VERIFY_TOKEN", "").strip(),
        "app_secret": os.environ.get("WHATSAPP_APP_SECRET", "").strip(),
        "event_template": os.environ.get("WHATSAPP_EVENT_TEMPLATE", "paidia_event_notification").strip(),
        "template_language": os.environ.get("WHATSAPP_TEMPLATE_LANGUAGE", "de").strip(),
        "test_recipient": os.environ.get("WHATSAPP_TEST_RECIPIENT", "").strip(),
        "send_enabled": os.environ.get("WHATSAPP_SEND_ENABLED", "false").lower() in {"1", "true", "yes"},
    }


def whatsapp_recipients() -> dict[str, list[str]]:
    try:
        raw = json.loads(os.environ.get("WHATSAPP_RECIPIENTS_JSON", "{}"))
    except json.JSONDecodeError:
        return {}
    if not isinstance(raw, dict):
        return {}
    result: dict[str, list[str]] = {}
    for child_id, values in raw.items():
        numbers = values if isinstance(values, list) else [values]
        clean = []
        for value in numbers:
            digits = re.sub(r"\D", "", str(value))
            if 8 <= len(digits) <= 15:
                clean.append(digits)
        if clean:
            result[str(child_id)] = clean
    return result


def send_whatsapp_template(to: str, template: str, language: str,
                           parameters: list[str] | None = None) -> dict:
    config = whatsapp_config()
    if not config["send_enabled"]:
        raise RuntimeError("WhatsApp sending is disabled")
    if not config["access_token"] or not config["phone_number_id"]:
        raise RuntimeError("WhatsApp credentials are incomplete")
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": re.sub(r"\D", "", to),
        "type": "template",
        "template": {"name": template, "language": {"code": language}},
    }
    if parameters:
        payload["template"]["components"] = [{
            "type": "body",
            "parameters": [{"type": "text", "text": str(value)[:1024]} for value in parameters],
        }]
    request = urllib.request.Request(
        f"{WHATSAPP_GRAPH_URL}/{WHATSAPP_GRAPH_VERSION}/{config['phone_number_id']}/messages",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {config['access_token']}",
            "Content-Type": "application/json",
            "User-Agent": "PAIDIA/1.0",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read())


ITEM_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "extracted_text": {"type": "string"},
        "language": {"type": "string"},
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "name": {"type": "string"},
                    "canonical_name": {"type": "string"},
                    "quantity": {"type": "number"},
                    "unit": {"type": "string"},
                    "category": {"type": "string"},
                    "brand": {"type": "string"},
                    "package_size": {"type": "string"},
                    "notes": {"type": "string"},
                    "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
                    "ambiguous": {"type": "boolean"},
                },
                "required": [
                    "name", "canonical_name", "quantity", "unit", "category",
                    "brand", "package_size", "notes", "confidence", "ambiguous",
                ],
            },
        },
    },
    "required": ["extracted_text", "language", "items"],
}


PROMPT = """Extract a supermarket shopping list from the supplied text or image.
The source may be handwritten or printed and may mix Greek, German, and English.
Return one row per intended product. Correct obvious OCR mistakes, but preserve brand,
variant, package size, house/event instructions, and crossed-out/uncertain meaning in
notes. Interpret ranges conservatively: use the upper bound and mention the range.
Do not merge different brands, sizes, or variants. Merge only clear duplicates and sum
their quantities. A missing quantity is 1 and must be medium or low confidence.
Use short canonical product names.

UNITS — every item MUST use exactly one of: Stk, kg, g, L, ml, Pkg.
Choose the unit that matches what is written on the list:
- Weight written (500g, 1,5 kg, 200 γραμμάρια) → qty=500 unit=g OR qty=1.5 unit=kg (never Stk).
- Volume written (2L, 1,5 Liter, 500ml, 2 λίτρα) → qty=2 unit=L OR qty=500 unit=ml (never Stk).
- Count / pieces / bottles / packs counted as items / τεμ / Stück → unit=Stk.
- Explicit pack count with no weight/volume → unit=Pkg only when the source says Pack/Pkg/Packung;
  otherwise prefer Stk.
Map synonyms: Stück/Stk/pcs/τεμ → Stk; liter/λίτρο/lt → L; κιλά/kilo → kg; γραμμ/gramm → g.
Put package size text in package_size (example: "1.5 L bottle"), NOT as a fake unit.
Never default to Stk when a weight or volume unit is visible on the line.
Mark unclear handwriting, 1/7, 0/6, kg/g, and pack-vs-item ambiguity low.
This is a draft only; never claim that items were purchased or approved.
Return only a JSON object with extracted_text, language, and items. Every item must have:
name, canonical_name, quantity, unit, category, brand, package_size, notes, confidence
(high, medium, or low), and ambiguous (boolean). Do not add other fields."""


HELP_PROMPT_BASE = """You are the PAIDIA / Armonia Thassos in-app help assistant for a residential
child-care operations app. Reply in the language used by the user (German, Greek, or English).
Be concise, practical, and safety-aware. Never invent saved data, claim an action was already
completed, reveal PINs or secrets, or make medical/legal decisions.
Always respect context.permissions — they are authoritative for this signed-in user.
Address the user by context.profileName when helpful."""

HELP_PROMPT_CHILD = HELP_PROMPT_BASE + """

ROLE: CHILD (read-only)
You help this child understand THEIR own views only:
- Today / Week: activities assigned to them (time, house, caregivers, other kids)
- Events published for them (date, place, bring, companion)
- Games tab (Memory, XO, fish catch) — local device games, no server save
- Help (?), profile, Face ID/PIN, logout
Do NOT explain staff tools (stock, shopping, audit, admin, shifts, supermarket import, team talk).
Do NOT propose or invent stock/shopping changes. Never output a ```paidia-action``` block.
If they ask to change food or the schedule, say a caregiver must do that.
If they ask about another child's private schedule, refuse politely."""

HELP_PROMPT_STAFF = HELP_PROMPT_BASE + """

ROLE: STAFF (caregiver)
You help with day-to-day operations they can use:
- Home tasks, schedule (day/week/house/matrix), events, shopping list, supermarket mode,
  inventory/fridge, audit log, profile/PIN/passkey, staff talk, AI help
FOOD / STOCK / SHOPPING MUTATIONS:
When the user asks to change food stock or the shopping list, ALWAYS propose draft actions
(do not only explain the UI). Match productQuery to names from context.inventory when possible.
Use houseId from context.inventory.houses[].id — prefer activeHouse when no house is named.
Examples:
- "Milch +2 in Kalyvia" / "βάλε 2 γάλα Kalyvia" → stock_adjust IN
- "Eier raus 6" / "βγάλε 6 αυγά" → stock_adjust OUT
- "Reis auf die Liste" → shop_add
- "Tomaten von der Liste" → shop_remove
Allowed action types:
- stock_adjust: {type, houseId, productQuery, dir:IN|OUT, qty:number, unit?, reason?}
- shop_add: {type, houseId, productQuery|name, qty:number, unit?}
- shop_remove: {type, houseId, productQuery|name}
If you propose actions, end with exactly one fenced block:
```paidia-action
{"actions":[...]}
```
Changes need confirmation in the app (PIN). Never claim they are already saved.
ADMIN-ONLY (you cannot do these — say an admin must): permanent week template edits,
shift template edits for others, editing another profile's contact, admin center overrides.
If a feature is missing, say so clearly."""

HELP_PROMPT_ADMIN = HELP_PROMPT_BASE + """

ROLE: ADMIN
You help admins with full operational + management control:
Everything staff can do, PLUS Admin Center, permanent schedule template, shift editing,
managing events, audit corrections, other profiles' contact details, security overview.
FOOD / STOCK / SHOPPING MUTATIONS: same rules as staff — propose draft actions with
```paidia-action
{"actions":[...]}
```
when they ask to change stock or the shopping list. Confirmation still required in the app.
Remind them that permanent plan changes are admin-only and stay in the audit log.
Be precise about which button/path to use (Home → Admin Center, Dauerhaft/Μόνιμα, etc.)."""


CHAT_ACTION_RE = re.compile(r"```paidia-action\s*([\s\S]*?)```", re.IGNORECASE)


def chat_role_for_session(session: dict | None) -> str:
    if not session:
        return "anonymous"
    if session.get("mode") == "child":
        return "child"
    if session.get("admin"):
        return "admin"
    return "staff"


def help_prompt_for_role(role: str) -> str:
    if role == "child":
        return HELP_PROMPT_CHILD
    if role == "admin":
        return HELP_PROMPT_ADMIN
    if role == "staff":
        return HELP_PROMPT_STAFF
    return HELP_PROMPT_BASE + "\n\nROLE: UNKNOWN — only explain general navigation; never mutate data."


def apply_session_chat_permissions(context: dict, session: dict | None) -> dict:
    """Force permission fields from the auth session; ignore client spoofing."""
    role = chat_role_for_session(session)
    can_mutate = role in {"staff", "admin"}
    can_admin = role == "admin"
    cleaned = {k: v for k, v in context.items() if k not in {
        "canMutate", "admin", "role", "permissions", "profileId", "mode",
    }}
    if not can_mutate:
        cleaned.pop("inventory", None)
    elif not isinstance(cleaned.get("inventory"), dict):
        cleaned.pop("inventory", None)
    cleaned["role"] = role
    cleaned["canMutate"] = can_mutate
    cleaned["admin"] = can_admin
    cleaned["permissions"] = {
        "role": role,
        "canMutateStock": can_mutate,
        "canMutateShopping": can_mutate,
        "canEditOwnProfile": True,
        "canEditOtherProfiles": can_admin,
        "canEditPermanentSchedule": can_admin,
        "canEditShifts": can_admin,
        "canUseAdminCenter": can_admin,
        "canCorrectAudit": can_admin,
        "canViewOwnChildSchedule": role == "child",
        "canViewAllStaffTools": role in {"staff", "admin"},
        "canPlayGames": role == "child",
    }
    if session:
        cleaned["profileId"] = session.get("profile_id")
        cleaned["mode"] = session.get("mode")
    return cleaned


def extract_chat_actions(text: str) -> tuple[str, list]:
    """Split assistant reply into visible message + optional draft actions."""
    if not isinstance(text, str) or not text.strip():
        return "", []
    actions: list = []
    cleaned = text

    def _consume(match: re.Match) -> str:
        nonlocal actions
        raw = (match.group(1) or "").strip()
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            return ""
        rows = payload.get("actions") if isinstance(payload, dict) else payload
        if not isinstance(rows, list):
            return ""
        for row in rows[:12]:
            if not isinstance(row, dict):
                continue
            kind = str(row.get("type", "")).strip()
            if kind not in {"stock_adjust", "shop_add", "shop_remove"}:
                continue
            action = {"type": kind}
            for key in ("houseId", "productQuery", "name", "dir", "unit", "reason"):
                value = row.get(key)
                if isinstance(value, str) and value.strip():
                    action[key] = value.strip()[:120]
            qty = row.get("qty")
            try:
                qty_num = float(qty)
            except (TypeError, ValueError):
                qty_num = None
            if qty_num is not None and qty_num > 0:
                action["qty"] = round(qty_num, 2)
            if kind == "stock_adjust":
                direction = str(action.get("dir", "IN")).upper()
                if direction not in {"IN", "OUT"}:
                    continue
                action["dir"] = direction
                if "qty" not in action or not (action.get("productQuery") or action.get("name")):
                    continue
            if kind == "shop_add" and ("qty" not in action or not (action.get("productQuery") or action.get("name"))):
                continue
            if kind == "shop_remove" and not (action.get("productQuery") or action.get("name")):
                continue
            actions.append(action)
        return ""

    cleaned = CHAT_ACTION_RE.sub(_consume, cleaned).strip()
    return cleaned, actions


def run_chat(body: dict, api_key: str, session: dict | None = None) -> tuple[int, dict]:
    """Shared chat handler for local server and Vercel Flask."""
    raw_messages = body.get("messages", [])
    context = body.get("context", {})
    if not isinstance(context, dict):
        context = {}
    if not isinstance(raw_messages, list) or not raw_messages:
        return 400, {"error": "messages are required"}
    context = apply_session_chat_permissions(context, session)
    role = context["role"]
    can_mutate = bool(context.get("canMutate"))
    prompt = help_prompt_for_role(role)
    messages = [{"role": "system", "content": prompt + "\nCurrent UI context: " +
                 json.dumps(context, ensure_ascii=False)[:12000]}]
    for message in raw_messages[-12]:
        if not isinstance(message, dict) or message.get("role") not in {"user", "assistant"}:
            continue
        content = message.get("content")
        if isinstance(content, str) and content.strip():
            messages.append({"role": message["role"], "content": content[:4000]})
    if len(messages) == 1:
        return 400, {"error": "No valid messages"}
    try:
        response = groq_completion(api_key, {
            "model": CHAT_MODEL, "messages": messages, "temperature": 0.3,
            "max_completion_tokens": 900,
        }, timeout=60)
        raw = completion_text(response)
        message, actions = extract_chat_actions(raw)
        if not can_mutate:
            actions = []
        if not message and actions:
            message = "I prepared draft changes. Please confirm them in the app."
        if not message and not actions:
            message = raw
        # Strip any leaked action fences from the visible text if we dropped actions.
        if not can_mutate and message:
            message = CHAT_ACTION_RE.sub("", message).strip() or message
        return 200, {
            "message": message or raw,
            "actions": actions,
            "role": role,
            "canMutate": can_mutate,
            "model": response.get("model", CHAT_MODEL),
            "responseId": response.get("id"),
        }
    except urllib.error.HTTPError as exc:
        return provider_error(exc)
    except (urllib.error.URLError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
        code = "timeout" if isinstance(exc, TimeoutError) else "provider"
        return (504 if code == "timeout" else 502), {"error": "Help chat failed", "code": code}


def run_chore_verify(body: dict, api_key: str) -> tuple[int, dict]:
    """AI verifier for kids' chore proof submissions."""
    chore_name = body.get("choreName", "the chore")
    proof_text = body.get("proofText", "")
    lang = body.get("lang", "de")

    if lang == "el":
        system_msg = (
            f"Είσαι ένας φιλικός βοηθός για ένα παιδικό κέντρο στη Θάσο (Armonia Thassos). "
            f"Ένα παιδί λέει ότι ολοκλήρωσε αυτή την αποστολή: \"{chore_name}\". "
            f"Η απόδειξή του: \"{proof_text}\". "
            "Απάντησε ΜΟΝΟ με ένα JSON αντικείμενο: "
            "{\"approved\": true/false, \"reason\": \"σύντομη φιλική εξήγηση στα ελληνικά\"}. "
            "Να είσαι ενθαρρυντικός. Αν η απόδειξη φαίνεται λογική για ένα παιδί, έγκρινέ τη."
        )
    else:
        system_msg = (
            f"Du bist ein freundlicher Helfer für ein Kinderbetreuungszentrum auf Thassos (Armonia Thassos). "
            f"Ein Kind behauptet, diese Aufgabe erledigt zu haben: \"{chore_name}\". "
            f"Sein Beweis: \"{proof_text}\". "
            "Antworte NUR mit einem JSON-Objekt: "
            "{\"approved\": true/false, \"reason\": \"kurze freundliche Erklärung auf Deutsch\"}. "
            "Sei ermutigend. Wenn der Beweis für ein Kind plausibel klingt, genehmige ihn."
        )

    messages = [
        {"role": "system", "content": system_msg},
        {"role": "user", "content": f"Aufgabe: {chore_name}\nBeweis: {proof_text}"},
    ]
    try:
        response = groq_completion(api_key, {
            "model": CHAT_MODEL,
            "messages": messages,
            "temperature": 0.2,
            "max_completion_tokens": 150,
        }, timeout=30)
        raw = completion_text(response)
        import re as _re
        match = _re.search(r"\{[\s\S]*?\}", raw)
        if match:
            parsed = json.loads(match.group(0))
            approved = bool(parsed.get("approved", False))
            reason = str(parsed.get("reason", ""))
            return 200, {"approved": approved, "reason": reason}
        return 200, {"approved": False, "reason": raw[:200]}
    except Exception as exc:
        return 502, {"error": str(exc), "code": "provider"}


def groq_completion(api_key: str, request_body: dict, timeout: int = 90) -> dict:
    """Call Groq and transparently retry short, recoverable rate limits."""
    for attempt in range(2):
        request = urllib.request.Request(
            GROQ_URL,
            data=json.dumps(request_body).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "PAIDIA/1.0",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=timeout) as result:
                return json.loads(result.read())
        except urllib.error.HTTPError as exc:
            if exc.code != 429 or attempt == 1:
                raise
            retry_after = exc.headers.get("retry-after", "3")
            try:
                match = re.search(r"\d+(?:\.\d+)?", retry_after)
                delay = min(15.0, max(1.0, float(match.group()) if match else 3.0))
            except ValueError:
                delay = 3.0
            exc.read()
            time.sleep(delay)
    raise RuntimeError("unreachable")


def provider_error(exc: urllib.error.HTTPError) -> tuple[int, dict]:
    """Map provider failures to stable, non-sensitive errors for the browser."""
    if exc.code == 429:
        return 429, {"error": "AI temporarily busy", "code": "rate_limit", "retryAfter": 5}
    if exc.code in {401, 403}:
        return 503, {"error": "AI configuration rejected", "code": "configuration"}
    if exc.code in {408, 504}:
        return 504, {"error": "AI request timed out", "code": "timeout"}
    if exc.code in {400, 413, 415, 422}:
        return 422, {"error": "AI could not read this input", "code": "input"}
    return 502, {"error": "AI provider unavailable", "code": "provider"}


def completion_text(response: dict) -> str:
    try:
        return response["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        raise ValueError("Groq returned no message content") from exc


def parse_json_output(text: str) -> dict:
    clean = text.strip()
    if clean.startswith("```"):
        clean = clean.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
    if not clean.startswith("{"):
        start, end = clean.find("{"), clean.rfind("}")
        if start >= 0 and end > start:
            clean = clean[start:end + 1]
    value = json.loads(clean)
    if not isinstance(value, dict) or not isinstance(value.get("items"), list):
        raise ValueError("Groq returned an invalid shopping-list object")
    return value


class Handler(SimpleHTTPRequestHandler):
    def json_response(self, status: int, payload: dict, headers: dict | None = None) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        for name, value in (headers or {}).items():
            if name == "Set-Cookie" and isinstance(value, (list, tuple)):
                for item in value:
                    self.send_header(name, item)
            else:
                self.send_header(name, value)
        self.end_headers()
        self.wfile.write(raw)

    def auth_cookie(self) -> str:
        cookie = SimpleCookie(self.headers.get("Cookie", ""))
        morsel = cookie.get(AUTH_COOKIE)
        return morsel.value if morsel else ""

    def passkey_device_cookie(self) -> str:
        cookie = SimpleCookie(self.headers.get("Cookie", ""))
        morsel = cookie.get(PASSKEY_COOKIE)
        return morsel.value if morsel else ""

    def passkey_store_for_request(self) -> dict:
        return merge_passkey_stores(PASSKEYS, decode_passkey_device_bundle(self.passkey_device_cookie()))

    def set_cookie_header(self, name: str, token: str, max_age: int) -> str:
        secure = (
            os.environ.get("PAIDIA_COOKIE_SECURE", "false").lower() in {"1", "true", "yes"}
            or os.environ.get("VERCEL", "") == "1"
        )
        parts = [f"{name}={token}", "Path=/", f"Max-Age={max_age}", "HttpOnly", "SameSite=Lax"]
        if secure:
            parts.append("Secure")
        return "; ".join(parts)

    def set_session_cookie(self, token: str, max_age: int = AUTH_SESSION_TTL) -> str:
        return self.set_cookie_header(AUTH_COOKIE, token, max_age)

    def set_passkey_cookie(self, token: str, max_age: int = PASSKEY_COOKIE_TTL) -> str:
        return self.set_cookie_header(PASSKEY_COOKIE, token, max_age)

    def client_ip(self) -> str:
        ip = self.client_address[0]
        trust_proxy = os.environ.get("PAIDIA_TRUST_PROXY", "false").lower() in {"1", "true", "yes"}
        try:
            peer = ipaddress.ip_address(ip)
            trusted_peer = peer.is_loopback or any(peer in network for network in TRUSTED_PROXY_NETWORKS)
        except ValueError:
            trusted_peer = False
        if trust_proxy and trusted_peer:
            forwarded = self.headers.get("X-Forwarded-For", "").split(",", 1)[0].strip()
            if forwarded:
                try:
                    ipaddress.ip_address(forwarded)
                    ip = forwarded
                except ValueError:
                    pass
        return ip

    def current_auth_session(self) -> dict | None:
        token = self.auth_cookie()
        if not token:
            return None
        signed = decode_session_token(token)
        if signed:
            return signed
        with AUTH_LOCK:
            session = AUTH_SESSIONS.get(token)
            if not session or session["expires_at"] <= time.time():
                AUTH_SESSIONS.pop(token, None)
                return None
            return dict(session)

    def text_response(self, status: int, value: str) -> None:
        raw = value.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(raw)

    def read_json_body(self) -> tuple[bytes, dict | None]:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            return b"", None
        if length <= 0 or length > MAX_BODY:
            return b"", None
        raw = self.rfile.read(length)
        try:
            value = json.loads(raw)
        except (json.JSONDecodeError, UnicodeDecodeError):
            return raw, None
        return raw, value if isinstance(value, dict) else None

    def whatsapp_signature_valid(self, raw: bytes) -> bool:
        secret = whatsapp_config()["app_secret"]
        if not secret:
            return True
        supplied = self.headers.get("X-Hub-Signature-256", "")
        expected = "sha256=" + hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
        return hmac.compare_digest(supplied, expected)

    def do_GET(self) -> None:  # noqa: N802
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path == "/api/health":
            self.json_response(200, {
                "ok": True,
                "aiConfigured": bool(os.environ.get("GROQ_API_KEY")),
                "ocrModel": OCR_MODEL,
                "chatModel": CHAT_MODEL,
                "whatsappConfigured": bool(whatsapp_config()["access_token"] and
                                             whatsapp_config()["phone_number_id"]),
                "whatsappSendEnabled": whatsapp_config()["send_enabled"],
            })
            return
        if parsed.path == "/api/auth/health":
            delivery = email_delivery_status()
            self.json_response(200, {
                "ok": True,
                "configuredProfiles": len(AUTH_USERS),
                "profilesWithEmail": sum(1 for user in AUTH_USERS.values() if user["email"]),
                "emailConfigured": delivery["configured"],
                "emailProvider": delivery["provider"],
                "secureCookie": os.environ.get("PAIDIA_COOKIE_SECURE", "false").lower() in {"1", "true", "yes"},
                "securityMonitoring": True,
                "securityEmailReady": bool(delivery["configured"] and security_alert_recipients()),
                "securityAdminRecipients": len(security_alert_recipients()),
                "trustedNetworksConfigured": len(TRUSTED_NETWORKS),
                "trustedProxyNetworksConfigured": len(TRUSTED_PROXY_NETWORKS),
                "loginAttemptLimit": LOGIN_MAX_ATTEMPTS,
                "passkeysAvailable": WEBAUTHN_AVAILABLE,
                "passkeyCredentials": len(PASSKEYS["credentials"]),
                "passkeyOrigin": WEBAUTHN_ORIGIN,
                "passkeyRpId": WEBAUTHN_RP_ID,
                "onboardingVersion": ONBOARDING_VERSION,
            })
            return
        if parsed.path == "/api/auth/profiles":
            session = self.current_auth_session()
            if not session:
                self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
                return
            profile_ids = list(AUTH_USERS) if session.get("admin") else [session["profile_id"]]
            self.json_response(200, {
                "profiles": [{
                    "profileId": profile_id,
                    "mode": AUTH_USERS[profile_id]["mode"],
                    "email": AUTH_USERS[profile_id].get("email", ""),
                    "phone": AUTH_USERS[profile_id].get("phone", ""),
                } for profile_id in profile_ids],
                "canManageAll": bool(session.get("admin")),
                "emailConfigured": email_delivery_status()["configured"],
                "emailProvider": email_delivery_status()["provider"],
            })
            return
        if parsed.path == "/api/auth/session":
            session = self.current_auth_session()
            if not session:
                self.json_response(200, {"authenticated": False})
            else:
                contact = profile_contact(session["profile_id"])
                self.json_response(200, {
                    "authenticated": True,
                    "profileId": session["profile_id"],
                    "mode": session["mode"],
                    "admin": bool(session.get("admin")),
                    "sessionId": session["session_id"],
                    "expiresAt": int(session["expires_at"] * 1000),
                    "passkeys": len(profile_passkeys(session["profile_id"], session["mode"])),
                    "onboardingComplete": onboarding_complete(session["profile_id"], session["mode"]),
                    "onboardingVersion": ONBOARDING_VERSION,
                    "email": contact["email"],
                    "phone": contact["phone"],
                    "contactComplete": bool(contact["email"] and contact["phone"]),
                    "emailConfigured": email_delivery_status()["configured"],
                    "emailProvider": email_delivery_status()["provider"],
                })
            return
        if parsed.path == "/api/talk":
            session = self.current_auth_session()
            if not session:
                self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
                return
            if session.get("mode") != "staff":
                self.json_response(403, {"error": "Staff only", "code": "staff_required"})
                return
            self.json_response(200, talk_snapshot())
            return
        if parsed.path == "/api/ops":
            session = self.current_auth_session()
            if not session:
                self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
                return
            if session.get("mode") != "staff":
                self.json_response(403, {"error": "Staff only", "code": "staff_required"})
                return
            try:
                since = int(urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query).get("since", ["0"])[0])
            except (TypeError, ValueError):
                since = 0
            self.json_response(200, get_ops(since))
            return
        if parsed.path == "/api/whatsapp/health":
            config = whatsapp_config()
            self.json_response(200, {
                "ok": True,
                "configured": bool(config["access_token"] and config["phone_number_id"]),
                "sendEnabled": config["send_enabled"],
                "webhookConfigured": bool(config["verify_token"]),
                "signatureVerification": bool(config["app_secret"]),
                "businessAccountConfigured": bool(config["business_account_id"]),
                "recipientProfiles": len(whatsapp_recipients()),
                "graphVersion": WHATSAPP_GRAPH_VERSION,
                "eventTemplate": config["event_template"],
            })
            return
        if parsed.path == "/api/whatsapp/webhook":
            query = urllib.parse.parse_qs(parsed.query)
            config = whatsapp_config()
            if (query.get("hub.mode", [""])[0] == "subscribe" and config["verify_token"] and
                    hmac.compare_digest(query.get("hub.verify_token", [""])[0], config["verify_token"])):
                self.text_response(200, query.get("hub.challenge", [""])[0])
            else:
                self.json_response(403, {"error": "Webhook verification failed"})
            return
        # Never let browsers/PWAs keep a stale login shell.
        if parsed.path in {"/", "/index.html", "/app.js", "/gate.js", "/sw.js"} or parsed.path.endswith((".html", ".js", ".css", ".webmanifest")):
            path = self.translate_path(self.path)
            if os.path.isdir(path):
                path = os.path.join(path, "index.html")
            try:
                with open(path, "rb") as file_obj:
                    payload = file_obj.read()
            except OSError:
                self.send_error(404, "File not found")
                return
            content_type = self.guess_type(path)
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        path = urllib.parse.urlsplit(self.path).path
        if path == "/api/whatsapp/webhook":
            raw, body = self.read_json_body()
            if body is None:
                self.json_response(400, {"error": "Invalid webhook payload"})
                return
            if not self.whatsapp_signature_valid(raw):
                self.json_response(401, {"error": "Invalid webhook signature"})
                return
            # Acknowledge quickly. Delivery/read payloads are intentionally not persisted locally.
            self.json_response(200, {"received": True})
            return
        if path not in {
            "/api/ai-shopping", "/api/chat", "/api/talk", "/api/ops", "/api/whatsapp/test", "/api/whatsapp/event",
            "/api/notify/event-email",
            "/api/auth/login", "/api/auth/logout", "/api/auth/request-reset", "/api/auth/reset",
            "/api/auth/passkey/register/options", "/api/auth/passkey/register/verify",
            "/api/auth/passkey/login/options", "/api/auth/passkey/login/verify", "/api/auth/passkey/remove",
            "/api/auth/onboarding/complete",
            "/api/auth/profile/email", "/api/auth/profile/email/test",
        }:
            self.json_response(404, {"error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.json_response(400, {"error": "Invalid content length", "code": "input"})
            return
        if length <= 0 or length > MAX_BODY:
            self.json_response(413, {"error": "Input is empty or too large"})
            return
        try:
            body = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.json_response(400, {"error": "Invalid JSON"})
            return
        if not isinstance(body, dict):
            self.json_response(400, {"error": "JSON object required", "code": "input"})
            return

        if path == "/api/auth/login":
            self.handle_auth_login(body)
            return
        if path == "/api/auth/logout":
            self.handle_auth_logout()
            return
        if path == "/api/auth/request-reset":
            self.handle_auth_request_reset(body)
            return
        if path == "/api/auth/reset":
            self.handle_auth_reset(body)
            return
        if path == "/api/auth/passkey/register/options":
            self.handle_passkey_register_options(body)
            return
        if path == "/api/auth/passkey/register/verify":
            self.handle_passkey_register_verify(body)
            return
        if path == "/api/auth/passkey/login/options":
            self.handle_passkey_login_options(body)
            return
        if path == "/api/auth/passkey/login/verify":
            self.handle_passkey_login_verify(body)
            return
        if path == "/api/auth/passkey/remove":
            self.handle_passkey_remove(body)
            return
        if path == "/api/auth/onboarding/complete":
            self.handle_onboarding_complete(body)
            return
        if path == "/api/auth/profile/email":
            self.handle_profile_email(body)
            return
        if path == "/api/auth/profile/email/test":
            self.handle_profile_email_test(body)
            return
        if path == "/api/talk":
            session = self.current_auth_session()
            if not session:
                self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
                return
            status, payload = mutate_talk(str(body.get("action") or "").strip(), body, session)
            self.json_response(status, payload)
            return
        if path == "/api/ops":
            session = self.current_auth_session()
            if not session:
                self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
                return
            status, payload = put_ops(body, session)
            self.json_response(status, payload)
            return

        if path == "/api/whatsapp/test":
            self.handle_whatsapp_test(body)
            return
        if path == "/api/whatsapp/event":
            self.handle_whatsapp_event(body)
            return
        if path == "/api/notify/event-email":
            self.handle_event_email(body)
            return

        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            self.json_response(503, {
                "error": "Groq is not configured",
                "setup": "Set GROQ_API_KEY in .env and restart python3 server.py",
            })
            return

        if path == "/api/chat":
            if not self.current_auth_session():
                self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
                return
            self.handle_chat(body, api_key)
            return
        if path == "/api/ai-shopping":
            status, payload = run_shopping(body, api_key)
            self.json_response(status, payload)
            return
        if path == "/api/chore-verify":
            if not self.current_auth_session():
                self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
                return
            status, payload = run_chore_verify(body, api_key)
            self.json_response(status, payload)
            return
        self.json_response(404, {"error": "Not found"})

    def finish_authentication(self, profile_id: str, mode: str, method: str = "pin",
                               extra_cookies: list[str] | None = None) -> None:
        client_ip = self.client_ip()
        token, payload = encode_session_token(profile_id, mode, method)
        with AUTH_LOCK:
            AUTH_SESSIONS.pop(self.auth_cookie(), None)
            new_ip, first_ip = remember_profile_ip(profile_id, client_ip)
        if mode == "staff":
            trusted = is_trusted_ip(client_ip)
            if not trusted:
                queue_security_alert(profile_id, "untrusted_ip_login", client_ip, {"attempts": 0})
            elif new_ip and not first_ip:
                queue_security_alert(profile_id, "new_ip_login", client_ip, {"attempts": 0})
        contact = profile_contact(profile_id)
        cookies = [self.set_session_cookie(token)]
        if extra_cookies:
            cookies.extend(extra_cookies)
        self.json_response(200, {
            "authenticated": True, "profileId": profile_id, "mode": mode,
            "admin": bool(payload["admin"]),
            "sessionId": payload["session_id"], "expiresAt": int(payload["expires_at"] * 1000),
            "authenticationMethod": method,
            "onboardingComplete": onboarding_complete(profile_id, mode),
            "onboardingVersion": ONBOARDING_VERSION,
            "email": contact["email"],
            "phone": contact["phone"],
            "contactComplete": bool(contact["email"] and contact["phone"]),
        }, {"Set-Cookie": cookies if len(cookies) > 1 else cookies[0]})

    def handle_onboarding_complete(self, body: dict) -> None:
        session = self.current_auth_session()
        if not session:
            self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
            return
        if body.get("version") != ONBOARDING_VERSION:
            self.json_response(409, {
                "error": "Tutorial version changed. Please restart the tutorial.",
                "code": "onboarding_version",
                "version": ONBOARDING_VERSION,
            })
            return
        with ONBOARDING_LOCK:
            previous = ONBOARDING_STATE["profiles"].get(session["profile_id"])
            ONBOARDING_STATE["profiles"][session["profile_id"]] = {
                "version": ONBOARDING_VERSION,
                "mode": session["mode"],
                "completed_at": int(time.time()),
            }
            try:
                persist_onboarding_state()
            except OSError:
                # On Vercel, keep the in-memory completion even if disk write fails.
                if os.environ.get("VERCEL") != "1":
                    if previous is None:
                        ONBOARDING_STATE["profiles"].pop(session["profile_id"], None)
                    else:
                        ONBOARDING_STATE["profiles"][session["profile_id"]] = previous
                    self.json_response(500, {
                        "error": "Tutorial progress could not be saved.",
                        "code": "onboarding_storage",
                    })
                    return
        self.json_response(200, {"completed": True, "version": ONBOARDING_VERSION})

    def handle_auth_login(self, body: dict) -> None:
        profile_id = str(body.get("profileId", "")).strip()[:64]
        mode = "child" if body.get("mode") == "child" else "staff"
        pin = str(body.get("pin", ""))[:12]
        client_ip = self.client_ip()
        user = AUTH_USERS.get(profile_id)
        profile_bucket = profile_id if user else "_unknown"
        attempt_key = f"pair:{client_ip}:{profile_bucket}"
        ip_key = f"ip:{client_ip}"
        profile_key = f"profile:{profile_bucket}"
        now = time.time()
        with AUTH_LOCK:
            failures = [stamp for stamp in LOGIN_FAILURES.get(attempt_key, []) if now - stamp < LOGIN_WINDOW]
            ip_failures = [stamp for stamp in IP_LOGIN_FAILURES.get(ip_key, []) if now - stamp < LOGIN_WINDOW]
            profile_failures = [stamp for stamp in PROFILE_LOGIN_FAILURES.get(profile_key, []) if now - stamp < LOGIN_WINDOW]
            LOGIN_FAILURES[attempt_key] = failures
            IP_LOGIN_FAILURES[ip_key] = ip_failures
            PROFILE_LOGIN_FAILURES[profile_key] = profile_failures
            lock_until = max(LOGIN_LOCKS.get(attempt_key, 0), LOGIN_LOCKS.get(ip_key, 0),
                             LOGIN_LOCKS.get(profile_key, 0))
            if lock_until <= now:
                LOGIN_LOCKS.pop(attempt_key, None)
                LOGIN_LOCKS.pop(ip_key, None)
                LOGIN_LOCKS.pop(profile_key, None)
        if lock_until > now:
            self.json_response(429, {"error": "Too many PIN attempts", "code": "locked",
                                     "retryAfter": max(1, int(lock_until - now))})
            return
        valid = bool(
            user
            and user["mode"] == mode
            and re.fullmatch(r"\d{4,6}", pin)
            and verify_pin(pin, user["pin_hash"])
        )
        if not valid:
            with AUTH_LOCK:
                LOGIN_FAILURES.setdefault(attempt_key, []).append(now)
                IP_LOGIN_FAILURES.setdefault(ip_key, []).append(now)
                PROFILE_LOGIN_FAILURES.setdefault(profile_key, []).append(now)
                pair_count = len(LOGIN_FAILURES[attempt_key])
                ip_count = len(IP_LOGIN_FAILURES[ip_key])
                profile_count = len(PROFILE_LOGIN_FAILURES[profile_key])
                should_lock = (pair_count >= LOGIN_MAX_ATTEMPTS or ip_count >= IP_MAX_FAILURES or
                               profile_count >= PROFILE_MAX_FAILURES)
                if should_lock:
                    lock_until = now + LOGIN_LOCK_TTL
                    if pair_count >= LOGIN_MAX_ATTEMPTS:
                        LOGIN_LOCKS[attempt_key] = lock_until
                    if ip_count >= IP_MAX_FAILURES:
                        LOGIN_LOCKS[ip_key] = lock_until
                    if profile_count >= PROFILE_MAX_FAILURES:
                        LOGIN_LOCKS[profile_key] = lock_until
            if user and user["mode"] == "staff" and pair_count == SECURITY_ALERT_AFTER:
                queue_security_alert(profile_id, "repeated_failures", client_ip, {"attempts": pair_count})
            if should_lock:
                if user and user["mode"] == "staff":
                    queue_security_alert(profile_id, "login_locked", client_ip, {"attempts": pair_count})
                self.json_response(429, {"error": "Too many PIN attempts", "code": "locked",
                                         "retryAfter": LOGIN_LOCK_TTL})
                return
            self.json_response(401, {
                "error": "Invalid profile or PIN", "code": "invalid_pin",
                "attemptsRemaining": max(0, LOGIN_MAX_ATTEMPTS - pair_count),
            })
            return
        with AUTH_LOCK:
            LOGIN_FAILURES.pop(attempt_key, None)
        self.finish_authentication(profile_id, mode, "pin")

    def handle_passkey_register_options(self, body: dict) -> None:
        if not WEBAUTHN_AVAILABLE:
            self.json_response(503, {"error": "Passkey support is not installed", "code": "passkey_unavailable"})
            return
        session = self.current_auth_session()
        if not session:
            self.json_response(401, {"error": "PIN sign-in is required before adding a passkey", "code": "reauth_required"})
            return
        profile_id, mode = session["profile_id"], session["mode"]
        display_name = str(body.get("displayName", profile_id)).strip()[:80] or profile_id
        store = self.passkey_store_for_request()
        existing = profile_passkeys(profile_id, mode, store=store)
        options = generate_registration_options(
            rp_id=WEBAUTHN_RP_ID, rp_name="Armonia Thassos", user_name=profile_id,
            user_id=passkey_user_handle(profile_id), user_display_name=display_name,
            authenticator_selection=AuthenticatorSelectionCriteria(
                authenticator_attachment=AuthenticatorAttachment.PLATFORM,
                resident_key=ResidentKeyRequirement.PREFERRED, require_resident_key=False,
                user_verification=UserVerificationRequirement.REQUIRED,
            ),
            exclude_credentials=[PublicKeyCredentialDescriptor(id=unb64url(item["credential_id"]))
                                 for item in existing], timeout=60_000,
        )
        challenge_b64 = b64url(options.challenge if isinstance(options.challenge, (bytes, bytearray))
                               else unb64url(str(options.challenge)))
        ceremony_payload = {
            "kind": "register", "profile_id": profile_id, "mode": mode,
            "challenge": challenge_b64, "session_id": session["session_id"],
            "label": str(body.get("label", "This device")).strip()[:80] or "This device",
            "expires_at": time.time() + PASSKEY_CHALLENGE_TTL,
        }
        ceremony_id = mint_passkey_ceremony(ceremony_payload)
        remember_passkey_challenge(ceremony_id, {**ceremony_payload, "challenge": challenge_b64})
        self.json_response(200, {"ceremonyId": ceremony_id, "publicKey": json.loads(options_to_json(options))})

    def handle_passkey_register_verify(self, body: dict) -> None:
        if not WEBAUTHN_AVAILABLE:
            self.json_response(503, {"error": "Passkey support is not installed", "code": "passkey_unavailable"})
            return
        session = self.current_auth_session()
        ceremony_id = str(body.get("ceremonyId", ""))
        challenge = take_passkey_challenge(ceremony_id)
        if (not session or not challenge or challenge.get("kind") != "register" or
                challenge.get("expires_at", 0) <= time.time() or
                challenge.get("session_id") != session.get("session_id")):
            self.json_response(400, {"error": "Passkey setup expired; start again", "code": "challenge_expired"})
            return
        credential = body.get("credential")
        if not isinstance(credential, dict):
            self.json_response(400, {"error": "Invalid passkey response", "code": "input"})
            return
        try:
            verified = verify_registration_response(
                credential=credential, expected_challenge=unb64url(challenge["challenge"]),
                expected_rp_id=WEBAUTHN_RP_ID, expected_origin=WEBAUTHN_ORIGIN,
                require_user_verification=True,
            )
        except (InvalidRegistrationResponse, ValueError, TypeError):
            self.json_response(401, {"error": "The passkey could not be verified", "code": "verification_failed"})
            return
        credential_id = b64url(verified.credential_id)
        record = {
            "credential_id": credential_id, "profile_id": challenge["profile_id"],
            "mode": challenge["mode"], "public_key": b64url(verified.credential_public_key),
            "sign_count": verified.sign_count, "device_type": verified.credential_device_type.value,
            "backed_up": verified.credential_backed_up, "label": challenge["label"],
            "created_at": int(time.time()),
        }
        device_bundle = decode_passkey_device_bundle(self.passkey_device_cookie())
        try:
            with AUTH_LOCK:
                PASSKEYS["credentials"][credential_id] = record
                persist_passkeys()
            device_bundle["credentials"][credential_id] = record
            if challenge["profile_id"] in PASSKEYS["user_handles"]:
                device_bundle["user_handles"][challenge["profile_id"]] = PASSKEYS["user_handles"][challenge["profile_id"]]
        except OSError:
            # Still keep the device cookie so Face ID works on this browser after cold starts.
            device_bundle["credentials"][credential_id] = record
        self.json_response(200, {
            "registered": True, "credentialId": credential_id,
            "passkeys": len(profile_passkeys(challenge["profile_id"], challenge["mode"],
                                             store=merge_passkey_stores(PASSKEYS, device_bundle))),
        }, {"Set-Cookie": self.set_passkey_cookie(encode_passkey_device_bundle(device_bundle))})

    def handle_passkey_login_options(self, body: dict) -> None:
        if not WEBAUTHN_AVAILABLE:
            self.json_response(503, {"error": "Passkey support is not installed", "code": "passkey_unavailable"})
            return
        profile_id = str(body.get("profileId", "")).strip()[:64]
        mode = "child" if body.get("mode") == "child" else "staff"
        user = AUTH_USERS.get(profile_id)
        store = self.passkey_store_for_request()
        credentials = profile_passkeys(profile_id, mode, store=store)
        if not user or user.get("mode") != mode or not credentials:
            self.json_response(404, {"error": "No passkey is configured for this profile", "code": "no_passkey"})
            return
        options = generate_authentication_options(
            rp_id=WEBAUTHN_RP_ID,
            allow_credentials=[PublicKeyCredentialDescriptor(id=unb64url(item["credential_id"]))
                               for item in credentials],
            user_verification=UserVerificationRequirement.REQUIRED, timeout=60_000,
        )
        challenge_b64 = b64url(options.challenge if isinstance(options.challenge, (bytes, bytearray))
                               else unb64url(str(options.challenge)))
        ceremony_payload = {
            "kind": "login", "profile_id": profile_id, "mode": mode,
            "challenge": challenge_b64, "expires_at": time.time() + PASSKEY_CHALLENGE_TTL,
        }
        ceremony_id = mint_passkey_ceremony(ceremony_payload)
        remember_passkey_challenge(ceremony_id, ceremony_payload)
        self.json_response(200, {"ceremonyId": ceremony_id, "publicKey": json.loads(options_to_json(options))})

    def handle_passkey_login_verify(self, body: dict) -> None:
        if not WEBAUTHN_AVAILABLE:
            self.json_response(503, {"error": "Passkey support is not installed", "code": "passkey_unavailable"})
            return
        ceremony_id = str(body.get("ceremonyId", ""))
        credential = body.get("credential")
        challenge = take_passkey_challenge(ceremony_id)
        if (not challenge or challenge.get("kind") != "login" or
                challenge.get("expires_at", 0) <= time.time() or not isinstance(credential, dict)):
            self.json_response(400, {"error": "Passkey request expired; try again", "code": "challenge_expired"})
            return
        credential_id = str(credential.get("id") or credential.get("rawId") or "")
        store = self.passkey_store_for_request()
        stored = store["credentials"].get(credential_id)
        if (not stored or stored.get("profile_id") != challenge["profile_id"] or
                stored.get("mode") != challenge["mode"]):
            self.json_response(401, {"error": "Passkey does not belong to this profile", "code": "verification_failed"})
            return
        try:
            verified = verify_authentication_response(
                credential=credential, expected_challenge=unb64url(challenge["challenge"]),
                expected_rp_id=WEBAUTHN_RP_ID, expected_origin=WEBAUTHN_ORIGIN,
                credential_public_key=unb64url(stored["public_key"]),
                credential_current_sign_count=int(stored.get("sign_count", 0)),
                require_user_verification=True,
            )
        except (InvalidAuthenticationResponse, ValueError, TypeError):
            self.json_response(401, {"error": "Face ID / fingerprint verification failed", "code": "verification_failed"})
            return
        stored = dict(stored)
        stored["sign_count"] = verified.new_sign_count
        stored["backed_up"] = verified.credential_backed_up
        stored["last_used_at"] = int(time.time())
        device_bundle = decode_passkey_device_bundle(self.passkey_device_cookie())
        try:
            with AUTH_LOCK:
                PASSKEYS["credentials"][credential_id] = stored
                persist_passkeys()
        except OSError:
            pass
        device_bundle["credentials"][credential_id] = stored
        self.finish_authentication(
            challenge["profile_id"], challenge["mode"], "passkey",
            extra_cookies=[self.set_passkey_cookie(encode_passkey_device_bundle(device_bundle))],
        )

    def handle_passkey_remove(self, body: dict) -> None:
        del body
        session = self.current_auth_session()
        if not session:
            self.json_response(401, {"error": "Sign in is required", "code": "reauth_required"})
            return
        profile_id, mode = session["profile_id"], session["mode"]
        store = self.passkey_store_for_request()
        removed = [key for key, value in store["credentials"].items()
                   if value.get("profile_id") == profile_id and value.get("mode") == mode]
        device_bundle = decode_passkey_device_bundle(self.passkey_device_cookie())
        try:
            with AUTH_LOCK:
                for key in removed:
                    PASSKEYS["credentials"].pop(key, None)
                    device_bundle["credentials"].pop(key, None)
                persist_passkeys()
        except OSError:
            for key in removed:
                device_bundle["credentials"].pop(key, None)
        self.json_response(200, {"removed": len(removed)}, {
            "Set-Cookie": self.set_passkey_cookie(encode_passkey_device_bundle(device_bundle)),
        })

    def handle_auth_logout(self) -> None:
        token = self.auth_cookie()
        with AUTH_LOCK:
            AUTH_SESSIONS.pop(token, None)
        self.json_response(200, {"loggedOut": True}, {
            "Set-Cookie": self.set_session_cookie("", max_age=0),
        })

    def editable_profile(self, body: dict) -> tuple[dict | None, str]:
        session = self.current_auth_session()
        if not session:
            self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
            return None, ""
        profile_id = str(body.get("profileId") or session["profile_id"]).strip()[:64]
        if profile_id != session["profile_id"] and not session.get("admin"):
            self.json_response(403, {"error": "Admins alone can edit another profile", "code": "admin_required"})
            return None, ""
        user = AUTH_USERS.get(profile_id)
        if not user:
            self.json_response(404, {"error": "Profile not found", "code": "profile_not_found"})
            return None, ""
        return user, profile_id

    def handle_profile_email(self, body: dict) -> None:
        user, profile_id = self.editable_profile(body)
        if not user:
            return
        email = str(body.get("email", "")).strip().lower()[:320]
        phone_raw = body.get("phone", user.get("phone", ""))
        phone = normalize_phone(str(phone_raw if phone_raw is not None else ""))
        if email and not valid_email(email):
            self.json_response(400, {"error": "Enter a valid email address", "code": "invalid_email"})
            return
        if phone and not valid_phone(phone):
            self.json_response(400, {"error": "Enter a valid phone number", "code": "invalid_phone"})
            return
        previous = {"email": user.get("email", ""), "phone": user.get("phone", "")}
        user["email"] = email
        user["phone"] = phone
        try:
            persist_auth_users()
        except RuntimeError:
            user["email"] = previous["email"]
            user["phone"] = previous["phone"]
            self.json_response(507, {"error": "Contact details could not be saved", "code": "storage"})
            return
        self.json_response(200, {
            "saved": True, "profileId": profile_id, "email": email, "phone": phone,
            "contactComplete": bool(email and phone),
            "emailConfigured": email_delivery_status()["configured"],
            "emailProvider": email_delivery_status()["provider"],
        })

    def handle_profile_email_test(self, body: dict) -> None:
        user, profile_id = self.editable_profile(body)
        if not user:
            return
        if not user["email"]:
            self.json_response(400, {"error": "Save an email address first", "code": "email_missing"})
            return
        if not email_delivery_status()["configured"]:
            self.json_response(503, {"error": "Email delivery is not configured", "code": "email_not_configured"})
            return
        rate_key = f"email-test:{profile_id}"
        now = time.time()
        with AUTH_LOCK:
            if now - RESET_REQUESTS.get(rate_key, 0) < 30:
                self.json_response(429, {"error": "Wait before sending another test", "code": "rate_limited"})
                return
            RESET_REQUESTS[rate_key] = now
        try:
            send_test_profile_email(user["email"])
        except EmailDeliveryError as exc:
            self.json_response(502, {"error": str(exc), "code": exc.code})
            return
        except (RuntimeError, OSError, smtplib.SMTPException):
            self.json_response(502, {"error": "The test email could not be delivered", "code": "delivery_failed"})
            return
        self.json_response(200, {"sent": True, "profileId": profile_id})

    def handle_auth_request_reset(self, body: dict) -> None:
        profile_id = str(body.get("profileId", "")).strip()
        email = str(body.get("email", "")).strip().lower()[:320]
        generic = {
            "accepted": True,
            "message": "If the email matches this profile, a reset link will be sent.",
        }
        rate_key = hashlib.sha256(f"{self.client_address[0]}:{email}".encode()).hexdigest()
        now = time.time()
        with AUTH_LOCK:
            if now - RESET_REQUESTS.get(rate_key, 0) < 60:
                self.json_response(200, generic)
                return
            RESET_REQUESTS[rate_key] = now
        user = AUTH_USERS.get(profile_id)
        if not user or not email or not user["email"] or not hmac.compare_digest(email, user["email"]):
            self.json_response(200, generic)
            return
        if not email_delivery_status()["configured"]:
            self.json_response(200, generic)
            return
        raw_token = mint_reset_token(profile_id, user.get("pin_hash", ""))
        public_url = public_base_url(self.headers)
        reset_url = f"{public_url}/?reset={urllib.parse.quote(raw_token)}"
        try:
            send_pin_reset_email(email, reset_url)
        except (EmailDeliveryError, RuntimeError, OSError, smtplib.SMTPException):
            append_security_event("pin_reset_email_failed", profile_id, self.client_ip(), {})
        self.json_response(200, generic)

    def handle_auth_reset(self, body: dict) -> None:
        token = str(body.get("token", ""))
        pin = str(body.get("pin", ""))
        confirm = str(body.get("confirmPin", ""))
        if pin != confirm or not re.fullmatch(r"\d{4,6}", pin):
            self.json_response(400, {"error": "PINs must match and contain 4 to 6 digits", "code": "invalid_pin"})
            return
        parsed = parse_reset_token(token)
        if not parsed:
            self.json_response(400, {"error": "Reset link is invalid or expired", "code": "invalid_token"})
            return
        profile_id, fingerprint = parsed
        user = AUTH_USERS.get(profile_id)
        if not user or pin_fingerprint(user.get("pin_hash", "")) != fingerprint:
            self.json_response(400, {"error": "Reset link is invalid or expired", "code": "invalid_token"})
            return
        old_hash = user["pin_hash"]
        user["pin_hash"] = hash_pin(pin)
        try:
            persist_auth_users()
        except RuntimeError:
            user["pin_hash"] = old_hash
            self.json_response(507, {"error": "The new PIN could not be saved", "code": "storage"})
            return
        with AUTH_LOCK:
            for session_token, session in list(AUTH_SESSIONS.items()):
                if session["profile_id"] == profile_id:
                    AUTH_SESSIONS.pop(session_token, None)
        recipient = (user.get("email") or "").strip()
        if recipient and email_delivery_status()["configured"]:
            profile_name = {
                "e1": "Dora", "e2": "Karin", "e3": "Dimitris", "e4": "Angelos",
                "e5": "Claudio", "e6": "Löhri", "e7": "Amalia", "e8": "Zoi",
                "k1": "Simon", "k2": "Kai", "k3": "Vincent", "k4": "Julian klein",
                "k5": "Julian groß", "k6": "Lea", "k7": "Valeria", "k8": "Jule",
                "k9": "Samantha", "k10": "Lilly", "k11": "Zoitsa", "k12": "Leonie",
            }.get(profile_id, profile_id)
            try:
                send_pin_changed_email(recipient, profile_name)
            except (EmailDeliveryError, RuntimeError, OSError, smtplib.SMTPException):
                append_security_event("pin_changed_email_failed", profile_id, self.client_ip(), {})
        self.json_response(200, {"changed": True}, {
            "Set-Cookie": self.set_session_cookie("", max_age=0),
        })

    def handle_whatsapp_test(self, body: dict) -> None:
        del body
        config = whatsapp_config()
        recipient = re.sub(r"\D", "", config["test_recipient"])
        if not recipient:
            self.json_response(503, {
                "error": "WhatsApp test recipient is not configured",
                "setup": "Set WHATSAPP_TEST_RECIPIENT in .env",
            })
            return
        try:
            response = send_whatsapp_template(
                recipient,
                os.environ.get("WHATSAPP_TEST_TEMPLATE", "hello_world"),
                os.environ.get("WHATSAPP_TEST_LANGUAGE", "en_US"),
            )
            self.json_response(200, {
                "sent": True,
                "messageId": ((response.get("messages") or [{}])[0]).get("id"),
            })
        except RuntimeError as exc:
            self.json_response(503, {"error": str(exc), "code": "configuration"})
        except urllib.error.HTTPError as exc:
            try:
                provider = json.loads(exc.read())
                provider_code = provider.get("error", {}).get("code")
            except (json.JSONDecodeError, AttributeError):
                provider_code = None
            self.json_response(502, {
                "error": "Meta rejected the WhatsApp test message",
                "code": "provider",
                "providerCode": provider_code,
            })
        except (urllib.error.URLError, TimeoutError):
            self.json_response(504, {"error": "WhatsApp request timed out", "code": "timeout"})

    def handle_whatsapp_event(self, body: dict) -> None:
        title = str(body.get("title", "")).strip()[:200]
        event_id = str(body.get("eventId", "")).strip()[:100]
        date = str(body.get("date", "")).strip()[:20]
        from_time = str(body.get("from", "")).strip()[:10]
        to_time = str(body.get("to", "")).strip()[:10]
        location = str(body.get("location", "")).strip()[:200] or "—"
        child_ids = body.get("childIds", [])
        if not title or not event_id or not date or not from_time or not to_time or not isinstance(child_ids, list):
            self.json_response(400, {"error": "Valid event details and childIds are required", "code": "input"})
            return
        mapping = whatsapp_recipients()
        recipients = sorted({number for child_id in child_ids for number in mapping.get(str(child_id), [])})
        if not recipients:
            self.json_response(422, {
                "error": "No approved WhatsApp recipients are configured for these children",
                "code": "recipients",
            })
            return
        config = whatsapp_config()
        sent = 0
        skipped = 0
        failures = 0
        now = time.time()
        for recipient in recipients[:30]:
            dedupe_key = f"{event_id}:{recipient}"
            if now - WHATSAPP_SENT.get(dedupe_key, 0) < WHATSAPP_DEDUPE_WINDOW:
                skipped += 1
                continue
            try:
                send_whatsapp_template(recipient, config["event_template"], config["template_language"], [
                    title, date, f"{from_time}–{to_time}", location,
                ])
                WHATSAPP_SENT[dedupe_key] = now
                sent += 1
            except (RuntimeError, urllib.error.HTTPError, urllib.error.URLError, TimeoutError):
                failures += 1
        status = 200 if sent or skipped else 502
        self.json_response(status, {
            "sent": sent,
            "skippedDuplicates": skipped,
            "failed": failures,
            "recipientCount": len(recipients),
        })

    def handle_event_email(self, body: dict) -> None:
        session = self.current_auth_session()
        if not session:
            self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
            return
        if not email_delivery_status()["configured"]:
            self.json_response(503, {"error": "Email delivery is not configured", "code": "email_not_configured"})
            return
        title = str(body.get("title", "")).strip()[:200]
        event_id = str(body.get("eventId", "")).strip()[:100]
        date = str(body.get("date", "")).strip()[:20]
        from_time = str(body.get("from", "")).strip()[:10]
        to_time = str(body.get("to", "")).strip()[:10]
        location = str(body.get("location", "")).strip()[:200]
        note = str(body.get("note", "")).strip()[:500]
        child_ids = body.get("childIds", [])
        if not title or not event_id or not date or not isinstance(child_ids, list):
            self.json_response(400, {"error": "Valid event details are required", "code": "input"})
            return
        child_names = {
            "k1": "Simon", "k2": "Kai", "k3": "Vincent", "k4": "Julian klein",
            "k5": "Julian groß", "k6": "Lea", "k7": "Valeria", "k8": "Jule",
            "k9": "Samantha", "k10": "Lilly", "k11": "Zoitsa", "k12": "Leonie",
        }
        children = ", ".join(child_names.get(str(cid), str(cid)) for cid in child_ids if cid)
        # Notify every staff profile with a recovery email, plus any child profiles that have one.
        recipients: list[str] = []
        for profile_id, user in AUTH_USERS.items():
            email = (user.get("email") or "").strip()
            if not email:
                continue
            if user.get("mode") == "staff" or str(profile_id) in {str(cid) for cid in child_ids}:
                recipients.append(email)
        recipients = sorted(set(recipients))
        if not recipients:
            self.json_response(422, {"error": "No profile emails are configured", "code": "recipients"})
            return
        sent = 0
        failures = 0
        for recipient in recipients[:40]:
            try:
                send_event_announcement_email(
                    recipient, title, date, from_time, to_time, location, children, note,
                )
                sent += 1
            except (EmailDeliveryError, RuntimeError, OSError, smtplib.SMTPException):
                failures += 1
        status = 200 if sent else 502
        self.json_response(status, {
            "sent": sent,
            "failed": failures,
            "recipientCount": len(recipients),
            "eventId": event_id,
        })

    def handle_shopping(self, body: dict, api_key: str) -> None:
        status, payload = run_shopping(body, api_key)
        self.json_response(status, payload)

    def handle_chat(self, body: dict, api_key: str) -> None:
        session = self.current_auth_session()
        if not session:
            self.json_response(401, {"error": "Authentication required", "code": "auth_required"})
            return
        status, payload = run_chat(body, api_key, session=session)
        self.json_response(status, payload)


if __name__ == "__main__":
    print(f"PAIDIA: http://{HOST}:{PORT} (OCR: {OCR_MODEL}, chat: {CHAT_MODEL})")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
