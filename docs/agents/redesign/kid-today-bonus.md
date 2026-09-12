# Kid Start + Kid Bonus — redesign

Surfaces reviewed: PC 1440×900 and phone 393×852 from
`.qa-screens/v245-true/` (`pc-kid-today.png`, `phone-kid-today.png`,
`pc-kid-bonus.png`, `phone-kid-bonus.png`), build v245. Trust these captures —
they are genuine per-view harness shots.

Code (Start): `childStartView()` `app.js:17536–17648`, `kidHomeCtaHtml()`
`17514–17534`, `kidFirstRunHtml()` `17220–17232`, `kidTodayCalHtml()`
`19015–19039`, `progressRingHtml()` / `levelMeterHtml()` `16969–16981`,
`renderChild()` shell `19556–19698`, `kidPrimaryNavItems()` `17251–17258`.

Code (Bonus): `childBonusView()` `app.js:19273–19298`, `kidBonusState()`
`19251–19271`, i18n `887–891` / `2139–2143`, back chrome `kidShowBackChrome()`
`16832–16839`, sister page `childRewardsView()` `19509–19554`.

CSS: `ui-v245.css` §1–2 (FAB / hero compact / empty cal collapse),
`ui-v213.css:345–349` / `771–778` (CTA grids), `ui-v110.css:7398–7428`,
`index.html` `.kid-first-run` ~3978, `.level-card` / `.progress-ring` ~4013,
`.kid-home-layout` ~4179 / desktop split ~4485, `.kid-bonus-*` ~4917–4943.
Empty-cal collapse is phone-only (`@media max-width:899px`).

v245 already: first-run scoped to Start; Zo-Ai off FAB into Mehr on phone;
empty month calendars collapsed on phone; `.kid-back-bar` only for Mehr views.
Do not re-propose those.

**PC vs phone for kids (applies to both pages):** Phone is the real surface.
A child at Armonia is handed a phone or small tablet, not a 1440 desktop. The
220px staff sidebar + wide two-column Start layout on PC is adult chrome
borrowed from carers. Treat desktop kid mode as a *wider phone column*
(capped content ~520–640px), not as a second dashboard. Keep the sidebar as
chrome if the shell requires it; do not invent a PC-only kid grammar unless
usage data says kids actually sit at the desk PC.

---

# Page A — Kid Start / Today (`childView === 'today'`)

---

## 1. What this page is for

A child opens the app and arrives with one of three questions, in this order:

1. **What am I doing today?** (next activity, chores, anything owed)
2. **How am I doing?** (stars / level — pride, not analytics)
3. **Where do I go next?** (only if 1–2 are quiet)

The page should answer (1) first, celebrate (2) briefly, and treat (3) as
overflow — the dock already owns navigation. Today it answers a different
question: “here is a map of the whole app, plus a zeroed progress ring.”
`nextHtml` / lesson rows / chores already exist lower in `childStartView()`
(`17548–17618`) but lose the first viewport to welcome + greeting + ring +
dock-duplicate CTA grid.

---

## 2. Read of the current design

### Phone (`.qa-screens/v245-true/phone-kid-today.png`)

Eye order above the dock:

1. **First-run banner** (`.kid-first-run`) — pine slab, “Willkommen in deiner
   App”, dock-oriented copy (v245), “Alles klar”. Correct place after v245
   scoping; still ~120px before anything personal.
2. **Greeting hero** (`.kid-hero` / `.kid-header`) — “ARMONIA · DEIN TAG”,
   “Hallo, Simon”, “Starter · Level 0 · 0 Sterne gesammelt”. Name already in
   the app header; level/stars repeat in the next card.
3. **Level card** (`.level-card`) — empty ring with **0**, “0 / 50 Sterne”,
   “Noch 50 bis zur nächsten Stufe”, “STUFE 0” + empty meter. Ring centre is
   `lv` via `progressRingHtml(pct, lv)` (`17597`), so it shows level, not
   stars — at zero both read the same; at level 7 / 340 stars the ring would
   say “7” while the copy talks Sterne.
4. **“Wohin als Nächstes?”** (`.kid-home-cta-grid`) — large tiles: Spiele,
   Bewertung, Taschengeld, Bonus, Notizen, (+ Plan/Sterne when Pro). Four of
   these are identical destinations to the dock (`kidPrimaryNavItems`).

