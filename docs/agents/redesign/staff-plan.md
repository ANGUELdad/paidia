# Redesign — Staff Plan / Schedule (`data-tab="schedule"`)

Surfaces reviewed: `.qa-screens/v245-final/{pc,phone}-staff-schedule{,-week}.png` (v245).

**The two PC captures are byte-identical, and so are the two phone captures**
(`shasum`: `0588945…` / `cb016cc…`). That is not a QA slip — `setScheduleView()`
and `recalledScheduleView()` both fall back to `'week'` (app.js:8213, 8218), so
"open Plan" *is* "open the week". There is no screenshot of the day view in this
set, and the day view is the one staff on shift actually need. That fact drives
most of what follows.

---

## 1. What this page is for

Plan is the digital form of the paper *Wochenplan* that the house fills in at the
Monday 13:30 Besprechung: seven days × three blocks (`BLOCKS`, app.js:2556–2560 —
Vormittag 10–14 by house, Nachmittag 15–19 by person, Abend 19–22 by house), with
activity, children, assignee and time per cell.

Two different people arrive with two different questions:

- **Authoring** (admin, Monday, big screen): "is the week covered, and where are the
  holes?" — needs the whole grid at once, plus the four bulk-fill routes.
- **Consuming** (carer, mid-shift, phone): "what am I doing next and who is with
  me?" — a one-day, one-person question.

The page currently answers the authoring question by default, on both surfaces.
On the phone — the primary surface for staff on shift — that is the wrong
question, and it costs the whole first viewport.

---

## 2. Read of the current design

### Phone (393×852), in the order the eye receives it

Eleven rows of chrome before one byte of plan data:

| # | Row | Source | ~Cost |
|---|---|---|---|
| 1 | Fixed app header | shell | 56px |
| 2 | `Tag / Woche / Kal / •••` sticky | `.planner-focus-switch`, app.js:10173–10178 | 48px |
| 3 | `Alle / Kalyvia / Limenaria` | `.planner-mobile-house`, app.js:10179–10182 | 44px |
| 4 | `WOCHE 7.9.–13.9.2026` + Besprechung chip | `.plan-week-range`, app.js:8990–8994 | 44px |
| 5 | `Agenda | Tabelle` | `.week-layout-seg`, app.js:8962–8965 | 52px |
| 6 | `‹ / Diese Woche / date / ›` | `.week-switcher`, app.js:8939–8946 | 52px |
| 7 | `＋ Eintrag` | `.plan-hero-cta`, app.js:8998 | 52px |
| 8–9 | `Foto → Woche` + `Mit Text füllen`, then `Woche importieren` | `.week-ai-bar`, app.js:8948–8953 | 92px |
| 10 | `21 / 6 / 2` big figures | `.plan-week-summary`, app.js:9002–9006 | 90px |
| 11 | `MO 3 · DI 3 · MI 4 …` | `.week-jump`, app.js:8920–8930 | 66px |
| 12 | `WOCHE / Wochenprogramm / Alle sieben Tage · …` | `weekAgendaBoardHtml` header, app.js:8604–8607 | 76px |

Rows 5–9 are each a full-width row only because `mobile.css:1429` sets
`.plan-week-chrome-actions{grid-template-columns:1fr}`. "Montag" — the first real
content — lands at roughly y≈780, which is the top edge of the dock. **At the
default view, on the primary surface, the plan is entirely below the fold.**

v245 §3 (`ui-v245.css:150–204`) already did the right things here: it dropped the
third duplicated Lagercheck banner, hid `.week-ai-clear:disabled`, demoted
`.week-ai-photo` to an outline button so `＋ Eintrag` is the sole filled primary,
and fixed `Diese Woche` rendering its own "you are here" state at `opacity:.55`.
That pass fixed *button weight*. It did not reduce the *number of rows*, which is
the actual problem — and row count is what pushes content past the fold.

**Three specific things in this stack do not work as designed:**

1. **`Agenda | Tabelle` is inert on a portrait phone.** `viewScheduleWeek()` hard-forces
   `effectiveLayout = portraitMobile ? 'agenda' : layout` (app.js:8858). Tapping
   *Tabelle* calls `setWeekLayout('matrix')`, re-renders the agenda anyway, and adds a
   `.week-rotate-coach` banner telling you to rotate the phone (app.js:8955–8960).
   Worse, `WEEK_LAYOUT_KEY` is a single shared `localStorage` key
   (`'paidia.weekLayout'`, app.js:8101), so a Pro user who ever chose *Tabelle* on
   desktop sees *Tabelle* highlighted on their phone while the agenda renders. A
   segmented control that shows the wrong state and cannot change the output should
   not be on the page.
