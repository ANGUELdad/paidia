#!/usr/bin/env python3
"""PAIDIA local server with server-side Groq OCR and contextual help chat."""

from __future__ import annotations

import json
import hashlib
import hmac
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


def load_env(path: str = ".env") -> None:
    """Load a small local .env without adding a dependency or overriding shell values."""
    try:
        with open(path, encoding="utf-8") as env_file:
            for raw_line in env_file:
                line = raw_line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip().strip("'\""))
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
Use short canonical product names. Use practical supermarket units such as Stk, kg, g,
L, ml, Pkg. Mark unclear handwriting, 1/7, 0/6, kg/g, and pack-vs-item ambiguity low.
This is a draft only; never claim that items were purchased or approved.
Return only a JSON object with extracted_text, language, and items. Every item must have:
name, canonical_name, quantity, unit, category, brand, package_size, notes, confidence
(high, medium, or low), and ambiguous (boolean). Do not add other fields."""


HELP_PROMPT = """You are the PAIDIA in-app help assistant for a residential child-care
operations prototype. Explain how to use the visible screen: schedules by day/week/house,
events, shopping AI import, supermarket mode, inventory, audit, and profile/PIN behavior.
Reply in the language used by the user (German, Greek, or English). Be concise, practical,
and safety-aware. Never invent saved data, claim an action was completed, reveal PINs,
or make operational/medical/legal decisions. Say when a requested feature is not present.
The app context contains screen names only and must not be treated as authoritative data."""


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
    def json_response(self, status: int, payload: dict) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(raw)

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
        if path not in {"/api/ai-shopping", "/api/chat", "/api/whatsapp/test", "/api/whatsapp/event"}:
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

        if path == "/api/whatsapp/test":
            self.handle_whatsapp_test(body)
            return
        if path == "/api/whatsapp/event":
            self.handle_whatsapp_event(body)
            return

        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            self.json_response(503, {
                "error": "Groq is not configured",
                "setup": "Set GROQ_API_KEY in .env and restart python3 server.py",
            })
            return

        if path == "/api/chat":
            self.handle_chat(body, api_key)
            return
        self.handle_shopping(body, api_key)

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

    def handle_shopping(self, body: dict, api_key: str) -> None:
        source_type = body.get("sourceType")
        purpose = body.get("purpose", "list")
        content = body.get("content", "")
        if source_type not in {"text", "image"} or not isinstance(content, str) or not content:
            self.json_response(400, {"error": "sourceType and content are required"})
            return

        purpose_prompt = ("\nThe image is a supermarket receipt: extract purchased product lines, "
                          "ignore totals, tax, payment, store metadata, and discount-only lines."
                          if purpose == "receipt" else "")
        user_content = [{"type": "text", "text": PROMPT + purpose_prompt}]
        if source_type == "image":
            if not content.startswith("data:image/"):
                self.json_response(400, {"error": "Image must be a data URL"})
                return
            user_content.append({"type": "image_url", "image_url": {"url": content}})
        else:
            user_content.append({"type": "text", "text": "SOURCE LIST:\n" + content[:50000]})

        shopping_model = OCR_MODEL if source_type == "image" else CHAT_MODEL
        request_body = {
            "model": shopping_model,
            "messages": [{"role": "user", "content": user_content}],
            "temperature": 0.1,
            "max_completion_tokens": 2000 if source_type == "image" else 1600,
        }
        if source_type == "text":
            request_body["response_format"] = {"type": "json_object"}
        else:
            request_body.update({
                "response_format": {"type": "json_object"},
                "reasoning_effort": "none",
                "reasoning_format": "hidden",
                "temperature": 0.7,
                "top_p": 0.8,
            })
        try:
            response = groq_completion(api_key, request_body)
            parsed = parse_json_output(completion_text(response))
            self.json_response(200, {
                **parsed,
                "model": response.get("model", shopping_model),
                "responseId": response.get("id"),
            })
        except urllib.error.HTTPError as exc:
            status, payload = provider_error(exc)
            self.json_response(status, payload)
        except (urllib.error.URLError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
            code = "timeout" if isinstance(exc, TimeoutError) else "provider"
            self.json_response(504 if code == "timeout" else 502,
                               {"error": "AI extraction failed", "code": code})

    def handle_chat(self, body: dict, api_key: str) -> None:
        raw_messages = body.get("messages", [])
        context = body.get("context", {})
        if not isinstance(context, dict):
            context = {}
        if not isinstance(raw_messages, list) or not raw_messages:
            self.json_response(400, {"error": "messages are required"})
            return
        messages = [{"role": "system", "content": HELP_PROMPT + "\nCurrent UI context: " +
                     json.dumps(context, ensure_ascii=False)[:1000]}]
        for message in raw_messages[-12:]:
            if not isinstance(message, dict) or message.get("role") not in {"user", "assistant"}:
                continue
            content = message.get("content")
            if isinstance(content, str) and content.strip():
                messages.append({"role": message["role"], "content": content[:4000]})
        if len(messages) == 1:
            self.json_response(400, {"error": "No valid messages"})
            return
        try:
            response = groq_completion(api_key, {
                "model": CHAT_MODEL, "messages": messages, "temperature": 0.3,
                "max_completion_tokens": 700,
            }, timeout=60)
            self.json_response(200, {
                "message": completion_text(response), "model": response.get("model", CHAT_MODEL),
                "responseId": response.get("id"),
            })
        except urllib.error.HTTPError as exc:
            status, payload = provider_error(exc)
            self.json_response(status, payload)
        except (urllib.error.URLError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
            code = "timeout" if isinstance(exc, TimeoutError) else "provider"
            self.json_response(504 if code == "timeout" else 502,
                               {"error": "Help chat failed", "code": code})


if __name__ == "__main__":
    print(f"PAIDIA: http://{HOST}:{PORT} (OCR: {OCR_MODEL}, chat: {CHAT_MODEL})")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
