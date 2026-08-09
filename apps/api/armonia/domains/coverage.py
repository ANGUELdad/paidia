from __future__ import annotations

import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from armonia.auth.security import require_staff
from armonia.domains.schedule import BLOCKS
from armonia.store import HOUSES, mutate, snapshot

router = APIRouter(prefix="/api/coverage", tags=["coverage"])


class GapReportBody(BaseModel):
    message: str


def _coverage_for_date(state: dict[str, Any], date: str) -> dict[str, Any]:
    profiles = state.get("profiles") or {}
    entries = [
        e
        for e in (state.get("overrides") or [])
        if e.get("date") == date and not e.get("cancelled")
    ]
    checkins = [c for c in (state.get("shiftCheckins") or []) if c.get("date") == date]
    checked_in = {c.get("profileId"): c for c in checkins if c.get("profileId")}

    houses_out: list[dict[str, Any]] = []
    for house in state.get("houses") or HOUSES:
        hid = house["id"]
        house_entries = [e for e in entries if hid in (e.get("houseIds") or [])]

        assigned_staff: set[str] = set()
        for entry in house_entries:
            for eid in entry.get("employeeIds") or []:
                assigned_staff.add(eid)

        staff_present = [
            eid
            for eid in assigned_staff
            if eid in checked_in and checked_in[eid].get("status") in {"there", "late"}
        ]

        late: list[dict[str, Any]] = []
        for eid in assigned_staff:
            checkin = checked_in.get(eid)
            if checkin and checkin.get("status") == "late":
                late.append(
                    {
                        "profileId": eid,
                        "name": (profiles.get(eid) or {}).get("name") or eid,
                        "reason": checkin.get("reason") or "",
                        "at": checkin.get("at"),
                    }
                )

        gaps: list[dict[str, Any]] = []
        for block in BLOCKS:
            if block.get("by") != "house":
                continue
            covered = any(
                entry.get("block") == block["id"] and (entry.get("employeeIds") or [])
                for entry in house_entries
            )
            if not covered:
                gaps.append({"block": block["id"], "from": block["from"], "to": block["to"]})

        houses_out.append(
            {
                "id": hid,
                "name": house.get("name") or hid,
                "entries": house_entries,
                "staffPresent": staff_present,
                "gaps": gaps,
                "late": late,
            }
        )

    return {"date": date, "houses": houses_out}


@router.get("/today")
def coverage_today(request: Request) -> dict[str, Any]:
    require_staff(request)
    today = time.strftime("%Y-%m-%d")
    return _coverage_for_date(snapshot(), today)


@router.post("/gap-report")
def gap_report(body: GapReportBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    text = body.message.strip()
    if not text:
        raise HTTPException(status_code=400, detail={"code": "empty_message", "error": "Message required"})
    now = int(time.time() * 1000)
    msg = {
        "id": uuid.uuid4().hex[:12],
        "profileId": session["profile_id"],
        "topic": "ops",
        "text": text[:2000],
        "at": now,
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("talkMessages", []).append(msg)
        st.setdefault("auditLog", []).append(
            {
                "at": now,
                "type": "COVERAGE_GAP",
                "profileId": session["profile_id"],
                "text": f"Gap report: {text[:300]}",
            }
        )

    mutate(apply)
    return {"ok": True, "message": msg}