2. **`•••` is dead on the phone.** It proxy-clicks `.adaptive-chrome-summary`
   (app.js:23681–23683), which lives inside `.planner-chrome-wrap` — and
   `ui-v244.css:299–303` sets that wrapper to `display:none` on both phone shells.
   `display:none` on an ancestor kills the whole subtree, so the bottom sheet cannot
   paint. Its only unique payload is *Dienst* and *Events*, which means **those two
   views are unreachable from the phone except by typing `#schedule/shift`.** Worth a
   device confirm, but the cascade reads unambiguously.
3. **Two of the three summary labels describe the wrong number** (app.js:9002–9006).
   `21` is `weekEntries.length`, the whole week, labelled `dueToday` = "Heute zu
   tun". `6` is `activeDays`, labelled `viewDay` = "Tag". Only `2 Ohne Person` is
   honest. The one figure that matters most — unassigned — is also the only one that
   isn't tappable.

### PC (1440×900, `/desk/`)

Same content, and the same problem one scale larger. Measured off the capture: the
view seg at y≈132, the week card at y≈235, then **four stacked full-width button
bars** (Foto → Woche, Mit Text füllen, Zo-Ai-Einträge leeren, Woche importieren)
occupying y≈294–470, the `21/6/2` figures at y≈511, the day rail at y≈596, and the
first schedule cell at **y≈800**. Roughly 795px of a 900px viewport is chrome.

Two causes, both citable:

- The four bars are full width because the base `.btn` carries `width:100%`
  (index.html:514) and only `.btn.sm` resets it (index.html:516). `Woche importieren`
  is `.btn.sm`, which is why it alone is auto-width. `.week-ai-bar` is
  `flex-wrap:wrap` (index.html:987), so three 100%-wide children wrap to three rows.
- v245's rules that fixed exactly this — hiding the disabled clear button, demoting
  the photo CTA — are inside `@media (max-width:899px)` (ui-v245.css:157). **On
  desktop the dead disabled "Zo-Ai-Einträge leeren" bar is still there**, still
  painting a full-width row that only ever means "nothing to undo".

### The week grid on PC: does it deliver?

No — and the reason is worth stating precisely, because the good grid already
exists.

`defaultWeekLayout()` returns `matrix` for Pro on desktop (app.js:8171–8176), so
the PC capture shows `matrixBlock` (app.js:8967–8980). That is **three independent
`matrixView()` tables stacked vertically** — morning (houses × days), afternoon
(persons × days + an unassigned row), evening (houses × days). Each one emits its
own `.matrix-toolbar`, its own sticky 7-column day header, its own `⛶ Vollbild`
button and its own "Tabelle · seitlich scrollen · Zelle = hinzufügen" hint. The
7 day columns are therefore declared three times and aligned by coincidence, not
by grid.

Both affordances are false on desktop: `matrixView` sets
`--matrix-min: min(120 + 7×132, 1180)` = **1044px** (app.js:8675) inside a
`.planner{width:min(100%,1180px)}` column (ui-v110.css:2604–2609), so the table has
~136px of slack and never scrolls sideways. The hint tells you to do something
impossible; fullscreen buys you nothing.

Meanwhile `body.layout-desktop .week-agenda-board` **is** a real week grid —
`grid-template-columns: repeat(7,minmax(0,1fr))` with each day column split into
the three blocks (ui-v110.css:3420–3436). It is well built and it is not the
desktop default. The single-grid week the page wants is half-written already; it is
just gated behind the *Agenda* option that Pro desktop users never pick.

### Density: fixtures vs. reality

The fixtures are not as sparse as they look — 21 entries across the week, day
counts 3/3/4/4/5/2/0 — but they are sparse *per cell*: never more than one entry,
which is why every visible cell reads `Leer · tippen`. The real shape is 2 planning
houses (`h1`,`h2`), **8 employees**, 12 children, 3 blocks. A genuinely full week is
7 × (2 morning + 8 afternoon + 2 evening) ≈ 84 entries across 91 cells.

Two failures appear only at that volume, so neither is in any screenshot:

- **Desktop: nested scrolling in the one table that matters.** `.matrix` carries
  `max-height:min(70vh,640px); overflow:auto` (index.html:1162–1165). The afternoon
  person table is `8 employees + 1 unassigned = 9 rows × 56px + 42px header = 546px`
  — it fits at today's headcount. Hire two more carers and it becomes a 644px body
  in a 630px box: a nested vertical scroller, with its own sticky header, inside the
  page scroller. The failure mode is invisible until staffing changes.
- **Phone: a ~4300px scroll with no way back to the rail.** A dense day card is
  ~580px (day head + 3 block heads + ~8 compact entries + footer), so seven of them
  stacked (`ui-v110.css:3548–3554`) is a four-screen-plus scroll. `.week-jump` is a
  horizontal scroller (ui-v244.css:307–319) but **is not sticky** — only
  `.planner-focus-switch` is (ui-v110.css:2869–2882). Once you are inside Wednesday
  you must scroll ~1700px back up to change day.

