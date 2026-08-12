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

## 2026-08-10 — Figma mockups shipped without visual QA

- **Trigger:** User rejected overhaul board as an "atrocity" ("don't you have eyes?").
- **Insight:** Plugin API layout bugs (`resize` locking FIXED height, SPACE_BETWEEN leaving dead voids, HUG sheet at bottom) produce frames that look "done" in metadata but fail as UI. Shipping Figma options without downloading/reading screenshots is how empty phones reach the user.
- **Reusable pattern:** After every `use_figma` screen build: (1) `screenshot()` or `get_screenshot`, (2) actually inspect the image, (3) reject if >~20% empty band or clipped text, (4) only then share the link.
- **Skill candidates:** strengthen figma-generate-design / agent habit — "screenshot-before-share" gate for design deliverables.

## 2026-08-10

### Observation 18: Playwright isVisible does not wait for live SPA content

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** Live deployment smoke test of paidia-platform.vercel.app staff login
**Skill:** New skill candidate: live-spa-smoke-testing
**Type:** open-source
**Phase/Area:** Browser automation waits

**Issue:** First live run marked staff profiles FAIL because locator.isVisible({ timeout }) returned immediately on an empty list while /api/auth/profiles was still in flight. A follow-up using waitFor({ state: 'visible' }) correctly passed once the API responded.

**Suggested improvement:** For SPA/live smoke checklists, require waitFor (or expect.toBeVisible) rather than isVisible; treat cold-start API latency as expected and assert eventual UI, not immediate DOM.

**Principle:** In browser automation, visibility helpers that do not wait produce false negatives on async-loaded UI — prefer waiting assertions for remote deployments with cold starts.

### Observation: live Zo-Ai guide probes must assert guide-layer, not chat bubbles

**Date:** 2026-08-10
**Trigger:** Live probe against paidia-platform.vercel.app after guide mapping fix
**Skill:** e2e / live probe methodology
**Issue:** `scripts/live-zoai-guide-probe.mjs` waited for `.bubble.assistant` after guideAsk; production starts the guide layer and navigates to the spotlight route, so chat bubbles never appear and the probe false-failed despite correct API `guide` payloads.
**Suggested improvement:** Assert `guide-layer` / coach copy / network `guide.spotlight` (and optional URL) as the primary success criteria for how-to asks; treat chat bubbles as secondary when the flow is guide-first.


### Observation 19: Live SPA screenshots before data settle false-fail empty states

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** LIVE staff dock smoke on paidia-platform.vercel.app
**Skill:** live-spa-smoke-testing
**Type:** open-source
**Phase/Area:** Async content settlement

**Issue:** Immediate screenshots after `domcontentloaded` on `/stock` showed “Keine Artikel in diesem Filter” and marked +/- FAIL; `/handover`/`/coverage`/`/incidents` looked stuck on skeleton loaders. After waiting for stock rows / loader text to clear (~0.5–2s), all settled green and stock +/- worked via API+UI.

**Suggested improvement:** Smoke checklist must (1) wait for route-specific ready selectors or absence of loading copy, (2) distinguish “empty after settle” from “still loading”, (3) treat missing loading UI that reuses empty-state copy as a product bug.

**Principle:** For live SPA smoke, assert settled content — never judge PASS/FAIL from the first paint after navigation.

## 2026-08-10 — Live guide mapping retest after redeploy

**Trigger:** User asked for PASS/FAIL after redeploying fixed guide mapping for «Wie starte ich die Schicht?» → tour-presence.

**Observation:** Production verification of Zo-Ai guide mapping is most reliable via authenticated platform proxy `POST /api/zoai/chat` (assert `guide.spotlight`) plus a short UI poll for `guide-layer`/`zoai-guide-hint`, not by waiting solely on `.bubble.assistant` (offline/LLM latency causes false FAIL). Login against live profiles is flaky — retry profile list load.

**Suggested improvement:** Prefer spotlight-field assertions in live probes; treat assistant bubble as soft signal.

### Observation 20: Live guide QA must assert coach/nav not chat bubbles

**Status:** OPEN
**Date:** 2026-08-10
**Session context:** Live Zo-Ai guide probe against paidia-platform.vercel.app
**Skill:** New skill candidate: live-pwa-guide-visual-qa
**Type:** open-source
**Phase/Area:** Visual QA / Playwright against guided overlays

**Issue:** First probe failed waiting for `.bubble.assistant` after `guideAsk`. `startGuide` navigates to the target route and remounts away from chat, so bubbles never stay visible even when the guide coach on /home, /stock, or /plan is correct. Separately, Playwright `fill()` on the home ask input sometimes left React `askDraft` empty and navigated to bare `/zoai`.

