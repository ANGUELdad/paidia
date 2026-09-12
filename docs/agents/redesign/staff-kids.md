# Staff — Kinder & Schule (`data-tab="kids"`)

Surfaces reviewed: `.qa-screens/v245-final/pc-staff-kids.png` (1440×900, `shell-desk`,
Pro, admin) and `.qa-screens/v245-final/phone-staff-kids.png` (393×852, `shell-m`).

Code under review:

| What | Where |
|---|---|
| Directory + pane router | `viewKids()` — `app.js` 18177–18247 |
| Profile | `viewKidProfile()` — `app.js` 18249–18328 |
| Attendance pane | `viewAttendanceGrid()` — `app.js` 18391–18405 |
| Wiring | `wireKidsView()` — `app.js` 18543–18600 |
| Row data | `childProgressSummary()` — `app.js` 17768–17797; `attendanceFor()` 17754 |
| Admin sheet | `sheetAdminKid()` — `app.js` ~18095–18167; `removeKidRecord()` 18168 |
| Base CSS | `index.html` 5264–5306, media blocks 5382–5393 and 5864–5906 |
| Desk CSS | `desk/desk.css` 422–727 |
| Phone CSS | `mobile/mobile.css` 1002–1014 (only the admin button row) |
| Correctness layers | `ui-v244.css` 57–63, 79–84; `ui-v110.css` 7166–7170; `ui-v213.css` 113 |

---

## 1. What this page is for

Two jobs are stapled together under one tab. The first is *roster*: a carer coming
on shift needs to know who is in the house today, who is missing, and who nobody
has accounted for yet. The second is *record*: someone — usually later, usually
sitting down — needs one child's week, and today that means their school grades,
their team rating, their notes, their pocket balance and their plan entries.

The page currently answers a third question that nobody asked: **"how is each
child scoring?"** The directory row is six numbers wide — Notenschnitt,
Anwesenheit, Hausaufgaben, Team-Wochenschnitt, XP·Lv, Spiel-Siege — and the
attendance state, the only shift-relevant field on the row, is the smallest and
faintest thing in it. The hero even says so out loud: `kidsHeroHint` =
"Schule, Entwicklung und Spiel-Fortschritt auf einen Blick".

---

## 2. Read of the current design

### PC (1440×900)

Eye order as the page actually delivers it:

1. **A 7-chip pane bar** (`kids-pane-tabs`, `app.js` 18217–18225). Kinder ·
   Anwesenheit · Hausaufgaben · Material · Verlauf · Stundenplan · Fächer.
   Seven co-equal chips, no grouping, no indication that the first one is the
   page and the other six are school sub-tools.
2. **Three big numerals** (`.kids-overview`, 18212–18216): 12 Kinder, 0 mit
   Noten, 0 Hausaufgaben offen. `desk.css` 447–481 gives this a 56px-tall
   full-width bar. Two of the three numbers are school-admin counts, neither is
   a shift question, and "12 Kinder" is a fact you can also get by counting the
   list directly beneath it.
3. **A filled pine "Kind hinzufügen" button** (`.kids-admin-bar`, 18227) — the
   only filled primary above the fold, and it is the rarest action on the page.
   A child is added maybe twice a season.
4. **Twelve identical rows**, and only then the children.

Inside a row (`desk.css` 497–629): the name gets a fixed `flex:0 0 132px`
column, then six metric cells at `repeat(6, minmax(70px,86px))` with
`width:max-content`. That is the density problem in one line — the metric block
is sized to its own content and then stops, so on a 1220px stage every row ends
around x≈730 and there is ~220px of dead white between the last number and the
admin buttons pinned right. The brief is correct that PC has unused width; here
the CSS *declines* it. The cost is visible: `Team-Wochenschnitt` clips to
"Team-Wochensc…" at 86px (`text-overflow:ellipsis`, `desk.css` 606–617) while a
fifth of the row is empty.

The six metric **labels repeat on every row** — 72 label strings on this
fixture, 150+ at a realistic roster. This is a table whose header has been
copied into each record.

Attendance is `<small class="kid-dir-att">` inside the name stack. On desk it at
least carries colour: `.att-present` pine, `.att-absent` `#c2410c`
(`desk.css` 578–594). But:

