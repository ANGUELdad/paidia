from __future__ import annotations

import time
import uuid
from typing import Any

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from armonia.auth.security import require_staff
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/talk", tags=["talk"])


class MessageBody(BaseModel):
    text: str | None = None
    body: str | None = None
    topic: str = "general"


class TopicBody(BaseModel):
    text: str = Field(min_length=1, max_length=400)


class MeetingBody(BaseModel):
    weekKey: str
    text: str | None = None
    body: str | None = None
    title: str = "Besprechung"


def _enrich(messages: list[dict[str, Any]], profiles: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
    for m in messages:
        pid = m.get("profileId") or ""
        name = (profiles.get(pid) or {}).get("name") or pid or "Team"
        out.append(
            {
                **m,
                "author": name,
                "body": m.get("text") or m.get("body") or "",
                "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime((m.get("at") or 0) / 1000))
                if m.get("at")
                else "",
            }
        )
    return out


@router.get("")
@router.get("/")
@router.get("/feed")
def feed(request: Request, topic: str | None = None) -> dict[str, Any]:
    require_staff(request)
    state = snapshot()
    messages = list(state.get("talkMessages") or [])
    if topic:
        messages = [m for m in messages if (m.get("topic") or "general") == topic]
    return {
        "messages": _enrich(messages[-100:], state.get("profiles") or {}),
        "topics": state.get("talkTopics") or [],
    }


@router.post("")
@router.post("/")
@router.post("/message")
def post_message(body: MessageBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    text = (body.text or body.body or "").strip()
    if not text:
        return {"ok": False, "error": "empty"}
    msg = {
        "id": uuid.uuid4().hex[:12],
        "profileId": session["profile_id"],
        "topic": body.topic or "general",
        "text": text[:2000],
        "at": int(time.time() * 1000),
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("talkMessages", []).append(msg)

    mutate(apply)
    state = snapshot()
    enriched = _enrich([msg], state.get("profiles") or {})[0]
    return {"ok": True, "message": enriched}


@router.post("/topic")
def add_topic(body: TopicBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    topic = {
        "id": uuid.uuid4().hex[:10],
        "text": body.text.strip(),
        "by": session["profile_id"],
        "at": int(time.time() * 1000),
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("talkTopics", []).append(topic)

    mutate(apply)
    return {"ok": True, "topic": topic}


@router.get("/meeting/{week_key}")
def get_meeting(week_key: str, request: Request) -> dict[str, Any]:
    require_staff(request)
    note = (snapshot().get("meetingNotes") or {}).get(week_key)
    notes = []
    if note:
        notes.append(
            {
                "id": note.get("weekKey") or week_key,
                "weekKey": week_key,
                "title": note.get("title") or "Besprechung",
                "body": note.get("text") or "",
            }
        )
    return {"note": note, "notes": notes}


@router.post("/meeting")
def save_meeting(body: MeetingBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    text = (body.text or body.body or "").strip()
    if not text:
        return {"ok": False, "error": "empty"}

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("meetingNotes", {})[body.weekKey] = {
            "weekKey": body.weekKey,
            "title": body.title.strip()[:120] or "Besprechung",
            "text": text[:8000],
            "by": session["profile_id"],
            "at": int(time.time() * 1000),
        }

    mutate(apply)
    note = (snapshot().get("meetingNotes") or {}).get(body.weekKey)
    return {
        "ok": True,
        "note": note,
        "notes": [
            {
                "id": body.weekKey,
                "weekKey": body.weekKey,
                "title": note.get("title") if note else body.title,
                "body": note.get("text") if note else text,
            }
        ],
    }