**Suggested improvement:** For guide how-to flows, assert network `guide` payload + `guide-layer`/`guide-coach` (or destination route), not chat bubbles. Prefer `guideAsk` deep links over controlled-input fill for asks.

**Principle:** When a product action navigates away from the surface that produced it, assert the destination UI — not the ephemeral source chrome.

## 2026-08-10 — Live guide intent needs bidirectional phrase match

- **Trigger:** QA of Marble Dawn home + Zo-Ai screen guide.
- **Insight:** German how-to phrasing (“Wie starte ich die Schicht?”) does not match `schicht\s*start`. Intent maps need verb/noun either order, and more-specific targets (Schichtbuch) must win over substring matches (Schicht).
- **Reusable pattern:** For guide/intent routers, put longer/more-specific patterns first; test with real user phrasing, not only keyword lists.

## Episode — 2026-08-10 — Visual QA spotlight measure race

- **Context:** Live visual QA on paidia-platform.vercel.app (staff Zoi); Playwright screenshots of home / Wochenplan guide / Zo-Ai.
- **Friction:** Guide coach appeared but spotlight hole never rendered; DOM showed `[data-tour]` present while `.guide-hole` / `.tour-spotlight-target` absent.
- **Insight:** `GuideProvider.measure` is scheduled once on `active`/`path` (120ms). Targets that mount later (page `ready` / async data) are missed with no retry/observer — looks like a “dim void” with no cutout. Pair guide start with MutationObserver or re-measure on layout effects when the spotlight selector appears.
- **Reuse:** For guide/spotlight QA, assert both coach UI and `.guide-hole` + `.tour-spotlight-target`, not only navigation + coach copy.

## Episode — 2026-08-10 — Stuck guide scrim after Später

- **Context:** User “this shit doesnt work”; live paidia-platform after Marble Dawn guide work.
- **Friction:** Tour finish left a full-screen guide-hole blocking chips/dock. Root: GuidedTour effect depended on GuideProvider context identity, so clearGuide re-triggered startGuide. Second bug: Zo-Ai auto-startGuide on wrong page painted solid scrim over “Zeig mir”.
- **Insight:** Spotlight/tour context values that include `active` must not be effect deps for “start spotlight”; use refs. Never show a blocking scrim without a measured cutout on the current route.
- **Reuse:** For overlay tutors, assert dismiss clears layer (layer count 0) and that off-route coach never uses pointer-events:auto full scrim.

## Episode — 2026-08-10 — Wire PAIDIA_* env into v2 API

- **Context:** User: use env variables already there for passwords and etc.
- **Friction:** paidia-api used hardcoded seed PINs (argon2) while production secrets lived in PAIDIA_AUTH_USERS_JSON (pbkdf2) + SMTP/session on the legacy Vercel project / root .env.
- **Insight:** New stacks must alias legacy env names and verify the legacy hash format; sync secrets onto the new Vercel project or cold starts keep fake seeds.
- **Reuse:** When splitting a monolith deploy, copy auth env first and assert login against env hashes (seed PIN should fail if overlay worked).

### Observation 21: V2 API store ignores Neon DATABASE_URL after auth JSON wiring

**Status:** OPEN
**Date:** 2026-08-11
**Session context:** Read-only audit of apps/api Armonia v2 auth + store post PAIDIA_AUTH_USERS_JSON
**Skill:** New skill candidate: dual-stack cutover audit
**Type:** open-source
**Phase/Area:** durable store vs env auth overlay

**Issue:** After wiring PAIDIA_AUTH_USERS_JSON into the FastAPI store, DATABASE_URL/Neon aliases exist in config/env_aliases but store.py still persists only to /tmp JSON. PIN resets and sessions therefore cannot survive cold starts, and env pin hashes reclobber local pinHash on reload.

**Suggested improvement:** Checklist: (1) does the new stack call the same durable DB keys as legacy, (2) do env auth overlays respect override precedence, (3) are health durableStorage flags evidence-based.

**Principle:** Wiring env secrets into a new stack is not cutover-complete until the durable store path used by production is the same path the new API mutates.

## Episode — 2026-08-11 — Neon-backed Armonia store

- **Context:** User “Improve it” after env PIN wiring.
- **Friction:** DATABASE_URL was on paidia-api but store still used /tmp; health lied `durableStorage: true`.
- **Insight:** Aliasing env is not enough — verify the runtime actually reads/writes the durable backend; assert health fields against a real round-trip.
- **Reuse:** When improving “env is there”, check consumers of each secret (DB URL → store, SMTP → email send result, auth JSON → verify hash format).

