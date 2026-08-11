"""In-memory + file-backed store for Phase 0/1. Swap to Prisma/Postgres client later."""

from __future__ import annotations

import json
import os
import threading
import time
from copy import deepcopy
from pathlib import Path
from typing import Any

from argon2 import PasswordHasher

from armonia.env_aliases import apply_env_aliases

apply_env_aliases()

_LOCK = threading.RLock()
_DEFAULT_STORE = Path(__file__).resolve().parent.parent / ".armonia-store.json"
# Vercel serverless FS is read-only except /tmp — keep warm-instance continuity there.
_DATA_PATH = Path(os.environ.get("ARMONIA_STORE_PATH") or ("/tmp/.armonia-store.json" if os.environ.get("VERCEL") else _DEFAULT_STORE))
_PIN_HASHER = PasswordHasher()

# Display meta + optional local-dev seed PINs (used only when PAIDIA_AUTH_USERS_JSON is absent).
SEED_PROFILES = [
    {"id": "e1", "name": "Dora", "mode": "staff", "role": "Betreuerin", "admin": False, "color": "#9bc4b0", "pin": "111111"},
    {"id": "e2", "name": "Karin", "mode": "staff", "role": "Betreuerin", "admin": False, "color": "#7a9eaa", "pin": "222222"},
    {"id": "e3", "name": "Dimitris", "mode": "staff", "role": "Betreuer", "admin": True, "color": "#c5ddd0", "pin": "333333"},
    {"id": "e4", "name": "Angelos", "mode": "staff", "role": "Betreuer", "admin": True, "color": "#a8c5b8", "pin": "444444"},
    {"id": "e5", "name": "Claudio", "mode": "staff", "role": "Betreuer", "admin": False, "color": "#8fb0a0", "pin": "555555"},
    {"id": "e6", "name": "Löhri", "mode": "staff", "role": "Betreuer", "admin": False, "color": "#d4c4a0", "pin": "666666"},
    {"id": "e7", "name": "Amalia", "mode": "staff", "role": "Betreuerin", "admin": False, "color": "#b8c9a8", "pin": "777777"},
    {"id": "e8", "name": "Zoi", "mode": "staff", "role": "Leitung", "admin": True, "color": "#2f5a63", "pin": "888888"},
    {"id": "k1", "name": "Simon", "mode": "child", "role": "Kind", "admin": False, "color": "#9bc4b0", "pin": "121212"},
    {"id": "k2", "name": "Kai", "mode": "child", "role": "Kind", "admin": False, "color": "#7a9eaa", "pin": "131313"},
    {"id": "k3", "name": "Vincent", "mode": "child", "role": "Kind", "admin": False, "color": "#c5ddd0", "pin": "141414"},
    {"id": "k4", "name": "Julian klein", "mode": "child", "role": "Kind", "admin": False, "color": "#a8c5b8", "pin": "151515"},
    {"id": "k5", "name": "Julian groß", "mode": "child", "role": "Kind", "admin": False, "color": "#8fb0a0", "pin": "161616"},
    {"id": "k6", "name": "Lea", "mode": "child", "role": "Kind", "admin": False, "color": "#d4c4a0", "pin": "171717"},
    {"id": "k7", "name": "Valeria", "mode": "child", "role": "Kind", "admin": False, "color": "#b8c9a8", "pin": "181818"},
    {"id": "k8", "name": "Jule", "mode": "child", "role": "Kind", "admin": False, "color": "#6b9a88", "pin": "191919"},
    {"id": "k9", "name": "Samantha", "mode": "child", "role": "Kind", "admin": False, "color": "#5a8a7a", "pin": "202020"},
    {"id": "k10", "name": "Lilly", "mode": "child", "role": "Kind", "admin": False, "color": "#7a9eaa", "pin": "212121"},
    {"id": "k11", "name": "Zoitsa", "mode": "child", "role": "Kind", "admin": False, "color": "#c48a1a", "pin": "222222"},
    {"id": "k12", "name": "Leonie", "mode": "child", "role": "Kind", "admin": False, "color": "#2f5a63", "pin": "232323"},
]
_SEED_BY_ID = {p["id"]: p for p in SEED_PROFILES}

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
    "incidents": 500,
    "careLogs": 2000,
}

