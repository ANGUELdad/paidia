from __future__ import annotations

import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from armonia.auth.security import require_admin, require_staff
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/stock", tags=["stock"])


class AdjustBody(BaseModel):
    houseId: str
    productId: str
    dir: str  # IN|OUT
    qty: float = Field(gt=0)
    reason: str = ""


class CheckBody(BaseModel):
    houseId: str
    date: str
    notes: str = ""
    counts: dict[str, float] = Field(default_factory=dict)


@router.get("/snapshot")
def stock_snapshot(request: Request) -> dict[str, Any]:
    require_staff(request)
    state = snapshot()
    return {
        "houses": state.get("houses") or [],
        "products": state.get("products") or [],
        "stock": state.get("stock") or {},
        "stockChecks": state.get("stockChecks") or {},
        "revision": state.get("revision") or 0,
    }


@router.post("/adjust")
def adjust(body: AdjustBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    if body.dir not in {"IN", "OUT"}:
        raise HTTPException(status_code=400, detail={"code": "bad_dir"})
    key = f"{body.houseId}:{body.productId}"

    def apply(st: dict[str, Any]) -> None:
        stock = st.setdefault("stock", {})
        cur = float(stock.get(key) or 0)
        delta = body.qty if body.dir == "IN" else -body.qty
        nxt = max(0.0, cur + delta)
        stock[key] = nxt
        st.setdefault("stockLedger", []).append(
            {
                "id": uuid.uuid4().hex[:10],
                "houseId": body.houseId,
                "productId": body.productId,
                "qty": body.qty,
                "dir": body.dir,
                "reason": body.reason,
                "by": session["profile_id"],
                "at": int(time.time() * 1000),
            }
        )
        st.setdefault("auditLog", []).append(
            {
                "at": int(time.time() * 1000),
                "type": "STOCK",
                "profileId": session["profile_id"],
                "text": f"{body.dir} {body.qty} {body.productId} @ {body.houseId} ({body.reason})",
            }
        )
        st.setdefault("learningSignals", []).append(
            {
                "id": uuid.uuid4().hex[:10],
                "kind": "stock_adjust",
                "profileId": session["profile_id"],
                "houseId": body.houseId,
                "productId": body.productId,
                "dir": body.dir,
                "qty": body.qty,
                "at": int(time.time() * 1000),
            }
        )

    mutate(apply)
    return {"ok": True, "key": key, "qty": (snapshot().get("stock") or {}).get(key)}


@router.post("/check")
def stock_check(body: CheckBody, request: Request) -> dict[str, Any]:
    """Admin/staff structured storage keeping ritual."""
    session = require_staff(request)
    check_id = f"{body.date}:{body.houseId}"

    def apply(st: dict[str, Any]) -> None:
        checks = st.setdefault("stockChecks", {})
        for pid, qty in body.counts.items():
            st.setdefault("stock", {})[f"{body.houseId}:{pid}"] = float(qty)
        checks[check_id] = {
            "id": check_id,
            "date": body.date,
            "houseId": body.houseId,
            "notes": body.notes.strip()[:1000],
            "counts": body.counts,
            "by": session["profile_id"],
            "at": int(time.time() * 1000),
            "complete": True,
        }
        st.setdefault("auditLog", []).append(
            {
                "at": int(time.time() * 1000),
                "type": "STOCK_CHECK",
                "profileId": session["profile_id"],
                "text": f"Stock check {body.houseId} {body.date}",
            }
        )

    mutate(apply)
    return {"ok": True, "check": (snapshot().get("stockChecks") or {}).get(check_id)}


@router.get("/check/{date}/{house_id}")
def get_check(date: str, house_id: str, request: Request) -> dict[str, Any]:
    require_staff(request)
    check = (snapshot().get("stockChecks") or {}).get(f"{date}:{house_id}")
    return {"check": check, "complete": bool(check and check.get("complete"))}