## Episode — 2026-08-11 — Lag from Neon-per-snapshot + guide scroll loop

- **Context:** User: hella laggy and buggy.
- **Friction:** Every `snapshot()` reloaded Neon (~1–3s); home chained 3 API calls; guide `scrollIntoView(smooth)` + scroll listener re-measured forever.
- **Insight:** Durable reads need TTL coalescing inside a request/warm instance; spatial tutors must not scroll on every measure.
- **Reuse:** After wiring a remote store, benchmark `snapshot()` call count × RTT before shipping.

## 2026-08-11 — armonia-thassos gate redesign
- Pattern: legacy gate CSS was dark (`#121c18`) while app shell already used Marble Dawn / pine; auth-pending forced the clash.
- Fix: unify gate to light mineral glass, brand-hero Fraunces, role CTAs without emoji; bump build/cache.
- Deploy target: root Vercel project `paidia` → armonia-thassos.vercel.app

## 2026-08-12

### Observation 22: Legacy PWA dead-UI audit methodology

**Status:** OPEN
**Date:** 2026-08-12
**Session context:** Read-only audit of index.html / gate.js / app.js for unwired controls
**Skill:** New skill candidate: static-spa-control-audit
**Type:** open-source
**Phase/Area:** methodology

**Issue:** In apps where most UI is JS-templated into a shell, grepping only static HTML IDs misses almost all dead buttons. Dual login shells (instant gate + post-load gate) also create false "wired" confidence unless logout/re-entry paths are compared to the redesigned entrance.

**Suggested improvement:** For shell+JS-rendered PWAs: (1) extract button ids/data-* from template literals, (2) require a selector/#id or dataset handler, (3) separately diff pre-bundle vs post-load gate/render paths, (4) flag functions that build HTML but are never interpolated.

**Principle:** When UI is mostly runtime-rendered, audit the template graph and re-entry paths, not only the static shell markup.

### Observation 23: Dual login shells need an explicit public bridge

**Status:** OPEN
**Date:** 2026-08-12
**Session context:** Fix dual-login-gate (gate.js Marble Dawn vs app.js legacy renderEntrance)
**Skill:** New skill candidate: dual-shell-ui-handoff
**Type:** open-source
**Phase/Area:** progressive boot / gate handoff

**Issue:** Cold start used a redesigned gate.js shell, but after app.js loaded, logout/openGate called app.js renderEntrance() and repainted a second legacy UI. Re-login via gate.js also no-op'd loadApp() when the app script tag already existed.

**Suggested improvement:** When a lightweight boot shell and a heavy app both own the same surface, require a small public API (open/render/onAuth) plus an explicit already-loaded handoff event; never let the heavy bundle silently reimplement the shell.

**Principle:** Progressive-boot UIs need a one-way ownership contract: the first shell owns re-entry visuals, and the heavy app must call into it (or reload) rather than painting a duplicate path.

### Observation 24: Keep dual static allowlists in sync (Vercel + local)

**Status:** OPEN
**Date:** 2026-08-12
**Session context:** P1 production fixes for build.json allowlist, SW cache, icon 404s
**Skill:** New skill candidate: dual-runtime static parity
**Type:** internal
**Phase/Area:** static asset serving (api/index.py vs server.py)

**Issue:** PAIDIA serves static assets from two parallel allowlists (`_STATIC_EXACT` in `api/index.py` for Vercel, `allowed_exact` in `server.py` for local). A production bug (missing `build.json` on Vercel) can exist while local still appears fine if only one list is updated.

**Suggested improvement:** When changing either static allowlist, rewrite rule, Cache-Control pattern, or missing-file 404 behavior, always patch the sibling path in the same commit and mention both in the PR summary.

**Principle:** Dual-runtime apps need allowlist/static-serving changes applied as a pair; treat unpaired updates as incomplete.

### Observation 25: click() || fallback always takes fallback

**Status:** OPEN
**Date:** 2026-08-12
**Session context:** P1 UX wiring fixes in legacy app.js (shopScan)
**Skill:** New skill candidate: spa-chrome-collision-audit
**Type:** open-source
**Phase/Area:** event wiring / falsy return values

**Issue:** `el?.click() || fallback()` always runs fallback because `HTMLElement.click()` returns `undefined` (falsy), even when the click handler ran successfully. shopScan opened import instead of receipt for this reason.

**Suggested improvement:** In chrome/wiring audits, flag `?.click() ||` and prefer direct function calls over synthesizing clicks when the target action is known.

