# Changelog

## v92 — 2026-08-22

Kid data can now persist. Two gaps, both closed.

- `chores`, `choreSubmissions`, `xpLog`, `gameStats`, `kidRatings` and `kidNotes`
  were in the localStorage set but **not** in the server's `OPS_KEYS`, so they
  never reached durable storage even when the database was healthy. They are now
  part of the synced set, with row caps, and `gameStats` registered as a dict key.
- `put_ops` is staff-only by design, so a child's device had **no write path at
  all**. New `POST /api/kid-ops` (mirrored in `api/index.py`): child session
  required, and it can touch only `kidRatings` and `kidNotes`.

Ownership is taken from the session and stamped onto every row server-side, so a
forged `kidId` in the payload is ignored rather than trusted. Rows belonging to
other children are preserved on write. Verified against local SQLite: a second
child cannot overwrite the first's rows, a row claiming `kidId: "k1"` sent from
k2's session is stored as k2's, staff keys sent to the endpoint are ignored, a
staff session is refused 403, and anonymous is refused 401.

Client pushes are debounced 900ms, since ratings fire on every star tap, and fail
soft when offline — the local copy still holds and the next save retries.

## v91 — 2026-08-22

Emoji removed from the interface chrome. The design doc has listed
"emoji used as primary iconography" as a placeholder to replace since v1, and it
was the single biggest thing still making the app read as dated.

- 18 stroke icons added to the existing sprite (check, tasks, calendar, book,
  camera, cart, sparkle, alert, megaphone, person, note, receipt, plus, clock,
  leaf, search, chat, party), on the same 24-grid and `currentColor` convention
  as the nav icons, with explicit sizing.
- New `ui(id)` helper; empty states, the Zo-Ai launcher and the visible chrome
  buttons now render icons instead of emoji.
- Content emoji deliberately kept: food categories and chore glyphs are *data*,
  and outline icons for milk vs butter would be worse for staff scanning a shelf.

## v90 — 2026-08-22

Three Kids surfaces from the Figma frames, built in the app.

- **Bewertungen** — weekly self-rating across Schule / Zuhause / Freunde / Wie
  ich mich fühle, five stars each, stored per ISO week per child, with a
  four-week trend showing the computed average.
- **Bonus** — derived, never stored, so it cannot drift from the chore and XP
  data it reads: streak, plus four earn conditions with their point values.
- **Notizen** — the child's own notes with a mood picker (Gut / Geht so /
  Schwer). Deliberately local to the device: these are the child's words and are
  not part of the shared ops blob staff sync between phones.

Reachable from Start; the dock keeps five items and highlights Sterne or Start
as appropriate rather than growing to eight.

All strings added in **both** DE and EL. New `kidRatings` / `kidNotes` keys added
to the persisted set.

## v89 — 2026-08-22

Responsive layout for every aspect ratio, not just phone-or-desktop.

The app had a single binary switch at 900px. An iPad at 768px therefore got the
phone layout with a **748px-wide "floating" dock pill** stretched across the
bottom — a phone control blown up rather than a tablet one. There was no tablet
tier at all, and almost no orientation handling.

Five tiers now:

- **<=359** compact phone / folded foldable — single column, tighter gutters,
  smaller dock labels.
- **360–599** phone (unchanged default).
- **600–899** tablet portrait, previously missing — content gets a 720px measure
  instead of running full-bleed, three-column dashboard.
- **900–1279** tablet landscape / small desktop — 900px measure, three columns.
- **>=1600** large desktop — 1080px measure, four columns.

Plus: landscape phones (`max-height:500px`) compress the header and dock and
drop to a denser grid; very short viewports tighten the shift card; and the
floating dock is capped at 560px and centred at *any* width where it is not the
desktop rail, with the Zo-Ai launcher aligned to its edge.

Measured at 320, 375, 430, 600, 768, 812x375, 1024, 1280 and 1680: no horizontal
overflow at any size.

## v88 — 2026-08-22

