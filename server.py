#!/usr/bin/env python3
"""PAIDIA local server with server-side Groq OCR and contextual help chat."""

from __future__ import annotations

import json
import os
import re
import time
import urllib.error
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

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/api/health":
            self.json_response(200, {
                "ok": True,
                "aiConfigured": bool(os.environ.get("GROQ_API_KEY")),
                "ocrModel": OCR_MODEL,
                "chatModel": CHAT_MODEL,
            })
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        if self.path not in {"/api/ai-shopping", "/api/chat"}:
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

        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            self.json_response(503, {
                "error": "Groq is not configured",
                "setup": "Set GROQ_API_KEY in .env and restart python3 server.py",
            })
            return

        if self.path == "/api/chat":
            self.handle_chat(body, api_key)
            return
        self.handle_shopping(body, api_key)

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
