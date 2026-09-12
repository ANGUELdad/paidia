# Kid Bewertung + Kid Sterne — redesign

Surfaces reviewed: `.qa-screens/v245-true/pc-kid-rate.png`,
`phone-kid-rate.png`, `pc-kid-stars.png`, `phone-kid-stars.png` (v245-true
harness). Trust these captures; earlier kid screenshots in-repo were duplicates.

**Capture note (Sterne):** QA lists the view as `'stars'`
(`scripts/qa-ui-audit-2026.mjs` `KID_VIEWS`), but `childViewHtml()` only knows
`'rewards'` (`app.js:23527`) and falls through to `childStartView()`
(`app.js:23537`). The “kid-stars” PNGs are therefore **Start** with the reward
system on it — which is also the surface a child actually hits first. The
dedicated Sterne page is analyzed from `childRewardsView()` + DEVICE chrome
numbers; say so when the PNG and the route diverge.

Code anchors:

| What | Where |
|---|---|
| Child rate page | `childBewertungenView()` `app.js:19233–19246` |
| Week calendar | `kidRatingMonthHtml()` `app.js:19042–19074`, shell `.rate-cal-shell` |
| Team summary (child-visible) | `childStaffRatingHtml()` `app.js:19118–19137`, `staffKidWeeklySummary()` `18823–18934` |
| Week key | `kidWeekKey()` `app.js:18794–18798` |
| Self-rate blocked | `setKidRating()` `app.js:18863–18866` (“Children never self-rate”) |
| Staff ratings store | `DB.staffKidRatings` / `DB.staffKidRatingSummaries`; child `renderChild` clears raw `staffKidRatings` `19560–19563` |
| Sterne page | `childRewardsView()` `app.js:19509–19554` |
| XP calendar (not on Sterne) | `kidXpCalHtml()` `app.js:18991–19014` — mounted under Spiele `19929` |
| Level ring on Start | `childStartView()` `app.js:17536–17647`, `.level-card` `17596–17603` |
| Bonus sibling | `childBonusView()` / `kidBonusState()` `19251–19291` |
| Guide contradiction | `kidGuideHintRate` `app.js:435` vs `kidRateLead` `875` |
| v245 week tint | `ui-v245.css` §2c lines 117–129 — **inside `@media (max-width: 899px)`** |
| Solid week fill (base) | `.paidia-cal .cal-cell.on` `ui-v110.css:6847–6852` |
| Empty XP cal collapse | `ui-v245.css` §2b lines 83–91 |
| PC kid columns | `index.html:3379–3383` `.kid-home-layout` / `.kid-rate-layout` |

---

# Page A — Kid Bewertung (`childView === 'rate'`)

## 1. What this page is for

A child opens Bewertung with one question: **how did my week go?** Secondary: can
I look at another week without asking an adult.

The page *should* answer that with a warm, readable summary of how the care team
saw the week — or an honest empty state if nobody has rated yet. Today it
answers a different question first: **which calendar day am I looking at?** The
month grid is the primary object; the grade is secondary (phone) or off-fold /
absent in the PC Pro capture. Copy still oscillates between “you give grades”
and “you only watch,” while the data path already decided: children never write
ratings (`setKidRating` returns false in child mode).

## 2. Read of the current design

### Phone (`phone-kid-rate.png`)

Eye order:

1. App chrome (Simon · Bewertungen).
2. Compact hero (`.kid-hero-compact`): kicker `ARMONIA · WIE LIEF DIE WOCHE?`,
   title `Bewertungen`, lead `kidRateLead` — school 1–6, team rates, you watch.
3. Month calendar (`.rate-cal-shell`): September 2026; week 7–13 as **pine tint +
   bottom underline** (v245 §2c). Reads as one week strip, not seven day chips.
4. Team card (`.child-staff-rating`): `— / 6`, empty copy, then the long
   `childStaffRatingHint`, then `1 = sehr gut · 6 = ungenügend`.

Hierarchy the layout implies: *explain school grades → pick a month cell → see
a dash*. Hierarchy the task needs: *this week’s answer → soft explanation →
history if curious*.