- **`.att-excused` has no rule anywhere** in any layer. "Entschuldigt" renders
  in the same `#5c6a63` grey as "kein Eintrag" — two states with opposite
  operational meaning, rendered identically.
- `.att-ok`, `.att-out`, `.att-late` (`desk.css` 579, 584, 588) are dead.
  `setAttendance()` (`app.js` 17758) only ever writes `present|absent|excused`.

### Phone (393×852) — the primary surface

Worse, and in a way that inverts the priority:

- **Attendance state is monochrome.** `ui-v244.css` 79–84 sets
  `body #view .kid-dir-att, .att-none, .att-absent { color:#5c6a63 !important }`.
  On desk the `body.shell-desk` rules out-specify it; on `shell-m` nothing does.
  So "Fehlt" and "kein Eintrag" are the same 12px grey word floated right by
  `.kid-dir-name small{margin-left:auto}` (`index.html` 5885). Confirmed in the
  screenshot: Simon "Fehlt" and Vincent "kein Eintrag" are visually identical.
- **The attendance percentage is the one metric explicitly deleted on phone.**
  `index.html` 5888–5890 hides `.kid-dir-metrics > span:nth-child(2)`, `(5)`
  and `(6)` — that is Anwesenheit, XP·Lv and Spiel-Siege. The phone keeps
  Notenschnitt, Hausaufgaben and Team-Wochenschnitt. School reporting survives
  the cut; the shift number does not. (It is also index-coupled: reordering the
  metrics in `viewKids()` silently hides the wrong three.)
- **Two admin buttons per child, full width.** `mobile/mobile.css` 1002–1013
  gives ✎ and ⌫ `flex:1 1 0` at 40–44px each. Every row therefore spends a
  second 44px band on Bearbeiten/Entfernen — destructive admin actions with
  glyph-only labels, permanently docked under each child, sized larger than the
  attendance state. At 25 children that is ~1100px of delete buttons.
- A card is ~150px tall, so **four children fit above the fold**. A 25-child
  roster is a six-screen scroll.
- **Kinder is not in the phone dock.** `index.html` 5865:
  `nav.dock .dock-secondary[data-tab="kids"]{display:none!important}`. It lives
  behind "Mehr". Answering "who is here today?" in under two seconds is
  currently impossible before you even reach the list.

### Privacy

The directory prints, per child, side by side and implicitly rankable: grade
average, attendance %, open homework, a **staff behaviour rating out of 6**,
XP/level, and game wins. Any staff role sees it (only ✎/⌫ and the Fächer pane
are behind `isAdminUser()`). On a phone carried around a house where children
are present, that is a leaderboard of children. None of it is needed to answer
the roster question.

One concrete leak, not a judgement call: `viewKidProfile()` 18264 renders
`DB.kidNotes` filtered on `kidId` only. The child's own Notizen tab writes into
the same collection with `{by:kidId, mood}` (`app.js` 19454, 19458). A child's
private mood diary therefore appears verbatim in the staff notes card,
undifferentiated from staff-authored notes, with no attribution rendered.

### Empty / low-data behaviour

The fixture is 12 children with almost no data, and **that is the common case**
for everything except attendance. Grades, homework, materials and game stats are
seeded empty; `kidsMetricEmpty` ("—") and `0` fill the row. So the six-metric
row costs its full width to say nothing twelve times. Attendance is the one
field that will be populated daily in real use — and it is the one field the
layout treats as an afterthought. The profile is the same shape at larger scale:
14 cards, most of which render `t('…Empty')` for a new child.

`viewKids()` 18181: `const kids=(DB.children||[]).filter(k=>!k.temporary || true)`
— `|| true` makes the predicate constant. Temporary children (`SEED.children`
2598, `Leonie`) were meant to be separable and are not.

### Deliberate and good — leave alone

- **`.kid-dir-row` is a grid of `[card | admin]`** (`ui-v110.css` 7167), so the
  destructive buttons are siblings of the open-button, not nested inside it.
  That is why `data-kid-remove` needs only `ev.stopPropagation()` and never
  mis-fires. Keep this structure in any restructure.
- **`data-open-kid` is honoured from outside the page** (`app.js` 6166 Zo-Ai
  actions, 23781 a home shortcut, 18398 the attendance grid). The profile is
  already a linkable destination; Plan C depends on that.
