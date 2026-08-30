"""xAI Grok OCR helpers for PAIDIA shopping / stock image extraction.

Imported by server.py and api/index.py. Keep this file focused so parallel
edits to server.py kid-ops / push do not wipe OCR wiring.
"""
from __future__ import annotations

import json
import os
import re
import threading
import time
import urllib.error
import urllib.request
from typing import Any


def env_int(name: str, default: int, minimum: int = 1) -> int:
    try:
        return max(minimum, int(os.environ.get(name, str(default))))
    except ValueError:
        return default


XAI_BASE_URL = os.environ.get("XAI_BASE_URL", os.environ.get("GROK_BASE_URL", "https://api.x.ai/v1")).rstrip("/")
XAI_URL = f"{XAI_BASE_URL}/chat/completions"
XAI_OCR_MODEL = (
    os.environ.get("XAI_OCR_MODEL")
    or os.environ.get("GROK_OCR_MODEL")
    or "grok-2-vision-1212"
).strip()
PAIDIA_OCR_PROVIDER = os.environ.get("PAIDIA_OCR_PROVIDER", "auto").strip().lower()
OCR_MAX_IMAGE_CHARS = env_int("PAIDIA_OCR_MAX_IMAGE_CHARS", 2_800_000, minimum=100_000)
OCR_RATE_WINDOW = env_int("PAIDIA_OCR_WINDOW_SECONDS", 600)
OCR_RATE_MAX = env_int("PAIDIA_OCR_MAX_REQUESTS", 12)
OCR_RATE_HITS: dict[str, list[float]] = {}
OCR_RATE_LOCK = threading.Lock()

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def xai_api_key() -> str:
    return (os.environ.get("XAI_API_KEY") or os.environ.get("GROK_API_KEY") or "").strip()


def ocr_rate_allow(key: str) -> bool:
    now = time.time()
    with OCR_RATE_LOCK:
        hits = [ts for ts in OCR_RATE_HITS.get(key, []) if now - ts < OCR_RATE_WINDOW]
        if len(hits) >= OCR_RATE_MAX:
            OCR_RATE_HITS[key] = hits
            return False
        hits.append(now)
        OCR_RATE_HITS[key] = hits
        return True


def resolve_ocr_endpoint(
    source_type: str,
    *,
    groq_ocr_model: str,
    groq_chat_model: str,
) -> tuple[str, str, str, str] | None:
    """Return (provider, url, api_key, model) or None."""
    xai_key = xai_api_key()
    groq_key = os.environ.get("GROQ_API_KEY", "").strip()
    pref = PAIDIA_OCR_PROVIDER if PAIDIA_OCR_PROVIDER in {"auto", "xai", "groq"} else "auto"
    if source_type == "image":
        if pref == "xai":
            return ("xai", XAI_URL, xai_key, XAI_OCR_MODEL) if xai_key else None
        if pref == "groq":
            return ("groq", GROQ_URL, groq_key, groq_ocr_model) if groq_key else None
        if xai_key:
            return ("xai", XAI_URL, xai_key, XAI_OCR_MODEL)
        if groq_key:
            return ("groq", GROQ_URL, groq_key, groq_ocr_model)
        return None
    if groq_key:
        return ("groq", GROQ_URL, groq_key, groq_chat_model)
    return None


def ocr_image_configured(*, groq_ocr_model: str, groq_chat_model: str) -> bool:
    return resolve_ocr_endpoint(
        "image", groq_ocr_model=groq_ocr_model, groq_chat_model=groq_chat_model
    ) is not None


def openai_compatible_completion(
    url: str, api_key: str, request_body: dict, timeout: int = 90
) -> dict:
    for attempt in range(2):
        request = urllib.request.Request(
            url,
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


def purpose_prompt(purpose: str) -> str:
    if purpose == "receipt":
        return (
            "\nThe image is a supermarket receipt: extract purchased product lines, "
            "ignore totals, tax, payment, store metadata, and discount-only lines."
        )
    if purpose == "stock":
        return (
            "\nThe image is a pantry / fridge / shelf label or handwritten stock note. "
            "Extract product lines for inventory intake (name, quantity, unit)."
        )
    if purpose == "request":
        return (
            "\nThe image is a single product request (photo of a package or short note). "
            "Return at most 3 candidate items; prefer the clearest product name."
        )
    return ""
