# Changelog

## v119 — 2026-08-24

- Kids is now a first-class mobile destination in the bottom navigation instead of being hidden behind More.
- The mobile Kids directory uses one-row filters, compact overview counters, and three readable signals per child instead of squeezing six desktop metrics into every card.
- Opening a child, changing a Kids section, or returning to the directory reliably resets the view to the top.
- Child profiles prioritize the anonymous weekly team evaluation, use touch-sized rating controls, and remove redundant mobile schedule clutter.
- Installed and long-lived PWA sessions detect a newer release manifest before app boot and perform one safe cache-busted refresh.
- Cache `paidia-v119`.

## v118 — 2026-08-24

- Child sessions never receive raw staff-evaluation records or evaluator identifiers; the server returns only anonymous weekly aggregates for the signed-in child.
- Staff sessions retain the full evaluator-owned records required to update the equal-weight weekly average.
- Child clients purge any raw v117 staff-rating cache and render exclusively from the anonymous server summary.
- Cache `paidia-v118`.

## v117 — 2026-08-24

- Every staff member can submit one weekly four-area evaluation for each child without overwriting the child's self-rating.
- Each child's weekly team score averages every participating staff member equally and shows the number of evaluators plus per-area averages.
- The shared weekly result is visible in the staff directory, child profile, child home, and the child's four-week evaluation trend.
- Cache `paidia-v117`.

## v116 — 2026-08-24

- Rebuilt the staff Kids directory around useful signals: grade average, weekly attendance, open homework, XP/level, and game wins.
- Child profiles now combine editable subject grades, attendance, homework, badges, self-ratings, and synchronized game progress in one dashboard.
- The child home screen now shows a school snapshot and a personalized next-game challenge alongside the existing 13-game arcade and rewards system.
- Game launches and personal bests are persisted per child in shared data, allowing staff and children to see the same progress across devices.
- Cache `paidia-v116`.

## v115 — 2026-08-24

- Closing the Profile sheet while its security and passkey cards are still loading no longer throws an async null-handler error or shows the generic crash toast.
- Includes the v114 calendar, next-shift handoff, late-alert, and truthful notification-delivery fixes.
- Cache `paidia-v115`.

## v114 — 2026-08-24

- The main Apple / `.ics` profile action now downloads the complete eight-week calendar immediately; Google and Outlook remain in the detailed calendar view.
- Shift end now identifies the next scheduled team member, includes that lookup in the Talk handoff, and automatically resumes after the required journal note is saved.
- Late check-ins create persistent admin inbox alerts with the employee, shift, time, and stated reason.
- Notification setup and testing now report actual delivery failure instead of showing a false enabled state.
- Cache `paidia-v114`.

## v113 — 2026-08-24

- Flattened the desktop Lager controls into a full-width toolbar with wrapping actions and no overlap.
- Fixed shift calendar lookup, Athens timezone metadata and `.ics` generation.
- Migrated granted notification permissions into the active preference store and retry failed deliveries.
- Made notification delivery await the service worker before marking alerts as sent.
- Added overnight shift lookup and reliable late-arrival prompts.
- Added confirmed automatic handoff summaries to Team Talk at shift end.
- Cache `paidia-v113`.

## v112 — 2026-08-24

- Restored a solid, labeled desktop navigation rail with readable contrast.
- Replaced the narrow shopping control rail with one centered toolbar and list flow.
- Removed duplicate shopping summaries and empty-state actions from the desktop page.
- Let text-bearing header controls size to their labels instead of clipping.
- Cache `paidia-v112`.

## v111 — 2026-08-24

- Rebuilt the mobile Home composition around one action, one checklist and one task list.
- Removed mobile dashboard summaries, secondary toolbars and decorative empty-state panels.
- Flattened Plan, Lager, Liste and Buch into section headers and work rows.
- Constrained all mobile actions and controls to the viewport to eliminate overlap.
- Cache `paidia-v111`.

## v110 — 2026-08-24