- **`kid-dir-av` uses each child's own `color`** rather than a generated hash.
  It is the fastest recognition cue on the row and the one thing that already
  scans. Make it bigger, not smaller.
- **Attendance history in the profile is editable in place** — `att-chip` with
  `data-att-cycle` (18274) cycles a day rather than opening a sheet. Correct
  pattern; it should be on the directory row too.
- `desk.css` 430 hides `.kids-hero` on PC because the title already lives in the
  top chrome. Right call, and the reason PC has no duplicated masthead.

---

## 3. Three plans

### Plan A — Tighten

**Make attendance the loudest field in the row and stop repeating the legend.**
CSS-only, in a new `ui-v246.css` loaded after `ui-v245.css`.

Changes:

1. **Give the state chip semantics on phone.** `ui-v244.css` 79–84 flattens all
   states to `#5c6a63`; scope the restoration tighter so it wins on `shell-m`
   without touching v244's WCAG intent:

   ```
   body.shell-m #view .kid-dir-att.att-present  → pine (--brand)
   body.shell-m #view .kid-dir-att.att-absent   → #c2410c   (desk's existing absent ink)
   body #view      .kid-dir-att.att-excused     → #8a5a00   (v244's darkened sun, both shells)
   body #view      .kid-dir-att.att-none        → keep #5c6a63
   ```

   `.att-excused` is new everywhere, not a re-proposal.
2. **Chip, not word.** `.kid-dir-att` gets `display:inline-flex`, a 4px radius,
   a tinted background at the matching hue and a leading dot. State becomes a
   shape you match at 400ms, not a word you read.
3. **Unrecorded is a row state, not a label.** `.kid-dir-row:has(.att-none)`
   gets a 3px left rule in `--line`; `:has(.att-absent)` gets it in `#c2410c`.
   Now "who is unaccounted for" is a vertical stripe pattern down the list.
4. **Phone shows the shift metric.** In `index.html` 5888–5890, swap the hidden
   set: hide `nth-child(1)` (Notenschnitt) and keep `(2)` Anwesenheit. Same
   three-cell budget, shift-relevant contents.
5. **PC takes the width it has.** `desk.css` 596–604 →
   `grid-template-columns: repeat(6, minmax(96px, 1fr)); width:auto; flex:1 1 auto`.
   Kills the "Team-Wochensc…" clip and the 220px dead gap in one declaration.
6. **Demote the rare primary.** `.kids-admin-bar .btn` → `.sec` treatment
   (`desk.css` 487, `mobile.css` 687). Shrink `.kids-overview > div` min-height
   72→56 on phone (`index.html` 5877).
7. **Phone admin row loses its bulk:** `mobile.css` 1008 `flex:1 1 0` →
   `flex:0 0 44px`, right-aligned. Two 44pt squares instead of two half-width
   bars.

Ship checklist: `build.json`, `APP_BUILD` in `gate.js`, `?v=` in
`gate.js` / `index.html` / `sw.js` / the `app.js` SW register, `paidia-vN`, and
add the `<link>` to all four shells.

**Cost:** one pass, no JS. Risk: `:has()` on `.kid-dir-row` — already used in
`ui-v245.css` 90, so it is an accepted baseline here.

**Leaves unsolved:** no search, no grouping, no sort, 25 rows is still a
six-screen scroll, PC still swaps the whole page to show one child, the metric
wall and its privacy problem are untouched, and the directory still cannot
*record* attendance.

```
PHONE — Plan A
┌─────────────────────────────────┐
│ Kinder                          │
│ [Kinder][Anwesenh.][Hausauf.]→  │
│ ┌───────┬───────┬───────┐       │
│ │  12   │   0   │   0   │  56px │
│ └───────┴───────┴───────┘       │
│  + Kind hinzufügen   (secondary)│
│ ╻┌──────────────────────────┐   │
│ ╹│ (S) Simon      ●FEHLT    │   │  red rule + red chip
│  │     – 0 –                │   │
│  │                   ✎  ⌫   │   │  44pt, right
│  └──────────────────────────┘   │
│ ╷┌──────────────────────────┐   │
│ ╵│ (V) Vincent    ○OFFEN    │   │  grey rule
└─────────────────────────────────┘

PC — Plan A: same row, metrics now span to the admin buttons; no clipped label.
```

---

### Plan B — Restructure  *(recommended)*

