# Changelog

## v84 — 2026-08-22

- Merged the pre-redesign `main` line back in; kept `notifications.js`
  (`window.PaidiaNotify`: calendar grid, reminder scheduling, ICS export, badges)
- Wired `notifications.js` into the shell and both static allowlists — it shipped
  on the old line but was never reachable from the redesign
- Removed a duplicate `run_chore_verify` the merge introduced; kept the hardened
  version (clamped input, routes via `llm_completion` rather than Groq-only)
- Removed an unreachable duplicate `/api/chore-verify` route in `api/index.py`
- Kept the redesign's shell, manifest and service worker — they supersede the old
  line, including a richer `notificationclick` handler
- Cache `paidia-v84`

## v83 — 2026-08-22

- Force fresh UI: service worker no longer caches `app.js` / `gate.js` / `index.html`
- Gate purges old PWA caches once per release and re-registers SW before login
- Cache `paidia-v83`

## v82 — 2026-08-22

- Login hotfix: remember-me is opt-in (unchecked by default) so PIN works before API redeploy
- Vercel auth bridge: forward `remember`, catch handler errors as JSON (no HTML 500)
- Cache `paidia-v82`

## v81.1 — 2026-08-22

- Fix Vercel login crash: Flask auth bridge now forwards `remember` to session minting (was 500 → “Anmeldung nicht möglich”)
- Session decode preserves `remember` for sliding cookie refresh

## v81 — 2026-08-22

- Phase 3 Kids icons: chore cards, badges (earned/locked), empty states use SVG `currentColor` sprites
- Explicit width/height on inline icons (no unsized SVG viewport swallow)
- Cache `paidia-v81`

## v80 — 2026-08-21

- Remember-me: last profile skip on cold open, 30-day session when checked, sliding cookie refresh
- Faster entry: `window.__paidiaBootSession` handoff, preload `app.js` on PIN, soft Laden skeleton
- Kids: dock clearance + Zo-Ai above dock; 380/600/900 + landscape; dedicated dock SVG icons
- Start secondary chips (Events / Galerie / How-to); empty-day CTA to Plan
- Cache `paidia-v80`

## v79 — 2026-08-21

- Kids Phase 1: student-app shell matching Figma Kids frames (Start, Stundenplan, Aufgaben, Sterne, Lernen)
- Child dock: Start · Plan · Lernen · Sterne · Spiele (replaces emoji tab strip)
- Widgets: SVG progress ring, level meter, streak, badge grid, segmented quiz progress
- Sterne view: balance ring, weekly delta, 7-day streak, earned/locked badges, leaderboard
- Stundenplan terracotta now-line on the active block; Aufgaben `--out` overdue after 17:00
- Handover-ribbon stagger on lesson / plan / Aufgabe rows (capped at five)
- Cache `paidia-v79`

## v78 — 2026-08-21

- Design system v2 implemented from `design/VISUAL_MOTION_SYSTEM.md` (§2–§7)
- Full token layer: stone scale, hairline-strong, pine/amber tints, sea-deep,
  glass-rim, radius lg/pill, 4/8 space scale, type scale, motion tokens