- Replaced the staff UI's layered glass/prototype styling with one flat operational design system.
- Converted plan, stock, shopping and logbook surfaces from decorative card stacks to compact work lists.
- Standardized typography, spacing, controls, navigation, states and responsive desktop/mobile chrome.
- Added `ui-v110.css` as a versioned final presentation layer so the overhaul is isolated and reversible.
- Cache `paidia-v110`.

## v109 — 2026-08-23
- Mobile UX reset: flat warm gate, scannable profile rows, calm solid work surfaces
- One-handed five-item dock; Momente, Kinder, Talk and Buch moved into a clear “Mehr” sheet
- Mobile Home hierarchy tightened: compact chrome, stronger primary action, four-column status strip
- Removed prototype styling on phones: decorative glass, floating cards and the content-obscuring Zo-Ai bubble
- Accessibility retained: 40–54px controls, visible focus states, semantic dialog/navigation labels
- Cache `paidia-v109`

## v108 — 2026-08-23
- Mobile Glass 2026 (Figma `07`): light frosted staff header on phone/tablet
- Ink-on-glass topbar buttons (bell, lang, profile) — matches browser frames
- Cache `paidia-v108`

## v107 — 2026-08-23
- Desktop header glass: ink-on-light topbar buttons (was white-on-white)
- Hit targets ≥44px (topbtn, chips, btn.sm); rail width locked to 220px with labeled nav
- Dock/nav pointer-events hardened on desktop
- Figma: page `07 — Mobile Glass 2026` (WEB FIRST browsers + iOS/Android + depth screens)
- Cache `paidia-v107`

## v106 — 2026-08-23
- PC desktop shell (≥900px): fixed 220px chrome sidebar with brand + Zo-Ai, not a stretched phone dock
- Dense Home: main column + right rail (Mitteilungen, Kinder, Schichtende)
- Schichtende sheet: Buch → Tasks → Handover → Abmelden
- Mitteilungen center from topbar bell; shop ops rail docked on desktop
- Cache `paidia-v106`

## v105 — 2026-08-22

Staff expansion roadmap (visual + school + Zo-Ai), one ship:

- **v102 visual:** Home shift ring + 7-day sparkline; Plan day-load ring; Lager history sparkline when log exists; hero stone texture; pine-settle motion; tutorial Liquid Glass + `ui(...)` icons; Kids/Zo-Ai tutorial steps; desktop denser home grid
- **v103 kids/school A:** Staff dock **Kinder**; profiles (XP, ratings, notes); `DB.subjects` / `subjectGrades` (1–5 stars); admin subject CRUD; child read-only subjects; Zo-Ai `subject_grade_set`, `kid_note_add`, `open_kid`
- **v104 SIS-lite:** Attendance day grid; homework list; subject timetable; Zo-Ai `attendance_set`, `homework_add`
- **Zo-Ai reliability:** Clearer success toasts (Lager/Liste/Plan/Schule); richer help context (children + subjects); Confirm still required (+ PIN for schedule)
- Ops sync: new keys on `/api/ops`; cache `paidia-v105`

## v101 — 2026-08-22

- Staff Liquid Glass 2026 from Figma prototype: frosted cards, floating chrome dock, Zo FAB label
- Kill remaining dark home/shift heroes so stone + pine always wins
- Cache `paidia-v101`

## v100 — 2026-08-22

- Staff Home: Figma mast (brand + greeting + lede), signal tiles, glass shift card, quieter “Mehr”
- Plan / Lager / Liste shells: ops heroes, widgets, pine bulk bar; mechanics unchanged
- Galerie / Talk / Übergabe / Zo-Ai: light heroes + glass panels; confirm flow untouched
- Staff chrome: dock inverted only; page-actions glass; planner icons → `ui(...)`
- Cache `paidia-v100`

## v99 — 2026-08-22

- Spiele hub: glass-1 tiles, featured snap-rail, pine-settle stagger, XP/streak chips
- Widget catalogue: `ringHtml`, `sparklineHtml`, `statTileHtml`, `miniCalendarHtml`
- Games: stroke icons where mapped; React sparkline from last 8 attempts
- Cache `paidia-v99`

