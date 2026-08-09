from __future__ import annotations

import html
import json
import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from armonia.auth.limits import rate_limit
from armonia.auth.security import require_admin, require_session
from armonia.config import get_settings
from armonia.domains.email import email_status, send_email
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/notify", tags=["notify"])


class RulePatch(BaseModel):
    enabled: bool | None = None
    channels: list[str] | None = None


class SubscribeBody(BaseModel):
    endpoint: str | None = None
    keys: dict[str, str] = Field(default_factory=dict)
    subscription: dict[str, Any] | None = None


class BroadcastBody(BaseModel):
    audience: str = "all"
    subject: str = ""
    title: str = ""
    message: str = ""
    body: str = ""
    lang: str = "de"
    alsoPush: bool = True
    channels: list[str] = Field(default_factory=list)


class EmailTestBody(BaseModel):
    to: str = ""
    subject: str = "Armonia Test"
    message: str = "Email delivery is configured."


def _normalize_audience(raw: str) -> str:
    if raw in {"all", "everyone"}:
        return "all"
    if raw in {"staff", "children"}:
        return raw
    return "all"


def _evaluate_due(session: dict[str, Any], state: dict[str, Any]) -> list[dict[str, Any]]:
    rules = {r["kind"]: r for r in (state.get("notificationRules") or []) if r.get("enabled")}
    due: list[dict[str, Any]] = []
    today = time.strftime("%Y-%m-%d")
    pid = session["profile_id"]
    weekday = time.strftime("%A")

    if session.get("mode") == "staff":
        if rules.get("journal_due"):
            note = (state.get("shiftNotes") or {}).get(f"{pid}:{today}")
            if not (note and (note.get("text") or "").strip()):
                due.append(
                    {
                        "kind": "journal_due",
                        "title": "Schichtbuch",
                        "body": "Heute noch eintragen",
                        "url": "/book",
                        "dedupeKey": f"journal:{pid}:{today}",
                    }
                )
        if rules.get("presence_late") or rules.get("shift_start"):
            checkins = [
                c for c in (state.get("shiftCheckins") or []) if c.get("profileId") == pid and c.get("date") == today
            ]
            if not checkins:
                due.append(
                    {
                        "kind": "shift_start",
                        "title": "Schicht",
                        "body": "Ich bin da tippen",
                        "url": "/home",
                        "dedupeKey": f"shift:{pid}:{today}",
                    }
                )
        if rules.get("low_stock"):
            low = sum(1 for q in (state.get("stock") or {}).values() if float(q) <= 2)
            if low:
                due.append(
                    {
                        "kind": "low_stock",
                        "title": "Lager",
                        "body": f"{low} Positionen niedrig",
                        "url": "/stock",
                        "dedupeKey": f"lowstock:{today}",
                    }
                )
        if rules.get("meeting_notes_due"):
            week_key = time.strftime("%G-W%V")
            if not (state.get("meetingNotes") or {}).get(week_key):
                due.append(
                    {
                        "kind": "meeting_notes_due",
                        "title": "Besprechung",
                        "body": "Notizen fehlen",
                        "url": "/talk",
                        "dedupeKey": f"meeting:{week_key}",
                    }
                )
        if rules.get("friday_list") and weekday == "Friday":
            open_items = [e for e in (state.get("listEntries") or []) if e.get("status") != "done"]
            if open_items:
                due.append(
                    {
                        "kind": "friday_list",
                        "title": "Freitagsliste",
                        "body": f"{len(open_items)} offene Positionen",
                        "url": "/shop",
                        "dedupeKey": f"friday:{today}",
                    }
                )
        if rules.get("event_publish"):
            drafts = [e for e in (state.get("events") or []) if e.get("status") == "draft"]
            if drafts:
                due.append(
                    {
                        "kind": "event_publish",
                        "title": "Events",
                        "body": f"{len(drafts)} Entwürfe unveröffentlicht",
                        "url": "/plan",
                        "dedupeKey": f"events-draft:{today}",
                    }
                )
        notice = (state.get("prefs") or {}).get("_teamNotice")
        if rules.get("broadcast") and notice:
            due.append(
                {
                    "kind": "broadcast",
                    "title": notice.get("title") or "Broadcast",
                    "body": notice.get("subject") or "",
                    "url": "/home",
                    "dedupeKey": f"broadcast:{notice.get('id')}",
                }
            )
    else:
        if rules.get("child_event"):
            events = [
                e
                for e in (state.get("events") or [])
                if e.get("status") == "published"
                and e.get("audience") in {"children", "all"}
                and e.get("date", "") >= today
            ]
            if events:
                due.append(
                    {
                        "kind": "child_event",
                        "title": "Event",
                        "body": events[0].get("title") or "Neues Event",
                        "url": "/kids",
                        "dedupeKey": f"child-event:{events[0].get('id')}",
                    }
                )
    return due


