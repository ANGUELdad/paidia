from __future__ import annotations

import hashlib
import json
import random
import time
import uuid
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from armonia.auth.security import require_session, verify_pin
from armonia.config import get_settings
from armonia.store import mutate, snapshot

router = APIRouter(prefix="/api/zoai", tags=["zoai"])

KNOWLEDGE_DIR = Path(__file__).resolve().parents[4] / "knowledge" / "zoai"
ACTIONS_HELP = """
Emit optional JSON actions in a fenced block:
```paidia-action
[{"type":"stock_adjust","houseId":"h1","productQuery":"Milch","dir":"IN","qty":2},
 {"type":"shop_add","houseId":"h1","name":"Reis","qty":1},
 {"type":"schedule_add","date":"2026-08-10","block":"morning","activity":"Betreuung","houseIds":["h1"]},
 {"type":"broadcast_email","audience":"staff","subject":"Hinweis","message":"..."}]
```
Staff/admin only. Never invent PINs. Child: no actions. Schedule/broadcast need Confirm + PIN.
When the user asks how/where to do something, also answer with a concrete UI path (Heute, Plan, Lager, Zo-Ai).
"""

PIN_ACTIONS = {"schedule_add", "broadcast_email", "event_announce"}

GUIDE_RULES: list[tuple[str, dict[str, str]]] = [
    (r"schichtbuch|\bbuch\b|journal|audit", {
        "href": "/book", "spotlight": "tour-book", "title": "Schichtbuch",
        "body": "Pflicht-Eintrag für die Schicht. Audit zeigt, was passiert ist.",
    }),
    (r"(?<!\w)schicht(?!buch)|präsenz|anwesend|check.?in|zu\s*spät|verspät|\bstarte?\b", {
        "href": "/home", "spotlight": "tour-presence", "title": "Schicht starten",
        "body": "Oben auf Heute: „Schicht starten“ oder Verspätung. Läuft die Schicht schon: Übergabe / Tagesplan.",
    }),
    (r"jetzt\s*wichtig|was\s*jetzt|nächste\s*aufgabe", {
        "href": "/home", "spotlight": "tour-now", "title": "Jetzt",
        "body": "Die wichtigste nächste Aufgabe — zuerst erledigen.",
    }),
    (r"wochenplan|tagesplan|\bplan\b|schedule|block", {
        "href": "/plan", "spotlight": "tour-plan", "title": "Wochenplan",
        "body": "Tag wählen, Blöcke prüfen. Änderungen brauchen Confirm + PIN.",
    }),
    (r"lager|bestand|vorrat|milch|stock", {
        "href": "/stock", "spotlight": "tour-stock", "title": "Lager",
        "body": "＋/− Bestand. Niedrige Artikel auf die Einkaufsliste setzen.",
    }),
    (r"einkauf|liste|shop|einkaufen", {
        "href": "/shop", "spotlight": "tour-shop", "title": "Einkaufsliste",
        "body": "Vorschläge prüfen — immer bestätigen, nie automatisch.",
    }),
    (r"zo.?ai|assistent", {
        "href": "/zoai", "spotlight": "tour-zoai", "title": "Zo-Ai",
        "body": "Frag auf Deutsch oder Griechisch. Aktionen nur nach Confirm.",
    }),
    (r"\btalk\b|chat|besprechung", {
        "href": "/talk", "spotlight": "tour-talk", "title": "Talk",
        "body": "Team-Chat und Besprechungsnotizen der ISO-Woche.",
    }),
    (r"kalender|termin|ics", {
        "href": "/calendar", "spotlight": "tour-cal", "title": "Kalender",
        "body": "Termine, ICS und Erinnerungen.",
    }),
]


def _infer_guide(user_text: str) -> dict[str, str] | None:
    import re

    q = (user_text or "").strip()
    if not q:
        return None
    # Only for how-to / where questions — never hijack action asks ("Milch auf Liste").
    how = re.search(r"wie|how|wo\s*(finde|sehe|öffne)|zeig\s+mir|erklä|help|hilfe|\?", q, re.I)
    if not how:
        return None
    for pattern, target in GUIDE_RULES:
        if re.search(pattern, q, re.I):
            return dict(target)
    return {
        "href": "/home",
        "spotlight": "tour-home",
        "title": "Heute",
        "body": "Dein Tagesstart: Präsenz, was jetzt zählt, und Zo-Ai fragen.",
    }