## v98 — 2026-08-22

Accept the Supabase pooler URL as issued.

With v97 pointing writes at Supabase, the connection failed on `invalid URI
query parameter: "supa"`. Supabase tags its pooler URLs with a vendor marker
(`?supa=base-pooler.x`), and libpq rejects any query parameter it does not
recognise rather than ignoring it. `db.py` now filters the query string down to
libpq's own keywords before the URL reaches psycopg, so vendor extras are
dropped and `sslmode` and friends survive.

## v97 — 2026-08-22

Save to the database that still works.

The retired Neon store is connected to the project at "All Environments", so
Vercel re-injects its `DATABASE_URL` on every deploy no matter what the
environment rows say — and that URL wins on name order, sending every write to a
project whose transfer quota is exhausted. Reachability could not break the tie:
Neon accepts the TCP connection and only then fails on quota.

`db.py` now ranks candidate URLs instead of taking the first name that matches —
a reachable non-Neon host beats a reachable Neon one, unreachable hosts sort
last, and discovery order breaks ties within a rank. `PAIDIA_DATABASE_URL`
overrides the ranking outright when a specific URL has to win.

## v96 — 2026-08-22

Find the Postgres URL whatever the integration named it.

Vercel marketplace integrations allow a custom variable prefix, and the Supabase
install landed as `A_POSTGRES_URL` rather than `POSTGRES_URL` — so a correct
setup would still have reported no database. `db.py` now falls back to any
`*_POSTGRES_URL` after trying the explicit names. `POSTGRES_URL_NON_POOLING` is
excluded by construction: it does not match the suffix, and it is the direct IPv6
host Vercel cannot reach.

Verified: a prefixed pooled URL is found and passes the pooler check, a prefixed
non-pooled one is not preferred over it, and an explicit `DATABASE_URL` still
wins over everything.

## v95 — 2026-08-22

The Redis-REST backend now accepts either env-var convention: the legacy
`KV_REST_API_URL` / `KV_REST_API_TOKEN` pair and Upstash's own
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. Marketplace integrations
inject different names for the same endpoint, and guessing wrong would have
looked like "storage still broken" after a correct setup. Verified against the
stub under the Upstash naming.

## v94 — 2026-08-22

Durable storage without Postgres, and without Neon.

`db.py` gains a Redis-REST backend (Vercel KV / Upstash). The module's whole
public surface is `get_json` / `set_json` / `has_key` / `health` — a key-value
shape — so this is a natural second backend rather than a port.

Activates when `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set and no
`DATABASE_URL` is present, so Postgres still wins where it is configured and the
local SQLite path is untouched. Uses stdlib `urllib` only — no new dependency.
Security events use `LPUSH` + `LTRIM` to keep the same capped-log behaviour as
the SQL backend.

Vercel Blob was considered and rejected: its objects are served over URLs, and a
leaked or logged URL would be an unauthenticated read of caregiver and child
records. KV is private and token-authenticated.

Verified against a local REST stub: PING/SET/GET/EXISTS round-trip, JSON and
non-ASCII (Greek + German) survive intact, `get_json` honours its default, the
security log caps, SQLite is unaffected when KV is unset, Postgres takes
precedence when both are set, and a bad token raises and is reported by `health`
rather than failing silently.

## v93 — 2026-08-22

Stop reporting a successful save for a write that never reached the database.

`persist_ops_state()` discarded the result of the durable write. The /tmp copy on
Vercel always succeeds and is wiped when the instance recycles, so `put_ops`
returned 200 and staff were shown success for data that was already gone. It now
returns whether the write reached durable storage, `put_ops` and `put_kid_ops`
pass that back as `durable`, and the client shows a persistent red banner plus a
toast instead of a false confirmation.

Provider note: `db.py` already accepts Supabase poolers as well as Neon, so
moving to another free Postgres is a `DATABASE_URL` swap with no code change.

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