Density: the calendar earns space only if week-picking is frequent. For “how did
*this* week go?” it is expensive chrome. Empty state is the realistic fixture
here (new / mid-week before staff rates); the page handles emptiness with a
sentence, which is good, but buries it under a full month of blank cells.

### PC (`pc-kid-rate.png`)

Same hero + calendar, plus:

1. `kidGuideHtml` banner: **“Vergib Noten für diese Woche — 1 ist sehr gut.”**
   (`kidGuideHintRate`) — directly contradicts the hero lead and the code.
2. Sidebar “SEITEN” with Bewertung active — fine for adult-supervised desk use.
3. Week cells still read as **solid pine** (white numerals). That is not a
   vision glitch: §2c is scoped to `@media (max-width: 899px)`, so desktop still
   uses `ui-v110.css:6847–6852` solid `.cal-cell.on`. Seven solid cells = seven
   selected days. FAB covers day “20” (NOTES P1) — leave correctness alone in
   the redesign, but don’t make the grid bigger.

`.kid-rate-layout` (`index.html:3382–3383`) is a 2-column grid wrapping
`childSubjectsReadonlyHtml` only — the calendar and team card stay single-column
above it. PC width is mostly unused margin.

### Hierarchy vs task

| Layout says | Task needs |
|---|---|
| Month picker is the product | This week’s team view is the product |
| School analogy is the frame | Care-home check-in is the frame |
| Guide: “Vergib Noten” | Code + lead: watch only |

### Reading level (DE / EL)

Readable for ~10+, hard for ~7:

- Fine: `Woche`, `Noten`, `sehr gut`, `Team`.
- Heavy: `Bewertungen`, `ungenügend`, `Betreuerinnen und Betreuer`,
  `Wöchentlicher Durchschnitt`, EL `ανεπαρκής` / `φροντιστών`.
- School labels `befriedigend` / `mangelhaft` (`grade3`/`grade5`) are adult
  report-card German.

Tone: evaluative, not warm. Target icon + 1–6 school scale = being graded.

### Deliberate, good — leave alone

- Children cannot write grades (`setKidRating` guard) — correct for a care
  setting until product policy says otherwise.
- Separate `staffKidRatings` vs `kidRatings` so a child device cannot overwrite
  team evaluations (`app.js:18879–18882`).
- Phone week chrome (tint + underline) correctly fixes the “seven days on”
  misread — **extend it to desktop**, don’t reinvent.
- Empty team copy is calm; no red urgency.

## 3. Three plans

### Plan A — Tighten (CSS + string fixes)

**Idea:** Make the page tell the truth and stop looking like a day picker on PC.

Concrete:

- Lift `ui-v245.css` §2c out of the phone media query (or duplicate under
  `body.layout-desktop.mode-child`) so `.rate-cal-shell .cal-cell.on` matches
  phone.
- Soften / align strings: `kidGuideHintRate`, `kidHomeCtaRate` (“Woche
  bewerten”), tour `kid-rate` hint (`app.js:4919`) → watch language matching
  `kidRateLead` / `kidRateStaffOnly`.
- Shorten `childStaffRatingHint` and replace `ungenügend` in the kid-facing
  legend with gentler ends (product call — see §5).
- Optional: CSS-only demote `.rate-cal-shell` (smaller cells, less margin) so
  `.staff-rating-summary` wins the fold on phone.

```
PHONE A                         PC A
┌─────────────────────┐         ┌─rail─┬──────────────────────────┐
│ Bewertungen (short) │         │ nav  │ guide (truthful hint)    │
│ Diese Woche: — / 6  │         │      │ Diese Woche · — / 6      │
│ Team noch nicht …   │         │      │ [compact week tint cal]  │
│ [tint week cal]     │         │      │ Fächer (if any)          │
└─────────────────────┘         └──────┴──────────────────────────┘
```

**Cost:** half day, low risk. **Leaves unsolved:** month-as-week-picker, school
framing, whether children should see staff grades at all.