Dock: Start on, Spiele / Bewertung / Taschengeld / Notizen / Mehr — same icons
as the tiles.

### PC (`.qa-screens/v245-true/pc-kid-today.png`)

Same stack in the main column, plus:

- Staff-style **sidebar** (Start highlighted).
- **Aside** (`.kid-home-aside`): Deine Woche empty → “Zu Bewertungen”; Fächer
  empty; Meine Schule KPI strip (—, 0%, 0, —); Hausaufgaben empty.
- Empty **September 2026** calendar still visible — v245 collapse
  (`.kid-tab-cal-wrap:not(:has(.cal-cell.has))`) is phone-only, so PC keeps
  ~a month of blank cells.
- Zo-Ai **FAB** still present — `ui-v245.css` hides FAB for kid *phone* and
  for desktop *staff*, not for `body.layout-desktop.mode-child`.

### Hierarchy implied vs needed

Layout says: *orientation → identity → zero progress → navigate the app*.
Task needs: *what’s next today → stars as a heartbeat → navigate only what’s
not in the dock*.

### Density — what earns its space

| Block | Earns it? |
|---|---|
| First-run (once, Start only) | Yes — leave; good v245 call |
| Greeting hero | Partial — “Hallo, {name}” delights; kicker + star line duplicate header + level card |
| Level card at 0/50 · Stufe 0 | No as designed — grey ring + “Noch 50…” is a debt statement, not a welcome |
| CTA grid vs dock | Mostly no — Spiele/Bewertung/Taschengeld/Notizen duplicate dock; **Bonus** and (Pro) Plan/Sterne *do* earn a slot because they live under Mehr |
| `nextHtml` / Heute lessons / chores | Yes — but below the fold on a new child |
| PC aside school KPIs | No for 6–14 Easy — adult dashboard; empty state is four dashes |
| Empty PC calendar | No — collapse on desktop too |

### Empty / low-data vs established

- **New child (these screenshots, common at first login):** zero stars, empty
  week/subjects/HW, no calendar markers. The page is almost entirely chrome +
  empty meters. This is the state that must be *designed*, not tolerated.
- **Established (level 7, ~340 stars, lessons today):** ring fills, “Hallo”
  plus a real next-up and lesson list become the page. CTA grid still
  duplicates the dock. Aside on PC finally has numbers but still reads like
  staff school ops.

### Copy as a child reads it

- “Noch 50 bis zur nächsten Stufe” at day one = *you are far away*.
- “Wohin als Nächstes?” is fine German, but the answer is already the dock.
- “Starter · Level 0 · 0 Sterne gesammelt” stacks three zeros in one breath.

### Good decisions — leave alone

- First-run scoped to Start + dock-pointing copy (v245).
- Large touch tiles (`min-height:100px` on phone, `ui-v110.css:7403`).
- Tone classes on CTA tiles (`.out` / `.sea` / `.sun`) — readable without
  emoji.
- Personal “Hallo, {name}” as the emotional beat.
- Dock as primary nav; Mehr for Bonus / Plan / Sterne / Zo-Ai.

---

## 3. Three plans

### Plan A — Tighten

**Idea:** Keep structure; fix the zeroed first impression and cut duplicate
chrome with CSS + tiny template branches.

**Changes:**

1. **New-child level card** — when `xp===0 && lv===0`, add class
   `level-card is-fresh` in `childStartView()` (`17596`). In `ui-v245.css`:
   hide or soften `.pr-track` emptiness; show a gold sparkle + short line
   (“Dein erstes Sternchen kommt gleich”) instead of “Noch 50…”. Keep
   `.level-xp` / ring for `xp>0`.
2. **Collapse empty Start calendar on desktop** — lift
   `.kid-tab-cal-wrap:not(:has(.cal-cell.has)){display:none}` out of the
   phone media query in `ui-v245.css` §2b (or duplicate under
   `body.layout-desktop.mode-child`).
3. **Hide dock-duplicate CTA tiles in Easy** — in `kidHomeCtaHtml()`
   (`17516–17523`), mark `games|rate|pocket|notes` with a class
   `kid-home-cta-dock-dup` and `display:none` under
   `body.mode-child.mode-easy`, *or* filter the array to only
   `bonus` (+ `plan`/`rewards` when Pro). Leaves Mehr destinations as the
   grid’s job.