HOUSES = [
    {"id": "h1", "name": "Kalyvia", "short": "Kal"},
    {"id": "h2", "name": "Thalassa", "short": "Tha"},
]


def _seed_profile_row(p: dict[str, Any], *, hash_plain: bool = True) -> dict[str, Any]:
    row = {k: v for k, v in p.items() if k != "pin"}
    pin = p.get("pin")
    row["email"] = ""
    row["phone"] = ""
    if hash_plain and pin:
        row["pinHash"] = _PIN_HASHER.hash(str(pin))
    else:
        row["pinHash"] = None
    return row


def _parse_auth_users_json() -> dict[str, dict[str, Any]]:
    raw = (os.environ.get("PAIDIA_AUTH_USERS_JSON") or "").strip()
    if not raw:
        return {}
    if (raw.startswith('"') and raw.endswith('"')) or (raw.startswith("'") and raw.endswith("'")):
        raw = raw[1:-1]
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    if not isinstance(data, dict):
        return {}
    out: dict[str, dict[str, Any]] = {}
    for pid, rec in data.items():
        if not isinstance(rec, dict):
            continue
        pin_hash = str(rec.get("pin_hash") or "").strip()
        if not pin_hash:
            continue
        out[str(pid)] = {
            "pin_hash": pin_hash,
            "mode": "child" if rec.get("mode") == "child" else "staff",
            "email": str(rec.get("email") or "").strip().lower(),
            "phone": str(rec.get("phone") or "").strip(),
        }
    return out


def _admin_ids() -> set[str]:
    raw = (os.environ.get("PAIDIA_ADMIN_PROFILE_IDS") or "e3,e4,e8").strip()
    return {x.strip() for x in raw.split(",") if x.strip()}


