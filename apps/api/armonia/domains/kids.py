from __future__ import annotations

import time
from typing import Any

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from armonia.auth.security import require_session
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/kids", tags=["kids"])


class XpBody(BaseModel):
    delta: int = Field(default=5, ge=1, le=50)
    reason: str = "game"


class PlayBody(BaseModel):
    game: str = "memory"
    score: int = Field(default=1, ge=1, le=20)


def _xp_row(state: dict[str, Any], profile_id: str) -> dict[str, Any]:
    row = (state.get("xp") or {}).get(profile_id) or {"points": 0, "streak": 0, "badges": []}
    return {
        "xp": int(row.get("points") or 0),
        "points": int(row.get("points") or 0),
        "streak": int(row.get("streak") or 0),
        "badges": list(row.get("badges") or []),
        "lastPlayAt": row.get("at"),
        "lastReason": row.get("lastReason"),
    }


@router.get("/home")
@router.get("/rewards")
def kids_home(request: Request) -> dict[str, Any]:
    session = require_session(request)
    if session.get("mode") != "child":
        return {"error": "child_only", "state": None}
    state = snapshot()
    xp = _xp_row(state, session["profile_id"])
    today = time.strftime("%Y-%m-%d")
    events = [e for e in (state.get("events") or []) if e.get("status") == "published" and e.get("date", "") >= today]
    return {
        "xp": xp,
        "state": xp,
        "events": events[:5],
        "rewards": [
            {"id": "star", "label": {"de": "Stern", "el": "Αστέρι"}, "need": 20},
            {"id": "shell", "label": {"de": "Muschel", "el": "Κοχύλι"}, "need": 50},
            {"id": "pine", "label": {"de": "Pinie", "el": "Πεύκο"}, "need": 100},
        ],
    }


@router.post("/xp")
def add_xp(body: XpBody, request: Request) -> dict[str, Any]:
    session = require_session(request)
    if session.get("mode") != "child":
        return {"ok": False}

    def apply(st: dict[str, Any]) -> None:
        xp_map = st.setdefault("xp", {})
        row = dict(xp_map.get(session["profile_id"]) or {"points": 0, "streak": 0, "badges": []})
        row["points"] = int(row.get("points") or 0) + body.delta
        row["streak"] = int(row.get("streak") or 0) + 1
        badges = list(row.get("badges") or [])
        for bid, need in (("star", 20), ("shell", 50), ("pine", 100)):
            if row["points"] >= need and bid not in badges:
                badges.append(bid)
        row["badges"] = badges
        row["lastReason"] = body.reason
        row["at"] = int(time.time() * 1000)
        xp_map[session["profile_id"]] = row

    mutate(apply)
    state = snapshot()
    return {"ok": True, "xp": _xp_row(state, session["profile_id"]), "state": _xp_row(state, session["profile_id"])}


@router.post("/play")
def play(body: PlayBody, request: Request) -> dict[str, Any]:
    gained = min(20, max(1, body.score * (2 if body.game == "memory" else 1)))
    result = add_xp(XpBody(delta=gained, reason=body.game), request)
    return {**result, "gained": gained, "game": body.game}