4. **Compact greeting on phone** — already partly done in `ui-v245.css` §2;
   drop the duplicate stars line from `.kid-hello` when the level card is
   present (`17592`), keep name only.
5. **Hide Zo-Ai FAB on kid desktop** — extend the desktop FAB rule in
   `ui-v245.css` §1 to `body.layout-desktop.mode-child .zoai-fab` (Mehr /
   sidebar already cover Zo-Ai).

**Cost:** ~half day. Risk: low. Regression: CTA hiding must not remove Bonus
for Easy kids who can’t find Mehr; first-run + fresh card stacking height.

**Gains:** First session no longer opens on a grey debt ring; less scroll
before `nextHtml`; PC stops showing a blank month.

**Leaves unsolved:** Page still isn’t “today”; aside stays a mini dashboard;
ring semantics (level vs stars) unchanged; established-child layout unloved.

```
PHONE — Plan A (new child, after dismiss)
┌─────────────────────────────┐
│ A  Simon · Start    ? 🔔 DE │
├─────────────────────────────┤
│ Hallo, Simon                │  compact hero
├─────────────────────────────┤
│ ✦  Deine Sterne starten     │  fresh state (not empty ring)
│    Gleich geht’s los        │
├─────────────────────────────┤
│ Wohin?                      │
│ [ Mein Bonus ] [ …Mehr ]    │  only non-dock targets
├─────────────────────────────┤
│ Als Nächstes · Spiele →     │  nextHtml rises into view
├─────────────────────────────┤
│ ●●●●●● Start Spiele … Mehr  │
└─────────────────────────────┘

PC — same column, max-width ~560 inside shell; aside unchanged (A leaves it)
```

---

### Plan B — Restructure  *(recommended for Start)*

**Idea:** Start becomes **Today first, stars second, shortcuts last** —
template reorder in `childStartView()`, not a new product.

**Changes:**

1. **Reorder `kid-home-main`** (`17595–17623`):
   - (optional first-run, stays in shell)
   - compact hello (name only)
   - **`nextHtml` + today’s lessons + due chores** moved *above* `.level-card`
   - then `.level-card` (with fresh vs filled states from Plan A)
   - then a **thin** CTA row: only Mehr destinations (Bonus; Plan/Sterne if Pro)
   - demote `.course-grid` / second course-grid / game challenge below or into
     Pro only (they restate Spiele/Bewertung/Sterne)
2. **Deliberate star states** in `childStartView()` + `progressRingHtml`:
   - Fresh (`xp===0`): illustration/copy, CTA “Spiele öffnen” or “Woche
     bewerten” as the *first earn* path — not “Noch 50”.
   - Active (`0 < pct < 100`): ring shows **stars toward next level** (pass
     `xp-curXp` or remaining as centre label — pick one and stick to it;
     prefer remaining or current xp, not bare `lv`).
   - Established (e.g. lv≥5 or xp≥250): show level name + week delta
     (`kidWeekXpDelta`) as the pride line; meter secondary.
3. **PC aside:** hide or collapse `.kid-home-aside` under Easy
   (`body.mode-child.mode-easy .kid-home-aside{display:none}`), or replace
   with one card: “Deine Woche” only when `kidWeekTrendHtml` has data. School
   KPI strip (`childSchoolSnapshotHtml`) stays Pro.
4. **CTA grid → “Nur unter Mehr” strip** — rename
   `t('kidHomeCtaTitle')` to something like “Noch mehr” / keep German short;
   1×2 or horizontal chips, not a 2×3 dock mirror.
5. **Wire:** no new routes; still `data-child-view`.

**Cost:** 2–4 days. Risk: medium — Easy/Pro visibility of course tiles and
aside; calendar/next-up empty states need friendly copy (`nothingToday` is
adult-flat). Regression: tour targets `data-tour="kid-start"`; tips that
point at CTA tiles.

**Gains:** Layout matches the child’s actual questions; dock stops competing
with a second nav; zero state becomes a launchpad; PC stops looking like
staff Home.

