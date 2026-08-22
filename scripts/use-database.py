#!/usr/bin/env python3
"""Point PAIDIA at a Postgres database and prove it works, in one command.

    .venv/bin/python scripts/use-database.py "postgresql://…-pooler…/neondb?sslmode=require"

Validates the URL, connects, creates the schema, optionally seeds it from this
machine's local store, and prints exactly what to paste into Vercel. Works with
any Postgres that offers a pooled connection string — Neon and Supabase are both
recognised explicitly by db.postgres_pooler_error.

Nothing is written to .env; the URL is only used for this check.
"""
from __future__ import annotations

import json
import os
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    url = sys.argv[1].strip().strip('"').strip("'")
    seed = "--seed" in sys.argv[2:]

    os.environ["DATABASE_URL"] = url
    os.environ.setdefault("PAIDIA_SESSION_SECRET", "check-only")

    import importlib
    import db as paidia_db
    importlib.reload(paidia_db)

    from urllib.parse import urlparse
    host = urlparse(url).hostname or "?"
    print(f"  host      {host}")

    problem = paidia_db.postgres_pooler_error(url)
    if problem:
        print(f"  REJECTED  {problem}")
        print("\n  Use the POOLED connection string (its host contains '-pooler').")
        return 1
    print("  pooled    yes")

    try:
        paidia_db.init_schema()
    except Exception as exc:                       # noqa: BLE001
        msg = str(exc).strip().splitlines()[0] if str(exc).strip() else type(exc).__name__
        print(f"  CONNECT   failed — {msg[:160]}")
        if "data transfer quota" in msg or "quota" in msg.lower():
            print("\n  That project is out of allowance. Create a new free project and")
            print("  pass its pooled URL here instead.")
        return 1
    print("  schema    ok")

    health = paidia_db.health()
    print(f"  health    backend={health.get('backend')} ok={health.get('ok')}")

    if seed:
        local = ROOT / ".paidia-ops.json"
        if local.exists():
            blob = json.loads(local.read_text(encoding="utf-8"))
            paidia_db.set_json(paidia_db.KEY_OPS, blob)
            back = paidia_db.get_json(paidia_db.KEY_OPS) or {}
            print(f"  seeded    revision={back.get('revision')} from {local.name}")
        else:
            print("  seeded    skipped (no local .paidia-ops.json)")

    print("\n  WORKS. Paste this into Vercel -> Settings -> Environment Variables:")
    print("    DATABASE_URL = <the pooled URL you just passed>")
    print("  then Redeploy, and check:")
    print("    curl -s https://armonia-thassos.vercel.app/api/auth/health")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
