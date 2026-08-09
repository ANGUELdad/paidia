from __future__ import annotations

import re
import time
import uuid
from datetime import date, timedelta
from typing import Any, Literal

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from armonia.auth.security import require_staff
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/shop", tags=["shop"])

ListStatus = Literal["open", "bought", "missing"]


class AddBody(BaseModel):
    houseId: str = "h1"
    productId: str | None = None
    name: str | None = None
    qty: float = Field(default=1, gt=0)
    unit: str = "Stk"
    fridayDate: str | None = None
    status: ListStatus = "open"


class DoneBody(BaseModel):
    entryId: str


class ReorderItem(BaseModel):
    houseId: str
    productId: str | None = None
    name: str
    qty: float = Field(default=1, gt=0)
    unit: str = "Stk"


class ReorderApplyBody(BaseModel):
    items: list[ReorderItem] = Field(default_factory=list)


class OcrBody(BaseModel):
    text: str = ""


class StatusBody(BaseModel):
    entryId: str
    status: ListStatus


class SupermarketModeBody(BaseModel):
    enabled: bool = True


def _upcoming_friday(ref: date | None = None) -> str:
    d = ref or date.today()
    days_ahead = (4 - d.weekday()) % 7
    return (d + timedelta(days=days_ahead)).isoformat()


def _par_level(product: dict[str, Any]) -> float:
    raw = product.get("parLevel")
    if raw is None:
        return 2.0
    try:
        return float(raw)
    except (TypeError, ValueError):
        return 2.0


def _product_label(product: dict[str, Any]) -> str:
    name = product.get("name") or {}
    if isinstance(name, dict):
        return str(name.get("de") or name.get("el") or product.get("id") or "Item")
    return str(name or product.get("id") or "Item")


def _make_entry(body: AddBody, profile_id: str) -> dict[str, Any]:
    return {
        "id": f"li_{uuid.uuid4().hex[:10]}",
        "houseId": body.houseId,
        "productId": body.productId,
        "name": (body.name or body.productId or "Item").strip()[:80],
        "qty": body.qty,
        "unit": body.unit,
        "status": body.status,
        "fridayDate": body.fridayDate,
        "by": profile_id,
        "at": int(time.time() * 1000),
    }


def _append_entry(st: dict[str, Any], entry: dict[str, Any], profile_id: str, house_id: str) -> None:
    st.setdefault("listEntries", []).append(entry)
    st.setdefault("learningSignals", []).append(
        {
            "id": uuid.uuid4().hex[:10],
            "kind": "shop_add",
            "profileId": profile_id,
            "houseId": house_id,
            "productId": entry.get("productId"),
            "name": entry["name"],
            "qty": entry["qty"],
            "at": entry["at"],
        }
    )
    st.setdefault("auditLog", []).append(
        {
            "at": entry["at"],
            "type": "SHOP",
            "profileId": profile_id,
            "text": f"List +{entry['name']}",
        }
    )


@router.get("/list")
def shop_list(request: Request) -> dict[str, Any]:
    require_staff(request)
    entries = [
        e
        for e in (snapshot().get("listEntries") or [])
        if e.get("status") != "done" and not e.get("fridayDate")
    ]
    return {"entries": entries}


