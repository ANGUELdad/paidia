from __future__ import annotations

import time
import uuid
from typing import Any

from fastapi import APIRouter, Request
from pydantic import BaseModel

from armonia.auth.security import require_staff
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/presence", tags=["presence"])


class CheckinBody(BaseModel):
    date: str
    shiftId: str = "default"
    status: str = "there"  # there|late
    reason: str = ""


@router.get("/active")
def active(request: Request) -> dict[str, Any]:
    session = require_staff(request)
    today = time.strftime("%Y-%m-%d")
    rows = [
        c
        for c in (snapshot().get("shiftCheckins") or [])
        if c.get("profileId") == session["profile_id"] and c.get("date") == today
    ]
    return {"date": today, "checkin": rows[-1] if rows else None, "pending": not rows}


@router.post("/checkin")
def checkin(body: CheckinBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    row = {
        "id": uuid.uuid4().hex[:12],
        "profileId": session["profile_id"],
        "date": body.date,
        "shiftId": body.shiftId,
        "status": body.status if body.status in {"there", "late"} else "there",
        "reason": body.reason.strip()[:300],
        "at": int(time.time() * 1000),
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("shiftCheckins", []).append(row)
        st.setdefault("auditLog", []).append(
            {
                "at": row["at"],
                "type": "PRESENCE",
                "profileId": session["profile_id"],
                "text": f"Presence {row['status']} {body.date}",
            }
        )

    mutate(apply)
    return {"ok": True, "checkin": row}