def _apply_auth_env(state: dict[str, Any]) -> bool:
    """Overlay PAIDIA_AUTH_USERS_JSON — never clobber an explicit PIN override."""
    users = _parse_auth_users_json()
    if not users:
        return False
    changed = False
    profiles = state.setdefault("profiles", {})
    admins = _admin_ids()
    for pid, rec in users.items():
        seed = _SEED_BY_ID.get(pid) or {
            "id": pid,
            "name": pid,
            "mode": rec["mode"],
            "role": "Kind" if rec["mode"] == "child" else "Betreuer",
            "admin": pid in admins,
            "color": "#2f5a63",
        }
        row = profiles.get(pid)
        if not row:
            row = _seed_profile_row(seed, hash_plain=False)
            profiles[pid] = row
            changed = True
        # Respect runtime PIN resets / profile PIN changes
        if not row.get("pinOverride"):
            if row.get("pinHash") != rec["pin_hash"]:
                row["pinHash"] = rec["pin_hash"]
                changed = True
        row.pop("pin", None)
        if rec["email"] and row.get("email") != rec["email"]:
            row["email"] = rec["email"]
            changed = True
        if rec["phone"] and row.get("phone") != rec["phone"]:
            row["phone"] = rec["phone"]
            changed = True
        mode = rec["mode"]
        if row.get("mode") != mode:
            row["mode"] = mode
            changed = True
        want_admin = pid in admins
        if bool(row.get("admin")) != want_admin:
            row["admin"] = want_admin
            changed = True
    # Drop known seed plaintext when env auth is authoritative
    for row in profiles.values():
        if row.pop("pin", None) is not None:
            changed = True
    return changed


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
    env_auth = bool(_parse_auth_users_json())
    return {
        "revision": 0,
        "updatedAt": int(time.time() * 1000),
        "profiles": {
            p["id"]: _seed_profile_row(p, hash_plain=not env_auth) for p in SEED_PROFILES
        },
        "passkeys": {},
        "sessions": {},
        "houses": HOUSES,
        "products": [
            {"id": "p_milk", "name": {"de": "Milch", "el": "Γάλα"}, "unit": "L", "category": "fridge", "parLevel": 2},
            {"id": "p_eggs", "name": {"de": "Eier", "el": "Αυγά"}, "unit": "Stk", "category": "fridge", "parLevel": 2},
            {"id": "p_rice", "name": {"de": "Reis", "el": "Ρύζι"}, "unit": "kg", "category": "pantry", "parLevel": 2},
            {"id": "p_pasta", "name": {"de": "Nudeln", "el": "Ζυμαρικά"}, "unit": "kg", "category": "pantry", "parLevel": 2},
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
        "incidents": [],
        "careLogs": [],
        "calendarFeeds": {},
        "pinResetTokens": {},
        "supermarketMode": False,
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


def _prepare(state: dict[str, Any]) -> dict[str, Any]:
    changed = _upgrade_profile_pins(state)
    changed = _apply_auth_env(state) or changed
    if changed:
        _persist(state)
    return state


def load_state() -> dict[str, Any]:
    apply_env_aliases()
    with _LOCK:
        # 1) Neon / Postgres (survives cold starts)
        try:
            from armonia.durable import load_state_blob

            remote = load_state_blob()
            if isinstance(remote, dict) and remote.get("profiles"):
                return _prepare(remote)
        except Exception:
            pass
        # 2) Local /tmp file (dev + warm instance)
        if _DATA_PATH.exists():
            try:
                state = json.loads(_DATA_PATH.read_text(encoding="utf-8"))
                return _prepare(state)
            except (OSError, json.JSONDecodeError):
                pass
        state = _empty_state()
        for h in HOUSES:
            for p in state["products"]:
                state["stock"][f"{h['id']}:{p['id']}"] = 4
        _apply_auth_env(state)
        _persist(state)
        return state


def _persist(state: dict[str, Any]) -> None:
    _trim_lists(state)
    state["updatedAt"] = int(time.time() * 1000)
    try:
        from armonia.durable import save_state_blob

        save_state_blob(state)
    except Exception:
        pass
    raw = json.dumps(state, ensure_ascii=False, indent=2, allow_nan=False)
    try:
        _DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
        tmp = _DATA_PATH.with_suffix(".tmp")
        tmp.write_text(raw, encoding="utf-8")
        tmp.replace(_DATA_PATH)
    except OSError:
        # Serverless without durable DB — keep in-memory only.
        pass


def _refresh_from_durable() -> None:
    """Pull newer remote revision into memory (multi-instance / cold start)."""
    try:
        from armonia.durable import durable_available, load_state_blob

        if not durable_available():
            return
        remote = load_state_blob()
        if not isinstance(remote, dict) or not remote.get("profiles"):
            return
        if int(remote.get("revision") or 0) >= int(STATE.get("revision") or 0):
            STATE.clear()
            STATE.update(remote)
            _apply_auth_env(STATE)
    except Exception:
        pass


STATE = load_state()


def durable_storage_ok() -> bool:
    try:
        from armonia.durable import health as durable_health

        return bool(durable_health().get("ok"))
    except Exception:
        return False


def get_state() -> dict[str, Any]:
    with _LOCK:
        return STATE


def mutate(fn) -> dict[str, Any]:
    with _LOCK:
        _refresh_from_durable()
        fn(STATE)
        STATE["revision"] = int(STATE.get("revision") or 0) + 1
        _persist(STATE)
        return deepcopy(STATE)


def snapshot() -> dict[str, Any]:
    with _LOCK:
        _refresh_from_durable()
        return deepcopy(STATE)
