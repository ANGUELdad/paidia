from __future__ import annotations

import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from armonia.auth.security import require_session
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/care", tags=["care"])

CARE_KINDS = frozenset({"meal", "sleep", "mood", "meds"})


class CareLogBody(BaseModel):
    childId: str
    date: str
    kind: str
    note: str = ""
    value: str = ""


def _assert_care_access(session: dict[str, Any], child_id: str) -> None:
    if session.get("mode") == "staff":
        return
    if session.get("mode") == "child" and session.get("profile_id") == child_id:
        return
    raise HTTPException(status_code=403, detail={"code": "forbidden", "error": "Care log access denied"})


@router.get("/log")
def get_care_log(request: Request, childId: str, date: str) -> dict[str, Any]:
    session = require_session(request)
    _assert_care_access(session, childId)
    logs = [
        row
        for row in (snapshot().get("careLogs") or [])
        if row.get("childId") == childId and row.get("date") == date
    ]
    return {"childId": childId, "date": date, "logs": logs}


@router.post("/log")
def post_care_log(body: CareLogBody, request: Request) -> dict[str, Any]:
    session = require_session(request)
    _assert_care_access(session, body.childId)
    kind = body.kind.strip().lower()
    if kind not in CARE_KINDS:
        raise HTTPException(status_code=400, detail={"code": "bad_kind", "error": "Invalid care log kind"})
    row = {
        "id": f"care_{uuid.uuid4().hex[:10]}",
        "childId": body.childId,
        "date": body.date,
        "kind": kind,
        "note": body.note.strip()[:500],
        "value": body.value.strip()[:200],
        "by": session["profile_id"],
        "at": int(time.time() * 1000),
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("careLogs", []).append(row)

    mutate(apply)
    return {"ok": True, "log": row}