### Plan B — Restructure (recommended shape)

**Idea:** Default to *this week*; calendar becomes history, not the hero.

Concrete template changes in `childBewertungenView` / `childStaffRatingHtml`:

1. Lead with `.staff-rating-summary` for `state.rateWeek || kidWeekKey()` —
   big numeral or a warm empty illustration, not a dash in a sea of chrome.
2. Replace month-first UI with a **week strip**: prev / “7.–13. Sep” / next,
   wired to existing `data-rate-week` / `state.rateWeek` (same handlers as
   `kidRatingMonthHtml` cell taps). Keep `kidRatingMonthHtml` behind a
   disclosure (“Frühere Wochen”) or Pro-only.
3. Show area rows (`staffRatingAreaRows`) only when `raterCount > 0`; hide
   school-subject readonly block unless it has scores.
4. Drop school analogy from `kidRateLead`; use care language (see §5).
5. PC: use `.kid-rate-layout` for **summary | week history**, not subjects
   alone.

```
PHONE B                         PC B
┌─────────────────────┐         ┌─rail─┬────────────┬─────────────┐
│ Wie war deine Woche?│         │ nav  │ This week  │ Last 4 wks  │
│     —  /  still open│         │      │ big answer │ trend bars  │
│ ← Diese Woche →     │         │      │ areas      │ [month opt] │
│ (areas if rated)    │         │      │            │             │
│ ▸ Kalender          │         └──────┴────────────┴─────────────┘
└─────────────────────┘
```

**Cost:** 2–4 days; touches `childBewertungenView`, `childStaffRatingHtml`,
bindings in `bindKidExtras` / `wirePaidiaCal`, strings. **Risk:** staff still
uses `kidRatingMonthHtml` in `staffRatingPanelHtml` — don’t break mode:'staff'.
**Gain:** child lands on an answer; week selection matches cognition; pressure
drops.

### Plan C — Rethink

**Idea:** Bewertung is not a child destination. Fold “how did my week go?” into
Start’s `.kid-home-aside` “Deine Woche” (already deep-links via
`kidWeekTrendHtml` / `kidHomeGoRate`) and keep detailed grades staff-only.

Or invert: child **self-reflection** (feelings / emoji week) stored separately
from `staffKidRatings`, never shown as school Noten — team ratings stay in
staff Kinder pane.

Worth it only if the owner decides either (a) kids should not see staff grades,
or (b) kids *should* self-rate and the current watch-only path is wrong.

```
PHONE C (into Start)            PC C
┌─────────────────────┐         Start aside becomes the rating surface;
│ Deine Woche         │         dock item “Bewertung” → scroll/focus that
│  🙂 noch offen      │         card or opens a sheet, not a full page.
│ [Zu Team-Blick]     │
└─────────────────────┘
```

**Cost:** product decision + nav IA change; high regression on dock/tour
`kid-nav-rate`. **Gain:** one less emotionally loaded page; Start already sells
the entry.

## 4. Recommendation

**Plan B**, preceded by the Plan A string + desktop §2c lift (ship today).

Highest-value change today: **fix the lying guide/CTA copy**
(`kidGuideHintRate`, `kidHomeCtaRate`, tour hints) so every entry point says the
child is watching, not grading — zero behaviour risk, immediate trust win.

## 5. Open questions for the owner

1. Should a child see staff grades at all? If yes, average only or per-area?
2. Is self-rating ever coming back, or is `DB.kidRatings` legacy?
3. Keep German school 1–6 (lower=better), or switch to a care-friendly scale
   (smileys / 1–3 / “läuft gut”)?
4. Who rates how often in real life — empty weeks common or rare?
5. Is PC kid use real (shared desk) or should phone own this page’s design budget?

---

# Page B — Kid Sterne (`childView === 'rewards'`, surfaces on Start)

## 1. What this page is for

A child arrives asking some mix of: **how many stars do I have?**, **am I close
to the next level?**, and **what did I get them for?**