**Principle:** Never chain `element.click()` into a boolean/or fallback — void methods always look like failure.

### Observation 26: Port both Handler methods and inline do_* API routes

**Status:** OPEN
**Date:** 2026-08-12
**Session context:** WhatsApp health/webhook Vercel parity
**Skill:** Extends dual-runtime static parity → API route parity
**Type:** internal
**Phase/Area:** api/index.py vs server.py route surface

**Issue:** `/api/whatsapp/event` and `/test` were already wrapped via `_call_handler`, but `/health` and `/webhook` lived only as inline branches in `Handler.do_GET`/`do_POST`, so Vercel silently 404'd Meta verify/health while local worked.

**Suggested improvement:** When auditing Vercel vs local API parity, grep both `handle_*` methods and `do_GET`/`do_POST` path strings; port any path present in only one runtime.

**Principle:** Dual-runtime route parity must cover inline path handlers, not only named Handler methods already in `handler_routes`.

## 2026-08-12 — Playwright staff-tab QA against live Marble Dawn gate
- Observed: legacy gate selectors drifted to `button.gate-role` + `h1.gate-brand`; old `button.profile[data-mode=staff]` timed out.
- Skill candidate: keep QA selectors dual-path (legacy profile + Marble Dawn gate-role) when UI is mid-redesign.
- Confidence: high

### Observation 27: Local Playwright QA needs auth overrides for QA PIN file

**Status:** OPEN
**Date:** 2026-08-12
**Session context:** Playwright staff e4 stock/shop click-test against local :5173
**Skill:** New skill candidate: paidia-local-qa-auth
**Type:** internal
**Phase/Area:** Local QA / auth bootstrap

**Issue:** `/tmp/paidia-qa-pin` matches `/tmp/paidia-qa-overrides.json` for e4 but not the default `.env` PAIDIA_AUTH_USERS_JSON hash. Without `PAIDIA_AUTH_OVERRIDES_PATH=/tmp/paidia-qa-overrides.json` (or equivalent), staff login fails with attempts remaining. Also, Playwright `waitForSelector` on `nav [data-tab]` while `body.auth-pending` matches hidden nav and times out; gate-scoped selectors are required. PIN entry must use pinpad `data-k` (fill alone can race 6-digit auto-submit).

**Suggested improvement:** Document a short local QA bootstrap: start server with QA overrides path, read PIN from `/tmp/paidia-qa-pin` without echoing, gate-first login via pinpad, then tab flows.

**Principle:** When a QA secret file is provided, verify it against the running auth source (env vs overrides vs DB) before treating login failures as product bugs.

## 2026-08-12 — multi-agent QA fleet on armonia-thassos
- Pattern: parallel explore agents found dual-gate + static allowlist gaps faster than single pass; branch fragmentation lost fixes until rebase onto one qa branch.
- Fix: unify on cursor/qa-fleet-fixes-d9bd, Playwright staff tabs passed (login→all docks→Zo-Ai→security→Marble Dawn logout).
- Remaining: production click-login needs real PINs; Drive still unconfigured; WhatsApp sendEnabled depends on tokens.

## 2026-08-12 — Playwright local QA auth overrides

- **Trigger:** friction
- **Context:** Local click-test needed QA PINs via `/tmp/paidia-qa-overrides.json` while process auth is loaded only at startup; mid-run server on :5173 was flaky/down.
- **Observation:** Gate PIN auto-submits at 6 digits (`buf.length === 6 → finish()`); Playwright must not also click `#gLogin` or it times out on disabled/loading button. Dauerhaft (`#fScope [data-s=template]`) only appears when editing `source==='template'` entries—not on new/extra cards.
- **Suggested skill impact:** update — local QA / Playwright login helpers
- **Confidence:** high
- **Status:** pending-review

## 2026-08-12 — legacy QA/guide/calendar/EasyPro implementation
- Starting full plan on branch cursor/legacy-qa-guide-calendar-easypro

## 2026-08-12 — Admin permission gate inventory

- **Trigger:** Investigate why admins cannot edit/add everything (permissions/role gates).
- **Insight:** Live site (armonia-thassos.vercel.app) is legacy PWA; admin is solely `profile_id in PAIDIA_ADMIN_PROFILE_IDS` from login — empty/wrong env yields admin:false and cascades through every isAdminUser/require_admin gate. Local employees[].admin is overwritten by server login response.
- **Skill implication:** Permission audits should always start at session mint + env admin ID source before cataloging UI gates.
- **Evidence:** server.py:439-442,651; app.js:2291,2209; apps/api store.py _apply_auth_env only syncs admin when AUTH_USERS_JSON is set.

