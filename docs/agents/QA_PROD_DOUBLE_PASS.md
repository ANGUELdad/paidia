# QA — Production double-pass (live)

**Target:** https://armonia-thassos.vercel.app  
**Latest live at report time:** **v149** (`build.json` + `gate.js?v=149` + `ui-v110.css?v=149` + `paidia-v149` SW)  
**Earlier passes in same session:** v143 → v144 → v145 (then siblings shipped through v149)  
**Method:** hard-refresh gate + public asset/API probes ×2; shipped `app.js` / CSS / `notifications.js` / `sw.js` marker checks ×2.  
**Auth:** **BLOCKED** — no documented non-secret test PIN (marketing docs explicitly say none). Did **not** invent PINs, dump secrets, or use leaked transcript PINs.  
**Did not** submit prod feedback / OCR / notes payloads (would pollute shared ops).

## Verdict

| Scope | Readiness | Notes |
|-------|-----------|--------|
| Public / gate / cache / health | **~96%** | Two-pass clean; cache-bust aligned at v149 |
| Authenticated staff + child critical paths | **0% verified** | Need credentials |
| **Overall deployment readiness (honest)** | **~52%** | Do **not** claim 100% — in-app Home/Plan/Lager/Liste/Talk/Kids/Tour/OCR UI/Feedback compose unproven on live session |

### Top failures / blockers

1. **Auth blocked** — cannot double-pass staff Home/Talk/Liste light chrome, Lager ±, Zo-Ai title runtime, Kids dock/Start, Spiele hub→iframe→back, Spotlight tour, OCR buttons, kids notes persist, Mitteilungen settings UI, feedback compose.
2. **OCR unavailable path** — `/api/health` reports `ocrConfigured: true` on prod, so the honest-503-without-key path was **not** exercised live (only unauth `401 auth_required` ×2).
3. *(Session note, fixed by later ships)* At **v144**, `index.html` briefly still referenced `?v=143` while `build.json` was 144 — **cleared by v145+** (v149 aligned).

---

## Versions touched this QA wave

| Label | Commit(s) (upstream) | Theme |
|-------|----------------------|--------|
| v143 | `6e6c586` | Zo-Ai sparkle title (not raw SVG text) |
| v144 | `57f9391` | Kids Start denser + dock/rail |
| v145 | `fd0fe24` + tour engine | Staff light heroes; Spotlight tour |
| Spiele | `f4d7946` | Absolute `/kids-games/…`, scores→kid-ops, PhET online-only |
| Tour docs | `459a04e` | `docs/agents/TOUR_SYSTEM.md` |
| OCR | `255c654` / `6810daf` | Grok/`ocr_xai.py` → `POST /api/ai-shopping` |
| Feedback | `eafa61f` (feature ~v147) | `feedbackReports` Bug/Change/Addition |
| v148 | `3807df5` / `606cfcc` | Kids own-notes CRUD + sync race |
| v149 | `ce14b94` | Notifications matrix + optional VAPID |

---

## Pass / fail table (two-pass)

Legend: **P1** / **P2** = confirmation runs. `PASS*` = visual/CSS confirm where `getComputedStyle.backgroundColor` cannot see gradients.

### A. Shell, cache, API

| Area | Check | P1 | P2 | Notes |
|------|-------|----|----|-------|
| API | `GET /build.json` matches live label | PASS | PASS | v149 at final write |
| Cache | `index.html` `gate.js` / `ui-v110.css` `?v=` = build | PASS | PASS | 149/149 |
| API | `GET /api/auth/health` ok + durable DB | PASS | PASS | postgres ok; no secrets logged |
| API | `GET /api/ops` unauth → 401 | PASS | PASS | |
| API | `POST /api/chat` unauth → 401 | PASS | PASS | earlier wave |
| API | `POST /api/ai-shopping` unauth | PASS | PASS | `401` `auth_required` — not fake success |
| Health | OCR flags (booleans only) | PASS | PASS | `ocrConfigured: true` (no keys in report) |
| Health | Notifications (safe) | PASS | PASS | `local: true`, `webPush: false` — VAPID not required for pass |
| Assets | `gate.js` / `app.js` / `sw.js` / icons | PASS | PASS | |

### B. Login gate (unauthenticated)

| Area | Check | P1 | P2 | Notes |
|------|-------|----|----|-------|
| Gate | Version chip shows live build | PASS | PASS | V149 (final); V145 earlier |
| Gate | Staff + child mode cards | PASS | PASS | |
| Gate | DE ↔ EL toggle | PASS | PASS | Προσωπικό / Personal |
| Gate | Staff profile grid (8) | PASS | PASS | |
| Gate | Staff PIN pad (Dora) | PASS | PASS | no real PIN entered as credential |
| Gate | Wrong PIN rejected (1 attempt) | PASS | — | “Noch N Versuche”; avoid lockout spam |
| Gate | PIN clear (C) | — | PASS | 5 digits then clear |
| Gate | Forgot-PIN / reset UI | PASS | PASS | email + send + back |
| Gate | Reset → PIN → profiles → entrance | PASS | PASS | |
| Gate | Child profiles (12) + Simon PIN UI | PASS | PASS | |
| Gate | Desktop entrance + version | PASS | PASS | 1280×800 |
| Light | Gate mail hero **light** (not dark teal) | PASS* | PASS* | Screenshot: white/stone card, ink title; CSS gradient in `ui-v110.css` |
| Light | Reset email input white | PASS | PASS | |
| A11y | Primary gate controls usable | PASS | PASS | large Link senden CTA |