class ChatBody(BaseModel):
    messages: list[dict[str, str]] = Field(default_factory=list)
    text: str | None = None
    voice: bool = False
    context: dict[str, Any] = Field(default_factory=dict)


class ApplyBody(BaseModel):
    actions: list[dict[str, Any]] = Field(default_factory=list)
    action: dict[str, Any] | None = None
    pin: str | None = None


def _offline_action_hint(user_text: str, role: str) -> tuple[str, list[dict[str, Any]]]:
    """Deterministic offline helpers so actionable asks still get confirm cards."""
    import re

    q = (user_text or "").strip()
    if role == "child":
        return (f"Offline: Ich kann gerade nur erklären. Frage: „{q[:80]}“", [])
    m = re.search(
        r"(?:setz|füg|add|auf\s+(?:die\s+)?liste|einkauf)[^\w]{0,12}([A-Za-zÄÖÜäöüß][\wÄÖÜäöüß\-]{1,40})"
        r"|([A-Za-zÄÖÜäöüß][\wÄÖÜäöüß\-]{1,40})\s+(?:auf\s+(?:die\s+)?liste|zum\s+einkauf)",
        q,
        re.I,
    )
    if m:
        name = (m.group(1) or m.group(2) or "").strip()
        if name and name.lower() not in {"bitte", "mal", "etwas", "was"}:
            action = {"type": "shop_add", "houseId": "h1", "name": name.capitalize(), "qty": 1}
            return (
                f"Offline-Vorschlag: „{name.capitalize()}“ auf die Einkaufsliste — bitte bestätigen.",
                [action],
            )
    return (
        f"Offline: Für „{q[:80]}“ — öffne Lager/Liste und bestätige selbst. ({uuid.uuid4().hex[:6]})",
        [],
    )


def _read_knowledge(role: str) -> str:
    parts: list[str] = []
    for name in ("overview.md", f"{role}.md", "actions.md"):
        path = KNOWLEDGE_DIR / name
        if not path.exists():
            continue
        if name == "actions.md" and role == "child":
            continue
        parts.append(path.read_text(encoding="utf-8")[:1400])
    settings = get_settings()
    return "\n\n".join(parts)[: settings.zoai_knowledge_chars]


def _fresh_seed(user_text: str) -> str:
    h = hashlib.sha256(f"{time.time_ns()}:{user_text}:{random.random()}".encode()).hexdigest()[:12]
    angles = [
        "Open with a concrete next step, not a greeting cliché.",
        "Use a Thassos/pine metaphor once, lightly.",
        "Lead with the risk if they do nothing.",
        "Ask one sharp clarifying question only if needed.",
        "Celebrate a small win if context shows progress.",
    ]
    return f"Variety seed {h}. {random.choice(angles)}"


def _omni_reachable() -> bool:
    settings = get_settings()
    try:
        import urllib.request

        req = urllib.request.Request(f"{settings.omniroute_base_url.rstrip('/')}/v1/models", method="GET")
        with urllib.request.urlopen(req, timeout=0.45) as resp:
            return 200 <= resp.status < 500
    except Exception:
        return False


def _omni_models() -> list[str]:
    settings = get_settings()
    preferred = [m.strip() for m in (settings.omniroute_models or "").split(",") if m.strip()]
    discovered: list[str] = []
    try:
        import urllib.request

        req = urllib.request.Request(f"{settings.omniroute_base_url.rstrip('/')}/v1/models", method="GET")
        with urllib.request.urlopen(req, timeout=1.2) as resp:
            data = json.loads(resp.read())
        for row in data.get("data") or []:
            mid = row.get("id")
            if isinstance(mid, str) and mid:
                discovered.append(mid)
    except Exception:
        pass
    # Prefer free / fast open models when Omni lists them
    free_bias = [m for m in discovered if any(x in m.lower() for x in ("free", "llama", "gemma", "qwen", "mistral", "gpt-oss"))]
    ordered: list[str] = []
    for m in preferred + free_bias + discovered + [settings.chat_model]:
        if m and m not in ordered:
            ordered.append(m)
    return ordered[:8] or [settings.chat_model]


def _post_chat(url: str, key: str, model: str, messages: list[dict[str, str]], timeout: float = 45) -> str:
    import urllib.error
    import urllib.request

    body = {
        "model": model,
        "messages": messages,
        "temperature": 0.92,
        "max_tokens": 900,
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read())
    return data["choices"][0]["message"]["content"]


