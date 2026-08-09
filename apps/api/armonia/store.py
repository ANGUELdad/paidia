"""In-memory + file-backed store for Phase 0/1. Swap to Prisma/Postgres client later."""

from __future__ import annotations

import json
import threading
import time
from copy import deepcopy
from pathlib import Path
from typing import Any

from argon2 import PasswordHasher

_LOCK = threading.RLock()
_DATA_PATH = Path(__file__).resolve().parent.parent / ".armonia-store.json"
_PIN_HASHER = PasswordHasher()

# Dev seed PINs — hashed at seed time; plaintext is not persisted in the store.
SEED_PROFILES = [
    {"id": "e1", "name": "Dora", "mode": "staff", "role": "Betreuerin", "admin": False, "color": "#9bc4b0", "pin": "111111"},
    {"id": "e2", "name": "Karin", "mode": "staff", "role": "Betreuerin", "admin": False, "color": "#7a9eaa", "pin": "222222"},
    {"id": "e3", "name": "Dimitris", "mode": "staff", "role": "Betreuer", "admin": True, "color": "#c5ddd0", "pin": "333333"},
    {"id": "e4", "name": "Angelos", "mode": "staff", "role": "Betreuer", "admin": True, "color": "#a8c5b8", "pin": "444444"},
    {"id": "e8", "name": "Zoi", "mode": "staff", "role": "Leitung", "admin": True, "color": "#2f5a63", "pin": "888888"},
    {"id": "k1", "name": "Simon", "mode": "child", "role": "Kind", "admin": False, "color": "#9bc4b0", "pin": "121212"},
    {"id": "k2", "name": "Kai", "mode": "child", "role": "Kind", "admin": False, "color": "#7a9eaa", "pin": "131313"},
]

PLATFORM_LIST_CAPS = {
    "listEntries": 4000,
    "stockLedger": 5000,
    "auditLog": 2500,
    "learningSignals": 1000,
    "events": 800,
    "overrides": 4000,
    "template": 2000,
    "shiftCheckins": 2000,
    "talkMessages": 1000,
    "talkTopics": 200,
    "reminders": 500,
    "pushSubscriptions": 200,
    "zoaiRecent": 100,
}

HOUSES = [
    {"id": "h1", "name": "Kalyvia", "short": "Kal"},
    {"id": "h2", "name": "Thalassa", "short": "Tha"},
]


def _seed_profile_row(p: dict[str, Any]) -> dict[str, Any]:
    row = {k: v for k, v in p.items() if k != "pin"}
    pin = p.get("pin")
    row["email"] = ""
    row["phone"] = ""
    row["pinHash"] = _PIN_HASHER.hash(str(pin)) if pin else None
    return row


def _trim_lists(state: dict[str, Any]) -> None:
    for key, cap in PLATFORM_LIST_CAPS.items():
        rows = state.get(key)
        if isinstance(rows, list) and len(rows) > cap:
            state[key] = rows[-cap:]
    checks = state.get("stockChecks")
    if isinstance(checks, dict) and len(checks) > 800:
        # Keep newest by `at` when present.
        items = sorted(checks.items(), key=lambda kv: int((kv[1] or {}).get("at") or 0))
        state["stockChecks"] = dict(items[-800:])
    notes = state.get("shiftNotes")
    if isinstance(notes, dict) and len(notes) > 1000:
        items = sorted(notes.items(), key=lambda kv: str(kv[0]))
        state["shiftNotes"] = dict(items[-1000:])


def _empty_state() -> dict[str, Any]:
    return {
        "revision": 0,
        "updatedAt": int(time.time() * 1000),
        "profiles": {p["id"]: _seed_profile_row(p) for p in SEED_PROFILES},
        "passkeys": {},
        "sessions": {},
        "houses": HOUSES,
        "products": [
            {"id": "p_milk", "name": {"de": "Milch", "el": "Γάλα"}, "unit": "L", "category": "fridge"},
            {"id": "p_eggs", "name": {"de": "Eier", "el": "Αυγά"}, "unit": "Stk", "category": "fridge"},
            {"id": "p_rice", "name": {"de": "Reis", "el": "Ρύζι"}, "unit": "kg", "category": "pantry"},
            {"id": "p_pasta", "name": {"de": "Nudeln", "el": "Ζυμαρικά"}, "unit": "kg", "category": "pantry"},
        ],
        "stock": {},  # key houseId:productId -> qty
        "listEntries": [],
        "template": [],
        "overrides": [],
        "events": [
            {
                "id": "ev_welcome",
                "title": "Willkommen am Strand",
                "date": time.strftime("%Y-%m-%d"),
                "startTime": "10:00",
                "endTime": "12:00",
                "status": "published",
                "audience": "children",
                "location": "Strand",
                "remindMinutes": [60, 15],
            },
            {
                "id": "ev_draft",
                "title": "Wochenausflug (Entwurf)",
                "date": time.strftime("%Y-%m-%d"),
                "startTime": "15:00",
                "endTime": "18:00",
                "status": "draft",
                "audience": "staff",
                "remindMinutes": [120],
            },
        ],
        "shiftNotes": {},
        "shiftCheckins": [],
        "stockChecks": {},
        "stockLedger": [],
        "talkMessages": [],
        "talkTopics": [],
        "meetingNotes": {},
        "notificationRules": _default_rules(),
        "pushSubscriptions": [],
        "prefs": {},
        "widgetLayouts": {},
        "learningSignals": [],
        "auditLog": [],
        "zoaiRecent": [],
        "xp": {},
        "reminders": [],
    }


def _default_rules() -> list[dict[str, Any]]:
    kinds = [
        "shift_start",
        "presence_late",
        "low_stock",
        "friday_list",
        "journal_due",
        "event_publish",
        "meeting_notes_due",
        "broadcast",
        "child_event",
    ]
    return [{"id": k, "kind": k, "enabled": True, "channels": ["local", "push"]} for k in kinds]


def _upgrade_profile_pins(state: dict[str, Any]) -> bool:
    """Hash leftover plaintext seed PINs and strip them from persisted state."""
    changed = False
    for profile in (state.get("profiles") or {}).values():
        pin = profile.pop("pin", None)
        if pin:
            changed = True
            if not profile.get("pinHash"):
                profile["pinHash"] = _PIN_HASHER.hash(str(pin))
    return changed


def load_state() -> dict[str, Any]:
    with _LOCK:
        if _DATA_PATH.exists():
            try:
                state = json.loads(_DATA_PATH.read_text(encoding="utf-8"))
                if _upgrade_profile_pins(state):
                    _persist(state)
                return state
            except (OSError, json.JSONDecodeError):
                pass
        state = _empty_state()
        # seed stock
        for h in HOUSES:
            for p in state["products"]:
                state["stock"][f"{h['id']}:{p['id']}"] = 4
        _persist(state)
        return state


def _persist(state: dict[str, Any]) -> None:
    _trim_lists(state)
    state["updatedAt"] = int(time.time() * 1000)
    raw = json.dumps(state, ensure_ascii=False, indent=2, allow_nan=False)
    tmp = _DATA_PATH.with_suffix(".tmp")
    tmp.write_text(raw, encoding="utf-8")
    tmp.replace(_DATA_PATH)


STATE = load_state()


def get_state() -> dict[str, Any]:
    with _LOCK:
        return STATE


def mutate(fn) -> dict[str, Any]:
    with _LOCK:
        fn(STATE)
        STATE["revision"] = int(STATE.get("revision") or 0) + 1
        _persist(STATE)
        return deepcopy(STATE)


def snapshot() -> dict[str, Any]:
    with _LOCK:
        return deepcopy(STATE)
