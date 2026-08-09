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

## 2026-08-09 — OPEN

**Signal:** Improving methodology for product/architecture proposals on this repo  
**Skill:** (none yet — candidate: care-ops-integration-roadmap)  
**Context:** User asked for NEW INTEGRATIONS proposal across legacy + apps/web + apps/api; read STATUS, PLATFORM, knowledge/, docs/agents; no code.  
**Insight:** Best proposals score highest when they (1) finish half-built env-gated paths (WhatsApp, VAPID, Resend, Drive scripts, OCR) before inventing new vendors, (2) map to existing notify kinds + Zo-Ai confirmable actions, (3) prefer free APIs / client APIs aligned with OmniRoute-forever LLM. Kill SSO/analytics/DeepL as separate products.  
**Suggestion:** Optional skill `care-ops-integration-roadmap`: read knowledge maps → inventory `.env.example` stubs → score morning-ops value → P0 finish-wired / P1 cheap-new / P2 nice.  
**Reusable?** yes  
**Confidentiality:** 1


### Observation 4: Mobile layout audits need a chrome-token checklist

**Status:** OPEN
**Date:** 2026-08-09
**Session context:** Read-only CSS audit of apps/web + legacy index.html for dock overlap, week matrix overflow, safe-area, z-index, vh/dvh
**Skill:** New skill candidate: mobile-chrome-css-audit (or improve env-setup / review skills with a mobile checklist)
**Type:** open-source
**Phase/Area:** Layout / PWA mobile CSS inspection

**Issue:** Fixed bottom chrome clearance often drifts from reality when (1) content padding is a magic number (112px / pb-28) while the dock grows via safe-area padding, (2) JS measureChrome overwrites CSS --nav-total and drops safe-area/inset that the stylesheet had baked in, and (3) viewport-fit=cover is missing so env(safe-area-inset-*) stays 0. Z-index collisions (FAB == sheet backdrop) and leftover 100vh max-heights compound the same class of bugs.

**Suggested improvement:** A reusable audit checklist: viewport-fit → safe tokens → single --chrome-bottom measured or calc'd once → content padding uses that token → z-index scale documented → no raw vh for overlay heights → wide grids either hidden on mobile or overflow contained with overflow-x:clip on the page shell.

**Principle:** Bottom chrome clearance must be one shared token that already includes safe-area; never pad content with a fixed pixel guess while the fixed bar independently grows with insets.

### Observation 5: Auth security deep-dives benefit from dual-stack comparison (legacy vs v2)

**Status:** OPEN
**Date:** 2026-08-09
**Session context:** Read-only auth/session/security review across apps/api/armonia/auth, Next rewrite proxy, and gate.js
**Skill:** task-observer / review-security
**Type:** open-source
**Phase/Area:** Security review methodology

**Issue:** Comparing the legacy server.py session model (live admin resolution, pin_ver binding, multi-bucket lockouts) against the v2 FastAPI auth package surfaced regressions that a v2-only read would miss — sticky admin claims, weaker lockouts, missing audience filters.

**Suggested improvement:** For dual-stack migrations, treat “parity with hardened legacy controls” as an explicit review checklist item alongside new-surface bugs.

**Principle:** When reviewing a rewrite/migration, always diff security controls against the previous implementation, not only against generic best practices.

### Observation 6: Dual-stack Zo-Ai safety audits need side-by-side control matrices

**Status:** OPEN
**Date:** 2026-08-09
**Session context:** Read-only Zo-Ai safety audit (domains/zoai.py, web /zoai, legacy app.js + server.py /api/chat)
**Skill:** New skill candidate: dual-path security audit
**Type:** open-source
**Phase/Area:** methodology / security review

**Issue:** Safety controls (Confirm, PIN, admin gate, child strip, offline, injection) are implemented twice — legacy client-apply vs FastAPI server-apply — with divergent allowlists and PIN sets. A single-file review misses regressions where one stack enforces a control and the other only prompts for it.

**Suggested improvement:** For products with parallel legacy + new stacks, mandate a control matrix (control × stack × enforce-vs-prompt) before listing attack scenarios; treat UI Confirm as non-binding unless the apply API binds draft+role+PIN.

**Principle:** When the same assistant capability exists on two stacks, audit each control as enforce vs prompt on both paths — never assume parity from shared docs.

### Observation 7: Legacy PWA UI audit as reusable checklist

**Status:** OPEN
**Date:** 2026-08-09
**Session context:** Read-only UI/UX audit of paidia index.html / app.js / gate.js (home, plan, kids, tutorial); no product edits
**Skill:** New skill candidate: pwa-care-ops-ui-audit
**Type:** open-source
**Phase/Area:** Audit method for first-viewport, chrome measurement, mandatory onboarding