def _llm_chat(messages: list[dict[str, str]]) -> tuple[str, str]:
    """Forever chain: OmniRoute (multi free models) → Groq → OpenRouter free → fail."""
    settings = get_settings()
    errors: list[str] = []

    # 1) OmniRoute — try several free/local models
    if settings.llm_provider in {"auto", "omniroute"} and _omni_reachable():
        url = f"{settings.omniroute_base_url.rstrip('/')}/v1/chat/completions"
        for model in _omni_models():
            try:
                content = _post_chat(url, settings.omniroute_api_key or "local", model, messages, timeout=35)
                return content, f"omniroute:{model}"
            except Exception as exc:
                errors.append(f"omni:{model}:{str(exc)[:60]}")
                continue

    # 2) Groq
    if settings.llm_provider in {"auto", "groq"} and settings.groq_api_key:
        try:
            content = _post_chat(
                "https://api.groq.com/openai/v1/chat/completions",
                settings.groq_api_key,
                settings.groq_model or "openai/gpt-oss-120b",
                messages,
            )
            return content, "groq"
        except Exception as exc:
            errors.append(f"groq:{str(exc)[:60]}")

    # 3) OpenRouter free models (optional key)
    if settings.llm_provider in {"auto", "openrouter"} and settings.openrouter_api_key:
        for model in [
            m.strip()
            for m in (settings.openrouter_models or "meta-llama/llama-3.3-70b-instruct:free,google/gemma-2-9b-it:free").split(",")
            if m.strip()
        ]:
            try:
                content = _post_chat(
                    "https://openrouter.ai/api/v1/chat/completions",
                    settings.openrouter_api_key,
                    model,
                    messages,
                    timeout=40,
                )
                return content, f"openrouter:{model}"
            except Exception as exc:
                errors.append(f"or:{model}:{str(exc)[:40]}")
                continue

    raise RuntimeError("missing_llm_key" if not errors else f"all_providers_failed:{';'.join(errors)[:180]}")


def _parse_actions(text: str, role: str) -> list[dict[str, Any]]:
    if role == "child":
        return []
    marker = "```paidia-action"
    if marker not in text:
        return []
    try:
        chunk = text.split(marker, 1)[1].split("```", 1)[0].strip()
        data = json.loads(chunk)
        if isinstance(data, dict):
            data = [data]
        allowed = {
            "stock_adjust",
            "stock_set",
            "shop_add",
            "shop_remove",
            "want_bought",
            "broadcast_email",
            "event_announce",
            "open_tab",
            "schedule_add",
        }
        out = []
        for item in data[:8]:
            if isinstance(item, dict) and item.get("type") in allowed:
                payload = {k: v for k, v in item.items() if k != "type"}
                out.append({"type": item["type"], "payload": payload, **payload})
        return out
    except Exception:
        return []


def _normalize_action(action: dict[str, Any]) -> dict[str, Any]:
    payload = dict(action.get("payload") or {})
    kind = action.get("type") or payload.get("type")
    merged = {**payload, **{k: v for k, v in action.items() if k not in {"type", "payload"}}}
    return {"type": kind, **merged}


