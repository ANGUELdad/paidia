from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field, model_validator

from armonia.auth.security import require_staff
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/entries", tags=["entries"])

ENTRY_KINDS = frozenset({"journal", "incident", "care", "handover", "meeting", "note"})
_MAX_TAGS = 20
_MAX_TAG_LEN = 64
_MAX_BODY = 16_000


class EntryBody(BaseModel):
    kind: str
    houseId: str | None = None
    childProfileId: str | None = None
    tags: list[str] = Field(default_factory=list)
    body: str = Field(min_length=1, max_length=_MAX_BODY)
    attachments: dict[str, Any] | list[Any] | None = None
    clientRef: str | None = None

    @model_validator(mode="before")
    @classmethod
    def reject_client_timestamps(cls, data: Any) -> Any:
        forbidden = {"createdAt", "serverCreatedAt", "updatedAt", "timestamp", "at"}
        if isinstance(data, dict):
            found = forbidden & data.keys()
            if found:
                raise ValueError(f"Client must not supply timestamp fields: {sorted(found)}")
        return data


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def _now_ms() -> int:
    return int(datetime.now(timezone.utc).timestamp() * 1000)


def _match(entry: dict[str, Any], kind: str | None, child_id: str | None, house_id: str | None, q: str | None) -> bool:
    if kind and entry.get("kind") != kind:
        return False
    if child_id and entry.get("childProfileId") != child_id:
        return False
    if house_id and entry.get("houseId") != house_id:
        return False
    if q:
        needle = q.lower()
        if needle not in (entry.get("body") or "").lower():
            if not any(needle in t.lower() for t in (entry.get("tags") or [])):
                return False
    return True


@router.get("")
@router.get("/")
def list_entries(
    request: Request,
    kind: str | None = None,
    childId: str | None = None,
    houseId: str | None = None,
    q: str | None = None,
    limit: int = 50,
) -> dict[str, Any]:
    require_staff(request)
    limit = min(max(1, limit), 200)
    all_entries: list[dict[str, Any]] = list(snapshot().get("entries") or [])
    # active only
    active = [e for e in all_entries if not e.get("archivedAt")]
    # newest first
    active.sort(key=lambda e: e.get("serverCreatedAt") or "", reverse=True)
    filtered = [e for e in active if _match(e, kind, childId, houseId, q)]
    return {"entries": filtered[:limit], "total": len(filtered)}


@router.post("")
@router.post("/")
def create_entry(body: EntryBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    kind = body.kind.strip().lower()
    if kind not in ENTRY_KINDS:
        raise HTTPException(
            status_code=400,
            detail={"code": "bad_kind", "error": f"kind must be one of: {', '.join(sorted(ENTRY_KINDS))}"},
        )
    tags = [t.strip()[:_MAX_TAG_LEN] for t in (body.tags or []) if t.strip()][:_MAX_TAGS]

    # Dedup by clientRef
    if body.clientRef:
        existing_entries = snapshot().get("entries") or []
        for ex in existing_entries:
            if ex.get("clientRef") == body.clientRef:
                return {"ok": True, "entry": ex, "deduplicated": True}

    entry: dict[str, Any] = {
        "id": str(uuid.uuid4()),
        "kind": kind,
        "authorProfileId": session["profile_id"],
        "houseId": body.houseId or None,
        "childProfileId": body.childProfileId or None,
        "tags": tags,
        "body": body.body.strip()[:_MAX_BODY],
        "attachments": body.attachments,
        # Server stamps — never from client
        "serverCreatedAt": _now_iso(),
        "clientRef": body.clientRef or None,
        "archivedAt": None,
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("entries", []).append(entry)
        st.setdefault("auditLog", []).append(
            {
                "at": _now_ms(),
                "type": "ENTRY",
                "profileId": session["profile_id"],
                "text": f"Entry {kind} by {session['profile_id']}",
            }
        )

    mutate(apply)
    return {"ok": True, "entry": entry}


@router.patch("/{entry_id}/archive")
def archive_entry(entry_id: str, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    found: dict[str, Any] | None = None

    def apply(st: dict[str, Any]) -> None:
        nonlocal found
        for e in st.get("entries") or []:
            if e.get("id") == entry_id:
                if e.get("archivedAt"):
                    found = e  # already archived — idempotent
                    return
                e["archivedAt"] = _now_iso()
                e["archivedBy"] = session["profile_id"]
                found = e
                st.setdefault("auditLog", []).append(
                    {
                        "at": _now_ms(),
                        "type": "ENTRY_ARCHIVE",
                        "profileId": session["profile_id"],
                        "text": f"Archived entry {entry_id}",
                    }
                )
                return

    mutate(apply)
    if not found:
        raise HTTPException(status_code=404, detail={"code": "not_found", "error": "Entry not found"})
    return {"ok": True, "entry": found}