```
PHONE — Plan B
┌─────────────────────────────┐
│ A  Simon · Start            │
├─────────────────────────────┤
│ Hallo, Simon                │
├─────────────────────────────┤
│ ALS NÄCHSTES                │
│ [15:00] Freispiel      →    │  or idle → Spiele
├─────────────────────────────┤
│ Heute                       │
│ ○  … / ✓ …                  │
├─────────────────────────────┤
│ ✦  12 / 50 Sterne   Stufe 1 │  heartbeat, not hero
├─────────────────────────────┤
│ Mehr: [Bonus] [Sterne]      │  chips, not dock clones
├─────────────────────────────┤
│ Start Spiele Bew. … Mehr    │
└─────────────────────────────┘

PC — single capped column (no aside in Easy); sidebar chrome only
```

---

### Plan C — Rethink

**Idea:** Start is not a dashboard. It is a **single “Dein Tag” timeline** —
next block, then earn, then done. Stars move to Sterne; Bonus stays under
Mehr; CTA grid deleted.

**Would need to be true:** carers actually put daily plan entries on kids
(`entriesFor` / chores) often enough that “Heute” is rarely empty; otherwise
the page collapses to games-only and Spiele should become the default
`childView` after first run.

**Changes (premise shift):**

1. Default Easy landing: if `lessons.length===0 && dueChores===0`, auto-focus
   copy “Heute ist frei — spiel oder bewerte die Woche” with two big buttons
   only (games + rate) — delete `kidHomeCtaHtml()` entirely.
2. Move `.level-card` off Start into `childRewardsView()` only; Start shows a
   **pill** “✦ 12 Sterne” linking to `rewards`.
3. PC: force `kid-home-layout` to one column always; treat desk shell as
   preview of phone.

**Cost:** week+. Risk: high — breaks muscle memory, tour, tips, Pro course
grid. Only worth it if analytics show Start is used as a hub, not a schedule.

```
PHONE — Plan C
┌─────────────────────────────┐
│ Hallo, Simon     ✦ 12  ›    │  stars = chip → Sterne
├─────────────────────────────┤
│ DEIN TAG                    │
│ │ 15:00  Freispiel          │
│ │ 17:00  Abendessen         │
│ └ chores …                  │
├─────────────────────────────┤
│ [ Spiele ]  [ Bewerten ]    │  only if day is empty
└─────────────────────────────┘
```

---

## 4. Recommendation

**Plan B**, with Plan A’s fresh-state + empty-cal + FAB fixes shipped first
the same day.

**Ship today (highest value):** In `childStartView()`, when `xp===0`, replace
the “Noch 50 bis zur nächsten Stufe” / empty-ring presentation with a
fresh-state card (class + copy + one CTA to Spiele or Bewertung). That single
change stops the first session from feeling like a failed progress bar.

---

## 5. Open questions for the owner

1. Do kids at Armonia usually have **today’s plan entries**, or is Start often
   empty and they live in Spiele?
2. Should the ring centre mean **level**, **stars**, or **stars to go**?
   Pick one product meaning.
3. Is the PC kid session real (shared desk) or only QA / parent preview?
4. After dismissing first-run, should Easy Start hide dock-duplicate tiles
   entirely, or keep one “Spiele” oversized CTA for the youngest readers?
5. Realistic star velocity: how long to leave Stufe 0 — days or weeks? (Drives
   whether “Noch 50” is motivating or crushing.)

---

# Page B — Kid Bonus (`childView === 'bonus'`)

---

## 1. What this page is for

The child (or carer handing them the phone) asks: **Did I earn any extra
stars, and what do I still need to do?** It is a *checklist of stretch goals*,
derived live from chores/XP (`kidBonusState()` — “Derived, never stored”).

It currently answers with a repeated zero streak, a pocket-money deep link,
and (when Pro) a checklist. Easy mode hides the checklist
(`pro-only mode-pro-block` on the how-section, `19295`) — so the default kid
density can leave a page with **no actionable body**. Screenshots that show
the list are Pro (or Pro-per-page); Easy is the audience that matters.

Sister page **Sterne** (`childView === 'rewards'`) owns total XP, badges,
leaderboard. Bonus is “extra missions”; Sterne is “my pile of stars.”

---

## 2. Read of the current design

### Phone (`.qa-screens/v245-true/phone-kid-bonus.png`)

1. **Zurück** (`.kid-back-bar`) — correct: Bonus is a Mehr view
   (`kidShowBackChrome`).
