#!/usr/bin/env python3
"""Migrate legacy v69 ops JSON (or platform .armonia-store.json) toward Prisma-shaped rows.

Usage:
  python scripts/migrate_ops_to_prisma.py --source path/to/ops.json --out /tmp/prisma-seed.json
  python scripts/migrate_ops_to_prisma.py --from-store apps/api/.armonia-store.json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def from_platform_store(state: dict[str, Any]) -> dict[str, Any]:
    profiles = []
    for p in (state.get("profiles") or {}).values():
        profiles.append(
            {
                "id": p["id"],
                "name": p["name"],
                "mode": p.get("mode"),
                "role": p.get("role"),
                "admin": bool(p.get("admin")),
                "color": p.get("color"),
                "pinHash": p.get("pinHash"),
            }
        )
    products = []
    for p in state.get("products") or []:
        name = p.get("name") or {}
        products.append(
            {
                "id": p["id"],
                "nameDe": name.get("de") or p.get("nameDe") or p["id"],
                "nameEl": name.get("el") or p.get("nameEl") or "",
                "unit": p.get("unit") or "Stk",
                "category": p.get("category") or "other",
            }
        )
    list_items = state.get("listEntries") or []
    schedule = []
    for e in state.get("overrides") or []:
        schedule.append(
            {
                "id": e.get("id"),
                "date": e.get("date"),
                "block": e.get("block"),
                "activity": e.get("activity"),
                "houseIds": json.dumps(e.get("houseIds") or []),
                "employeeIds": json.dumps(e.get("employeeIds") or []),
                "childIds": json.dumps(e.get("childIds") or []),
                "fromTime": e.get("from"),
                "toTime": e.get("to"),
                "note": e.get("note"),
                "cancelled": bool(e.get("cancelled")),
            }
        )
    rules = state.get("notificationRules") or []
    return {
        "profiles": profiles,
        "houses": state.get("houses") or [],
        "products": products,
        "stock": state.get("stock") or {},
        "stockLedger": state.get("stockLedger") or [],
        "listItems": list_items,
        "scheduleEntries": schedule,
        "shiftNotes": state.get("shiftNotes") or {},
        "shiftCheckins": state.get("shiftCheckins") or [],
        "talkMessages": state.get("talkMessages") or [],
        "meetingNotes": state.get("meetingNotes") or {},
        "notificationRules": rules,
        "learningSignals": state.get("learningSignals") or [],
        "auditLog": state.get("auditLog") or [],
        "xp": state.get("xp") or {},
        "revision": state.get("revision") or 0,
    }


def from_legacy_ops(ops: dict[str, Any]) -> dict[str, Any]:
    """Best-effort map from legacy monolithic ops blob."""
    fake = {
        "profiles": ops.get("profiles") or ops.get("employees") or {},
        "houses": ops.get("houses") or [],
        "products": ops.get("products") or [],
        "stock": ops.get("stock") or {},
        "listEntries": ops.get("list") or ops.get("listEntries") or [],
        "overrides": ops.get("overrides") or ops.get("schedule") or [],
        "shiftNotes": ops.get("shiftNotes") or {},
        "shiftCheckins": ops.get("shiftCheckins") or [],
        "talkMessages": ops.get("talk") or ops.get("talkMessages") or [],
        "meetingNotes": ops.get("meetingNotes") or {},
        "notificationRules": ops.get("notificationRules") or [],
        "learningSignals": [],
        "auditLog": ops.get("auditLog") or [],
        "xp": ops.get("xp") or {},
        "stockLedger": [],
        "revision": ops.get("revision") or 0,
    }
    if isinstance(fake["profiles"], list):
        fake["profiles"] = {p["id"]: p for p in fake["profiles"] if p.get("id")}
    return from_platform_store(fake)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", type=Path, help="Legacy ops JSON")
    ap.add_argument("--from-store", type=Path, help="Platform .armonia-store.json")
    ap.add_argument("--out", type=Path, required=True)
    args = ap.parse_args()
    if args.from_store:
        state = json.loads(args.from_store.read_text(encoding="utf-8"))
        payload = from_platform_store(state)
    elif args.source:
        ops = json.loads(args.source.read_text(encoding="utf-8"))
        payload = from_legacy_ops(ops)
    else:
        raise SystemExit("Provide --source or --from-store")
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {args.out} ({len(payload.get('profiles') or [])} profiles)")


if __name__ == "__main__":
    main()