**The dense case is the common case**, and both surfaces are tuned for the sparse one.

### The matrix can silently hide entries

`houseTable` filters on `entryHouseIds(e).includes(h.id)` (app.js:8865) and
`personRows` on `entryEmployeeIds(p.id)` (app.js:8884). So a morning or evening
entry with **no house** assigned appears in no cell of the *Tabelle* view at all.
The agenda board shows everything (`weekAgendaBoardHtml`, app.js:8576–8589). Two
views of the same week disagree about what exists in it — and the one that drops
rows is the desktop default.

### Deliberate decisions that are good — leave them alone

- **Three blocks with per-block assignee semantics** (house / person / house) mirrors
  the paper form the staff already reason in. Do not normalise this away.
- **`weekJump` counts per day** (app.js:8922–8927) — "which day is thin" answered in
  one row. Best information density on the page.
- **`cellItems` inline `×` remove** (app.js:8834) with `data-remove-entry` — editing
  the grid without opening a sheet is right for authoring.
- **The empty-cell affordance** `Leer · tippen` + `data-cell` action string
  `date|block|house|person` (app.js:8866–8869) — tapping a hole creates the entry
  pre-scoped to that hole. Genuinely good, and the reason a grid beats a list here.
- **v245's single-primary rule.** Keep `＋ Eintrag` as the only filled green button.
- **`matrixView` as a shared primitive** across plan and `shift-roster`.

### Answering the IA question directly

There are not three levels of view-switching; there is **one legitimate axis, one
misfiled axis, and one axis that should not exist.**

| Control | Real axis | Verdict |
|---|---|---|
| `Tag / Woche / Kal` | time zoom (1 / 7 / ~30 days) | Defensible. This is what a segmented control is for. `Kal` overlaps Buch — see §5. |
| `Dienst / Events` (behind `•••`) | *different dataset*, not a zoom | Misfiled. Shifts and announcements are not zoom levels of the schedule. Currently unreachable on phone anyway. |
| `Agenda / Tabelle` | representation | Should not exist as a user choice. It is a function of viewport width, it is inert on portrait phones, and its state is shared across devices via one localStorage key. |
| `Alle / Kalyvia / Limenaria` | scope filter | Legitimately orthogonal — but it is emitted **twice** (`#hFilter` app.js:10167–10170 and `.planner-mobile-house` app.js:10179–10182), and it changes rarely enough to be a chip rather than a row. |

The view seg is likewise emitted twice — `#schView` (app.js:10160–10165) and
`.planner-focus-switch` (app.js:10173–10178) — with `ui-v110.css:2611–2612` hiding
one pair on desktop and `ui-v244.css:299–303` hiding the other on phone. Both copies
are always in the DOM; each surface pays for the one it does not use.

### Entry creation: menu problem or four real jobs?