### C. Ship-source / public Spiele (no child session)

| Area | Check | P1 | P2 | Notes |
|------|-------|----|----|-------|
| Spiele | `GET /kids-games/merge2048/index.html` | PASS | PASS | HTTP 200, title 2048 |
| Spiele | `GET /kids-games/snake/index.html` | PASS | PASS | HTTP 200, title Snake |
| Ship | Absolute `/kids-games/…` in `app.js` | PASS | PASS | + kid-ops / postMessage score bridge |
| Ship | PhET online-only marker | PASS | PASS | |
| Ship | Kids denser Start / dock markers | PASS | PASS | `kidHomeCta*`, rail/dock |
| Ship | Zo-Ai sparkle title path | PASS | PASS | regression |
| Ship | Staff light hero rules in `ui-v110.css` | PASS | PASS | no `#1b382e` staff shop-hero |
| Ship | Tour engine (`tourRoot` / `buildTourSteps`) | PASS | PASS | docs: `TOUR_SYSTEM.md` |
| Ship | OCR `#qaOcr` / `#reqOcr` + `/api/ai-shopping` | PASS | PASS | docs: `OCR_GROK.md` |
| Ship | `feedbackReports` + compose types | PASS | PASS | docs: `FEEDBACK_SYSTEM.md` |
| Ship | Mitteilungen / iOS-honest copy | PASS | PASS | docs: `NOTIFICATIONS_MATRIX.md` |
| Ship | SW `showNotification` / local path | PASS | PASS | VAPID optional (`webPush: false` ok) |
| Ship | Kids notes CTA (`kidHomeCtaNotes` / Notiz) | PASS | PASS | v148 |

### D. Authenticated critical paths — **BLOCKED** (need credentials)

Run each **twice** when a test PIN exists in non-secret docs. Until then: blocked both passes.

| Area | Critical path (×2 required) | P1 | P2 | Blocker |
|------|----------------------------|----|----|---------|
| Staff | Home light mast / signals | BLOCKED | BLOCKED | auth |
| Staff | Plan week | BLOCKED | BLOCKED | auth |
| Staff | Lager ± | BLOCKED | BLOCKED | auth |
| Staff | Liste / Talk light cards | BLOCKED | BLOCKED | auth |
| Staff | Zo-Ai panel title icon (runtime) | BLOCKED | BLOCKED | auth |
| Staff | OCR on Liste import/Beleg + Lager `#qaOcr` | BLOCKED | BLOCKED | auth — confirm honest 503 only if `ocrConfigured` false |
| Staff | αίτημα `#reqOcr` | BLOCKED | BLOCKED | auth |
| Staff | Spotlight tour: overlay, Got it / tap highlight, Skip | BLOCKED | BLOCKED | auth — see `TOUR_SYSTEM.md` |
| Staff | Feedback compose (Help/Profil/Mehr); open form fields; **cancel** (don’t pollute) | BLOCKED | BLOCKED | auth |
| Staff Pro | Feedback triage inbox | BLOCKED | BLOCKED | auth |
| Child | Start denser dashboard + dock/rail | BLOCKED | BLOCKED | auth |
| Child | Spiele hub → 2048 + Snake iframe → Alle Spiele | BLOCKED | BLOCKED | auth — public URLs already PASS |
| Child | Notes: write → wait ~3s → still there → refresh persists | BLOCKED | BLOCKED | auth (v148) |
| Child | Mitteilungen settings (honest iOS messaging) | BLOCKED | BLOCKED | auth (v149) |
| Child | Feedback via **Mehr** only — open form, cancel | BLOCKED | BLOCKED | auth |

---

## OCR note (v145+ / `255c654`/`6810daf`)

- Unauth: **401** `auth_required` ×2 — good.
- Prod health: **`ocrConfigured: true`** → cannot claim “unavailable UX” was seen on live; UI wires `#qaOcr` / `#reqOcr` / Liste import exist in shipped JS.
- When authed **and** key missing: expect **503** `configuration` + `errConfig` string — never fake success (`OCR_GROK.md`).

## Feedback note (`eafa61f` / ~v147)

- Ops key `feedbackReports`; staff Help/Profil/Mehr + Pro triage; kids **Mehr** only.
- Double-pass when authed: open compose → verify type/title/description/context fields → **Cancel** (preferred on prod) or one clearly marked test bug if owners allow.

## Notifications note (v149 / `ce14b94`)

- Pass criteria: Mitteilungen settings UI exists; platform-honest enable; SW local notifications; **VAPID not required**.
- Live health: `local: true`, `webPush: false` → still a pass for optional push.

## Kids notes note (v148)

- CTA + ownership/sync markers in shipped `app.js`.
- Runtime persist test (write / 3s / refresh) **blocked** without child auth.

---

## Evidence

- Gate / mail-hero screenshots from v145 wave (`/tmp/paidia-qa-v145-mail-p*.png`) — light stone card confirmed.
- Public Spiele HTTP 200 ×2 at final v149 check.
- No PINs, API keys, VAPID secrets, or caregiver phones in this report.

## Follow-up for a green in-app pass

1. Provide a **documented non-secret test PIN** (or ephemeral QA profile) in agent-safe docs.  
2. Re-run section D table twice on https://armonia-thassos.vercel.app after hard refresh.  
3. Prefer **cancel** on feedback; one OCR snap only if ops owners OK.
