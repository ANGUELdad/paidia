# PAIDIA specification audit

Audit date: 2026-08-04  
Sources: `ARMONIA_OMP_v2_SRS.md` and `complete_system_specification(6).md`

This repository is still a single-user/offline prototype. “Covered” below means the flow is
demonstrable in the prototype; it does not imply production security, concurrency, or persistence.

## ARMONIA OMP v2 core modules

| Module | Status | Current coverage / missing production work |
|---|---|---|
| Dashboard | Missing | No operational dashboard widgets or cross-module live summary. |
| Morning Planning | Covered in prototype | Monday–Sunday, Villa/Limenaria, daily and weekly matrix. |
| Afternoon Planning | Covered in prototype | Caregiver rows with children, activity, time and house; location/status need richer fields. |
| Evening Planning | Covered in prototype | Same responsive house matrix as morning. |
| Daily Call | Partial | Daily view and notes exist; no finalized call workflow, attendance, decisions or lock. |
| Events | Partial | Child-specific Events tab, staff CRUD/drafts/publishing, schedule-linked announcements and event audit exist; approvals, full calendar and gallery remain. |
| Shopping | Partial | AI import/review, Friday list, store mode, AI receipt matching and inventory handoff exist; full statuses and approval workflow remain. |
| Inventory | Partial | Two-house stock, IN/OUT, photo and audit exist; transfers, expiry, reconciliation and atomic backend transactions remain. |
| AI Assistant | Partial | Shopping text/vision extraction and contextual in-app help exist; permissions, citations and other module tools remain. |
| Activity Timeline | Partial | Append-only local audit view exists; server timestamps, durable retention and cross-entity timeline remain. |
| Reports | Missing | Daily, weekly and monthly reporting/export are not implemented. |

## SRS-wide foundations

| Requirement family | Status |
|---|---|
| Responsive table/calendar planning | Covered in prototype with the new matrix system and multi-house/multi-caregiver checkbox assignments. |
| Child portal and separate PIN entry | Covered in prototype, including a PIN-free 12-hour device session; PINs are demo/plaintext and not production authentication. |
| Conflict and duplicate validation | Partial rules in the client; no authoritative server validation. |
| Full RBAC and row-level security | Missing; requires backend/auth database. |
| Atomic writes, idempotency, optimistic concurrency | Missing locally; the AI endpoint sends an idempotency key, but operational records still use localStorage. |
| Server-side IP/time and immutable audit | Missing; current evidence is client-controlled. |
| Media server, signed URLs, retention and GDPR tooling | Missing. |
| Email/WhatsApp reminders, daily digest and jobs | Missing. |
| Backups, monitoring, health checks and disaster recovery | Missing. |
| Offline sync and conflict resolution | Missing; local prototype is not multi-device sync. |

## Shopping AI (§11.5, §37, §58–§59, §62)

| Requirement | Status |
|---|---|
| Pasted text and mixed Greek/German/English | Implemented through AI with a robust local text fallback. |
| Handwritten/printed image or screenshot | Implemented through `/api/ai-shopping`; requires `GROQ_API_KEY`. |
| Quantity, unit, brand, package size, category, notes | Implemented in structured model output. |
| Canonical-product and alias matching | Implemented against the local product catalog. |
| Confidence per item and low-confidence review | Implemented; all rows remain editable and require confirmation. |
| Existing-stock context | Current stock is shown per recognized item; expected stock and consumption forecast remain. |
| Duplicate detection | Existing active-list and within-import warnings are implemented; cross-week/backend fuzzy duplicates remain. |
| Human confirmation before save | Implemented with review screen and employee PIN. |
| Original/extracted/draft/final archive | Implemented in local `aiImports`; durable media storage/version retention requires backend storage. |
| Supermarket readiness | Confirmed rows retain canonical category and are grouped by aisle in store mode. |
| PDF/TXT/CSV/Excel/email inputs | Not yet implemented. |
| AI learning from corrections | Archive data is captured; organizational learning/alias promotion UI remains. |
| Partial/replaced/cancelled item workflows | Not fully implemented. |

## Production completion boundary

The two specifications describe a multi-user operational platform, while this repository remains a
static/local prototype plus one AI proxy endpoint. Full compliance requires the planned application
backend and database: authentication, RBAC/RLS, transactional inventory, durable audit/media storage,
background jobs, reports, monitoring, backups, conflict handling and automated tests. Those requirements
must not be marked complete until they are implemented and verified against a shared production-like datastore.