**One page, two modes: a shift board that records attendance inline, and a
master/detail record on PC.** Template changes in `app.js` plus a CSS block.

**B1 — Directory toolbar** (`viewKids()`, insert above `.kid-dir-list` at 18228).
A `#kidSearch` input copied from the pattern that already works on Taschengeld
(`.pocket-search` / `#pocketSearch`, `app.js` 13484), plus group chips built
from `DB.groups` (`syncAlleKinderGroup()` 18081–18093 guarantees `g4` = Alle
Kinder exists). New `state.kidsGroup`, wired in `wireKidsView()` next to the
existing `[data-kids-pane]` handler at 18550. At 25–30 children across houses
this is the difference between scanning and hunting. Fix 18181 while there so
`temporary` children can be excluded.

**B2 — Segment the list by state, unrecorded first.** Bucket the `dir` map at
18183–18209 into three groups with a count header:
`Nicht erfasst (7) · Fehlt (2) · Da (16)`. This is the literal answer to "who
is here today", available without reading a single row.

**B3 — Record attendance from the directory.** Each row gets the same 3-way
control the Anwesenheit pane already ships — `chip` buttons carrying
`data-att-kid` / `data-att-date` / `data-att-status`
(`viewAttendanceGrid()` 18399), already handled by the `attendance.set` domain
operation. The directory stops being a read-only mirror of the pane, and the
pane collapses to what only it can do: date picking and bulk select
(18402–18404). Two places for one job become one.

**B4 — Kill the per-row legend.** Move the metric labels into one
`.kid-dir-head` row rendered once above the list on desk, and give each metric
cell an explicit class (`kid-dir-m-att`, `kid-dir-m-grade`, …) so the brittle
`nth-child` hides at `index.html` 5888–5890 can be replaced by named rules. The
row shrinks to `avatar · name · state control · 2 numbers · →`; the rest of the
numbers belong to the record, not the roster.

**B5 — PC master/detail.** `viewKids()` currently early-returns
`viewKidProfile(state.staffKidId)` at 18179 — the whole page, including the
pane bar, is replaced by one child. Mirror the layout Taschengeld already has:
`.pocket-layout` (`app.js` 13503–13506) is `aside.pocket-kids-rail` +
`.pocket-main-col`, styled at `desk.css` 730–734 as `220px minmax(0,1fr)`. Add
`.kids-layout` on the same model at ~300px, keep the early return for
`shell-m`. The list stays visible, the pane bar stops disappearing, and the
"go back to find the next child" round-trip goes away.

**B6 — Band the profile.** `viewKidProfile()` 18288–18328 emits 14 sections in
source order. Group them and sub-tab bands 2 and 3:

- *Heute* — attendance week strip (18311), today's plan entries (18327), open
  homework (18312)
- *Diese Woche* — `staffRatingPanelHtml` (18308), subjects (18309), materials
  (18313)
- *Verlauf* — pocket (18304–18306), notes (18320), badges, games, chore review,
  Zo-Ai log

**B7 — Attribute the notes.** At 18264, either exclude `n.by === k.id` or render
child-authored entries with an explicit author badge and mood. Right now staff
read a child's diary believing it is a staff log.

**Cost:** ~150 template lines, one `wireKidsView` block, a CSS section, and
`python3 scripts/build-shell-sites.py` to regenerate the three shells that
carry the `nth-child` rules. Risk concentrates in B5: `routeKey` at 23618
already includes `staffKidId`, so selecting a child re-renders — the rail needs
a scroll-preservation rule that `resetKidsScroll()` (18544) currently defeats.
B3 touches a domain operation path, so it needs the existing attendance QA run.

**Gain:** the roster question is answered above the fold and answerable
one-handed; the record stops being a scroll; PC uses its width for a list
instead of for whitespace.

