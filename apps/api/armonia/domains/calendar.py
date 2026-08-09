"""Calendar events, ICS export, and reminder scheduling."""

from __future__ import annotations

import hashlib
import secrets
import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel, Field

from armonia.auth.limits import rate_limit
from armonia.auth.security import require_admin, require_session, require_staff
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/calendar", tags=["calendar"])


class EventBody(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    date: str
    startTime: str = "10:00"
    endTime: str = "11:00"
    audience: str = "staff"  # staff|children|all
    status: str = "draft"  # draft|published
    location: str = ""
    notes: str = ""
    remindMinutes: list[int] = Field(default_factory=lambda: [60, 15])


class ReminderBody(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    at: str  # ISO datetime local
    url: str = "/home"
    kind: str = "custom"


class FeedBody(BaseModel):
    mode: str = "staff"  # staff|child
    name: str = "Armonia calendar"


class FeedRotateBody(BaseModel):
    token: str = Field(min_length=8, max_length=200)


def _ics_escape(text: str) -> str:
    return (text or "").replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n")


def _to_ics(events: list[dict[str, Any]]) -> str:
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Armonia Thassos//Platform//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
    ]
    for e in events:
        date = (e.get("date") or "").replace("-", "")
        st = (e.get("startTime") or "10:00").replace(":", "")
        et = (e.get("endTime") or "11:00").replace(":", "")
        uid = e.get("id") or uuid.uuid4().hex
        lines.extend(
            [
                "BEGIN:VEVENT",
                f"UID:{uid}@armonia.local",
                f"DTSTAMP:{time.strftime('%Y%m%dT%H%M%SZ', time.gmtime())}",
                f"DTSTART:{date}T{st}00",
                f"DTEND:{date}T{et}00",
                f"SUMMARY:{_ics_escape(e.get('title') or 'Event')}",
                f"DESCRIPTION:{_ics_escape(e.get('notes') or '')}",
                f"LOCATION:{_ics_escape(e.get('location') or 'Armonia Villas')}",
                "END:VEVENT",
            ]
        )
        for mins in e.get("remindMinutes") or [60]:
            lines.extend(
                [
                    "BEGIN:VALARM",
                    "ACTION:DISPLAY",
                    f"DESCRIPTION:Reminder: {_ics_escape(e.get('title') or '')}",
                    f"TRIGGER:-PT{int(mins)}M",
                    "END:VALARM",
                ]
            )
    lines.append("END:VCALENDAR")
    return "\r\n".join(lines) + "\r\n"


def _child_visible_event(event: dict[str, Any]) -> bool:
    return event.get("status") == "published" and event.get("audience") in {"children", "all"}


def _feed_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


@router.get("/events")
def list_events(request: Request, fromDate: str | None = None, audience: str | None = None) -> dict[str, Any]:
    session = require_session(request)
    events = list(snapshot().get("events") or [])
    if session.get("mode") == "child":
        events = [e for e in events if _child_visible_event(e)]
    elif audience:
        events = [e for e in events if e.get("audience") in {audience, "all"}]
    if fromDate:
        events = [e for e in events if (e.get("date") or "") >= fromDate]
    events.sort(key=lambda e: (e.get("date") or "", e.get("startTime") or ""))
    return {"events": events}


@router.post("/events")
def create_event(body: EventBody, request: Request) -> dict[str, Any]:
    session = require_admin(request)
    rate_limit(request, key="calendar", limit=40, window_sec=60)
    if body.status not in {"draft", "published"}:
        raise HTTPException(status_code=400, detail={"code": "bad_status"})
    event = {
        "id": f"ev_{uuid.uuid4().hex[:10]}",
        "title": body.title.strip(),
        "date": body.date,
        "startTime": body.startTime,
        "endTime": body.endTime,
        "audience": body.audience if body.audience in {"staff", "children", "all"} else "staff",
        "status": body.status,
        "location": body.location.strip()[:120],
        "notes": body.notes.strip()[:2000],
        "remindMinutes": [int(m) for m in body.remindMinutes[:4] if int(m) > 0],
        "at": int(time.time() * 1000),
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("events", []).append(event)
        st.setdefault("auditLog", []).append(
            {
                "at": event["at"],
                "type": "EVENT",
                "profileId": session["profile_id"],
                "text": f"Event {event['title']} {event['date']}",
            }
        )

    mutate(apply)
    return {"ok": True, "event": event}


@router.post("/events/{event_id}/publish")
def publish_event(event_id: str, request: Request) -> dict[str, Any]:
    require_admin(request)

    def apply(st: dict[str, Any]) -> None:
        for e in st.get("events") or []:
            if e.get("id") == event_id:
                e["status"] = "published"
                e["publishedAt"] = int(time.time() * 1000)

    mutate(apply)
    return {"ok": True}


@router.get("/ics")
def export_ics(request: Request, eventId: str | None = None) -> Response:
    session = require_session(request)
    events = list(snapshot().get("events") or [])
    if eventId:
        events = [e for e in events if e.get("id") == eventId]
    if session.get("mode") == "child":
        events = [e for e in events if _child_visible_event(e)]
    else:
        events = [e for e in events if e.get("status") in {"published", "draft"}]
    body = _to_ics(events)
    return Response(
        content=body,
        media_type="text/calendar; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="armonia.ics"'},
    )


@router.post("/feed")
def create_feed(body: FeedBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    rate_limit(request, key="calendar-feed-mint", limit=12, window_sec=60)
    token = secrets.token_urlsafe(32)
    digest = _feed_hash(token)
    now_ms = int(time.time() * 1000)
    mode = "child" if body.mode in {"child", "children"} else "staff"
    feed = {
        "id": f"cf_{digest[:12]}",
        "hash": digest,
        "mode": mode,
        "name": body.name.strip()[:80] or "Armonia calendar",
        "createdBy": session["profile_id"],
        "createdAt": now_ms,
        "lastUsedAt": None,
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("calendarFeeds", {})[digest] = feed
        st.setdefault("auditLog", []).append(
            {
                "at": now_ms,
                "type": "CALENDAR_FEED",
                "profileId": session["profile_id"],
                "text": f"Calendar feed {mode}",
            }
        )

    mutate(apply)
    public_feed = {k: v for k, v in feed.items() if k != "hash"}
    url = str(request.base_url).rstrip("/") + f"/api/calendar/feed/{token}.ics"
    webcal = url.replace("https://", "webcal://").replace("http://", "webcal://")
    return {"ok": True, "token": token, "url": url, "webcalUrl": webcal, "feed": public_feed}


@router.post("/feed/rotate")
def rotate_calendar_feed(body: FeedRotateBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    rate_limit(request, key="calendar-feed-rotate", limit=12, window_sec=60)
    old_digest = _feed_hash(body.token.strip())
    state = snapshot()
    old = (state.get("calendarFeeds") or {}).get(old_digest)
    if not old or old.get("createdBy") != session["profile_id"]:
        raise HTTPException(status_code=404, detail={"code": "feed_not_found"})
    token = secrets.token_urlsafe(32)
    digest = _feed_hash(token)
    now_ms = int(time.time() * 1000)
    feed = {
        "id": f"cf_{digest[:12]}",
        "hash": digest,
        "mode": old.get("mode") or "staff",
        "name": old.get("name") or "Armonia calendar",
        "createdBy": session["profile_id"],
        "createdAt": now_ms,
        "lastUsedAt": None,
        "rotatedFrom": old.get("id"),
    }

    def apply(st: dict[str, Any]) -> None:
        feeds = st.setdefault("calendarFeeds", {})
        feeds.pop(old_digest, None)
        feeds[digest] = feed
        st.setdefault("auditLog", []).append(
            {
                "at": now_ms,
                "type": "CALENDAR_FEED_ROTATE",
                "profileId": session["profile_id"],
                "text": "Rotated calendar feed",
            }
        )

    mutate(apply)
    url = str(request.base_url).rstrip("/") + f"/api/calendar/feed/{token}.ics"
    webcal = url.replace("https://", "webcal://").replace("http://", "webcal://")
    public_feed = {k: v for k, v in feed.items() if k != "hash"}
    return {"ok": True, "token": token, "url": url, "webcalUrl": webcal, "feed": public_feed}


@router.get("/feed/{token}.ics")
def public_feed_ics(token: str, request: Request) -> Response:
    rate_limit(request, key="calendar-feed", limit=60, window_sec=60)
    digest = _feed_hash(token)
    state = snapshot()
    feed = (state.get("calendarFeeds") or {}).get(digest)
    if not feed:
        raise HTTPException(status_code=404, detail={"code": "feed_not_found"})
    events = list(state.get("events") or [])
    if feed.get("mode") == "child":
        events = [e for e in events if _child_visible_event(e)]
    else:
        events = [e for e in events if e.get("status") in {"published", "draft"}]
    events.sort(key=lambda e: (e.get("date") or "", e.get("startTime") or ""))
    now_ms = int(time.time() * 1000)

    def apply(st: dict[str, Any]) -> None:
        row = (st.get("calendarFeeds") or {}).get(digest)
        if row:
            row["lastUsedAt"] = now_ms

    mutate(apply)
    body = _to_ics(events)
    filename = "armonia-kids.ics" if feed.get("mode") == "child" else "armonia.ics"
    return Response(
        content=body,
        media_type="text/calendar; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/reminders")
def list_reminders(request: Request) -> dict[str, Any]:
    session = require_session(request)
    state = snapshot()
    pid = session["profile_id"]
    personal = [r for r in (state.get("reminders") or []) if r.get("profileId") == pid]
    # Due from notify engine + calendar upcoming
    today = time.strftime("%Y-%m-%d")
    cal = []
    for e in state.get("events") or []:
        if e.get("date", "") < today:
            continue
        if session.get("mode") == "child" and not _child_visible_event(e):
            continue
        cal.append(
            {
                "id": f"cal:{e.get('id')}",
                "title": e.get("title"),
                "at": f"{e.get('date')}T{e.get('startTime') or '10:00'}",
                "url": "/plan",
                "kind": "calendar",
                "remindMinutes": e.get("remindMinutes") or [60],
            }
        )
    return {"reminders": personal, "calendar": cal[:20]}


@router.post("/reminders")
def add_reminder(body: ReminderBody, request: Request) -> dict[str, Any]:
    session = require_staff(request)
    rate_limit(request, key="reminders", limit=30, window_sec=60)
    row = {
        "id": f"rm_{uuid.uuid4().hex[:10]}",
        "profileId": session["profile_id"],
        "title": body.title.strip(),
        "at": body.at,
        "url": body.url[:120] or "/home",
        "kind": body.kind[:40],
        "createdAt": int(time.time() * 1000),
    }

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("reminders", []).append(row)

    mutate(apply)
    return {"ok": True, "reminder": row}


@router.delete("/reminders/{reminder_id}")
def delete_reminder(reminder_id: str, request: Request) -> dict[str, Any]:
    session = require_session(request)

    def apply(st: dict[str, Any]) -> None:
        st["reminders"] = [
            r
            for r in (st.get("reminders") or [])
            if not (r.get("id") == reminder_id and r.get("profileId") == session["profile_id"])
        ]

    mutate(apply)
    return {"ok": True}


@router.get("/google-link")
def google_link(request: Request, eventId: str) -> dict[str, Any]:
    """Build Google Calendar template URL (no OAuth required)."""
    session = require_session(request)
    event = next((e for e in (snapshot().get("events") or []) if e.get("id") == eventId), None)
    if not event:
        raise HTTPException(status_code=404, detail={"code": "not_found"})
    if session.get("mode") == "child" and not _child_visible_event(event):
        raise HTTPException(status_code=403, detail={"code": "forbidden", "error": "Event not visible"})
    date = (event.get("date") or "").replace("-", "")
    st = (event.get("startTime") or "10:00").replace(":", "")
    et = (event.get("endTime") or "11:00").replace(":", "")
    from urllib.parse import quote

    title = quote(event.get("title") or "Armonia")
    details = quote(event.get("notes") or "")
    location = quote(event.get("location") or "Armonia Villas, Thassos")
    url = (
        "https://calendar.google.com/calendar/render?action=TEMPLATE"
        f"&text={title}&dates={date}T{st}00/{date}T{et}00"
        f"&details={details}&location={location}"
    )
    return {"url": url, "event": event}
