#!/usr/bin/env python3
"""PAIDIA local server with a server-side OpenAI shopping-list extractor."""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


HOST = os.environ.get("PAIDIA_HOST", "127.0.0.1")
PORT = int(os.environ.get("PAIDIA_PORT", "5173"))
MODEL = os.environ.get("OPENAI_OCR_MODEL", "gpt-5.6-sol")
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
This is a draft only; never claim that items were purchased or approved."""


def output_text(response: dict) -> str:
    for item in response.get("output", []):
        if item.get("type") != "message":
            continue
        for content in item.get("content", []):
            if content.get("type") == "output_text":
                return content.get("text", "")
    raise ValueError("The model returned no structured output")


class Handler(SimpleHTTPRequestHandler):
    def json_response(self, status: int, payload: dict) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(raw)

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/api/ai-shopping":
            self.json_response(404, {"error": "Not found"})
            return
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0 or length > MAX_BODY:
            self.json_response(413, {"error": "Input is empty or too large"})
            return
        try:
            body = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.json_response(400, {"error": "Invalid JSON"})
            return

        source_type = body.get("sourceType")
        purpose = body.get("purpose", "list")
        content = body.get("content", "")
        if source_type not in {"text", "image"} or not isinstance(content, str) or not content:
            self.json_response(400, {"error": "sourceType and content are required"})
            return

        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            self.json_response(503, {
                "error": "AI extraction is not configured",
                "setup": "Set OPENAI_API_KEY and start with: python3 server.py",
            })
            return

        purpose_prompt = ("\nThe image is a supermarket receipt: extract purchased product lines, "
                          "ignore totals, tax, payment, store metadata, and discount-only lines."
                          if purpose == "receipt" else "")
        user_content = [{"type": "input_text", "text": PROMPT + purpose_prompt}]
        if source_type == "image":
            if not content.startswith("data:image/"):
                self.json_response(400, {"error": "Image must be a data URL"})
                return
            user_content.append({"type": "input_image", "image_url": content, "detail": "original"})
        else:
            user_content.append({"type": "input_text", "text": "SOURCE LIST:\n" + content[:50000]})

        request_body = {
            "model": MODEL,
            "store": False,
            "reasoning": {"effort": "low"},
            "input": [{"role": "user", "content": user_content}],
            "text": {
                "verbosity": "low",
                "format": {
                    "type": "json_schema",
                    "name": "shopping_list_extraction",
                    "strict": True,
                    "schema": ITEM_SCHEMA,
                },
            },
        }
        api_request = urllib.request.Request(
            "https://api.openai.com/v1/responses",
            data=json.dumps(request_body).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "Idempotency-Key": self.headers.get("Idempotency-Key", "paidia-ai-import"),
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(api_request, timeout=90) as result:
                response = json.loads(result.read())
            parsed = json.loads(output_text(response))
            self.json_response(200, {
                **parsed,
                "model": response.get("model", MODEL),
                "responseId": response.get("id"),
            })
        except urllib.error.HTTPError as exc:
            try:
                detail = json.loads(exc.read()).get("error", {}).get("message", str(exc))
            except Exception:
                detail = str(exc)
            self.json_response(502, {"error": "AI extraction failed", "detail": detail})
        except (urllib.error.URLError, TimeoutError, ValueError, json.JSONDecodeError) as exc:
            self.json_response(502, {"error": "AI extraction failed", "detail": str(exc)})


if __name__ == "__main__":
    print(f"PAIDIA: http://{HOST}:{PORT} (model: {MODEL})")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
