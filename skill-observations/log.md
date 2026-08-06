# Skill Observations Log

<!-- Append-only. Agents: add entries; do not rewrite history. -->


## 2026-08-06 — Explore games / gallery / Zo-Ai inventory

- **Trigger:** User asked for thorough codebase state of child games, gallery, Zo-Ai (read-only exploration).
- **Insight:** Feature surface for kids (11 games + gallery + Zo-Ai) is concentrated in three files (`app.js`, `index.html` CSS, `server.py`) with docs lagging (`docs/zoai/child.md` still lists only Memory/XO/catch). When extending games or feed UX, update Zo-Ai knowledge docs in the same change or child prompts stay stale.
- **Reusable pattern:** Inventory reports should enumerate IDs + API actions + cache `?v=` + SW cache name together; cache-bust versions diverge easily (`gate/app ?v=58` vs `sw.js paidia-v19`).
- **Skill candidates:** none new this pass (exploration only).

## [2026-08-05T23:05:47Z] exploration — schedule/program codebase map

- **Trigger:** user asked for thorough schedule UX/data exploration (paste WhatsApp program gaps)
- **Signal:** structured domain map request; reusable as "codebase domain reconnaissance" skill pattern — key paths + line ranges + data shapes + explicit gaps
- **Skill implication:** none yet (read-only); observation logged for future domain-map skill if repeated
- **Evidence:** app.js SEED.template/overrides/weeks, entriesFor, sheetEntry scope, shopping-only OCR

### Observation 1: Gallery lacks ops-style DB refresh on Vercel

**Status:** OPEN
**Date:** 2026-08-06
**Session context:** Read-only exploration of "social media" / Momente gallery feature
**Skill:** New skill candidate: codebase domain reconnaissance
**Type:** internal
**Phase/Area:** storage / serverless consistency

**Issue:** While mapping Momente (`/api/gallery`), found that `get_ops` calls `refresh_ops_state_from_disk()` but `gallery_snapshot` / `mutate_gallery` only mutate process-local `GALLERY_STATE` loaded once at import. On Vercel multi-instance this can make posts appear missing or overwritten; without `DATABASE_URL` persistence falls through to ephemeral `/tmp/paidia/gallery.json`.

**Suggested improvement:** Domain maps for shared state features should always check: (1) durable key in db.py, (2) whether read path reloads from DB each request like ops, (3) Vercel /tmp vs Postgres failure modes, (4) payload shape (data-URL blobs vs object storage).

**Principle:** For serverless shared mutable state, inventory both the persistence backend and whether in-memory caches are refreshed on every read — a write path that persists but a read path that only uses warm memory is a silent multi-instance bug.

### Observation 2: UI chrome audits need a z-index + body-flag matrix

**Status:** OPEN
**Date:** 2026-08-06
**Session context:** Read-only UI/UX audit of fixed chrome, dead buttons, design-board gap
**Skill:** New skill candidate: spa-chrome-collision-audit
**Type:** open-source
**Phase/Area:** mobile fixed-layer stacking / measure-and-flag layout

**Issue:** Paidia positions FABs/docks via CSS vars (`--nav-total`, `--dock-h`, `--chat-h`) plus body flags (`has-stock-dock`, `store-fullscreen`, `chat-open`, `layout-desktop`). Desktop overrides for `.zoai-fab` ignore `--dock-h`, so measured dock height does not lift the FAB. A `--chat-h` var is always forced to `0` in JS, leaving dead CSS branches that look like they account for chat height.

**Suggested improvement:** For any vanilla SPA with stacked fixed chrome, audit checklist: (1) z-index ladder table, (2) every body flag × every fixed selector matrix, (3) confirm measure*() vars are consumed by the same selectors on mobile and desktop, (4) orphaned handler IDs vs live markup in one grep pass.

**Principle:** Fixed-layer collision bugs hide in the gap between measured CSS variables and layout-specific overrides that stop reading those variables.

### Observation 3: STATUS.md still claims email/WhatsApp need backend

**Status:** OPEN
**Date:** 2026-08-06
**Session context:** Codebase exploration (DB, notifications, Zo-Ai, OmniRoute, knowledge)
**Skill:** Task Observer / internal paidia docs hygiene
**Type:** internal
**Phase/Area:** STATUS.md vs live server.py

**Issue:** `STATUS.md` still lists email/WhatsApp as “impossible in a static PWA” and needing a future backend, but `server.py` already implements WhatsApp Cloud API (`/api/whatsapp/*`) and event email (`/api/notify/event-email`). Agents reading STATUS.md alone get a false gap list.

**Suggested improvement:** Mark those STATUS items done or point to README WhatsApp + notify sections; keep STATUS for true remaining gaps (web push, Sunday reminders, etc.).

**Principle:** Gap docs must be revalidated against implemented API routes before treating them as backlog — stale “missing” lists cause agents to re-propose shipped work.
