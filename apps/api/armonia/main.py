from __future__ import annotations

import time

from fastapi import APIRouter, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from armonia import __version__
from armonia.auth.passkeys import passkeys_available
from armonia.auth.routes import router as auth_router
from armonia.config import get_settings
from armonia.domains.book import router as book_router
from armonia.domains.calendar import router as calendar_router
from armonia.domains.care import router as care_router
from armonia.domains.coverage import router as coverage_router
from armonia.domains.incidents import router as incidents_router
from armonia.domains.kids import router as kids_router
from armonia.domains.notify import router as notify_router
from armonia.domains.presence import router as presence_router
from armonia.domains.schedule import router as schedule_router
from armonia.domains.shop import router as shop_router
from armonia.domains.shop_stock import router as stock_router
from armonia.domains.talk import MeetingBody, get_meeting, save_meeting
from armonia.domains.talk import router as talk_router
from armonia.domains.zoai import router as zoai_router
from armonia.store import snapshot

app = FastAPI(title="Armonia API", version=__version__)
settings = get_settings()
origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def limit_request_body(request: Request, call_next):
    cl = request.headers.get("content-length")
    if cl:
        try:
            size = int(cl)
        except ValueError:
            size = 0
        if size > settings.max_body_bytes:
            return JSONResponse(status_code=413, content={"error": "payload_too_large", "code": "payload_too_large"})
    return await call_next(request)

app.include_router(auth_router)
app.include_router(schedule_router)
app.include_router(stock_router)
app.include_router(shop_router)
app.include_router(book_router)
app.include_router(presence_router)
app.include_router(talk_router)
app.include_router(notify_router)
app.include_router(zoai_router)
app.include_router(kids_router)
app.include_router(calendar_router)
app.include_router(coverage_router)
app.include_router(incidents_router)
app.include_router(care_router)

meeting_alias = APIRouter(prefix="/api/meeting-notes", tags=["talk"])


@meeting_alias.get("")
@meeting_alias.get("/")
def meeting_notes_get(request: Request, weekKey: str = "") -> dict:
    key = weekKey or time.strftime("%G-W%V")
    return get_meeting(key, request)


@meeting_alias.post("")
@meeting_alias.post("/")
def meeting_notes_post(body: MeetingBody, request: Request) -> dict:
    return save_meeting(body, request)


app.include_router(meeting_alias)


@app.get("/api/health")
def health() -> dict:
    state = snapshot()
    omni = False
    try:
        from armonia.domains.zoai import _omni_reachable

        omni = _omni_reachable()
    except Exception:
        omni = False
    return {
        "ok": True,
        "version": __version__,
        "platform": "armonia-v2",
        "revision": state.get("revision") or 0,
        "durableStorage": True,
        "aiConfigured": bool(settings.groq_api_key) or omni,
        "llmProvider": "omniroute" if omni else ("groq" if settings.groq_api_key else "offline"),
        "omniroute": {"reachable": omni, "baseUrl": settings.omniroute_base_url},
        "notifications": {"local": True, "webPush": bool(settings.vapid_public_key)},
        "vapidPublicKey": settings.vapid_public_key or "",
        "passkeysAvailable": passkeys_available(),
        "emailConfigured": bool(getattr(settings, "resend_api_key", "") or getattr(settings, "smtp_host", "")),
    }


@app.get("/")
def root() -> dict:
    return {"service": "armonia-api", "docs": "/docs", "health": "/api/health"}
