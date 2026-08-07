from __future__ import annotations

import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from armonia.auth.security import require_admin, require_staff
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/schedule", tags=["schedule"])

BLOCKS = [
    {"id": "morning", "from": "10:00", "to": "14:00", "by": "house"},
    {"id": "afternoon", "from": "15:00", "to": "19:00", "by": "person"},
    {"id": "evening", "from": "19:00", "to": "22:00", "by": "house"},
]


class EntryBody(BaseModel):
    date: str
    block: str
    activity: str = "Betreuung"
    houseIds: list[str] = Field(default_factory=list)
    employeeIds: list[str] = Field(default_factory=list)
    childIds: list[str] = Field(default_factory=list)
    fromTime: str | None = None
    toTime: str | None = None
    note: str = ""
    asTemplate: bool = False
    overrideReason: str = ""
    force: bool = False


class CancelBody(BaseModel):
    entryId: str
    reason: str = ""


def _overlaps(a_from: str, a_to: str, b_from: str, b_to: str) -> bool:
    return a_from < b_to and b_from < a_to


def validate_day(date: str, entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    by_emp: dict[str, list[dict[str, Any]]] = {}
    for e in entries:
        if e.get("cancelled"):
            continue
        for eid in e.get("employeeIds") or []:
            by_emp.setdefault(eid, []).append(e)
    for eid, rows in by_emp.items():
        for i, a in enumerate(rows):
            for b in rows[i + 1 :]:
                if _overlaps(a.get("from") or "00:00", a.get("to") or "23:59", b.get("from") or "00:00", b.get("to") or "23:59"):
                    issues.append(
                        {
                            "code": "double_book",
                            "employeeId": eid,
                            "date": date,
                            "message": "Employee assigned to overlapping blocks",
                            "overrideAllowed": True,
                        }
                    )
    houses_covered = {h for e in entries for h in (e.get("houseIds") or []) if not e.get("cancelled")}
    if entries and len(houses_covered) < 2:
        issues.append(
            {
                "code": "house_gap",
                "date": date,
                "message": "Not all houses have coverage",
                "overrideAllowed": True,
            }
        )
    return issues


@router.get("/meta")
def schedule_meta() -> dict[str, Any]:
    return {"blocks": BLOCKS}


@router.get("/day/{date}")
def get_day(date: str, request: Request) -> dict[str, Any]:
    require_staff(request)
    state = snapshot()
    entries = [e for e in (state.get("overrides") or []) if e.get("date") == date]
    return {"date": date, "entries": entries, "issues": validate_day(date, entries), "events": [e for e in state.get("events") or [] if e.get("date") == date]}


@router.get("/week")
def get_week(start: str, request: Request) -> dict[str, Any]:
    require_staff(request)
    state = snapshot()
    # start is ISO Monday; return 7 days
    from datetime import date, timedelta

    try:
        d0 = date.fromisoformat(start)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail={"code": "bad_date"}) from exc
    days = []
    for i in range(7):
        ds = (d0 + timedelta(days=i)).isoformat()
        entries = [e for e in (state.get("overrides") or []) if e.get("date") == ds]
        days.append({"date": ds, "entries": entries, "issues": validate_day(ds, entries)})
    return {"start": start, "days": days, "blocks": BLOCKS}


@router.post("/entry")
def upsert_entry(body: EntryBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    if body.asTemplate:
        require_admin(request)
    block = next((b for b in BLOCKS if b["id"] == body.block), None)
    if not block:
        raise HTTPException(status_code=400, detail={"code": "bad_block"})
    entry = {
        "id": f"ov_{uuid.uuid4().hex[:10]}",
        "date": body.date,
        "block": body.block,
        "activity": body.activity.strip()[:80] or "Betreuung",
        "houseIds": body.houseIds,
        "employeeIds": body.employeeIds,
        "childIds": body.childIds,
        "from": body.fromTime or block["from"],
        "to": body.toTime or block["to"],
        "note": body.note.strip()[:500],
        "cancelled": False,
        "overrideReason": body.overrideReason.strip()[:300],
        "by": session["profile_id"],
        "at": int(time.time() * 1000),
    }
    state = snapshot()
    tentative = [e for e in (state.get("overrides") or []) if e.get("date") == body.date and not e.get("cancelled")] + [entry]
    issues = validate_day(body.date, tentative)
    blocking = [i for i in issues if i.get("code") == "double_book"]
    if blocking and not body.force:
        if not body.overrideReason.strip():
            raise HTTPException(
                status_code=409,
                detail={"code": "validation_failed", "issues": issues, "error": "Override reason required"},
            )

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("overrides", []).append(entry)
        if body.asTemplate:
            tmpl = dict(entry)
            tmpl.pop("date", None)
            st.setdefault("template", []).append(tmpl)
        st.setdefault("auditLog", []).append(
            {
                "at": entry["at"],
                "type": "SCHEDULE",
                "profileId": session["profile_id"],
                "text": f"Plan {body.date} {body.activity}"
                + (f" override={body.overrideReason}" if body.overrideReason else ""),
            }
        )

    mutate(apply)
    state = snapshot()
    entries = [e for e in state.get("overrides") or [] if e.get("date") == body.date]
    return {"ok": True, "entry": entry, "issues": validate_day(body.date, entries)}


@router.post("/cancel")
def cancel_entry(body: CancelBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)

    def apply(st: dict[str, Any]) -> None:
        for e in st.get("overrides") or []:
            if e.get("id") == body.entryId:
                e["cancelled"] = True
                e["cancelReason"] = body.reason.strip()[:300]
                e["cancelledBy"] = session["profile_id"]
                e["cancelledAt"] = int(time.time() * 1000)

    mutate(apply)
    return {"ok": True}