```
PHONE — Plan B
┌─────────────────────────────────┐
│ Kinder                          │
│ [Kinder][Anwesenh.][Hausauf.]→  │
│ 🔍 Suchen…                      │
│ [Alle][Zwillinge][Kai+Simon+V.] │
│                                 │
│ NICHT ERFASST · 7               │
│ ┌─────────────────────────────┐ │
│ │(S) Simon                    │ │
│ │    [ Da ][Fehlt][Entsch.] → │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │(V) Vincent                  │ │
│ │    [ Da ][Fehlt][Entsch.] → │ │
│ └─────────────────────────────┘ │
│ FEHLT · 2                       │
│ ┌─────────────────────────────┐ │
│ │(K) Kai         ●FEHLT     → │ │
│ └─────────────────────────────┘ │
│ DA · 16   (collapsed count)     │
├─────────────────────────────────┤
│ Home   Plan   Lager  Liste  ••• │
└─────────────────────────────────┘

PC — Plan B (master/detail, .kids-layout)
┌────────┬──────────────────────────────────────────────────────────┐
│ Armonia│ Kinder & Schule            Angelos · Betreuer   ADMIN     │
│        │ [Kinder][Anwesenheit][Hausaufgaben][Material][Verlauf]…   │
│ Home   ├───────────────┬──────────────────────────────────────────┤
│ Momente│ 🔍 Suchen…    │  (S)  Simon        Lv 0 · 0 XP · 12,50 € │
│ ▸Kinder│ [Alle][Zwil.] │  ┌────┬────┬────┬────┐                   │
│ Tasch. │               │  │ –  │ 0% │ 0  │ –  │                   │
│ Plan   │ NICHT ERF · 7 │  └────┴────┴────┴────┘                   │
│ Lager  │  Vincent      │  [Heute] Diese Woche  Verlauf            │
│ Liste  │  Julian kl.   │  ┌──────────────┬──────────────┐         │
│ Talk   │  Lea       …  │  │ Anwesenheit  │ Hausaufgaben │         │
│ Buch   │ FEHLT · 2     │  │ Mo Di Mi Do  │ – keine –    │         │
│ Persona│ ▸Simon        │  └──────────────┴──────────────┘         │
│ Schule │  Kai          │  ┌─────────────────────────────┐         │
│ Admin  │ DA · 16       │  │ Heute im Plan               │         │
│ Mehr   │  Jule         │  └─────────────────────────────┘         │
│        │  Samantha  …  │                                          │
│ Zo-Ai  │               │  (list stays; no back-and-forth)         │
└────────┴───────────────┴──────────────────────────────────────────┘
```

---

### Plan C — Rethink

**Kinder is not one page. It is a roster that belongs to the shift, and a
dossier that belongs to the child — and the dossier should aggregate what is
currently scattered across five tabs.**

Two moves:

**C1 — The roster leaves this tab.** "Wer ist heute da?" is a shift question, so
it belongs where a shift starts: Home. Today Kinder is not even in the phone
dock (`index.html` 5865 hides `dock-secondary[data-tab="kids"]`), which means
the highest-frequency question on the page sits two taps behind "Mehr" — an
honest signal that this tab was never designed for it. A compact presence strip
on Home (avatars, tap to cycle state, count of unrecorded) answers it in the
two seconds the brief asks for. Kinder keeps `viewAttendanceGrid` for the
weekly/bulk case.

**C2 — What remains becomes a real dossier, and it aggregates.** The profile
already reaches across pages: it prints `pocketMoneyPanelHtml(k.id,…)` (18305,
defined 13165) and today's plan entries via `entriesFor()` (18267). It stops
half-way — gallery photos tagged to the child and the child's Talk mentions are
not there, and Taschengeld/Gallery/Plan do not link back, even though the
mechanism exists (`state.tab='kids'; state.staffKidId=…` at 6166 and 23781).
Finish it: the dossier is the one place a child's week lives, every other page
deep-links into it, and the aggregation makes the privacy question answerable in
one place — ratings, mood notes and money get a single role gate instead of
being spread across a scannable list and four tabs.

Directory then becomes a plain index: avatar, name, group, last-seen. No
metrics, no leaderboard.

**What would have to be true:**

- Attendance is recorded by carers as they arrive, daily — not by an
  administrator once a week from a register. If it is the latter, the roster
  never belongs on Home and C1 is wrong.
- Home has room. It is already the densest staff page; adding a presence strip
  is a Home redesign decision, not a Kinder one, and these two plans must be
  agreed together.
- Staff actually want one child page. If in practice they work
  column-wise — "pay everyone's Taschengeld", "rate everyone" — then aggregation
  is the wrong axis and the current per-task tabs are right.
- Somebody owns the role model. Aggregating money + behaviour ratings + a
  child's private notes into one screen is a *bigger* privacy surface than
  today unless `isAdminUser()` (or a new carer/lead distinction) gates the
  bands.