Start already answers the first two (`.level-card`, greeting line
`kidStarsCollected`). The dedicated Sterne page (`childRewardsView`) answers
“status + badges + who is ahead of me” and does **not** render the XP history
calendar — `kidXpCalHtml` lives on Spiele (`app.js:19929`). Bonus
(`childBonusView`) is a third surface for the same economy.

So the job is split across Start / Sterne / Bonus / Spiele-cal. The page the
harness captured for “stars” is Start — which is the right place to judge what
kids actually see.

## 2. Read of the current design

### What the PNGs show (Start)

**Phone:** greeting with `Starter · Level 0 · 0 Sterne gesammelt` → large
`.level-card` (ring `0`, `0 / 50 Sterne`, `Noch 50 bis zur nächsten Stufe`) →
CTA grid including Bonus but **not** “Sterne ansehen” (that tile is
`pro:true` in `kidHomeCtaHtml` `17523`; phone Pro grid shows Plan instead).
Stars detail is behind Mehr.

**PC:** same level card; CTA includes **Sterne ansehen**; aside still pushes
Bewertung. Two-column `.kid-home-layout` works; stars are not starving for width.

Tone on Start: encouraging, not punitive. Empty progress is grey, not alarming.
Good.

### What `childRewardsView` actually builds (no PNG)

Order (`19519–19553`):

1. Header `Sterne` + name · level name.
2. `.sterne-hero` — same ring + `kidXpOf` / `kidXpRemain` as Start, plus week
   delta, streak count, `kidStreakHtml` (7 day chips).
3. Badges grid (`kidBadgesHtml`) — mostly locked at 0 XP.
4. Leaderboard of up to 8 children by XP.

DEVICE-phone: `rewards` burns **457px** chrome before content (worst kid view).
At 0 XP the page is a taller duplicate of Start’s level card plus locked badges
and a board of zeros — a scoreboard with nothing to celebrate.

### XP calendar / heat map

- Empty: collapsed by `ui-v245.css` §2b (good) — but only where wrapped in
  `.kid-tab-cal-wrap` (Spiele / notes), **not** on Sterne.
- Filled: day labels `+N` from `DB.xpLog` — answers “when,” not “why” (log
  entries are summed; no reason string in the cal cell).

**Design target:** Start empty-state (most children early on) + Sterne for
kids who already have streak/badge progress. Do not design Sterne primarily as
a heat map; the heat map isn’t even on this route.

### Three surfaces, one system

| Surface | Answers |
|---|---|
| Start `.level-card` | How many / how close |
| Sterne `childRewardsView` | Same + streak + badges + rank |
| Bonus `childBonusView` | Extra goals → more stars |
| Spiele `kidXpCalHtml` | When XP landed |

Child wants “how close” daily; “what for” when something felt unfair; “rank”
almost never in a small care home (and it can hurt).

### Reading level

- Fine: `Sterne`, `Stufe`, `Hallo`, badge names like `Erster Stern`.
- Harder: `7-Tage-Streak`, `Rangliste`, `Abzeichen`, EL `Εμβλήματα` /
  `Κατάταξη`.
- `Noch 50 bis zur nächsten Stufe` is long but decodable with the ring.

### Deliberate, good — leave alone

- Empty month calendars hidden (§2b).
- Level thresholds `XP_LEVELS` shared everywhere.
- Start shows progress without forcing a Sterne visit.
- Bonus derived, not stored (`kidBonusState` comment `19248–19250`).

## 3. Three plans

### Plan A — Tighten

**Idea:** Kill duplicate chrome; make empty Sterne honest.

Concrete:

- On `childRewardsView`, if `kidXp(kidId)===0` and no badges earned: collapse
  `.sterne-hero` stats + hide leaderboard; one short line + CTA to Spiele /
  Aufgaben (CSS `:has` / small template branch).
- Reuse Start’s `.level-card` styling; shrink `.sterne-hero` padding
  (`index.html:4136–4138`) so chrome <200px (DEVICE budget).
- Fix harness / docs: map QA `'stars'` → `'rewards'` so future captures are
  real.