## 2026-08-12 — Admin/staff add-edit UX audit

- **Trigger:** friction
- **Context:** Read-only audit of apps/web admin/staff add+edit sheets vs legacy app.js askPin/closeSheet flows.
- **Observation:** `askPin(..., {requirePin:true})` replaces the parent sheet via `openZoAiPinConfirm`→`openSheet`; any same-handler `closeSheet()` after `askPin` (e.g. `#helpProposeConfirm`) dismisses the PIN UI before entry. Post-PIN callbacks that re-read form DOM (broadcast `#broadcastAlsoBanner`) also fail because the form was already replaced.
- **Suggested skill impact:** update — sheet/PIN sequencing checklist for staff mutation audits
- **Confidence:** high
- **Status:** pending-review

## 2026-08-12 — transcript archaeology for admin edit/add

- **Trigger:** friction
- **Context:** Parent asked to extract admin edit/add failure history from Cursor transcripts + STATUS/CHANGELOG/docs; parallel fix agents already running.
- **Observation:** Paidia Cursor `agent-transcripts/` only has `ab7dc302` (Aug 4) plus today’s Aug 12 swarm. No Aug 9–11 Cursor threads. Claude session `cf713ba5` ends ~Aug 3–4. Cross-check sibling finals + `git log` + `docs/zoai` vs `knowledge/zoai` to reconstruct remaining gaps; don’t assume date-filtered Cursor folders exist.
- **Suggested skill impact:** new — “sparse transcript corpora” search pattern
- **Confidence:** high
- **Status:** pending-review

## 2026-08-12 — Plan/schedule admin template + edit

- **Trigger:** friction
- **Context:** Fixing apps/web Plan UI so admins can add/edit including permanent template; session.admin unused on plan page; schedule API append-only and ignored template merge.
- **Observation:** Admin-gated features need both (1) UI reading `session.admin` from `useRequireMode` and (2) API that actually persists/reads the gated domain (here: `asTemplate` + weekday `day` + `entries_for_date` merge). Shipping only the API flag or only a hidden button leaves the feature dead.
- **Suggested skill impact:** update — admin mutation checklist: session flag → visible control → write path → read-path merge/list
- **Confidence:** high
- **Status:** pending-review

## 2026-08-12 — Zo-Ai dual-stack action allowlist parity

- **Trigger:** friction
- **Context:** Admin could not propose/apply full edit/add mutations via Zo-Ai; v2 `zoai.py` `_parse_actions` allowed set lagged legacy `server.py` / docs.
- **Observation:** Dual-stack Zo-Ai (legacy PWA + apps/api) needs one shared allowlist matrix: staff types, admin-only types, PIN types, and `{"actions":[...]}` vs bare-array parse. Shipping describe/UI without parse+apply for the same types leaves confirm cards empty or `unsupported:*`. Also: never `closeSheet()` after `askPin(..., {requirePin:true})` — PIN UI replaces the sheet.
- **Suggested skill impact:** update — dual-stack Zo-Ai mutation checklist (parse → describe → pin → apply → persist)
- **Confidence:** high
- **Status:** OPEN

## 2026-08-12 — Admin edit/add root-cause fix

- **Trigger:** FINALLY FIX admin can edit/add everything.
- **Insight:** Empty PAIDIA_ADMIN_PROFILE_IDS demotes all admins; client must also hard-allow e3/e4/e8; shifts must be in OPS_KEYS; Dauerhaft must exist on *new* entries; session admin must be re-resolved live; Neon persist must not silent-fail on Vercel.
- **Skill implication:** Permission bugs — start at env admin ID source + session mint + shared-ops key whitelist before UI gates.
- **Evidence:** server.py ADMIN_PROFILE_IDS fallback; app.js coerceAdminFlag; store._sync_admin_flags; security.parse live admin; OPS shifts.

## 2026-08-12 — Spotlight guide MO + calendar POST allowlist

- **Trigger:** Phase 5 smoke hung after startSpotlightGuide; feed POST 404
- **Observation:** MutationObserver with `attributes:true` on body feedback-loops when measuring toggles `.guide-spotlight-target`. Disconnect after first successful hole; observe childList only. Local `server.py` do_POST has an early allowlist set — new routes like `/api/calendar/feed` must be added there or they 404 before the handler.
- **Suggested skill impact:** update — PWA guide measure guard; Flask/stdlib POST allowlist checklist
- **Confidence:** high
- **Status:** pending-review