@router.post("/chat")
def chat(body: ChatBody, request: Request) -> dict[str, Any]:
    from armonia.auth.limits import rate_limit

    rate_limit(request, key="ai", limit=40, window_sec=60)
    session = require_session(request)
    role = "admin" if session.get("admin") else ("child" if session.get("mode") == "child" else "staff")
    messages = list(body.messages or [])
    if body.text and body.text.strip():
        messages.append({"role": "user", "content": body.text.strip()})
    user_text = ""
    for m in reversed(messages):
        if m.get("role") == "user":
            user_text = m.get("content") or ""
            break
    seed = _fresh_seed(user_text)
    knowledge = _read_knowledge(role)
    recent = snapshot().get("zoaiRecent") or []
    anti = ", ".join(recent[-5:]) if recent else "none"
    system = (
        f"You are Zo-Ai for Armonia Thassos (DE/EL bilingual care-ops). Role={role}. "
        f"{seed} Avoid repeating: {anti}. Voice={body.voice}. "
        f"{ACTIONS_HELP}\n\n## Knowledge\n{knowledge}"
    )
    llm_messages = [{"role": "system", "content": system}]
    for m in messages[-10:]:
        if m.get("role") in {"user", "assistant"} and m.get("content"):
            llm_messages.append({"role": m["role"], "content": m["content"][:4000]})
    try:
        content, provider = _llm_chat(llm_messages)
    except RuntimeError as exc:
        msg = str(exc)
        if msg == "missing_llm_key" or msg.startswith("all_providers_failed"):
            hint, offline_actions = _offline_action_hint(user_text or "", role)
            guide = _infer_guide(user_text or "")
            if offline_actions:
                content = hint
            elif guide:
                content = (
                    f"{guide.get('title')}: {guide.get('body')} "
                    "Tippe „Zeig mir auf dem Bildschirm“, dann folge dem markierten Bereich."
                )
            elif hint:
                content = hint
            else:
                content = (
                    f"Offline: Für „{(user_text or '')[:80]}“ — nutze Heute, Plan, Lager oder Liste. "
                    f"Frag mit „Wie…?“, dann führe ich dich. ({uuid.uuid4().hex[:5]})"
                )
            provider = "offline"
            actions = offline_actions if role != "child" else []
            visible = content

            def apply_offline(st: dict[str, Any]) -> None:
                recent_list = st.setdefault("zoaiRecent", [])
                recent_list.append(visible[:80])
                st["zoaiRecent"] = recent_list[-20:]

            mutate(apply_offline)
            return {
                "message": visible,
                "reply": visible,
                "actions": actions,
                "guide": guide,
                "provider": provider,
                "role": role,
                "varietySeed": seed.split(".", 1)[0].replace("Variety seed ", ""),
            }
        else:
            raise HTTPException(status_code=502, detail={"code": "provider"}) from exc
    except Exception as exc:
        # Soft-fail forever: never leave staff without a reply
        content = (
            f"Zo-Ai Fallback: ich konnte gerade kein Modell erreichen. "
            f"Für „{(user_text or '')[:70]}“ — nutze Lager, Liste oder Plan manuell. ({uuid.uuid4().hex[:5]})"
        )
        provider = "offline"
        _ = exc

    actions = _parse_actions(content, role)
    visible = content.split("```paidia-action")[0].strip() or content
    guide = _infer_guide(user_text or "")

    def apply(st: dict[str, Any]) -> None:
        recent_list = st.setdefault("zoaiRecent", [])
        recent_list.append(visible[:80])
        st["zoaiRecent"] = recent_list[-20:]

    mutate(apply)
    return {
        "message": visible,
        "reply": visible,
        "actions": actions,
        "guide": guide,
        "provider": provider,
        "role": role,
        "varietySeed": seed.split(".", 1)[0].replace("Variety seed ", ""),
    }


def _finite_qty(raw: Any, default: float = 1.0, *, lo: float = 0.0, hi: float = 9999.0) -> float | None:
    try:
        qty = float(raw if raw is not None else default)
    except (TypeError, ValueError):
        return None
    if qty != qty or qty in (float("inf"), float("-inf")):  # NaN/inf
        return None
    if qty < lo or qty > hi:
        return None
    return qty