**Issue:** Auditing a dense vanilla PWA required cross-checking CSS tokens (--nav-total/--dock-h/--safe-b) against JS measureChrome overrides, mandatory tutorial sheet locking, dock slot count, and under-44px targets — signals that are easy to miss if reviewing only screenshots.

**Suggested improvement:** A short skill checklist: (1) first-viewport inventory vs hero budget, (2) chrome vars measured vs CSS calc, (3) onboarding dismissability + step count, (4) dock density at 390px, (5) contrast on dark chrome/gate muted text, (6) touch targets under 44px.

**Principle:** For mobile ops PWAs, audit chrome measurement math and mandatory flows with the same rigor as visual layout — layout bugs often come from JS overwriting CSS clearance tokens.

### Observation 8: Platform parity audits need a dual-store risk matrix

**Status:** OPEN
**Date:** 2026-08-09
**Session context:** Read-only legacy vs apps/web+apps/api comparison against docs/PLATFORM_PARITY.md
**Skill:** New skill candidate: platform-parity-cutover-audit
**Type:** open-source
**Phase/Area:** cutover / dual-run risk assessment

**Issue:** Comparing a migrating monolith to a new monorepo against a checkbox parity doc under-emphasizes the highest cutover risk: two writable stores, two session cookies, and production still routing to the legacy entrypoint while the new stack looks feature-complete in UI.

**Suggested improvement:** For dual-stack migrations, structure the audit as (1) parity checkbox status, (2) dual-run divergence risks (auth cookies, durable stores, deploy target), (3) must-fix on production-clone before cutover — not feature lists alone.

**Principle:** When an app is dual-running during a platform rewrite, treat conflicting sources of truth and session/auth boundaries as higher severity than missing UI polish.

### Observation 9: Static UI audit of Next apps/web surface

**Status:** OPEN
**Date:** 2026-08-09
**Session context:** Read-only UI/UX audit of apps/web (overflow, dock, tour, grids, a11y, i18n, empty states, role leaks, touch targets) with redesign proposals
**Skill:** New skill candidate: static-frontend-ux-audit
**Type:** open-source
**Phase/Area:** Methodology for auditing mobile PWAs from source

**Issue:** A thorough mobile-PWA UX audit was performed entirely from source (layout CSS, shared shell components, every route page) without a running browser. Highest-signal defects clustered in shared chrome (Dock mode defaults, GuidedTour mount/state, spotlight never wired) rather than page-local polish — those would be easy to miss if the audit only sampled screenshots of happy paths.

**Suggested improvement:** Codify a checklist skill: (1) inventory shared chrome first (dock/tour/shell/globals), (2) for every cross-role shared route assert Dock mode + auth gate, (3) verify tour steps have a mounted tour host on target routes, (4) grep for EN strings in DE/EL apps and !min-h-* under 44px, (5) map empty/error UI coverage per fetch.

**Principle:** Audit shared navigation and modal chrome before page content — role leaks and tour breakage usually live in defaults and mount points, not in individual screens.

### Observation 10: Reliability audit checklist for dual-store apps

**Status:** OPEN
**Date:** 2026-08-09
**Session context:** Read-only P0–P3 audit: overflow, caps, races, localStorage quota, SW notification storms; compare store.py vs server OPS_LIST_CAPS
**Skill:** New skill candidate: dual-path reliability audit
**Type:** open-source
**Phase/Area:** methodology / storage consistency

**Issue:** When a product has both a production monolith store (capped lists) and a Phase-0 in-memory store (uncapped appends), plus a client mirror in localStorage, cap drift and type-key mismatches (list vs dict) are invisible until sync wipes data or payloads hit quota.

**Suggested improvement:** A reusable checklist: (1) enumerate every append-only collection across client/server/alt-store; (2) assert matching caps and types; (3) exercise conflict-merge growth; (4) check notification timers for dual intervals and missing tags; (5) require reproduction steps per severity.

**Principle:** Dual persistence paths need an explicit cross-store cap/type matrix; a cap that exists on only one path is a latent data-loss or unbounded-growth bug.

## 2026-08-09
- Episode: multi-agent security/UX audit fleet (12+ parallel)
- Insight: Prefer verifying "already fixed" claims against current branch — kids ACL/calendar/_child_visible_event and XP forge were partially fixed on cursor/kids-mode-privacy-d9bd while push audience + static disclosure remain open.
- Action: When launching audit fleets after fix branches, include a verify agent that diffs prior CRITICAL list against HEAD.

## 2026-08-09
- Episode: audit→implement critical hardening + Übergabe
- Insight: After multi-agent audits, implement immediately on main (or ff-merge fix branch) rather than another audit wave; verify agents catch drift between findings and HEAD.
- Action: Prefer ship-critical security fixes in same session as audit when user says continue.