Four real jobs — they take four different inputs (a photo of the paper sheet, pasted
text, last week's rows, nothing) and have four different failure modes. That is not
redundancy.

But it is still misplaced, because **the choice is made before you look at the plan,
not while you read it.** Bulk-filling a week is a once-a-week authoring decision; it
does not deserve permanent residence in the header of a view that is opened every
shift. One tap deep is the right depth. Also note `Woche importieren` is `pro-only`
while the other three are not, so the row's shape changes between Easy and Pro — a
menu absorbs that variation for free.

### Gestures: swipe does not exist

`data-week-swipe` is **queried but never emitted** — `rg` across the repo finds only
the `querySelector` (app.js:23926) plus a `weekSwipeHint` string (app.js:247) and a
`.week-swipe-hint` rule duplicated into all four shells (index.html:1001), neither of
which is rendered either. The whole feature is orphaned.

And if it were wired, it would not do what the brief assumes: the handler steps
`week[idx±1]` — **one day, within the current week** — and returns early at the
boundaries (app.js:23941–23945), so you could never swipe from Sunday into the next
week. Day stepping is already covered by `.week-jump`. Whatever is wired up here
should step ±7 days, matching the week range in the header.

---

## 3. Three plans

### Plan A — Tighten

**Idea in one line:** reclaim the first viewport on both surfaces by deleting rows
that restate each other or cannot work, with CSS only.

A new `ui-v246.css` §Plan, wired after `ui-v245.css` in all four shells and
allowlisted in `server.py` + `api/index.py` (same pattern as v245).

*Phone (`body.shell-m[data-tab="schedule"] #view …`)*

| Change | Selector | Why | Saves |
|---|---|---|---|
| Hide the layout toggle in portrait | `.week-layout-seg{display:none}` inside `@media (max-width:899px) and (orientation:portrait)` | `effectiveLayout` is forced to `agenda` at app.js:8858; the control cannot change the output | 52px |
| Hide the agenda board's own header | `.week-agenda-shell > header{display:none}` | It says "WOCHE / Wochenprogramm / Alle sieben Tage · Vormittag · Nachmittag · Abend" directly beneath a card already headed "WOCHE 7.9.–13.9.2026" | 76px |
| Collapse the summary to one line | `.plan-week-summary{display:flex;gap:12px;border-top:0;margin-top:8px}` + `b{font-size:14px}` | `ui-v213.css:960–964` already wrote this as `.compact`, but `ui-v110.css:2693` wins on specificity (0,2,1 vs 0,2,0) and re-applies a 3-col grid with 24px figures. This just restores the intended rule. | 55px |
| One row for the fill actions | `.week-ai-bar{grid-auto-flow:column;grid-template-columns:none;overflow-x:auto;scrollbar-width:none}` overriding `ui-v244.css:365–376` | Four chips on one scrollable row instead of a 2-col grid plus a full-width `importWeek` (`mobile.css:1508–1511`) | 46px |
| Make the day rail sticky | `.week-jump{position:sticky;top:calc(100px + env(safe-area-inset-top,0px));z-index:17;background:rgba(247,248,245,.97);backdrop-filter:blur(12px)}` | The dense-week fix: keeps day switching reachable through a 4000px scroll. Pairs with the existing `.planner-focus-switch` sticky at `ui-v110.css:2869–2882`. | — |

≈229px reclaimed. "Montag" moves from y≈780 to y≈550 — the day head plus its
Vormittag block clear the dock.

*PC (`body.shell-desk[data-tab="schedule"] #view …`)*

| Change | Selector | Why | Saves |
|---|---|---|---|
| Un-stack the fill bar | `.week-ai-bar .btn{width:auto}` | Neutralises the `width:100%` on base `.btn` (index.html:514); four bars become one row | ~150px |
| Hide the disabled clear | `.week-ai-bar .week-ai-clear:disabled{display:none}` | v245's rule for this is inside `@media (max-width:899px)`; desktop never got it | 44px |
| Drop the false affordances | `.week-roster .matrix-toolbar-hint, .week-roster .matrix-fs-btn{display:none}` | `--matrix-min` is 1044px in a 1180px column — it cannot scroll sideways, so "seitlich scrollen" and `⛶ Vollbild` are both untrue | 0 (removes noise) |
| Hide the day rail in matrix layout | `body.week-layout-matrix.layout-desktop[data-tab="schedule"] .week-jump{display:none}` | All 7 days are already columns; `data-week-focus` has no visible effect there | 66px |
| Delete dead rules | `ui-v110.css:2824–2837` (`.plan-hero-week` — zero occurrences in `app.js`) | Housekeeping | 0 |

First schedule cell moves from y≈800 to roughly y≈540.

**Cost:** one CSS file, one QA re-run (`scripts/qa-ui-audit-2026.mjs`,
`scripts/qa-iphone-login-flow.mjs`), the usual cache-bust checklist. **Risk:** low.
The sticky `.week-jump` needs a check against `matrix-fullscreen`, which hides
`header` and `.bottom-panel` (index.html:1195) but not sticky page children.

**Leaves unsolved:** the three-level switcher; three tables instead of one grid;
Dienst/Events unreachable on phone; the mislabelled summary figures; the matrix
dropping house-less entries; nested scrolling at higher headcount; the week still
being the phone default.

```
PHONE — Plan A
┌──────────────────────────────────────┐
│ [A] Plan          ?  🔔2  DE  (A)   │
├──────────────────────────────────────┤
│  Tag  │ ▸Woche◂ │  Kal  │   •••     │ sticky
├──────────────────────────────────────┤
│ ▸Alle◂  Kalyvia  Limenaria           │
├──────────────────────────────────────┤
│ WOCHE 7.9.–13.9.2026  (Bespr. Mo)   │
│ [‹][Diese Woche][07/09/26][›]        │
│ ████████ ＋ Eintrag ███████████████ │
│ (Foto→Woche)(Mit Text)(Import) →    │ one scroll row
│ 21 Einträge · 6 Tage · 2 ohne Person│ one line
├──────────────────────────────────────┤
│[MO 3][DI 3][MI 4][DO 4][FR 5][SA 2]→│ STICKY
├──────────────────────────────────────┤
│ ╭─ Montag 7.9. ──────────────── 3 ─╮│ ← above the fold
│ │ Vormittag 10–14              1   ││
│ │  10:00  Kochkurs · Dora · Kalyvia││
│ │ Nachmittag 15–19             2   ││
├─ ─ ─ ─ ─ ─ dock ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
```

```
PC — Plan A (1220px content column)
┌──────┬──────────────────────────────────────────────────────────┐
│ nav  │ Plan · Woche                    Einfach|Pro  ? 🔔 DE (A) │
│ rail ├──────────────────────────────────────────────────────────┤
│      │ [Tag][▸Woche◂][Kal][Dienst][Events]  [▸Alle◂][Kal][Lim] │
│      │ WOCHE 7.9.–13.9.2026 (Bespr. Mo 13:30)                  │
│      │ [Agenda|▸Tabelle◂] [‹][Diese Woche][07/09][›] [＋Eintrag]│
│      │ (Foto→Woche)(Mit Text füllen)(Woche importieren)         │ one row
│      │ 21 Einträge   6 Tage   2 ohne Person                     │
│      ├──────────────────────────────────────────────────────────┤
│      │ Vormittagsprogramm                        10:00–14:00    │
│      │ Haus     │ MO │ DI │ MI │ DO │ FR │ SA │ SO             │ ← y≈540
│      │ Kalyvia  │ ·  │Koch│ ·  │ ·  │Dom │Koch│ ·              │
│      │ Limenaria│ ·  │ ·  │ ·  │ ·  │Dom │ ·  │ ·              │
│      │ Nachmittagsprogramm                       15:00–19:00    │ still a
│      │ Person   │ MO │ DI │ … (header #2 of 3)                  │ separate
└──────┴──────────────────────────────────────────────────────────┘ table
```

---

### Plan B — Restructure *(recommended)*

**Idea in one line:** one zoom axis, one week grid, one add affordance — and let the
viewport, not the user, decide agenda-vs-grid.

**B1 — Collapse the switcher to one axis, one copy.** In `viewSchedule()`
(app.js:10145–10203): keep `.planner-focus-switch` as the only zoom control, with
three items (Tag / Woche / Kal). Delete `.planner-more-toggle` (app.js:10177) and the
entire `.adaptive-chrome planner-chrome-wrap` block (app.js:10183–10196) — already
dead on phone per `ui-v244.css:299–303`, so on phone this deletes DOM nobody can
reach, and on desktop the seg simply renders inline. Move `shift` and `events` into
the dock **Mehr** sheet as `data-more-act` rows (wired at app.js:24882–24886), which
also makes them reachable on the phone for the first time. Collapse the two house
rails to one `.planner-mobile-house`, rendered on both surfaces; drop `#hFilter`.
Retire `#plannerMoreToggle`'s proxy-click handler (app.js:23681–23683).

**B2 — Delete `Agenda / Tabelle` as a user control.** Remove `.week-layout-seg`
(app.js:8962–8965), `weekLayout()` / `setWeekLayout()` / `weekLayoutExplicit()` /
`syncWeekLayoutToUiMode()` (app.js:8177–8198) and both localStorage keys
(app.js:8101–8102). `effectiveLayout` becomes a pure function of viewport: agenda
below 900px, grid at and above. That also retires `.week-rotate-coach`
(app.js:8955–8960, index.html:990–997) and the `weekRotateCoach`,
`weekMatrixPortraitHint`, `weekPortraitOnly`, `weekShowFull`, `weekShowDay`,
`weekSwipeHint` strings, plus the layout-gating block at `ui-v110.css:3032–3038`.
Landscape phones keep one escape hatch: a `Tabelle` action that calls the existing
`enterMatrixFullscreen()` (app.js:8719–8732).

**B3 — Make the desktop week ONE grid.** Replace `matrixBlock` (app.js:8967–8980)
with a single `matrixView()` call. Extend `matrixView` (app.js:8674–8705) to accept
group rows — `{group:'morning', label:'Vormittag', hrs:'10:00–14:00'}` — rendered as
a **new** `.matrix-row-group` class (no such selector exists today; it would live in
`ui-v246.css` next to `.matrix-row`, index.html:1167) spanning
`grid-column:1/-1`, then the existing house rows,
then the afternoon group with person rows + unassigned, then evening. One 7-column
header, sticky once. One label column. One scroller. Roughly 25 lines in
`matrixView` plus ~40 in `viewScheduleWeek`; `--cols` stays 7 so
`index.html:1167–1168` needs no change. Raise `.matrix{max-height}` for
`.week-roster` specifically so the grid scrolls with the page instead of nesting
(index.html:1162–1165) — this is what removes the headcount cliff. Same treatment
solves the hidden-entry bug: add a `Kein Haus` row to the morning and evening groups
so `entryHouseIds(e).length === 0` entries are visible rather than filtered out at
app.js:8865.

**B4 — One add affordance, four jobs behind it.** `＋ Eintrag` stays the sole primary
in `.plan-week-chrome-actions` (app.js:8998). Replace `weekAiBar`
(app.js:8948–8953) with one `.btn.sm.sec` "Woche füllen" opening a sheet whose four
rows are named by their input: *Foto vom Wochenplan* (`aiSchedulePhoto`), *Text
einfügen* (`aiFillText`), *Letzte Woche übernehmen* (`importWeek`), and — when
`countAiOverridesInWeek()` is non-zero — *Zo-Ai-Einträge leeren* (`aiClearSchedule`),
which is where a destructive undo belongs anyway. The Easy/Pro shape difference
(`importWeek` is `pro-only`) disappears into the sheet.

**B5 — Make the summary tell the truth, and make it a control.** app.js:9002–9006:
new `weekEntriesStat` ("Einträge") and `activeDaysStat` ("Tage geplant") keys
replacing the borrowed `dueToday` / `viewDay`. Then make `unassignedCount` a button
that filters the week to `!entryEmployeeIds(e).length`. "Where are the holes" is the
question authoring arrives with; today it is rendered as decoration.

**B6 — Phone gestures worth having.** `.week-jump` becomes the sticky rail (per A) and
the primary day control. Then, in priority order:
1. Emit `data-week-swipe` on `.week-agenda-board` — it is queried at app.js:23926 and
   never rendered — and change the step from `week[idx±1]` to ±7 days
   (app.js:23941–23948) so the gesture matches the week range in the header. Add the
   existing `weekSwipeHint` string under the rail so it is discoverable.
2. Long-press a day card head → duplicate that day into tomorrow. The single most
   repeated authoring action; `planWeekImport()` (app.js:9057) already has the
   fingerprint/conflict logic to build it on.
3. Swipe-left on a `.schedule-agenda-entry` → reveal remove, replacing the permanent
   3mm `×` at app.js:8545.
4. Pull-to-refresh: do **not** add. The client DB is local; there is nothing to pull.

**Cost:** ~250 lines of template churn across `viewSchedule`, `viewScheduleWeek`,
`matrixView`; new grid CSS; ~8 CSS blocks become dead and should be deleted in the
same pass. **Risk:** `matrixView` is shared with `viewShifts` via `.shift-roster`
(index.html:1011–1014, ui-v110.css:2860–2863) — grouping must be purely additive.
The tour anchors `data-tour="plan-views"`, `plan-house` and `plan-add` all sit on
nodes this plan moves; update per `docs/agents/TOUR_SYSTEM.md` or the spotlight will
point at nothing. `ROUTE_SCHEDULE_VIEWS` (app.js:8096) must keep accepting
`shift`/`events` so existing `#schedule/shift` links survive the move to Mehr.

**Gains:** phone drops from 11 chrome rows to 4 with the week starting in the first
viewport; desktop gets a genuine 7-day grid with the afternoon roster — the "who is
working" answer — visible without a scroll; two views of the same week stop
disagreeing; Dienst and Events become reachable on a phone.

```
PHONE — Plan B
┌──────────────────────────────────────┐
│ [A] Plan          ?  🔔2  DE  (A)   │
├──────────────────────────────────────┤
│  Tag  │ ▸Woche◂ │  Kal      ·Alle▾  │ sticky: zoom + scope chip
├──────────────────────────────────────┤
│ 7.9.–13.9.  ‹ ›     [＋ Eintrag]    │
│ 21 Einträge · 6 Tage · [2 ohne P.]→ │ tappable filter
│                     (Woche füllen ▾)│ 4 jobs, one tap deep
├──────────────────────────────────────┤
│[MO 3][DI 3][MI 4][DO 4][FR 5][SA 2]→│ STICKY · swipe = ±7 Tage
├──────────────────────────────────────┤
│ ╭─ Montag 7.9. ──────────────── 3 ─╮│
│ │ Vormittag 10–14              1   ││
│ │  10:00 Kochkurs · Dora · Kalyvia ││
│ │ Nachmittag 15–19             2   ││
│ │  15:00 Strand · Karin · Simon,Kai││
│ │  17:00 ＋ Noch nichts geplant    ││
│ │ Abend 19–22                  0   ││
│ ╰──────────────────────────────────╯│
│ ╭─ Dienstag 8.9. ────────────── 3 ─╮│
├─ ─ ─ ─ ─ ─ dock ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
```

```
PC — Plan B (one grid, one header, one scroller)
┌──────┬───────────────────────────────────────────────────────────────┐
│ nav  │ Plan · Woche                       Einfach|Pro  ? 🔔 DE (A)  │
│ rail ├───────────────────────────────────────────────────────────────┤
│      │ [Tag][▸Woche◂][Kal]   ·Alle Häuser▾      (Woche füllen ▾)    │
│      │ WOCHE 7.9.–13.9.2026 ‹ › · Bespr. Mo 13:30       [＋ Eintrag]│
│      │ 21 Einträge · 6 Tage geplant · [2 ohne Person]→               │
│      ├───────────┬────┬────┬────┬────┬────┬────┬────────────────────┤
│      │           │ MO │ DI │ MI │ DO │ FR │ SA │ SO   ← ONE header  │
│      │           │ 7.9│ 8.9│ 9.9│10.9│11.9│12.9│13.9                │
│      ├─ VORMITTAG 10:00–14:00 ───────────────────────────────────────┤
│      │ Kalyvia   │ ·  │Koch│ ·  │ ·  │Dom │Koch│ ·                  │
│      │ Limenaria │ ·  │ ·  │ ·  │ ·  │Dom │ ·  │ ·                  │
│      │ Kein Haus │ ·  │ ·  │ ·  │ ·  │ ·  │ ·  │ ·   ← no longer    │
│      ├─ NACHMITTAG 15:00–19:00 ──────────────────────────── hidden ──┤
│      │ Dora      │Str │ ·  │Str │ ·  │ ·  │ ·  │ ·                  │
│      │ Karin     │ ·  │Bast│ ·  │Bast│ ·  │ ·  │ ·                  │
│      │ Dimitris  │ ·  │ ·  │ ·  │ ·  │Fuß │ ·  │ ·                  │
│      │ … 5 more  │    │    │    │    │    │    │                    │
│      │ Ohne Pers.│ ·  │ !  │ ·  │ !  │ ·  │ ·  │ ·                  │
│      ├─ ABEND 19:00–22:00 ───────────────────────────────────────────┤
│      │ Kalyvia   │ ·  │ ·  │Film│ ·  │ ·  │ ·  │ ·                  │
│      │ Limenaria │ ·  │ ·  │ ·  │ ·  │ ·  │ ·  │ ·                  │
│      └───────────┴────┴────┴────┴────┴────┴────┴────────────────────┘
│      │ ▸ Hinweise der Woche                                          │
└──────┴───────────────────────────────────────────────────────────────┘
```

---

### Plan C — Rethink

**Idea in one line:** Plan is two products sharing a URL — a weekly authoring tool
and a per-shift "what's next" — so split it along that seam and stop shipping the
authoring view to the phone.

The premise to question is the default. `recalledScheduleView()` returns `'week'`
(app.js:8213), so every carer opening Plan mid-shift lands in the authoring
surface: a 7-day form, four bulk-fill routes, a week-notes editor. They wanted one
day and their own name.

- **Phone default becomes Tag, scoped to me.** `viewScheduleDay()` (app.js:8612–8655)
  already renders exactly the right thing — `dayProgramFlowHtml()` gives three
  blocks with timed entries, and it is the view with the *lowest* chrome cost. Add a
  "nur meine" scope alongside the house filter (`entryEmployeeIds(e).includes(me)`)
  and it answers the shift question in the first viewport with no grid at all. The
  week becomes a "ganze Woche" link, not the landing page.
- **Week authoring becomes a destination, not a tab.** A `Wochenplan` editor reached
  from Besprechung / Admin, desktop-first, where the grid, OCR, text-fill and import
  live together and chrome cost is fine because authoring is why you came. This is
  where Plan B's single grid lands, with a keyboard.
- **Merge `Dienst` into the grid's afternoon group.** `personRows` (app.js:8881–8902)
  and `viewShifts()` are both "who is on, per person, per day". Drawing the same
  table twice under two names is why the switcher needed five items.
- **Fold `Kal` + `Events` into one `Termine` destination, or into Buch.**
  `viewScheduleCalendar()` (app.js:10069–10143) already renders a month grid *plus*
  `dayOpsSummaryHtml` *plus* Wichtige Termine *plus* the six upcoming published
  events — which is most of what a separate Events view and much of what Buch
  already do. Three destinations, one job.

Net: Plan's switcher goes from five items on one control to **Tag / Woche**, and two
whole views leave the page.

**What would have to be true.** (a) Carers on shift really do arrive with a one-day
question — testable from `sessionStorage` view recall (`SCHEDULE_VIEW_LAST_KEY`,
app.js:8202) rather than guessed. (b) Week authoring is genuinely concentrated in the
Monday meeting on a big screen; if admins author from a phone on the ward, the phone
still needs a usable grid and C is wrong. (c) `viewShifts()` really is the same data
as the afternoon person table — it may model 24h cover and `handover` (`h24`,
`handover` strings at app.js:846) that the 15–19 block cannot express, in which case
the merge in C is unsafe and only the visual unification survives.

```
PHONE — Plan C (default view)
┌──────────────────────────────────────┐
│ [A] Plan          ?  🔔2  DE  (A)   │
├──────────────────────────────────────┤
│  ▸Tag◂  │  Woche  │  Kal    ·Ich▾   │
├──────────────────────────────────────┤
│ MONTAG 7.9.2026        [＋ Eintrag] │
│ Besprechung: Mo 13:30                │
│ 3 heute · 1 ohne Person              │
├──────────────────────────────────────┤
│[MO][DI][MI][DO][FR][SA][SO]          │
├──────────────────────────────────────┤
│ Vormittag 10:00–14:00            1  │
│  10:00  Kochkurs                    │
│         Dora · Kalyvia · Julian gr. │
│ ─────────────────────────────────── │
│ ▶ JETZT · Nachmittag 15:00–19:00 2  │ ← the shift answer
│  15:00  Strand                      │
│         Karin · Limenaria · Simon…  │
│  17:00  ＋ Noch nichts geplant      │
│ ─────────────────────────────────── │
│ Abend 19:00–22:00                0  │
├─ ─ ─ ─ ─ ─ dock ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
```

PC in Plan C is Plan B's grid, moved behind a `Wochenplan` destination; the Plan tab
itself becomes the day view plus a week link.

---

## 4. Recommendation

**Plan B.** It fixes the actual defect — the page has no consistent grammar, and
three controls stacked before any content imply a hierarchy the task does not have —
without betting on unvalidated claims about who uses which surface. It also
*subsumes* Plan A: every A rule is a step B takes anyway, so A is not wasted work.
Plan C is the right long-term shape but it depends on usage data nobody has yet
(see §5); B is a prerequisite for C either way, because C's authoring destination
needs B3's single grid to exist first.

**Ship today: Plan A's phone half.** Four rules in a new `ui-v246.css` §Plan:

1. `.week-layout-seg{display:none}` in portrait — it cannot change what renders
   (app.js:8858), and it shows desktop's state via a shared localStorage key.
2. `.week-agenda-shell > header{display:none}` — it restates the card above it.
3. `.plan-week-summary` back to one line — restoring `ui-v213.css:960–964`, which
   `ui-v110.css:2693` currently overrides on specificity.
4. `.week-ai-bar` to a single scroll row.

That is ~229px, no template edits, no behaviour change, and it moves Monday's
Vormittag block above the dock on the surface staff actually hold. It is measurable
with the two scripts already in the repo, and it is the one change on this page
where "correct" and "shippable in an afternoon" coincide.

Second, still small, still today if the first goes clean: the summary label fix
(app.js:9002–9006). `21` labelled "Heute zu tun" when it is the week total is the
page stating something false, and it is a two-string diff.

---

## 5. Open questions for the owner

1. **Who opens Plan on a phone, and what do they open it for?** The whole
   phone-vs-desktop split in Plan C rests on this. `SCHEDULE_VIEW_LAST_KEY`
   (app.js:8202) already records the last view per session — reading it for a few
   weeks answers it without a survey.
2. **Is the week authored on a phone, ever?** If the Monday Besprechung is done on a
   phone or iPad rather than the PC, the desktop-first grid in B3 is the wrong
   investment and the phone needs a real editing surface instead.
3. **Is `Dienst` the same data as the Nachmittag person table?** If `viewShifts()`
   models 24h cover and handover that the 15–19 block cannot express, the merge in
   C is unsafe and `Dienst` needs to stay a separate dataset.
4. **Should `Kal` exist on Plan at all, given Buch?** `viewScheduleCalendar()` renders
   a month grid, day ops, Wichtige Termine and upcoming events — a lot of which Buch
   also owns. Which of the two is the calendar of record?
5. **What is a realistic full week?** I modelled 7 × (2 houses + 8 staff + 2 houses)
   ≈ 84 entries. If the true ceiling is 20 and the fixtures are already
   representative, the density work in B3 is over-engineering; if houses or headcount
   grow, the `max-height:min(70vh,640px)` nested-scroll cliff (index.html:1162–1165)
   needs fixing before it is hit.
6. **Which of the four fill routes actually gets used?** If `Foto → Woche` (OCR) is
   how the week really gets entered, it deserves more prominence than a sheet row,
   not less — the sheet in B4 is the right call only if usage is spread across all
   four. This is instrumentable via `data-page-act` in the existing handler
   (app.js:23684–23686).
7. **Should entries with no house be creatable at all?** Today they are creatable and
   then invisible in the Tabelle view (app.js:8865). Either the grid grows a
   `Kein Haus` row (B3) or the entry sheet should require a house — a product call,
   not a design one.
8. **Do carers need a personal scope filter ("nur meine")?** It is the cheapest path
   to making the phone answer the shift question, and it does not require any of
   Plan C — but only if "what am I doing" beats "what is the house doing".
