from __future__ import annotations

import time
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from armonia.auth.limits import rate_limit
from armonia.auth.security import require_child
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/kids", tags=["kids"])

# Server-side XP awards — clients cannot choose score/delta.
GAME_XP = {"memory": 6, "quiz": 5, "breath": 3}
PLAY_COOLDOWN_SEC = 45
DAILY_XP_CAP = 80
ALLOWED_GAMES = frozenset(GAME_XP)
ALLOWED_MOODS = frozenset({"sun", "cloud", "rain", "storm"})


class PlayBody(BaseModel):
    game: str = "memory"
    # Legacy clients may still send score; it is ignored.
    score: int | None = None


class MoodBody(BaseModel):
    mood: str = "sun"


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


def _child_events(state: dict[str, Any]) -> list[dict[str, Any]]:
    today = time.strftime("%Y-%m-%d")
    return [
        e
        for e in (state.get("events") or [])
        if e.get("status") == "published"
        and e.get("audience") in {"children", "all"}
        and e.get("date", "") >= today
    ]


def _award_xp(profile_id: str, delta: int, reason: str) -> dict[str, Any]:
    now_ms = int(time.time() * 1000)
    today = time.strftime("%Y-%m-%d")
    state = snapshot()
    row = dict((state.get("xp") or {}).get(profile_id) or {"points": 0, "streak": 0, "badges": [], "daily": {}})
    daily = dict(row.get("daily") or {})
    earned_today = int(daily.get(today) or 0)
    if earned_today >= DAILY_XP_CAP:
        raise HTTPException(status_code=429, detail={"code": "daily_xp_cap", "error": "Daily XP cap reached"})
    last_at = int(row.get("at") or 0)
    if last_at and (now_ms - last_at) < PLAY_COOLDOWN_SEC * 1000:
        raise HTTPException(status_code=429, detail={"code": "play_cooldown", "error": "Play again later"})
    gained = min(delta, max(0, DAILY_XP_CAP - earned_today))
    if gained <= 0:
        raise HTTPException(status_code=429, detail={"code": "daily_xp_cap", "error": "Daily XP cap reached"})

    def apply(st: dict[str, Any]) -> None:
        xp_map = st.setdefault("xp", {})
        cur = dict(xp_map.get(profile_id) or {"points": 0, "streak": 0, "badges": [], "daily": {}})
        cur_daily = dict(cur.get("daily") or {})
        cur["points"] = int(cur.get("points") or 0) + gained
        cur["streak"] = int(cur.get("streak") or 0) + 1
        badges = list(cur.get("badges") or [])
        for bid, need in (("star", 20), ("shell", 50), ("pine", 100)):
            if cur["points"] >= need and bid not in badges:
                badges.append(bid)
        cur["badges"] = badges
        cur["lastReason"] = reason
        cur["at"] = now_ms
        cur_daily[today] = int(cur_daily.get(today) or 0) + gained
        cur["daily"] = cur_daily
        xp_map[profile_id] = cur

    mutate(apply)
    return {**_xp_row(snapshot(), profile_id), "gained": gained}


@router.get("/home")
@router.get("/rewards")
def kids_home(request: Request) -> dict[str, Any]:
    session = require_child(request)
    state = snapshot()
    xp = _xp_row(state, session["profile_id"])
    return {
        "xp": xp,
        "state": xp,
        "events": _child_events(state)[:5],
        "rewards": [
            {"id": "star", "label": {"de": "Stern", "el": "Αστέρι"}, "need": 20},
            {"id": "shell", "label": {"de": "Muschel", "el": "Κοχύλι"}, "need": 50},
            {"id": "pine", "label": {"de": "Pinie", "el": "Πεύκο"}, "need": 100},
        ],
    }


@router.post("/xp")
def add_xp_legacy(request: Request) -> dict[str, Any]:
    """Deprecated — XP is only awarded via /play with server-side rules."""
    require_child(request)
    raise HTTPException(status_code=403, detail={"code": "xp_forbidden", "error": "Use /api/kids/play"})


@router.post("/play")
def play(body: PlayBody, request: Request) -> dict[str, Any]:
    rate_limit(request, key="kids-play", limit=20, window_sec=60)
    session = require_child(request)
    game = (body.game or "memory").strip().lower()
    if game not in ALLOWED_GAMES:
        raise HTTPException(status_code=400, detail={"code": "bad_game", "error": "Unknown game"})
    gained = GAME_XP[game]
    try:
        row = _award_xp(session["profile_id"], gained, game)
    except HTTPException:
        raise
    return {"ok": True, "gained": row.get("gained", gained), "game": game, "xp": row, "state": row}


@router.post("/mood")
def post_mood(body: MoodBody, request: Request) -> dict[str, Any]:
    rate_limit(request, key="kids-mood", limit=24, window_sec=60)
    session = require_child(request)
    mood = (body.mood or "sun").strip().lower()
    if mood not in ALLOWED_MOODS:
        raise HTTPException(status_code=400, detail={"code": "bad_mood", "error": "Unknown mood"})
    today = time.strftime("%Y-%m-%d")
    row = {
        "type": "mood",
        "profileId": session["profile_id"],
        "date": today,
        "mood": mood,
        "at": int(time.time() * 1000),
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("learningSignals", []).append(row)

    mutate(apply)
    return {"ok": True, "mood": mood}