2. **“Du bist hier” guide** (`kidGuideHtml`) — title Bonus + hint + “So geht’s”.
3. **Hero** — “ARMONIA · EXTRA VERDIENT”, “Bonus”, streak sentence.
4. **`.kid-bonus-hero`** — “+0 Bonus-Sterne” + **same streak sentence again**.
5. **“Zur Taschengeld-Seite”** — dock already has Taschengeld.
6. **“Wie du Bonus bekommst”** — four rows, empty marks, +20/+15/+10/+25.

Dock: **Mehr** highlighted (right — Bonus is nested).

### PC (`.qa-screens/v245-true/pc-kid-bonus.png`)

Same vertical stack in a wide column; lots of unused horizontal space; FAB
visible; sidebar shows Mehr on. No two-column aside — just a lonely narrow
reading measure stretched full width.

### Hierarchy implied vs needed

Implied: *where you are → brand kicker → zero total → wallet link → missions*.
Needed: *missions first (what can I tick?) → earned total as celebration →
optional link to Sterne, not Taschengeld*.

### Density

| Block | Earns it? |
|---|---|
| Zurück | Yes |
| Guide + hero title “Bonus” | Redundant with header “Bonus” — one of them goes |
| Streak on hero **and** on `.kid-bonus-hero` | No — say it once |
| +0 Bonus-Sterne card | Weak at zero; strong when `earned>0` |
| Taschengeld button | No — wrong sibling; Sterne is the reward sibling |
| Checklist | **Yes — this is the page** — must not be Pro-only |
| Empty checkboxes for 6-year-olds | Marks are small (22px); labels muted grey until `.done` |

### Empty / established

- **New (+0, 0 days):** double zero copy reads like failure. Need a “noch
  unterwegs” framing and a single next mission highlighted.
- **Established (streak 5+, some `.done`):** `.kid-bonus-row.done` pine tint is
  good — lead with done count (“2 von 4”) and keep undone large.

### Copy

- “0 Tage in Folge ohne verpasste Aufgabe.” — long, negative framing
  (“verpasste”). Prefer positive: “Noch kein Serie-Tag — heut spielen zählt!”
- Mission labels are OK for ~10+; “Ganze Woche alle Aufgaben” is dense for ~6–8.
- “+0 Bonus-Sterne” as the hero number teaches nothing until non-zero.

### Good decisions — leave alone

- Derived state (no sync drift) — keep `kidBonusState()`.
- Warm amber `.kid-bonus-hero` tissue (brand-consistent, not neon).
- Back only on Mehr views (v245).
- Checkmark + pts pattern on rows.

---

## 3. Three plans

### Plan A — Tighten

**Idea:** Deduplicate chrome; un-gate the checklist for Easy; fix zero copy.

**Changes:**

1. Remove streak from either hero *or* `.kid-bonus-hero` in
   `childBonusView()` (`19284` vs `19291`) — keep one.
2. Drop `pro-only mode-pro-block` from the how-section (`19295`) so Easy kids
   see missions (the page’s reason to exist).
3. Zero earned: class `kid-bonus-hero is-fresh` — copy via new i18n key, e.g.
   “Noch keine Extra-Sterne — hol dir die erste!” instead of “+0…”.
4. Replace Taschengeld button with `data-child-view="rewards"` (“Zu deinen
   Sternen”) or remove the row.
5. CSS: bump `.kid-bonus-mark` to 28–32px; `.kid-bonus-label` use `--ink` at
   full weight even when not done (muted only for pts).
6. PC: `max-width:36rem` on `.kid-page[data-tour="kid-bonus"]` centred in
   the content column.

**Cost:** few hours. Risk: low. Un-gating Pro content is a product call (see
open questions) but matches child Easy audience.

**Gains:** Page has a body in Easy; zero state less punitive; less repetition.

```
PHONE — Plan A
┌─────────────────────────────┐
│ ← Zurück                    │
├─────────────────────────────┤
│ Bonus                       │  one title
│ Noch keine Extra-Sterne     │  fresh hero
├─────────────────────────────┤
│ Wie du Bonus bekommst       │  always visible
│ ☐ Woche alle Aufgaben  +20  │
│ ☐ 5 Tage gelesen       +15  │
│ …                           │
├─────────────────────────────┤
│ → Zu deinen Sternen         │
└─────────────────────────────┘
```

---

### Plan B — Restructure  *(recommended for Bonus)*