## 2026-08-10
- Checkpoint: no new skill observations from the Figma MCP build session.

### Observation 11: API test modules need rate-limit bucket isolation

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** Implementing Phase 2 parity APIs in apps/api with focused and full pytest runs
**Skill:** New skill candidate: FastAPI in-memory-state test isolation
**Type:** open-source
**Phase/Area:** Test methodology / shared process state

**Issue:** A new test module that performed several authenticated TestClient calls caused later, unrelated auth tests to fail with 429 because the app's in-memory sliding-window rate-limit buckets are module-global and survive fixture-created store resets.

**Suggested improvement:** For FastAPI suites with module-global limits, caches, or lockout maps, add a reusable fixture checklist: reset persistent store, reset rate-limit buckets, reset auth failure maps, and clear settings caches when tests monkeypatch env/config.

**Principle:** Test fixtures that isolate durable state also need to isolate in-memory process guards; otherwise adding legitimate coverage can make later tests fail through shared throttling state rather than product behavior.

### Observation 12: Broad `coverage/` gitignore hides app routes

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** Heavy UX sprint — `/coverage` page existed on disk but never entered git
**Skill:** New skill candidate: gitignore path specificity audit
**Type:** open-source
**Phase/Area:** Repo hygiene / Next.js app routes

**Issue:** Root `.gitignore` used `coverage/` intended for pytest/coverage.py HTML output. That pattern also matched `apps/web/src/app/coverage/`, so the Coverage board UI was silently untracked after implementation.

**Suggested improvement:** Prefer root-anchored ignores (`/coverage/`, `htmlcov/`, `.coverage`) for test artifacts. After adding a new first-segment app route, run `git check-ignore -v <path>` once before declaring the feature shipped.

**Principle:** Ignore rules written for tool output directories must be path-anchored; otherwise product folders that share common names (`coverage`, `dist`, `build`, `out`) disappear from version control without an obvious error.

## [2026-08-09T22:22:06Z] episode
- **Trigger:** read-only visual system inventory for apps/web
- **Insight:** Token file and globals.css stay aligned on pine/sea/amber, but most screens still render as glass card stacks + text-only dock — brand lives in tokens/heros, not in the default PageShell pattern.
- **Evidence:** design/armonia.platform.tokens.json mirrors globals.css :root; PageShell/Dock/MoreSheet + .panel/.card dominate secondary routes while only home/handover use branded heroes.
- **Skill candidate:** none (one-off audit)
- **Principle candidate:** When auditing a design system, compare token source of truth against the default chrome pattern (shell/dock/cards), not just the hero screens.

### Observation 13: Dense-list audit → shared row primitive gap

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** Read-only audit of apps/web table/matrix/dense list UIs for compact mobile redesign specs
**Skill:** New skill candidate: dense-ops-list-audit (or extend frontend design review)
**Type:** internal
**Phase/Area:** Inventory + redesign mapping

**Issue:** Multiple ops screens (stock, shop, coverage, incidents, care, book, calendar, admin notify) independently reimplement bordered `.card` / `.tile` stacks with 16px padding and inline action buttons, with no shared compact row / list→detail pattern. Cross-screen density work will duplicate unless a shared primitive lands first.

**Suggested improvement:** When implementing compact redesigns, introduce one shared `list-row` (or similar) component/CSS in apps/web before per-page rewrites; map swipe secondary actions and sticky section headers as reusable CSS.

**Principle:** Before redesigning N similar list screens, extract the shared density primitive so each screen only owns its data shape and secondary actions.

## 2026-08-10 — Staff home/plan/stock UI pain audit (read-only)

- **Trigger:** Thorough UI pain deep-dive of home/plan/stock + globals (.week-matrix, .dock, .page, .card, .panel)
- **Insight:** Plan uses live `.week-grid` (min-width 820) while `.week-matrix` in Next globals is an orphan stub; mobile plan buries the week under the add form; stock is unbounded card rows with competing ± / toList / sign-off CTAs; home hero is strong but secondary tiles + alerts reintroduce dashboard clutter below the fold.
- **Reusable pattern:** For staff ops screens, audit in four buckets (layout / density / table-or-matrix / list→detail) and always recommend a compact list→detail pseudo-structure so redesigns stay comparable across screens.
- **Skill candidates:** none new (reinforces existing shared list-row primitive observation).

### Observation 14: iOS touch-audit checklist for PWA surfaces

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** Read-only audit of apps/web interactive controls for iOS Simulator / touch reliability
**Skill:** New skill candidate: ios-pwa-touch-audit
**Type:** open-source
**Phase/Area:** methodology / mobile QA