- Promote or always-show `kidHomeCtaStars` in Easy (remove `pro:true`) **or**
  accept Start as the only Easy stars UI and demote dock Mehr entry.

```
PHONE A (rewards @ 0 XP)        PC A
┌─────────────────────┐         Same card, wider; no leaderboard of zeros.
│ Deine Sterne        │
│  (ring) 0 / 50      │
│ Noch keine — spiel! │
│ [Spiele öffnen]     │
└─────────────────────┘
```

**Cost:** 1 day. **Leaves:** three-surface split; no “what for” history.

### Plan B — Restructure (week recommendation)

**Idea:** Sterne becomes “my stars story”: progress + recent reasons; badges
secondary; leaderboard Pro or gone.

Concrete:

1. Move `kidXpCalHtml` (or a last-10 `DB.xpLog` list with human reasons) from
   Spiele into `childRewardsView`; keep Spiele focused on play
   (`arcade-lobby` order already demotes the cal).
2. Single progress module shared with Start (extract a
   `kidProgressCardHtml(kidId)` used by `childStartView` + `childRewardsView`).
3. Badges below the fold; leaderboard behind Pro or removed for ≤~12 kids in
   one house.
4. Deep-link Bonus as a chip on Sterne (“Extra-Sterne”) instead of a peer
   destination in the CTA grid.

```
PHONE B                         PC B
┌─────────────────────┐         ┌─rail─┬──────────────┬────────────┐
│ Sterne  0→50        │         │ nav  │ progress     │ badges     │
│ +12 diese Woche     │         │      │ recent XP    │            │
│ Letzte Sterne       │         │      │ (why/when)   │            │
│ · Spiel +5          │         └──────┴──────────────┴────────────┘
│ · Aufgabe +10       │
│ ▸ Abzeichen         │
└─────────────────────┘
```

**Cost:** 3–5 days; xpLog may need a displayable `reason`/`source` if missing.
**Risk:** Spiele layout (cal move). **Gain:** one page answers all three child
questions; Start can keep a thin ring only.

### Plan C — Rethink (consolidation)

**Idea:** Delete Sterne as a route. Start owns progress; Bonus owns goals;
Spiele keeps the XP heat map for the curious. Dock/Mehr `rewards` → scroll to
`.level-card` or open Bonus.

Worth it if Sterne traffic is near-zero (likely: Easy hides the CTA, dock
parks it under Mehr) and DEVICE chrome cost stays unjustified.

```
PHONE C                         PC C
Start.level-card is canonical   Aside chip “Bonus” only;
Mehr “Sterne” removed or        no third full page.
aliases to Start anchor.
```

**Cost:** IA + tour ids (`kidGuideHintStars`); medium. **Gain:** one reward
system, one empty state, no 457px chrome page.

## 4. Recommendation

**Plan B** if xpLog can expose “why”; otherwise **Plan A + Plan C lean** (make
Start canonical, shrink or alias Sterne).

Highest-value change today: **empty-state Sterne** — when XP is 0, do not
render leaderboard + locked badge grid; one progress card + play CTA. Ships in
`childRewardsView` alone.

## 5. Open questions for the owner

1. Is peer **Rangliste** appropriate in this care home, or harmful?
2. Design for new child (empty) or established heat-map kid — which is common?
3. Should Easy mode expose Sterne, or is Start’s ring enough?
4. Do xpLog rows carry a child-readable reason today, or only raw XP?
5. Keep Bonus separate, or merge into Sterne as “Extra”?
6. Confirm harness should capture `rewards` not `stars` going forward.

---

# Cross-cutting

- **PC kid sidebar:** worth keeping for supervised desk use; do not invent dense
  dashboard widgets for Bewertung/Sterne — phone grammar (one question, one
  answer) should win; PC only adds side-by-side history.
- **Emotional load:** Bewertung = judgment; Sterne = score. Both need warmer
  empty states and less school/competition vocabulary before any visual polish.
- **Do not re-litigate** v245 phone week underline or empty-cal collapse — build
  on them (and extend week tint to desktop).
