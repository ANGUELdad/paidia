from __future__ import annotations

import time
from typing import Any

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from armonia.auth.security import require_staff
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/book", tags=["book"])


class NoteBody(BaseModel):
    date: str
    text: str = Field(min_length=1, max_length=8000)
    mode: str = "append"  # append|rewrite


@router.get("/journal/{profile_id}")
def get_journal(profile_id: str, date: str, request: Request) -> dict[str, Any]:
    require_staff(request)
    key = f"{profile_id}:{date}"
    note = (snapshot().get("shiftNotes") or {}).get(key)
    return {"note": note, "due": not (note and (note.get("text") or "").strip())}


@router.post("/journal")
def write_journal(body: NoteBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    key = f"{session['profile_id']}:{body.date}"
    stamp = time.strftime("%H:%M")

    def apply(st: dict[str, Any]) -> None:
        notes = st.setdefault("shiftNotes", {})
        existing = notes.get(key) or {"text": "", "pages": []}
        if body.mode == "rewrite":
            text = body.text.strip()
            pages = [{"at": stamp, "text": text}]
        else:
            chunk = f"[{stamp}] {body.text.strip()}"
            text = ((existing.get("text") or "").rstrip() + "\n" + chunk).strip()
            pages = list(existing.get("pages") or []) + [{"at": stamp, "text": body.text.strip()}]
        notes[key] = {
            "profileId": session["profile_id"],
            "date": body.date,
            "text": text,
            "pages": pages[-40:],
            "updatedAt": int(time.time() * 1000),
        }
        st.setdefault("auditLog", []).append(
            {
                "at": int(time.time() * 1000),
                "type": "JOURNAL",
                "profileId": session["profile_id"],
                "text": f"Schichtbuch {body.date}",
            }
        )

    mutate(apply)
    return {"ok": True, "note": (snapshot().get("shiftNotes") or {}).get(key)}


@router.get("/audit")
def audit(
    request: Request,
    range: str = "week",
    type: str | None = None,
    q: str | None = None,
) -> dict[str, Any]:
    require_staff(request)
    rows = list(reversed(snapshot().get("auditLog") or []))
    if type:
        rows = [r for r in rows if r.get("type") == type]
    if q:
        needle = q.lower()
        rows = [r for r in rows if needle in str(r.get("text") or "").lower()]
    limit = 200 if range == "all" else 80
    return {"entries": rows[:limit]}
