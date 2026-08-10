"""Vercel Python entry — export FastAPI `app` for native ASGI."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from armonia.main import app  # noqa: E402

# Vercel Python looks for a module-level ASGI `app`.
__all__ = ["app"]