@router.get("/rules")
def list_rules(request: Request) -> dict[str, Any]:
    require_admin(request)
    rules = snapshot().get("notificationRules") or []
    enriched = [
        {
            **r,
            "type": r.get("kind"),
            "label": (r.get("kind") or "").replace("_", " ").title(),
        }
        for r in rules
    ]
    return {"rules": enriched}


@router.patch("/rules/{rule_id}")
def patch_rule(rule_id: str, body: RulePatch, request: Request) -> dict[str, Any]:
    require_admin(request)

    def apply(st: dict[str, Any]) -> None:
        for rule in st.get("notificationRules") or []:
            if rule.get("id") == rule_id:
                if body.enabled is not None:
                    rule["enabled"] = body.enabled
                if body.channels is not None:
                    rule["channels"] = body.channels
                rule["updatedAt"] = int(time.time() * 1000)

    mutate(apply)
    rules = snapshot().get("notificationRules") or []
    return {"ok": True, "rule": next((r for r in rules if r.get("id") == rule_id), None)}


@router.post("/subscribe")
def subscribe(body: SubscribeBody, request: Request) -> dict[str, Any]:
    session = require_session(request)
    sub = body.subscription or {}
    endpoint = body.endpoint or sub.get("endpoint")
    keys = body.keys or sub.get("keys") or {}
    if not endpoint:
        raise HTTPException(status_code=400, detail={"code": "missing_endpoint"})

    def apply(st: dict[str, Any]) -> None:
        subs = st.setdefault("pushSubscriptions", [])
        subs[:] = [s for s in subs if s.get("endpoint") != endpoint]
        subs.append(
            {
                "endpoint": endpoint,
                "keys": keys,
                "profileId": session["profile_id"],
                "mode": session["mode"],
                "at": int(time.time() * 1000),
            }
        )

    mutate(apply)
    return {"ok": True}


@router.get("/evaluate")
@router.post("/evaluate")
def evaluate(request: Request) -> dict[str, Any]:
    session = require_session(request)
    state = snapshot()
    due = _evaluate_due(session, state)
    settings = get_settings()
    return {
        "due": due,
        "webPushConfigured": bool(settings.vapid_public_key) or bool(state.get("pushSubscriptions")),
    }


def _try_send_web_push(subs: list[dict[str, Any]], payload: dict[str, Any]) -> int:
    settings = get_settings()
    if not settings.vapid_private_key or not settings.vapid_public_key:
        return 0
    try:
        from pywebpush import webpush  # type: ignore
    except Exception:
        return 0
    sent = 0
    data = json.dumps(payload)
    for sub in subs[:40]:
        try:
            webpush(
                subscription_info={"endpoint": sub["endpoint"], "keys": sub.get("keys") or {}},
                data=data,
                vapid_private_key=settings.vapid_private_key,
                vapid_claims={"sub": settings.vapid_subject},
            )
            sent += 1
        except Exception:
            continue
    return sent


@router.get("/email/status")
def notify_email_status(request: Request) -> dict[str, Any]:
    require_admin(request)
    return email_status()


