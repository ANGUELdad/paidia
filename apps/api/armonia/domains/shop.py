from __future__ import annotations

import time
import uuid
from typing import Any

from fastapi import APIRouter, Request
from pydantic import BaseModel, Field

from armonia.auth.security import require_staff
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/shop", tags=["shop"])


class AddBody(BaseModel):
    houseId: str = "h1"
    productId: str | None = None
    name: str | None = None
    qty: float = Field(default=1, gt=0)
    unit: str = "Stk"


@router.get("/list")
def shop_list(request: Request) -> dict[str, Any]:
    require_staff(request)
    entries = [e for e in (snapshot().get("listEntries") or []) if e.get("status") != "done"]
    return {"entries": entries}


@router.post("/add")
def shop_add(body: AddBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    entry = {
        "id": f"li_{uuid.uuid4().hex[:10]}",
        "houseId": body.houseId,
        "productId": body.productId,
        "name": (body.name or body.productId or "Item").strip()[:80],
        "qty": body.qty,
        "unit": body.unit,
        "status": "open",
        "by": session["profile_id"],
        "at": int(time.time() * 1000),
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("listEntries", []).append(entry)
        st.setdefault("learningSignals", []).append(
            {
                "id": uuid.uuid4().hex[:10],
                "kind": "shop_add",
                "profileId": session["profile_id"],
                "houseId": body.houseId,
                "productId": body.productId,
                "name": entry["name"],
                "qty": body.qty,
                "at": entry["at"],
            }
        )
        st.setdefault("auditLog", []).append(
            {"at": entry["at"], "type": "SHOP", "profileId": session["profile_id"], "text": f"List +{entry['name']}"}
        )

    mutate(apply)
    return {"ok": True, "entry": entry}


class DoneBody(BaseModel):
    entryId: str


@router.post("/done")
def shop_done(body: DoneBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)

    def apply(st: dict[str, Any]) -> None:
        for e in st.get("listEntries") or []:
            if e.get("id") == body.entryId:
                e["status"] = "done"
                e["doneBy"] = session["profile_id"]
                e["doneAt"] = int(time.time() * 1000)

    mutate(apply)
    return {"ok": True}


@router.get("/suggestions")
def suggestions(request: Request) -> dict[str, Any]:
    """Preference learning from past list/stock signals."""
    require_staff(request)
    signals = snapshot().get("learningSignals") or []
    scores: dict[str, float] = {}
    houses: dict[str, dict[str, float]] = {}
    for s in signals[-200:]:
        key = s.get("productId") or s.get("name") or ""
        if not key:
            continue
        scores[key] = scores.get(key, 0) + 1
        hid = s.get("houseId") or "h1"
        houses.setdefault(key, {})
        houses[key][hid] = houses[key].get(hid, 0) + 1
    ranked = sorted(scores.items(), key=lambda x: -x[1])[:8]
    return {
        "suggestions": [
            {
                "key": k,
                "score": v,
                "houseId": max(houses.get(k, {"h1": 1}).items(), key=lambda x: x[1])[0],
            }
            for k, v in ranked
        ]
    }