Load and reload fix. The app was re-downloading ~1.1 MB on **every** load and
reloading itself on top of that.

- **Service worker**: v83 went network-first on everything with
  `cache: 'no-store'` to kill stale bundles. That also bypassed the browser's own
  HTTP cache, so `index.html` + `app.js` (~1 MB) were re-fetched every load, and
  `activate` wiped every cache including icons. A `?v=N` URL is immutable by
  construction — the next release changes the URL — so versioned assets are now
  cache-first, the shell and `build.json` stay network-first with a cached
  offline fallback, and activate only drops *other* builds.
- **Reload loop**: `purgeStaleShell()` unregistered the worker, which forced a
  re-register, which fired `updatefound`, whose handler called `location.reload()`
  — which re-registered again. It no longer unregisters and no longer reloads;
  `app.js` also stopped registering a second worker in a race with `gate.js`.
  There is now no `location.reload()` anywhere in `gate.js`.
- **HTTP caching**: `app.js` was served `Cache-Control: no-store` (747 KB, every
  load). Version-stamped assets now get `public, max-age=31536000, immutable` in
  both `server.py` and `api/index.py`; the shell and `build.json` stay `no-store`
  so a release still lands immediately.

Net effect: first load unchanged, every subsequent load serves the bundles from
cache instead of the network.

## v87 — 2026-08-22

- Remaining staff screens brought onto the design system.
- **Foreign palettes removed.** 210 colour uses across 141 rules were Tailwind
  rose / emerald / amber (`#dc2626`, `#ecfdf5`, `#fbbf24`, `#fecdd3` …) — none of
  them an Armonia token. Remapped onto `--out` / `--in` / `--warn` and their
  tints, mapping by luminance so light washes stay washes and accents stay
  accents, preserving every text-on-background pairing.
- **Plan, Talk, Buch, Galerie heroes**: the last pre-redesign dark gradient
  cards, now stone canvas with sea eyebrow, Fraunces ink title and muted lead —
  matching Home. Kids/arcade heroes deliberately untouched (own direction, v79–80).
- **Zo-Ai launcher** now pine, not the pale brand-mark gradient.
- **Liste layout bug**: `.friday-picker` collapsed to 0 width inside a `nowrap`
  row, so the date label overflowed on top of the stepper. Given a real minimum
  and its own line on phones.
- Gallery hero contrast: helper lines were mark-a on stone (1.61:1). Now 6.37:1.
- Verified logged in at 375px and 1280px across Home, Plan, Lager, Liste, Talk,
  Momente.

## v86 — 2026-08-22

- Staff **Home** brought onto the design system. It had kept its pre-redesign
  structure while only the tokens shipped, which is why it still read as the old UI.
- Hero: dark gradient card -> stone canvas, sea eyebrow above a Fraunces wordmark,
  muted lead, pine primary action (matches the Figma "Home" frame).
- Shift banner: was a full-bleed crimson wash built on Tailwind rose
  (`#7f1d1d` / `#fecdd3`) — colours in no Armonia token. Now glass-1 with a 3px
  semantic accent edge and a 10% tint: pine by default, terracotta when late,
  success when done. Terracotta is an accent, never a wash.
- Step rows, marks and CTAs re-tokenised; desktop caps the primary action at 360px.
- Verified on mobile (375) and desktop (1280).

## v85 — 2026-08-22

- Fix the Neon data-transfer burn that exhausted the quota and took durable
  storage offline. `/api/ops` and the gallery are polled every 2.5s and each poll
  re-read the whole blob from Postgres — roughly 17 MB/hour per open tab.
- Added a 15s in-process cache for the two hot keys (`ops`, `gallery`), dropped
  on write so an instance never serves its own stale value. Measured: 20 polls
  now cost 1 database read instead of 20.
- The security/lockout key is deliberately left uncached — a stale read there
  would widen the PIN brute-force window across instances.
- TTL is tunable via `PAIDIA_DURABLE_TTL` (seconds; 0 disables the cache).
- Corrected the Greek login banner string, which had been left on v83 text.

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