@router.post("/apply")
def apply_actions(body: ApplyBody, request: Request) -> dict[str, Any]:
    session = require_session(request)
    if session.get("mode") != "staff":
        raise HTTPException(status_code=403, detail={"code": "staff_required"})
    actions = list(body.actions or [])
    if body.action:
        actions.append(body.action)
    if not actions:
        return {"ok": False, "error": "no_actions"}

    normalized = [_normalize_action(a) for a in actions[:10]]
    if any(a.get("type") == "broadcast_email" for a in normalized) and not session.get("admin"):
        raise HTTPException(status_code=403, detail={"code": "admin_required", "error": "Broadcast requires admin"})

    needs_pin = any(a.get("type") in PIN_ACTIONS for a in normalized)
    if needs_pin:
        profile = (snapshot().get("profiles") or {}).get(session["profile_id"]) or {}
        if not body.pin or not verify_pin(profile.get("pinHash"), body.pin, profile.get("pin")):
            raise HTTPException(status_code=401, detail={"code": "pin_required", "error": "PIN required"})

    applied = 0
    errors: list[str] = []

    def apply(st: dict[str, Any]) -> None:
        nonlocal applied
        from armonia.domains.schedule import BLOCKS, validate_day

        for action in normalized:
            kind = action.get("type")
            if kind == "shop_add":
                qty = _finite_qty(action.get("qty"), 1.0, lo=0.001, hi=9999.0)
                if qty is None:
                    errors.append("bad_qty")
                    continue
                st.setdefault("listEntries", []).append(
                    {
                        "id": f"li_{uuid.uuid4().hex[:8]}",
                        "houseId": str(action.get("houseId") or "h1")[:32],
                        "name": str(action.get("name") or action.get("productQuery") or "Item")[:120],
                        "qty": qty,
                        "unit": str(action.get("unit") or "Stk")[:24],
                        "status": "open",
                        "by": session["profile_id"],
                        "at": int(time.time() * 1000),
                    }
                )
                applied += 1
            elif kind in {"stock_adjust", "stock_set"}:
                products = st.get("products") or []
                q = str(action.get("productQuery") or action.get("productId") or "").lower()
                pid = action.get("productId")
                if not pid:
                    for p in products:
                        name = p.get("name") or {}
                        label = f"{name.get('de', '')} {name.get('el', '')} {p.get('id')}".lower()
                        if q and q in label:
                            pid = p["id"]
                            break
                if not pid:
                    errors.append("product_not_found")
                    continue
                qty = _finite_qty(action.get("qty"), 0.0, lo=0.0, hi=99999.0)
                if qty is None:
                    errors.append("bad_qty")
                    continue
                key = f"{action.get('houseId') or 'h1'}:{pid}"
                cur = float((st.get("stock") or {}).get(key) or 0)
                if kind == "stock_set":
                    cur = qty
                elif action.get("dir") == "OUT":
                    cur = max(0.0, cur - qty)
                else:
                    cur = cur + qty
                st.setdefault("stock", {})[key] = cur
                st.setdefault("stockLedger", []).append(
                    {
                        "id": uuid.uuid4().hex[:10],
                        "houseId": action.get("houseId") or "h1",
                        "productId": pid,
                        "qty": qty,
                        "dir": action.get("dir") or "SET",
                        "by": session["profile_id"],
                        "at": int(time.time() * 1000),
                    }
                )
                applied += 1
            elif kind == "schedule_add":
                block = next((b for b in BLOCKS if b["id"] == (action.get("block") or "morning")), BLOCKS[0])
                date = str(action.get("date") or time.strftime("%Y-%m-%d"))[:32]
                entry = {
                    "id": f"ov_{uuid.uuid4().hex[:10]}",
                    "date": date,
                    "block": block["id"],
                    "activity": (action.get("activity") or "Betreuung")[:80],
                    "houseIds": list(action.get("houseIds") or ["h1"])[:10],
                    "employeeIds": list(action.get("employeeIds") or [])[:20],
                    "childIds": list(action.get("childIds") or [])[:50],
                    "from": action.get("from") or block["from"],
                    "to": action.get("to") or block["to"],
                    "note": str(action.get("note") or "via Zo-Ai")[:500],
                    "cancelled": False,
                    "by": session["profile_id"],
                    "at": int(time.time() * 1000),
                }
                day_entries = [e for e in (st.get("overrides") or []) if e.get("date") == date and not e.get("cancelled")]
                issues = validate_day(date, day_entries + [entry])
                if any(i.get("code") == "double_book" for i in issues) and not action.get("force"):
                    errors.append("double_book")
                    continue
                st.setdefault("overrides", []).append(entry)
                st.setdefault("auditLog", []).append(
                    {
                        "at": entry["at"],
                        "type": "SCHEDULE",
                        "profileId": session["profile_id"],
                        "text": f"Zo-Ai plan {date} {entry['activity']}",
                    }
                )
                applied += 1
            elif kind == "broadcast_email":
                st.setdefault("prefs", {})["_teamNotice"] = {
                    "id": uuid.uuid4().hex[:12],
                    "audience": action.get("audience") or "staff",
                    "subject": (action.get("subject") or "Hinweis")[:160],
                    "title": (action.get("title") or action.get("subject") or "Hinweis")[:120],
                    "message": (action.get("message") or action.get("body") or "")[:4000],
                    "at": int(time.time() * 1000),
                }
                applied += 1
            else:
                errors.append(f"unsupported:{kind}")

    mutate(apply)
    return {"ok": applied > 0, "applied": applied, "error": errors[0] if errors and not applied else None}