**Idea:** Bonus is a **mission board**: one “next mission” hero, then the list;
earned total is a chip, not a second essay.

**Changes:**

1. Rewrite `childBonusView()`:
   - Drop compact duplicate hero + guide collision: if `kidGuideHtml` stays,
     hero h2 becomes unnecessary — or drop guide on bonus and keep a short
     lead.
   - **Next mission card:** first `!done` item from `kidBonusState().items`,
     large type, pts as a gold badge, one sentence why.
   - **Progress chip:** “Extra: +{earned}” / fresh state.
   - Full list below as now, Easy-visible.
2. Streak: show as a small series of day dots (reuse streak UI from
   `kidStreakHtml` if applicable) instead of a long negative sentence.
3. Remove pocket link; optional chip to `rewards`.
4. When all done: celebration state (pine) + “Alles geholt — schau Sterne”.

**Cost:** 1–2 days. Risk: medium — i18n DE/EL for shorter kids’ strings;
guide/howto button overlap with “So geht’s”.

**Gains:** Matches “what do I do for bonus?”; delight when something completes;
readable for younger Easy users.

```
PHONE — Plan B
┌─────────────────────────────┐
│ ← Zurück          Extra +0  │
├─────────────────────────────┤
│ ALS NÄCHSTES                │
│ 5 Tage lesen          +15   │
│ Noch 5 Tage — du schaffst   │
│ das!                        │
├─────────────────────────────┤
│ Alle Missions               │
│ ☐ …                         │
│ ☐ …                         │
└─────────────────────────────┘

PC — same, max-width column (not full 1220 stretch)
```

---

### Plan C — Rethink (merge Bonus + Sterne?)

**Idea:** One **Belohnungen** page under Mehr: top = star pile + level ring
(from `childRewardsView`), bottom = bonus missions (from `childBonusView`).
Single dock/Mehr entry; delete separate `bonus` route or alias it.

**Would need to be true:** kids (and carers) don’t need Bonus as a separate
mental model; mission checkmarks won’t get lost under badges/leaderboard;
leaderboard isn’t too competitive for the youngest.

**Changes:**

1. Merge templates into e.g. `childRewardsView()` sections; `goChildView('bonus')`
   → `rewards` with hash/section `bonus`.
2. Mehr list: one “Sterne & Bonus” row; update `kidMoreNavItems`, CTA tile,
   tips (`page-tips.js` kid-bonus), tour `data-tour="kid-bonus"`.
3. Start CTA: one tile instead of Bonus + Sterne (Pro).

**Cost:** several days + copy/tour/tips. Risk: high — leaderboard + missions
on one scroll can overwhelm Easy mode; Pro depth fights simplicity.

**Not recommended unless** owner confirms kids never distinguish “extra
missions” from “my stars.” Prefer Plan B on Bonus + keep Sterne separate,
with a clear cross-link.

```
PHONE — Plan C
┌─────────────────────────────┐
│ Sterne & Bonus              │
│ (ring) 340 · Stufe 7        │
│ Badges …                    │
├─────────────────────────────┤
│ Extra-Missions              │
│ next mission + list         │
├─────────────────────────────┤
│ Rangliste (Pro / older)     │
└─────────────────────────────┘
```

---

## 4. Recommendation

**Plan B** for Bonus, after Plan A’s un-gate + dedupe (ship A today).

**Ship today:** Remove `pro-only mode-pro-block` from the how-section so Easy
kids see missions; delete the duplicate streak line; retarget or remove the
Taschengeld button. Highest leverage for the audience that actually uses
Easy.

Do **not** merge with Sterne until the owner answers Plan C’s premise
question — separate Mehr entries are fine if Bonus becomes a real mission
board.

---

## 5. Open questions for the owner

1. Was gating “Wie du Bonus bekommst” behind **Pro** intentional? (If yes,
   what is Easy Bonus *for*?)
2. Are bonus rules (`allWeek` / `read5` / `helped` / `tidy7` heuristics in
   `kidBonusState`) accurate to house practice, or placeholder logic kids
   will distrust?
3. Should Bonus celebrate in **stars only**, or also pocket money? (Current
   link implies money; code awards star points.)
4. Merge with Sterne (Plan C) or keep two Mehr entries?
5. Minimum age for this page — if many users are 6–8, mission strings need a
   short-Easy glossary (staff-editable?).
)
