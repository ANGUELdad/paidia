#!/usr/bin/env python3
"""Seed the durable DB from current env JSON / local state files.

Run once after creating Postgres (or to hydrate local SQLite):

  python scripts/migrate_to_db.py
  DATABASE_URL=postgresql://... python scripts/migrate_to_db.py --force

Does not overwrite existing DB keys unless --force is passed.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

# Load .env the same way the server does
os.chdir(ROOT)
import server as paidia  # noqa: E402
import db  # noqa: E402


def _maybe_load(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def main() -> int:
    parser = argparse.ArgumentParser(description="Migrate PAIDIA env/files into durable DB")
    parser.add_argument("--force", action="store_true", help="Overwrite keys that already exist")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be written")
    args = parser.parse_args()

    health = db.health()
    print(f"database: {health}")
    if not health.get("ok"):
        print("DB not reachable — aborting", file=sys.stderr)
        return 1

    candidates = {
        db.KEY_AUTH_USERS: paidia.AUTH_USERS or None,
        db.KEY_AUTH_OVERRIDES: {"profiles": paidia.AUTH_OVERRIDES} if paidia.AUTH_OVERRIDES else None,
        db.KEY_PASSKEYS: paidia.PASSKEYS if paidia.PASSKEYS.get("credentials") else None,
        db.KEY_OPS: paidia.OPS_STATE if int(paidia.OPS_STATE.get("revision") or 0) or any(
            paidia.OPS_STATE.get(k) for k in paidia.OPS_KEYS
        ) else None,
        db.KEY_TALK: paidia.TALK_STATE if (
            paidia.TALK_STATE.get("messages") or paidia.TALK_STATE.get("topics")
        ) else None,
        db.KEY_ONBOARDING: paidia.ONBOARDING_STATE if paidia.ONBOARDING_STATE.get("profiles") else None,
        db.KEY_SECURITY: paidia.SECURITY_STATE if paidia.SECURITY_STATE.get("pepper") else None,
    }

    # Extra file fallbacks if in-memory was empty
    if not candidates[db.KEY_PASSKEYS]:
        candidates[db.KEY_PASSKEYS] = _normalize_passkeys(_maybe_load(Path(".paidia-passkeys.json")))
    if not candidates[db.KEY_OPS]:
        candidates[db.KEY_OPS] = _maybe_load(Path(".paidia-ops.json"))
    if not candidates[db.KEY_TALK]:
        candidates[db.KEY_TALK] = _maybe_load(Path(".paidia-talk.json"))
    if not candidates[db.KEY_ONBOARDING]:
        candidates[db.KEY_ONBOARDING] = _maybe_load(Path(".paidia-onboarding.json"))

    written = 0
    skipped = 0
    for key, value in candidates.items():
        if value is None:
            print(f"  skip {key}: nothing to migrate")
            skipped += 1
            continue
        exists = db.has_key(key)
        if exists and not args.force:
            print(f"  keep {key}: already in DB (use --force to overwrite)")
            skipped += 1
            continue
        if args.dry_run:
            print(f"  would write {key}")
            written += 1
            continue
        db.set_json(key, value)
        print(f"  wrote {key}")
        written += 1

    print(f"done — wrote={written} skipped={skipped}")
    return 0


def _normalize_passkeys(value):
    if isinstance(value, dict) and isinstance(value.get("credentials"), dict):
        value.setdefault("user_handles", {})
        return value
    return None


if __name__ == "__main__":
    raise SystemExit(main())
