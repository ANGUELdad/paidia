"""Map legacy PAIDIA_* / Neon env names onto the v2 Settings keys.

The production secrets already live on the legacy Vercel project and in
root `.env` / `.env.local`. Call `apply_env_aliases()` before Settings / store load.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

# Always prefer these legacy names when set (shared secrets / passwords).
_FORCE_ALIASES: tuple[tuple[str, str], ...] = (
    ("PAIDIA_SESSION_SECRET", "SESSION_SECRET"),
    ("PAIDIA_COOKIE_SECURE", "COOKIE_SECURE"),
    ("PAIDIA_LLM_PROVIDER", "LLM_PROVIDER"),
    ("GROQ_CHAT_MODEL", "CHAT_MODEL"),
    ("GROQ_CHAT_MODEL", "GROQ_MODEL"),
    ("SMTP_USER", "SMTP_USERNAME"),
    ("SMTP_STARTTLS", "SMTP_USE_TLS"),
    ("POSTGRES_URL", "DATABASE_URL"),
    ("POSTGRES_PRISMA_URL", "DATABASE_URL"),
)

# Origin/RP must stay project-specific (platform vs legacy site) — fill only if empty.
_FILL_ALIASES: tuple[tuple[str, str], ...] = (
    ("PAIDIA_WEBAUTHN_ORIGIN", "WEBAUTHN_ORIGIN"),
    ("PAIDIA_WEBAUTHN_RP_ID", "WEBAUTHN_RP_ID"),
    ("PAIDIA_WEBAUTHN_RP_NAME", "WEBAUTHN_RP_NAME"),
    ("PAIDIA_PUBLIC_URL", "PAIDIA_PUBLIC_URL"),
)

_ENV_FILES = (
    Path(__file__).resolve().parents[3] / ".env",
    Path(__file__).resolve().parents[3] / ".env.local",
    Path(__file__).resolve().parents[2] / ".env",
    Path(__file__).resolve().parents[2] / ".env.local",
)


def _load_dotenv_files() -> None:
    """Minimal dotenv: file values fill missing os.environ keys (not override)."""
    # Keep pytest on seed PINs — root .env carries live PAIDIA_AUTH_USERS_JSON.
    if "pytest" in sys.modules or os.environ.get("ARMONIA_DISABLE_DOTENV") == "1":
        return
    for path in _ENV_FILES:
        if not path.is_file():
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        for line in text.splitlines():
            raw = line.strip()
            if not raw or raw.startswith("#") or "=" not in raw:
                continue
            key, _, value = raw.partition("=")
            key = key.strip()
            if not key or key in os.environ and (os.environ.get(key) or "").strip():
                continue
            value = value.strip()
            if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                value = value[1:-1]
            os.environ[key] = value


def apply_env_aliases() -> None:
    _load_dotenv_files()
    for src, dst in _FORCE_ALIASES:
        val = (os.environ.get(src) or "").strip()
        if val:
            os.environ[dst] = val
    for src, dst in _FILL_ALIASES:
        val = (os.environ.get(src) or "").strip()
        if val and not (os.environ.get(dst) or "").strip():
            os.environ[dst] = val