```
PHONE — Plan C
  HOME (roster moves here)          KINDER (dossier index)
┌─────────────────────────┐       ┌─────────────────────────┐
│ Home                    │       │ Kinder                  │
│ Schicht · 14:00–22:00   │       │ 🔍 Suchen…              │
│ ┌─────────────────────┐ │       │ [Alle][Zwillinge][…]    │
│ │ HEUTE  16 da · 2 ✕  │ │       │ (S) Simon      Zwil.    │
│ │ 7 nicht erfasst     │ │       │ (K) Kai        Kai+S.   │
│ │ (S)(K)(V)(J)(L)(V)… │ │       │ (V) Vincent    Kai+S.   │
│ │  ✓  ✕  ○  ○  ✓  ○   │ │       │ (J) Julian kl. Jule+J.  │
│ │ tap = Status ändern │ │       │ …                       │
│ └─────────────────────┘ │       │                         │
│ Aufgaben …              │       │  DOSSIER (one child):   │
│                         │       │  Heute │ Woche │ Verlauf│
│                         │       │  + Taschengeld, Momente,│
│                         │       │    Plan, Notizen, Talk  │
└─────────────────────────┘       └─────────────────────────┘
```

---

## 4. Recommendation

**Plan B**, with Plan A's steps 1–3 pulled forward and shipped on their own
today.

Plan C is the right long-term shape and B is deliberately compatible with it —
B3's inline attendance control is the same component C1 would lift onto Home,
and B6's banded profile is C2's dossier minus the cross-page joins. But C
depends on a Home redesign and a role-model decision that are not this page's to
make. B fixes the actual complaint — the page answers a scoring question when
the user arrived with a roster question — inside one page's boundary.

**Ship first, today:** attendance legibility on phone. That is Plan A items 1–3
— restore per-state colour on `shell-m` so `ui-v244.css` 79–84 stops flattening
it, add the missing `.att-excused` ink (it exists in no layer), turn the label
into a tinted chip with a dot, and put a coloured left rule on
`.kid-dir-row:has(.att-absent)` / `:has(.att-none)`. It is CSS in a new
`ui-v246.css`, it is confined to four selectors, it touches no template, and it
converts the primary surface's roster answer from "twelve identical grey words"
to a pattern you read without reading. Everything else in B can follow.

---

## 5. Open questions for the owner

1. **Who records attendance, and when?** A carer tapping arrivals through the
   afternoon and a school administrator entering a week's register are different
   products. B3 and all of C1 depend on the answer.
2. **How many children, and is there a real grouping axis?** `DB.groups`
   (`app.js` 2601–2608) holds *activity* groupings (Zwillinge, Kai+Simon+Vincent),
   and only two children carry a `homeHouseId` — and those point at h3/h4, which
   are shopping-only houses named after the child (`SEED.houses` 2564–2568).
   If the real roster is 25–30 across 2–4 houses, the house/room assignment is
   missing from `DB.children` entirely, and the directory cannot group by it
   until it exists.
3. **Should the directory show scores at all?** Grade average, staff rating /6,
   XP and game wins are currently visible to every staff role, side by side, on
   a phone used in front of children. Is that intended, or should the metric
   wall be profile-only?
4. **Does a child's private note belong to staff?** `viewKidProfile()` 18264
   prints child-authored `kidNotes` (written with `by:kidId` and a mood at
   `app.js` 19454/19458) in the staff notes card without attribution. Three
   possible answers — hide, label, or keep as-is — and only the owner can pick.
5. **Which pane is the real default?** `state.kidsPane` defaults to `directory`,
   but five of the seven chips are school tooling (Material, Verlauf,
   Stundenplan, Fächer, Hausaufgaben). If school is the dominant use, the tab is
   mis-named and mis-ordered; if it is not, those five belong under the existing
   `Schule` nav item and this tab should be Kinder only.
6. **What is `temporary` for?** `SEED.children` 2598 marks Leonie
   `temporary:true` and `viewKids()` 18181 has an inert filter for it. Should
   temporary children be hidden, badged, or listed last?
7. **Is a per-child Zo-Ai transcript meant to be staff-readable?**
   `zoaiLogThreadHtml()` (17136) shows the last 12 turns of a child's assistant
   conversation in the profile. Same question class as (4), different data.