@router.post("/email/test")
def notify_email_test(body: EmailTestBody, request: Request) -> dict[str, Any]:
    session = require_admin(request)
    profile = (snapshot().get("profiles") or {}).get(session["profile_id"]) or {}
    to = (body.to or profile.get("email") or "").strip()
    status = email_status()
    if status.get("configured") and not to:
        raise HTTPException(status_code=400, detail={"code": "missing_recipient", "error": "Email recipient required"})
    message = body.message.strip() or "Email delivery is configured."
    result = send_email(
        to,
        body.subject.strip() or "Armonia Test",
        html=f"<p>{html.escape(message)}</p>",
        text=message,
    )
    return {**result, "to": to or None, "status": status}


@router.post("/broadcast")
def broadcast(body: BroadcastBody, request: Request) -> dict[str, Any]:
    session = require_admin(request)
    rate_limit(request, key="broadcast", limit=6, window_sec=max(30, get_settings().broadcast_cooldown))
    message = (body.message or body.body or "").strip()
    subject = body.subject.strip()
    if not subject or not message:
        raise HTTPException(status_code=400, detail={"code": "missing_fields"})
    audience = _normalize_audience(body.audience)
    profiles = list((snapshot().get("profiles") or {}).values())
    if audience == "staff":
        profiles = [p for p in profiles if p.get("mode") == "staff"]
    elif audience == "children":
        profiles = [p for p in profiles if p.get("mode") == "child"]
    if len(profiles) > get_settings().broadcast_max:
        profiles = profiles[: get_settings().broadcast_max]
    delivery_id = uuid.uuid4().hex[:12]
    also_push = body.alsoPush or "push" in body.channels
    also_email = "email" in body.channels

    def apply(st: dict[str, Any]) -> None:
        st.setdefault("auditLog", []).append(
            {
                "at": int(time.time() * 1000),
                "type": "BROADCAST",
                "profileId": session["profile_id"],
                "text": f"Broadcast {audience}: {subject}",
            }
        )
        st.setdefault("prefs", {})
        st["prefs"]["_teamNotice"] = {
            "id": delivery_id,
            "audience": audience,
            "subject": subject[:160],
            "title": (body.title or subject).strip()[:120],
            "message": message[:4000],
            "at": int(time.time() * 1000),
        }

    mutate(apply)
    push_sent = 0
    if also_push:
        subs = list(snapshot().get("pushSubscriptions") or [])
        if audience == "staff":
            subs = [s for s in subs if s.get("mode") == "staff"]
        elif audience == "children":
            subs = [s for s in subs if s.get("mode") == "child"]
        push_url = "/kids" if audience == "children" else "/home"
        push_sent = _try_send_web_push(
            subs,
            {"title": subject, "body": message[:180], "url": push_url, "dedupeKey": f"broadcast:{delivery_id}"},
        )
    email_attempted = 0
    email_queued = 0
    email_failed = 0
    email_reason: str | None = None
    if also_email:
        escaped_subject = html.escape(subject)
        escaped_message = html.escape(message).replace("\n", "<br>")
        email_html = f"<h1>{escaped_subject}</h1><p>{escaped_message}</p>"
        for profile in profiles:
            to = (profile.get("email") or "").strip()
            if not to:
                continue
            email_attempted += 1
            result = send_email(to, subject, html=email_html, text=message)
            if result.get("queued"):
                email_queued += 1
            else:
                email_failed += 1
                email_reason = email_reason or str(result.get("reason") or "send_failed")
    return {
        "ok": True,
        "sent": len(profiles),
        "failed": email_failed,
        "audience": audience,
        "deliveryId": delivery_id,
        "pushQueued": also_push,
        "pushSent": push_sent,
        "email": {
            "requested": also_email,
            "attempted": email_attempted,
            "queued": email_queued,
            "failed": email_failed,
            "reason": email_reason,
        },
        "preview": f"[{audience}] {subject}: {message[:120]}",
    }