- Elevation model: glass-1 tiles, glass-2 sheets, inverted chrome dock
- Dock is now the one dark surface — floating chrome pill, mark-a active state
- Three named motions: tide-line reveal, pine settle, handover ribbon
- Tabular numerals on all counts/times; opaque inputs; visible focus rings
- `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast` support
- Living style guide: `design/system-preview.html` (`scripts/build-style-guide.py`)
- `design/armonia.tokens.json` synced with the shipped `:root`
- Figma: [Armonia Thassos — Design System v2](https://www.figma.com/design/chWjXFxyCaFzFC6438lk4N)
  — 74 variables, 12 text styles, 3 elevation styles, motion specs
  - Material page: stone / pine / sea / courtyard / sea-gap plates + grain overlay,
    and the four-step hero treatment recipe (placeholder until real photography)
  - Widgets page: ~24 widgets — rings, streak, charts, level meter, field states,
    stepper, toggle, checklist, slider, date chips, avatars, status pills, presence,
    toast, banners, sheet, chat, media grid, dropzone, calendar, empty state
  - Screens: Login, Home, Übergabe, Plan, Lager, Liste, Galerie, Zo-Ai
  - Kids page: child mode reframed as a student app — level and star economy,
    Stundenplan with now-line, Aufgaben with progress, Belohnungen, Lernen quiz
- Cache `paidia-v78`

## v77 — 2026-08-21

- Design polish: denser Home signals/cards, glass command bars, pine bulk bar
- Figma Redesign v2 page (Armonia mast + Liste/Lager/Store) — not the Inter wireframes
- Cache `paidia-v77`

## v76 — 2026-08-21

- Multipage hash routes: `#home`, `#shop/plan|take|store`, full `#schedule/*`, `#stock`, …
- Select + sticky bulk actions on Liste, Lager, and supermarket store mode
- Compact informative Home (4 signals: due, overdue, list, stock)
- Figma: [Armonia Ops — Multipage Redesign](https://www.figma.com/design/PCNyO5gOJ1Q49WsJJkOpmu)
- Docs: `docs/agents/PUSH_ORIGIN.md` (ANGUELdad push / Cloud Agent 403)
- Cache `paidia-v76`

## v75 — 2026-08-20

- Shop hub: Plan / Mitnehmen, Auto aus Lager, take-list by aisle
- Schedule calendar month view + `#schedule/calendar` deep link + ICS export
- Kids rewards/chores (⭐ tab) with AI verify + admin Aufgaben-Zentrale
- Game win XP grants; notification quiet hours, lead time, app badge, Friday shop reminder
- Cache `paidia-v75`

## v74 — 2026-08-19

- Momente tab paints immediately (skeleton) then refreshes in the background
- Groq chat remaps retired `llama-3.3-70b-versatile` → `openai/gpt-oss-120b`; OCR stays `qwen/qwen3.6-27b`
- `/api/health` reports per-model Groq catalog status and refuses direct (IPv6) Postgres hosts
- Cache `paidia-v74`

## v69 — 2026-08-06

- UX Phase 1: Home one composition (mast + shift + signals + today; rest under “Mehr”)
- Plan/matrix day headers show full dates; mobile day chips include year
- Stock drafting pine (not blue); tutorial/help/import off indigo
- Talk stays a dedicated dock tab (label “Talk”)
- Admin Automationen panel for local notification rules (shift / stock / late / banner)
- Cache `paidia-v69`

## v68 — 2026-08-06

- Expanded agent knowledge / memory / token-reduce maps for all major code areas
- `docs/agents/BIOMETRICS.md` — iPhone Face ID + Android fingerprint setup
- Cold-boot `gate.js` Face ID / fingerprint login (primary CTA) + version chip on PIN
- Login always shows version + what changed (DE/EL)

## v67 — 2026-08-06

- Agent knowledge / memory / token-reduce maps (`docs/agents/`, `AGENTS.md`)
- Login screen shows app version + what changed (`build.json`)
- Biometrics-first gate CTA + WebAuthn env docs
- Admin broadcast HTML preview + bilingual email bodies
- Stronger notifications UX; child portal Mitteilungen + install/how-to instructions
- Admin broadcast optional in-app banner for online staff/kids; WebAuthn origin soft warning
- Zo-Ai Omni/knowledge tighten; learn/quiz/caption via same LLM helper; admin broadcast/event drafts
- Web Push deferred — see `docs/agents/WEB_PUSH_LATER.md`

## v66 — 2026-08-06

- Schichtbuch journal (append ink, duty banners)
- Home shift-start checklist + presence panel / notifications
- Per-person calendar (Apple .ics, Google, Outlook) with 30‑min alarms