@router.post("/add")
def shop_add(body: AddBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    entry = _make_entry(body, session["profile_id"])

    def apply(st: dict[str, Any]) -> None:
        _append_entry(st, entry, session["profile_id"], body.houseId)

    mutate(apply)
    return {"ok": True, "entry": entry}


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


@router.post("/status")
def shop_status(body: StatusBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)

    def apply(st: dict[str, Any]) -> None:
        for e in st.get("listEntries") or []:
            if e.get("id") == body.entryId:
                e["status"] = body.status
                e["statusBy"] = session["profile_id"]
                e["statusAt"] = int(time.time() * 1000)

    mutate(apply)
    return {"ok": True, "entryId": body.entryId, "status": body.status}


@router.get("/supermarket")
def supermarket_list(request: Request) -> dict[str, Any]:
    require_staff(request)
    state = snapshot()
    entries = [
        e
        for e in (state.get("listEntries") or [])
        if e.get("status") in {"open", "bought", "missing", None, ""}
    ]
    return {"entries": entries, "supermarketMode": bool(state.get("supermarketMode"))}


@router.post("/supermarket/mode")
def supermarket_mode(body: SupermarketModeBody, request: Request) -> dict[str, Any]:
    require_staff(request)

    def apply(st: dict[str, Any]) -> None:
        st["supermarketMode"] = bool(body.enabled)

    mutate(apply)
    return {"ok": True, "supermarketMode": bool(body.enabled)}


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


@router.get("/reorder-suggestions")
def reorder_suggestions(request: Request) -> dict[str, Any]:
    require_staff(request)
    state = snapshot()
    houses = state.get("houses") or []
    products = state.get("products") or []
    stock = state.get("stock") or {}
    items: list[dict[str, Any]] = []
    for h in houses:
        hid = h["id"]
        hname = h.get("name") or h.get("short") or hid
        for p in products:
            pid = p["id"]
            qty = float(stock.get(f"{hid}:{pid}") or 0)
            par = _par_level(p)
            if qty <= par:
                need = max(1.0, par - qty)
                items.append(
                    {
                        "houseId": hid,
                        "houseName": hname,
                        "productId": pid,
                        "name": _product_label(p),
                        "qty": need,
                        "unit": p.get("unit") or "Stk",
                        "stockQty": qty,
                        "parLevel": par,
                    }
                )
    return {"items": items}


@router.post("/reorder-apply")
def reorder_apply(body: ReorderApplyBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    if not body.items:
        raise HTTPException(status_code=400, detail={"code": "empty_items"})
    created: list[dict[str, Any]] = []

    def apply(st: dict[str, Any]) -> None:
        for item in body.items:
            add = AddBody(
                houseId=item.houseId,
                productId=item.productId,
                name=item.name,
                qty=item.qty,
                unit=item.unit,
            )
            entry = _make_entry(add, session["profile_id"])
            _append_entry(st, entry, session["profile_id"], item.houseId)
            created.append(entry)

    mutate(apply)
    return {"ok": True, "entries": created}


@router.get("/friday")
def friday_list(request: Request) -> dict[str, Any]:
    require_staff(request)
    friday = _upcoming_friday()
    entries = [
        e
        for e in (snapshot().get("listEntries") or [])
        if e.get("status") != "done"
        and (e.get("fridayDate") == friday or e.get("status") == "friday")
    ]
    return {"fridayDate": friday, "entries": entries}


@router.post("/friday/add")
def friday_add(body: AddBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    friday = _upcoming_friday()
    payload = body.model_copy(update={"fridayDate": body.fridayDate or friday})
    entry = _make_entry(payload, session["profile_id"])

    def apply(st: dict[str, Any]) -> None:
        _append_entry(st, entry, session["profile_id"], payload.houseId)

    mutate(apply)
    return {"ok": True, "entry": entry, "fridayDate": friday}


_UNIT_RE = r"(?:kg|g|l|ml|stk|stück|stueck|pkg|pack|liter|l)"


def _normalize_unit(raw: str | None) -> str:
    if not raw:
        return "Stk"
    n = raw.strip().lower()
    if n in {"stk", "stück", "stueck", "st", "pcs"}:
        return "Stk"
    if n in {"kg", "kilo"}:
        return "kg"
    if n == "g":
        return "g"
    if n in {"l", "liter", "litre"}:
        return "L"
    if n == "ml":
        return "ml"
    if n in {"pkg", "pack", "packung"}:
        return "Pkg"
    return raw[:24] or "Stk"


def _parse_ocr_line(line: str) -> dict[str, Any] | None:
    text = line.strip()
    if not text or text.startswith("#"):
        return None

    m = re.match(
        rf"^(.+?)\s+(\d+(?:[.,]\d+)?)\s*({_UNIT_RE})?\s*$",
        text,
        flags=re.IGNORECASE,
    )
    if m:
        return {
            "name": m.group(1).strip()[:80],
            "qty": float(m.group(2).replace(",", ".")),
            "unit": _normalize_unit(m.group(3)),
        }

    m = re.match(
        rf"^(\d+(?:[.,]\d+)?)\s*({_UNIT_RE})?\s+(.+)$",
        text,
        flags=re.IGNORECASE,
    )
    if m:
        return {
            "name": m.group(3).strip()[:80],
            "qty": float(m.group(1).replace(",", ".")),
            "unit": _normalize_unit(m.group(2)),
        }

    return {"name": text[:80], "qty": 1.0, "unit": "Stk"}


@router.post("/ocr")
def shop_ocr(body: OcrBody, request: Request) -> dict[str, Any]:
    require_staff(request)
    items: list[dict[str, Any]] = []
    for line in body.text.splitlines():
        parsed = _parse_ocr_line(line)
        if parsed and parsed.get("qty", 0) > 0:
            items.append(parsed)
    return {"items": items}
