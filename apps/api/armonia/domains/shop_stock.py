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
    expectedRevision: int | None = None


class ParBody(BaseModel):
    productId: str
    parLevel: float = Field(ge=0)
    expectedRevision: int | None = None


class CheckBody(BaseModel):
    houseId: str
    date: str
    notes: str = ""
    counts: dict[str, float] = Field(default_factory=dict)


class RevisionConflict(Exception):
    def __init__(self, revision: int) -> None:
        self.revision = revision


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
        rev = int(st.get("revision") or 0)
        if body.expectedRevision is not None and rev != body.expectedRevision:
            raise RevisionConflict(rev)
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

    try:
        state = mutate(apply)
    except RevisionConflict as exc:
        raise HTTPException(
            status_code=409,
            detail={"code": "revision_conflict", "revision": exc.revision, "error": "Bestand wurde parallel geändert — bitte neu laden"},
        ) from exc
    return {
        "ok": True,
        "key": key,
        "qty": (state.get("stock") or {}).get(key),
        "revision": state.get("revision") or 0,
    }


@router.post("/par")
def set_par(body: ParBody, request: Request) -> dict[str, Any]:
    require_staff(request)
    if not any(p.get("id") == body.productId for p in (snapshot().get("products") or [])):
        raise HTTPException(status_code=404, detail={"code": "product_not_found"})

    def apply(st: dict[str, Any]) -> None:
        rev = int(st.get("revision") or 0)
        if body.expectedRevision is not None and rev != body.expectedRevision:
            raise RevisionConflict(rev)
        for p in st.get("products") or []:
            if p.get("id") == body.productId:
                p["parLevel"] = float(body.parLevel)
                return
        raise RevisionConflict(rev)  # product vanished under lock

    try:
        state = mutate(apply)
    except RevisionConflict as exc:
        raise HTTPException(
            status_code=409,
            detail={"code": "revision_conflict", "revision": exc.revision, "error": "Bestand wurde parallel geändert — bitte neu laden"},
        ) from exc
    product = next((p for p in (state.get("products") or []) if p.get("id") == body.productId), None)
    return {"ok": True, "product": product, "revision": state.get("revision") or 0}


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
