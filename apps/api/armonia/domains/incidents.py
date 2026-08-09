from __future__ import annotations

import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from armonia.auth.security import require_admin, require_staff
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/incidents", tags=["incidents"])

SEVERITIES = frozenset({"low", "med", "high"})


class IncidentBody(BaseModel):
    houseId: str
    childIds: list[str] = Field(default_factory=list)
    staffIds: list[str] = Field(default_factory=list)
    severity: str = "med"
    text: str = Field(min_length=1, max_length=2000)
    date: str | None = None


@router.get("")
@router.get("/")
def list_incidents(request: Request) -> dict[str, Any]:
    require_staff(request)
    rows = list(snapshot().get("incidents") or [])
    return {"incidents": rows}


@router.post("")
@router.post("/")
def create_incident(body: IncidentBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    severity = body.severity if body.severity in SEVERITIES else "med"
    row = {
        "id": f"inc_{uuid.uuid4().hex[:10]}",
        "at": int(time.time() * 1000),
        "date": body.date or time.strftime("%Y-%m-%d"),
        "houseId": body.houseId,
        "childIds": list(body.childIds)[:20],
        "staffIds": list(body.staffIds)[:20],
        "severity": severity,
        "text": body.text.strip()[:2000],
        "by": session["profile_id"],
        "reviewed": False,
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("incidents", []).append(row)
        st.setdefault("auditLog", []).append(
            {
                "at": row["at"],
                "type": "INCIDENT",
                "profileId": session["profile_id"],
                "text": f"Incident {row['severity']} @ {row['houseId']}",
            }
        )

    mutate(apply)
    return {"ok": True, "incident": row}


@router.post("/{incident_id}/review")
def review_incident(incident_id: str, request: Request) -> dict[str, Any]:
    session = require_admin(request)
    found: dict[str, Any] | None = None

    def apply(st: dict[str, Any]) -> None:
        nonlocal found
        for inc in st.get("incidents") or []:
            if inc.get("id") == incident_id:
                inc["reviewed"] = True
                inc["reviewedBy"] = session["profile_id"]
                inc["reviewedAt"] = int(time.time() * 1000)
                found = inc
                st.setdefault("auditLog", []).append(
                    {
                        "at": inc["reviewedAt"],
                        "type": "INCIDENT_REVIEW",
                        "profileId": session["profile_id"],
                        "text": f"Reviewed incident {incident_id}",
                    }
                )
                break

    mutate(apply)
    if not found:
        raise HTTPException(status_code=404, detail={"code": "not_found", "error": "Incident not found"})
    return {"ok": True, "incident": found}