**Issue:** A thorough iOS touch audit repeatedly needed the same eight checks (button type, 44px targets, hover-only, z-index/pointer-events vs dock/sheets, Enter/submit, e2e vs routes, WebAuthn/push/file, safe-area under fixed chrome). Without a reusable checklist, findings scatter across ad-hoc greps and false positives (e.g. Chromium+iPhone viewport ≠ WebKit).

**Suggested improvement:** Author a lean skill with a fixed grep/read checklist, severity rubric (blocker vs UX), and an explicit note that Playwright `devices['iPhone 14']` + Chromium does not validate Safari WebAuthn/Push/Speech.

**Principle:** Mobile PWA touch audits should treat platform APIs (WebAuthn, Push, Speech) and hit-target CSS as separate failure classes, and never equate Chromium mobile emulation with WebKit.

### Observation 15: Prefer remount-safe overlay state and hang/error paths in stuck-UI audits

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** Read-only audit of apps/web for stuck UI, non-scrollable regions, and interaction traps
**Skill:** New skill candidate: stuck-ui-audit (or improve future mobile-PWA review checklists)
**Type:** open-source
**Phase/Area:** Audit methodology / overlay & loading traps

**Issue:** CSS searches for `overflow:hidden` / `100dvh` alone miss the highest-severity traps: per-page modal components that reset progress on remount (tour stuck at step 1), loading flags never cleared when a dependent fetch is skipped, and fetch helpers with no timeout so `LoadingBlock`/`ready` gates never escalate to an error.

**Suggested improvement:** Checklist order: (1) overlay state ownership across route remounts, (2) every `loading`/`busy`/`ready` path must clear or error on empty/fail/hang, (3) modal scroll-lock + dismiss consistency, (4) dock/safe-area occlusion, (5) then CSS overflow/height traps.

**Principle:** For mobile PWAs, stuck UI is more often state-lifecycle and hang/error omission than literal `overflow: hidden` on the document.

### Observation 16: WebKit e2e needs session settle + nav retry

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** Signal Compact polish + WebKit e2e green
**Skill:** Improve ios-pwa-touch-audit / playwright mobile harness notes
**Type:** open-source
**Phase/Area:** e2e / WebKit cookie race

**Issue:** Playwright WebKit often interrupted `page.goto` right after PIN login (`Navigation … interrupted by another navigation to "/"`) even when Chromium was green — Set-Cookie / client `useRequireMode` redirect raced the next navigation.

**Suggested improvement:** After login, wait for dock + `GET /api/auth/session` authenticated; wrap staff navigations in retry-on-interrupted helper. Install WebKit explicitly (`npx playwright install webkit`) when adding a WebKit project.

**Principle:** Cookie-auth mobile e2e must settle session readability before chained navigations; Chromium green does not prove WebKit auth timing.

### Observation 17: Signal Compact audit — inventory-first before rewrite

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** Read-only UX audit of apps/web + apps/api for Armonia Signal Compact overhaul checklist
**Skill:** task-observer
**Type:** internal
**Phase/Area:** methodology / PWA inventory

**Issue:** A thorough page inventory (Dock/Mehr vs orphan routes, API call matrix, DE-primary gaps) surfaced high-impact gaps faster than reading design tokens alone — e.g. handover→Talk topic invisible, admin Push env mismatch, plan hardcodes, pages with list-row but no detail sheets.

**Suggested improvement:** For mobile PWA UX overhaul tasks, start with route inventory + nav coverage + API call graph before CSS/token polish; rank fixes by "staff can't complete shift ritual" over visual consistency.

**Principle:** Inventory navigation, empty states, and API wiring before visual redesign — broken flows beat polish debt.

### Observation 17: UX overhaul pairs feature fixes with per-route Figma phones

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** Signal Compact UX overhaul + every-route Figma
**Skill:** Improve figma-generate-design / product UI sprint pattern
**Type:** open-source
**Phase/Area:** design↔code sync

**Issue:** Shipping dense list UX without a single Figma page of all routes left design drift (empty Login/Home/Plan pages vs live chalk UI). Feature bugs (hardcoded houseIds, missing cancel, admin VAPID) blocked “every feature working” even when screens looked polished.

**Suggested improvement:** For mobile ops PWAs: (1) fix shift-critical API wiring first, (2) create one Figma page with phone frames for every route in the same pass, (3) update tokens JSON frame map immediately.

**Principle:** Visual overhaul and feature correctness are the same sprint — a pretty screen with hardcoded IDs is still broken ops.

### Checkpoint: UX overhaul pass 2 — no new skill observations beyond Observation 17

**Status:** ACK
**Date:** 2026-08-10
**Note:** Continued Signal Compact overhaul (stock CAS, login/profile, notify CTAs, Figma sync). Methodology already captured in Observation 17.
