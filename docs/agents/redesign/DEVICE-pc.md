# DEVICE-pc — the desktop surface as a system

Scope: the whole PC surface at 1440×900 (`body.shell-desk` + `body.layout-desktop`),
staff and kid. This is not a page plan. It sets the constraints the 20 per-page
plans have to fit inside; where a per-page plan disagrees with §3, §4 or §5 here,
this document wins.

Everything numeric below was measured at runtime against `http://127.0.0.1:5173/desk/`
at 1440×900, staff profile `e4`, `mode-pro`, `lang=de`, via Playwright
(`getBoundingClientRect` + `getComputedStyle`). Selectors and line numbers were
grepped, not recalled.

---

## 0. Read this first: three of the twelve screenshots you were given are not real

While verifying §1 I found that the capture harness is measuring fewer pages than
it reports.

- `scripts/qa-ui-audit-2026.mjs:412` sets `state.planView`. **That key does not
  exist in `app.js`** (0 occurrences; the real key is `state.scheduleView` —
  `app.js:4022`, `8220`, `10146`, `10172`). So the "day" pass and the "week" pass
  render the same view. `pc-staff-schedule.png` and `pc-staff-schedule-week.png`
  are byte-identical (`md5 6387f250b932542a1ea101400f149dd5`). **Plan · Tag has
  never been captured on desktop.** For the record it does render correctly when
  the right key is set: `state.scheduleView='day'` → `div.planner.plan-day`,
  `docH 1093`, title "Plan · Tag".
- `scripts/qa-ui-audit-2026.mjs:428-431` calls `setChildView(v,{push:false})` and
  then `scrollTo(0,0)` — but `setChildView` (`app.js:16799-16821`) only mutates
  `state.childView`; it never calls `render()`. So every kid capture after the
  first is stale. **All nine `pc-kid-*.png` are byte-identical**
  (`md5 4bceb1ff45bbafbe89322ff87a39a2c7`), and so are all nine `phone-kid-*.png`
  (`84ce5a1e92f9e7b4c2899cf200d18b4c`).

Consequence for the brief's premise: the "3 P1 + 1 P2, all PC" figure is measured
over **11 distinct PC pages**, not 20. Nine kid desktop views and one staff view
have no audit coverage at all. Fixing the harness is P0 and costs two lines; it is
item 1 in the backlog.

I rendered the kid desktop views properly to have something real to say about them
(§2.4, §7.6).

---

## 1. The core problem, verified

### 1.1 Verdict

**Refuted as stated; the real defect is worse and more specific.**

"A phone layout stretched to 1440px" implies one centred column of stacked cards.
That is only literally true on 4 of 11 staff tabs. Six tabs already carry a genuine
two-column band. But **every one of those second columns is a decorative aside, and
the record list — the thing desktop exists for — is single-column on every page
without exception.** The Kinder directory, the Liste items, the Lager products, the
Buch entries and the Taschengeld ledger are all a vertical stack of ~1164px-wide
rows built from the phone row template. That is the actual "stretched phone": not
the page, the *row*.

The sharpest single number: on Kinder, each of the 12 directory rows carries
**304px of dead horizontal space** — 26% of the row — between the last metric and
the two action buttons (§1.4).

### 1.2 Stage geometry (measured, not from the CSS)

| Thing | Measured | Source |
|---|---|---|
| `--rail-w` | **220px** | set as an *inline style on `documentElement`* by `syncLayoutMode()`, `app.js:23370-23374` |
| `#bottomPanel` | 220 × 900 | — |
| `main.app-stage#view` | 1220px wide, `max-width:1280px`, `padding 18px 28px 56px` | `desk/desk.css:130-140` |
| `#view` client width | **1164px** | — |
| `#view` itself | `display:grid; grid-template-columns:1164px; gap:14px` | `desk/desk.css:142-148` |
| root font-size | **14px** | `index.html:95-97` `@media(min-width:900px){html,body{font-size:14px}}` |

Two things to note:

1. **`desk/desk.css:4 --rail-w:232px` is dead code.** The inline style written by
   `syncLayoutMode()` beats every stylesheet. So does `index.html:5470`. The brief's
   "220px" is correct; the CSS's 232 is not reachable at any viewport.
2. **`#view` is declared as a one-column grid.** Not a container that pages happen
   to fill single-file — a literal `grid-template-columns: 1164px`. Every page shell
   is a grid *item* in a single track. That is the system-level statement of the
   problem, and it is one declaration.

### 1.3 What each page actually is

Measured top-level structure inside `#view` (widths in px):

| Tab | Shell selector | Shell w | Structure | Doc height | Screens |
|---|---|---|---|---|---|
| Home | `div.home-start.home-start-desktop` | 1164 | hero `615+505`, then `.home-command-grid` **846 + 300** | 1224 | 1.36 |
| Plan · Woche | `div.planner.plan-week` | 1164 | 1 col; `.matrix-shell` 1154 → `.matrix` 8 × ~145px cells | 2068 | 2.30 |
| Plan · Tag | `div.planner.plan-day` | 1164 | 1 col | 1093 | 1.21 |
| Lager | `div.stock-shell.stock-layout-v2` | 1164 | `.stock-layout-top` **617 + 537**, then `.stock-workspace` **1 col** | 1235 | 1.37 |
| Liste | `div.shop-shell.shop-shell-plan` | 1164 | 1 col; `.shop-command` = 4 stacked full-width rows (35/100/34/36px) | 912 | **1.01** |
| Buch | `div.book-page` | 1164 | 1 col (hero 166, panes 54, chrome 68, journal 1860) | 2339 | 2.60 |
| Talk | `div.talk-page` | **1040** | **344 + 684** — good shape, wrong width (§7.1) | 927 | **1.03** |
| Kinder | `div.kids-shell` | 1164 | 1 col; `.kids-overview` 3×387; `.kid-dir-list` 1 col × 12 rows | 1196 | 1.33 |
| Taschengeld | `div.pocket-shell.pocket-stage` | **1080** | `.pocket-layout` **220 + 846** | 3356 | 3.73 |
| Momente | `div.section-shell` | 1164 | `.section-shell-layout` **200 + 950** | 912 | **1.01** |
| Admin · Übersicht | `div.admin-ops.admin-ops-cockpit` | 1164 | `.ops-overview` **1 col of 5 full-width blocks**, then `.admin-ops-desktop` **776 + 374** | 4136 | 4.60 |

So:

- **Single column end to end:** Plan (both views), Liste, Buch, Kinder.
- **Two-column, but the main slot is still a stack:** Home, Lager, Talk, Taschengeld,
  Momente, Admin.
- **"One screenful and a lot of empty width" is true for exactly three pages** —
  Liste (1.01), Momente (1.01), Talk (1.03). On Liste the last painted pixel is at
  y=622 on a 900px viewport: **278px of empty stage below an empty list.**
- **The opposite problem is more common.** Admin is 4.6 screens, Taschengeld 3.7,
  Buch 2.6, Plan · Woche 2.3. These are not underfilled pages; they are pages that
  refuse to use the horizontal axis and therefore run long.

### 1.4 The 304px hole in the Kinder row

Measured on `.kid-dir-row` (12 of them, 58px tall, 1164px wide, x 248 → 1412):

```
 x=248   261      311        457                    1023            1327   1412
  |  pad  | avatar |  name    |  6 metric columns    |                | 2 ico |
         [40px]   [132px]    [--------566px--------] [--- 304px ---] [ 78px ]
                                                       DEAD
```

Cause: `desk/desk.css:596-604` gives `.kid-dir-metrics`
`grid-template-columns:repeat(6, minmax(70px, 86px))` **and `width:max-content`**,
inside `.kid-dir-row{grid-template-columns:minmax(0,1fr) auto}` (`desk/desk.css:497-506`).
The metrics block refuses to grow, the `1fr` track absorbs the slack, the buttons
pin right. The six metrics are `Notenschnitt · Anwesenheit · Hausaufgaben ·
Team-Wochenschnitt · XP·Lv · Spiel-Siege` — every one of which is a column header
waiting to happen. Markup: `app.js:18188` (`kid-dir-row`), list at `app.js:18228`.

This is the template case for the whole surface: a phone row (avatar, name, a
metric blob, a chevron) with the chevron swapped for buttons and the leftover width
thrown away, where a desktop wants a table with six sortable numeric columns.

---

## 2. What desktop is FOR here

The brief's hypothesis is right, and the data supports it.

### 2.1 The split

Phone is the shift surface: one hand, one house, one question, standing up.
`body.shell-m` is correct to be a document made of rows.

Desktop is the **desk** surface. Nobody carries a 1440px screen around Kalyvia.
The desktop sessions are: the admin doing the week before it starts; someone
reconciling Taschengeld across 12 children; the person entering a Lager delivery
of 40 items; the handover being read and corrected; the Betriebszentrale being
looked at because a number is wrong.

The tell is in the page heights: the four longest desktop pages (Admin 4.6 screens,
Taschengeld 3.7, Buch 2.6, Plan 2.3) are exactly the four multi-record, review-and-
correct jobs. The three shortest (Liste, Momente, Talk) are the three "what is the
current state" glances. The product already sorts itself; the layout does not
reflect it.

### 2.2 So: denser and more tabular. Yes.

Not "denser" as in smaller — see §4, the 14px root is the wrong lever. Denser as in
**more records visible per screen and more attributes visible per record**, which
is a horizontal problem, not a font-size problem. At 1164px a Kinder row can carry
name + 6 metrics + 2 actions in 44px with room to spare; it currently spends 58px
and throws away 304px.

### 2.3 The desktop job of each area

| Area | Desktop job | Archetype (§3.2) |
|---|---|---|
| Home | Triage: what needs a decision today, in one screen, with a jump to each | Board |
| Plan · Woche | The week grid. Read, fill, reassign, spot holes | Wide table |
| Plan · Tag | Today's timeline + who is on. Secondary to Woche on desktop | Wide table |
| Lager | Bulk entry and correction across a house; delivery receiving | Master/detail |
| Liste | Build Friday's list from stock gaps + requests. Two panes, not four stacked bars | Two-pane |
| Buch | Read the archive, write today, correct a past day | Two-pane |
| Talk | Topic list + thread. Already right in shape | Two-pane |
| Kinder | The records console. Directory → profile → school/pocket/rating | Master/detail |
| Taschengeld | Multi-child ledger reconciliation | Master/detail |
| Personal, Schule | Same as Kinder: a list of people/subjects and one record open | Master/detail |
| Momente | Contact-sheet browsing and batch organising | Two-pane |
| Admin | Read a lot of numbers, drill into one | Board → wide table per section |

### 2.4 Kids on desktop

Measured with a real render (not the stale captures): rail 200px, stage 1240px,
`.kid-shell` is a **1184px single-column grid on every one of the nine views**;
doc heights 1841–2339 (2.0–2.6 screens). `index.html:3379-3383` does define
`.kid-home-layout` as `1.35fr / .85fr` and `.kid-rate-layout` as `1fr/1fr` for
desktop kids — those are the only two.

Kids' desktop job is *not* density. A 9-year-old at a 1440px screen still gets the
Easy-mode reading level and 44pt targets. What desktop should buy them is
**fewer scroll gestures**, i.e. the 1184px used as 2 columns so Start fits in one
screen instead of 2.5. That is the whole kid desktop brief. Do not import the staff
grid into `mode-child`.

---

## 3. A real desktop layout system

### 3.1 The grid

One declaration, scoped, on the existing `#view`:

```css
/* ui-v246.css — desktop grid. Loads after ui-v245.css. */
body.layout-desktop:not(.mode-child) #view{
  display:grid;
  grid-template-columns:repeat(12, minmax(0, 1fr));
  column-gap:20px;
  row-gap:16px;
  align-content:start;
}
/* every existing page shell keeps working until it opts in */
body.layout-desktop:not(.mode-child) #view > *{ grid-column:1 / -1; }
```

At the measured 1164px content box with 20px gutters the column is
**78.67px**; the useful spans are:

| Span | Width |
|---|---|
| 3 | 276px |
| 4 | 374.7px |
| 8 | 769.3px |
| 9 | 868px |
| 12 | 1164px |

`grid-column:1 / -1` on `#view > *` means this ships **without touching a single
page**: today's behaviour is byte-identical, and pages opt in one at a time by
setting their own span. That property is the reason to do it this way rather than
per-page `grid-template-columns`.

### 3.2 Four archetypes, not eleven layouts

```
ARCHETYPE 1 — BOARD                        (Home, Admin · Übersicht)
┌─rail─┬────────────── sticky chrome + page actions ──────────────┐
│ 220  ├──────────────────────────────┬──────────────────────────┤
│      │  cols 1-8   (769px)          │  cols 9-12  (375px)      │
│ nav  │  ┌────────┬────────┬───────┐ │  ┌──────────────────┐    │
│      │  │ signal │ signal │signal │ │  │ needs attention  │    │
│      │  └────────┴────────┴───────┘ │  ├──────────────────┤    │
│      │  ┌──────────────────────────┐│  │ people today     │    │
│      │  │  primary work list       ││  ├──────────────────┤    │
│      │  │                          ││  │ recent activity  │    │
│      │  └──────────────────────────┘│  └──────────────────┘    │
│      │                              │  (position:sticky)       │
└──────┴──────────────────────────────┴──────────────────────────┘

ARCHETYPE 2 — MASTER / DETAIL              (Kinder, Taschengeld, Lager, Personal, Schule)
┌─rail─┬─────────────────────────────────────────────────────────┐
│      ├─────────┬───────────────────────────────┬───────────────┤
│      │ 1-3     │  cols 4-9                     │ cols 10-12    │
│ nav  │ 276px   │  684px                        │ 276px         │
│      │ ┌─────┐ │  ┌─────────────────────────┐  │ ┌───────────┐ │
│      │ │Simon│◄┼─ │ record header + KPIs    │  │ │ INSPECTOR │ │
│      │ ├─────┤ │  ├─────────────────────────┤  │ │ actions   │ │
│      │ │Kai  │ │  │ tabs: Schule · Geld ·   │  │ │ status    │ │
│      │ ├─────┤ │  │       Bewertung         │  │ │ history   │ │
│      │ │…12  │ │  │ ─────────────────────── │  │ └───────────┘ │
│      │ └─────┘ │  │ table of that record    │  │  sticky       │
│      │ sticky  │  └─────────────────────────┘  │               │
└──────┴─────────┴───────────────────────────────┴───────────────┘
  Directory mode (no record selected) = master list expands to 1-12
  and becomes the wide table (archetype 3).

ARCHETYPE 3 — WIDE TABLE                   (Plan · Woche/Tag, Kinder directory, Buch · Verlauf,
┌─rail─┬─────────────────────────────────────────────────────────┐  Admin · Finanzen/Aktivität)
│      ├─────────────────────────────────────────────────────────┤
│      │ toolbar: filter · house · density · fullscreen          │
│ nav  ├──────┬──────┬──────┬──────┬──────┬──────┬──────┬───────┤
│      │ Haus │ MO   │ DI   │ MI   │ DO   │ FR   │ SA   │ SO    │ ← sticky
│      ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼───────┤
│      │ Kaly │      │ Koch │      │      │Domino│Koch  │       │
│      ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼───────┤
│      │ Lim. │      │      │      │      │Domino│      │       │
│      └──────┴──────┴──────┴──────┴──────┴──────┴──────┴───────┘
│      │ cols 1-12, horizontal scroll only past ~10 columns      │
└──────┴─────────────────────────────────────────────────────────┘

ARCHETYPE 4 — TWO-PANE WORKSPACE           (Talk, Liste, Buch · Übergabe, Momente)
┌─rail─┬─────────────────────────────────────────────────────────┐
│      ├────────────────┬────────────────────────────────────────┤
│      │ cols 1-4       │ cols 5-12   (769px)                    │
│ nav  │ 375px          │                                        │
│      │ ┌────────────┐ │ ┌────────────────────────────────────┐ │
│      │ │ topics /   │ │ │  thread / list / working surface   │ │
│      │ │ gaps /     │ │ │                                    │ │
│      │ │ days /     │ │ │                                    │ │
│      │ │ albums     │ │ │                                    │ │
│      │ └────────────┘ │ ├────────────────────────────────────┤ │
│      │ sticky         │ │ compose / add row (sticky bottom)  │ │
└──────┴────────────────┴─┴────────────────────────────────────┴─┘
```

### 3.3 Which page gets which — and where the inspector goes

| Page | Archetype | Left | Main | Inspector |
|---|---|---|---|---|
| Home | Board | — | 1-8 | **9-12** (Benachrichtigungen, Kinder heute, Schichtende) |
| Plan · Woche | Wide table | — | 1-12 | no (fullscreen matrix already exists) |
| Plan · Tag | Wide table | — | 1-9 | **10-12** (Dienst / who is on) |
| Lager | Master/detail | 1-3 categories | 4-9 products | **10-12** (selected product: min stock, movements, adjust) |
| Liste | Two-pane | 1-4 (Fehlendes aus Lager + Anfragen) | 5-12 list | no |
| Buch | Two-pane | 1-4 calendar | 5-12 page | no |
| Talk | Two-pane | 1-4 topics | 5-12 thread | no |
| Kinder | Master/detail | 1-3 directory | 4-9 record | **10-12** (attendance, quick actions, notes) |
| Taschengeld | Master/detail | 1-3 kids rail *(already shipped at 220px)* | 4-9 ledger | **10-12** (Schnellbeträge — currently buried below 3000px of scroll) |
| Momente | Two-pane | 1-4 albums | 5-12 grid | no |
| Admin | Board → table | — | 1-8 | **9-12** |

**Persistent right-hand inspector: Home, Plan · Tag, Lager, Kinder, Taschengeld,
Admin.** Six pages. The rule for when a page wants one: *the page has a currently
selected record and a set of actions on it that are not navigation.* Talk, Liste,
Buch and Momente fail that test — their right pane *is* the record.

**Wide table: Plan · Woche, Plan · Tag, Kinder directory, Buch · Verlauf, Admin ·
Finanzen and Admin · Aktivität.** Six surfaces. Plan · Woche already is one and is
the best-built thing on the desktop surface (§7.7) — the others should copy it, not
invent a second table.

### 3.4 The CSS approach, concretely

No framework, no new files beyond one layer. Add `ui-v246.css` after `ui-v245.css`
in all four shells (`index.html:6099`, `desk/index.html:6112`, `mobile/index.html`,
`school/index.html`), and give each shell a class:

```css
body.layout-desktop:not(.mode-child) #view > .desk-main   { grid-column:1 / 9;  }
body.layout-desktop:not(.mode-child) #view > .desk-side   { grid-column:9 / 13; }
body.layout-desktop:not(.mode-child) #view > .desk-master { grid-column:1 / 4;  }
body.layout-desktop:not(.mode-child) #view > .desk-detail { grid-column:4 / 10; }
body.layout-desktop:not(.mode-child) #view > .desk-wide   { grid-column:1 / 13; }

body.layout-desktop:not(.mode-child) #view > :is(.desk-side, .desk-master){
  position:sticky;
  top:calc(var(--header-h, 68px) + 12px);
  max-height:calc(100dvh - var(--header-h, 68px) - 24px);
  overflow:auto;
  align-self:start;
}
```

Three notes on fitting the codebase:

1. `#view` is the injection target of the string templates, so the shell `<div>`
   each `view*()` returns becomes the grid item. Adopting an archetype is
   **one class added to one template string** plus splitting that shell into two or
   three siblings. `viewPocket()` (`app.js:13361`) already does this
   (`.pocket-layout` measured `220px 846px`); `viewTalk()` (`app.js:7397`) already
   does this (`344 + 684`). Generalising is not new machinery.
2. **Delete the competing width caps first**, or the grid will not be visible:
   `ui-v110.css:4521-4525` (`.talk-page` 1040px), `ui-v110.css:6893-6898`
   (`.pocket-stage` 1080px), `ui-v110.css:5057-5062` (`.shop-shell-plan` 1040px
   `!important`), `index.html:5235` (`.kids-shell`/`.home-shell-v2` 960px),
   `desk/desk.css:142-148` (`#view` one-column grid).
3. Keep the media-query floor at 1100px that `desk/desk.css:903-912` already has:
   below it, collapse master/detail to detail-only and inspector to a bottom block.

---

## 4. Density and the 14px root

### 4.1 Dropping the root is the wrong call. Reverse it.

`index.html:95-97` sets `html,body{font-size:14px}` above 900px. Everything in the
system is `rem`-based (`index.html:3589-3600`), so the whole scale multiplied by
0.875. Here is what desktop actually renders, with `ui-v244.css` §1's px floors
applied:

| Token | rem | @14px root | v244 floor | **Effective on desktop** |
|---|---|---|---|---|
| `--t-display-xl` | `clamp(2rem,6vw,2.75rem)` | 28–38.5 | — | 38.5px |
| `--t-display-lg` | `clamp(1.75rem,4vw,2.1rem)` | 24.5–29.4 | — | 29.4px |
| `--t-display-md` | 1.375rem | 19.25 | — | 19.25px |
| `--t-numeral` | 1.75rem | 24.5 | — | 24.5px |
| `--t-display-sm` | 1.125rem | 15.75 | — | **15.75px** ← every `.card h2` |
| `--t-body-lg` | 1.05rem | 14.7 | — | 14.7px |
| `--t-body` | 1rem | 14 | — | 14px |
| `--t-label` | .85rem | 11.9 | **13.25px** | 13.25px |
| `--t-caption` | .8125rem | 11.375 | **12.75px** | 12.75px |
| `--t-body-sm` | .9rem | 12.6 | — | 12.6px |
| `--t-eyebrow` | .6875rem | 9.625 | **12px** | 12px |
| `--t-micro` | .625rem | 8.75 | **12px** | 12px |

Two failures fall straight out of that table:

1. **The bottom five steps collapse into a 1.25px band.** label 13.25, caption 12.75,
   body-sm 12.6, eyebrow 12, micro 12. Three of them are within 0.75px of each other
   and two are *identical*. A five-step small-text scale that renders as one step is
   not a scale. This is why every dense block on desktop reads as an undifferentiated
   grey mush — it is not a spacing problem.
2. **The card title is 1.75px larger than body text.** `--t-display-sm` 15.75 vs
   `--t-body` 14. `.card h2` (`index.html:3635`) is the most-used heading in the app
   and on desktop it is not a heading.

The v244 floors were the correct emergency fix for a real defect (9.6px eyebrows).
They are the wrong permanent shape, because they are px constants patching a rem
scale — the two systems now fight, and the rem scale loses at the bottom and wins
at the top.

### 4.2 The floors also leak onto the phone

`ui-v244.css:18-23` puts them in unscoped `:root`. The comment says "without
inflating the mobile scale". That is not what the rule does. On the phone (16px
root):

| Token | phone before | phone now | Δ |
|---|---|---|---|
| `--t-micro` | 10px | 12px | **+20%** |
| `--t-eyebrow` | 11px | 12px | **+9%** |
| `--t-caption` | 13px | 12.75px | −2% |
| `--t-label` | 13.6px | 13.25px | −3% |

Micro and eyebrow are the two labels the phone uses most in chips and stat rows;
they got 9–20% bigger everywhere. That is a real regression hiding inside a fix.

### 4.3 Proposed desktop type scale

Restore the root to 16px on desktop and define the scale in px on
`body.layout-desktop`, so the two systems stop competing. Ratio ≈ 1.2 at the top,
1.08 at the bottom where the eye needs closer steps, everything on a 4px baseline.

```css
/* ui-v246.css */
@media (min-width:900px){
  html, body { font-size:16px; }        /* replaces index.html:95-97 */
}

body.layout-desktop{
  --t-display-xl : 34px;   /* page hero, once per page, max */
  --t-display-lg : 27px;   /* section masthead */
  --t-display-md : 21px;   /* block title */
  --t-display-sm : 17px;   /* .card h2 — now 3px above body, reads as a heading */
  --t-numeral    : 26px;   /* KPI figure, tabular-nums */
  --t-body-lg    : 16px;   /* lead paragraph */
  --t-body       : 15px;   /* table cell, row primary */
  --t-body-sm    : 14px;   /* row secondary */
  --t-label      : 13px;   /* form label, column header */
  --t-caption    : 12px;   /* row meta */
  --t-eyebrow    : 11px;   /* uppercase kicker, +.06em */
  --t-micro      : 11px;   /* badge — same size as eyebrow, differentiated by weight */
}

/* the v244 floors become what they were meant to be: a phone rule */
@media (max-width:899px){
  :root{ --t-caption:12.75px; --t-label:13.25px; --t-eyebrow:11px; --t-micro:10.5px; }
}
```

Steps: 34 / 27 / 21 / 17 / 15 / 14 / 13 / 12 / 11. Nine distinguishable steps
instead of five that render as three. Note that **row text gets *bigger*, not
smaller** (14 → 15) while the page gets denser — density on desktop comes from
using the horizontal axis and cutting row height, not from shrinking type.

Row heights that go with it: table row 40px, list row 44px, dense table row 32px
(a `data-density="dense"` opt-in, which `.matrix-shell` already has —
`app.js:8696` emits `data-density`). Vertical rhythm on the existing `--space-*`
tokens (`index.html:3579-3580`), which are already a 4px scale.

**Risk to flag:** raising the root to 16px re-expands every `rem` value in
`index.html` and `ui-v110.css` by 14%, including paddings. It must ship together
with the desktop `--space-*` overrides, or every card grows. This is the single
highest-risk change in this document and it is why it is in Plan B, not Plan A.

---

## 5. The sidebar

### 5.1 Measured

220 × 900. Brand block 120px. **13 nav rows**, 46px each, 48px pitch, band
y=150 → 772. `#dockZoAi` at y=794, 44px tall. `#dockWho` ("Angelos · Admin") below it.

**Slack between the last nav row and the Zo-Ai button: 22px.** At the target
viewport height the rail is full. `nav.dock` carries `overflow:auto`
(`desk/desk.css:214`), so anything added scrolls — the nav would become a scrolling
list, which is the one thing a persistent rail must never be.

So the answer to "should the sidebar carry more?" is: **not at 13 rows it can't.**
Any house switcher, shift state or count has to be paid for by removing rows.

### 5.2 What is wrong with the model

1. **13 flat rows is not information architecture, it is a list of the 13 things
   that got built.** `desk/index.html:6174-6186` — Home, Momente, Kinder,
   Taschengeld, Plan, Lager, Liste, Talk, Buch, Personal, Schule, Admin, Mehr.
   Seven of them carry `class="dock-secondary"`, which on the phone means "behind
   Mehr" and on desktop means nothing at all — the primary/secondary distinction
   the markup encodes is discarded by the desktop CSS.
2. **The "Mehr" row is pure redundancy.** `#dockMore` (`desk/index.html:6186`) is a
   13th visible row whose job is to reveal destinations that are all already
   visible above it. `app.js:23572-23580` computes whether the current tab is behind
   Mehr; on desktop the answer is always no.
3. **No `aria-current`.** `app.js:23571` toggles a `.on` class only. The
   `.admin-section-nav` in `shared/workspace.css` does it correctly with
   `aria-current="page"` (`app.js:21425`) — the primary nav does not.
4. **No state in the rail.** The house you are in (Kalyvia / Limenaria / Julian
   groß / Valeria+Lea) is re-chosen inside four different pages via four different
   `.house-selector` rails. The shift you are on, the count of overdue items, the
   unread handover — all live in page content, so they are invisible from every
   other page. The rail is the only element on screen at all times and it carries
   nothing but destinations.
5. Removing the desktop Zo-Ai FAB in v245 (`ui-v245.css:48-51`) was **right** and
   is verified gone (`fabShown:false`). Leave it removed.

### 5.3 Proposed rail

Same 220px, 900px budget, restructured into three regions:

```
┌────────────────────┐
│ A  Armonia         │  60px   brand (was 120 — the two-line lockup is decoration)
│    Thassos         │
├────────────────────┤
│ ⌂ Kalyvia      ▾   │  44px   HOUSE SWITCHER — global, replaces 4 in-page rails
│ ● Schicht bis 19:00│  32px   shift state, read-only
├────────────────────┤
│ HEUTE                       (12px eyebrow section label)
│ ⌂ Home             │  44
│ ▤ Plan          3  │  44     ← count badges, right-aligned, tabular
│ ▭ Buch          1  │  44
│ ⌸ Talk             │  44
├────────────────────┤
│ VERSORGUNG
│ ⌷ Lager         2  │  44
│ ⛬ Liste         9  │  44
├────────────────────┤
│ KINDER
│ ⚇ Kinder           │  44
│ ⛁ Taschengeld      │  44
│ ✧ Schule           │  44
│ ⊞ Momente          │  44
├────────────────────┤
│ TEAM
│ ⚇ Personal         │  44
│ ✧ Admin            │  44
├────────────────────┤
│ ✧ Zo-Ai            │  44   (unchanged)
│ Angelos · Admin    │  20
└────────────────────┘
   60 + 76 + (4×12 label + 12×44) + 64 = 892 of 900
```

Four changes, in value order:

1. **Delete the Mehr row** (−48px, zero loss). This alone buys the shift-state line.
2. **Group into four labelled sections.** 12 destinations with no grouping is above
   the point where scanning beats reading. The labels cost 4 × 12px.
3. **Promote the house switcher into the rail.** It is the single most consequential
   piece of global state in the product and it is currently re-declared per page
   (`.house-selector` in `viewStock`, `viewShop`, `viewSchedule`, and the Taschengeld
   rail). One global switcher removes four in-page control bars and roughly 40px of
   vertical from each of those pages.
4. **Count badges on Plan / Buch / Lager / Liste.** The numbers exist —
   Home already renders "1 Überfällig", Admin renders "9 Offene Einkaufspositionen",
   "2 Planhinweise". Surfacing them in the rail is what makes the rail worth its
   220px on every page instead of only on the page you left.

Trade-off to state plainly: this costs ~50px of rail budget and the sections push
Admin to y≈830. It fits at 900px with 8px to spare and it does **not** fit if
anyone adds a 13th destination. That is a feature — the rail should be the thing
that forces the IA conversation.

---

## 6. Keyboard and pointer

I grepped before claiming anything. Some of this is better than the brief assumes;
the parts that are missing are missing completely.

### 6.1 What exists

- **Focus rings ship and are correct.** 24 `:focus-visible` declarations in
  `index.html`, 14 in `ui-v110.css`, 2 in `shared/workspace.css`. Global ring at
  `index.html:83` (`outline:2px solid var(--brand); outline-offset:2px`), overridden
  for controls at `index.html:3776-3780` with `box-shadow:var(--focus)` =
  `0 0 0 2px var(--stone-50), 0 0 0 4px var(--brand)` (`index.html:3612`) — a light
  inner ring plus a brand outer ring, which is the right construction and works on
  both the light stage and the dark rail. **Do not propose adding focus rings.**
  Note: 0 `:focus-visible` declarations in `desk/desk.css`, `ui-v244.css`,
  `ui-v245.css` — every new desktop component since v213 inherits rather than
  declares, which is fine, but it means desk-specific overrides that set
  `box-shadow:none !important` silently kill it (see 6.2).
- **The week matrix has real semantics and real keyboard support.**
  `app.js:8687-8695`: `role="table"` / `role="row"` / `role="columnheader"` /
  `role="rowheader"` / `role="cell"`, `tabindex="0"` and `aria-label` on every action
  cell, `Enter`/`Space` to open (`app.js:24011`). Hover works
  (`.matrix-action:hover` → `#eef5f0`, verified at runtime). This is the one part of
  the desktop surface that was built for a mouse and keyboard.
- **Multi-select exists.** `state.selectMode` / `state.selectedIds`
  (`app.js:4071-4072`), `toggleSelect` / `setSelectMode` (`app.js:8334-8348`),
  `#stockSelectToggle` (`app.js:10761`), `bulkBarHtml` (`app.js:10796`), shop at
  `app.js:14222`. Covers stock, shop, store, requests.
- **Escape is wired** for sheets (`app.js:7460`), lightbox, adaptive panels,
  matrix-fullscreen and chat (`app.js:25998-26020`).
- **Enter-to-submit** on 12 inputs across the app.

### 6.2 What is missing or broken

| # | Finding | Evidence |
|---|---|---|
| a | **Exactly one desktop hover rule exists, and it is inside a reduced-motion media query.** `body.shell-desk nav.dock button:hover` is the only `:hover` in `desk/desk.css` (line 875) and it sits inside `@media (prefers-reduced-motion: no-preference)` (opens line 863). Users with Reduce Motion on get **no sidebar hover at all**. | grep + runtime |
| b | **The Kinder row hover is dead.** `.kid-dir-card:hover` (`index.html:5285`) sets `border-color` + `box-shadow:var(--shadow-1)`; `desk/desk.css:508-520` sets `border:0 !important; box-shadow:none !important; background:transparent !important` on `body.shell-desk #view .kid-dir-card`, which wins. Runtime: rest and hover computed styles **identical** (`bg rgba(0,0,0,0)`, `border rgb(24,35,30)`, `shadow none`) with `cursor:pointer`. Twelve clickable rows with zero pointer feedback. | runtime hover test |
| c | **33 `:hover` declarations in the entire system**, of which none cover `.shop-item`, `.pocket-txn`, `.book` rows, `.kids-overview` tiles or `.ops-metric` cards on desktop. | grep across all 4 layers |
| d | **Zero keyboard accelerators.** 21 `keydown` handlers in `app.js`, all Enter/Space activation or Escape dismissal. No ⌘K, no `/` to search, no `n` for new, no `1-9` for tab, no arrow-key list navigation, no type-ahead. | `rg keydown app.js` |
| e | **No range or modifier selection.** `toggleSelect` (`app.js:8337`) is a single-item XOR. No shift-click range, no ⌘/Ctrl-click, no select-all, no `indeterminate` header checkbox. Multi-select is a *modal touch* pattern ("Auswählen" → tap → "Fertig"), correct on the phone and wrong on a mouse. | `app.js:8334-8348` |
| f | **`contextmenu`: 0 occurrences in `app.js`.** No right-click anywhere. | grep |
| g | **No drag anywhere except file drop.** `dragenter/dragover/drop` appear only on photo drop zones (`app.js:9663-9668`, `15160`). `[draggable]` count on every staff tab: **0**. Dragging an entry to another day in the week matrix — the single most obviously-desktop interaction in this product — does not exist. | grep + runtime |
| h | **Tab order on Plan is 116 stops.** The matrix puts `tabindex="0"` on every action cell (`app.js:8691`). Correct for discoverability, unusable in practice: reaching the notes card below the matrix takes 116 tabs. Wants a roving tabindex (one stop for the grid) plus arrow-key cell movement. | runtime: `focusables:169` on Plan vs 14–55 elsewhere |
| i | **No sortable columns anywhere.** `<table>` count on every staff tab: 0. The Kinder directory's six numeric metrics, the Taschengeld ledger and Admin · Aktivität are all unsortable. | runtime |
| j | **No `aria-current` on the primary nav.** `.on` class only (`app.js:23571`). | grep |
| k | **`#topTools` is deliberately empty on desktop.** `desk/desk.css:103` `body.shell-desk .topbar-tools{display:none !important}` with the comment "page owns tools on desk". The slot exists in the markup (`desk/index.html:6162`). Consequence: every page action scrolls away with the content, while the 68px sticky chrome carries 8 global buttons and nothing task-specific. On a 4.6-screen page like Admin the primary action is off-screen for 3.6 screens. | grep + runtime |

### 6.3 The minimum bar

A desktop surface is not finished until: every clickable row has a hover state;
the current row has a selected state distinct from hover; ⌘K opens a command
palette that can reach any tab and any child; `↑/↓` moves the selection in a master
list and `Enter` opens it; shift-click selects a range; every table column with a
number is sortable; and the primary action for the current page is pinned in
`#topTools` rather than scrolling away. None of that requires a framework.

---

## 7. Cross-page consistency defects, desktop-specific

**7.1 Three content widths for one stage.** `#view` is 1164px, but the page shell
inside it is 1164 (8 tabs), 1080 (Taschengeld, `ui-v110.css:6893-6898`
`.pocket-stage{width:min(1080px,100%);margin:0 auto}`) or 1040 (Talk,
`ui-v110.css:4521-4525`). Measured left edges: **248 / 290 / 310**. Moving from
Kinder to Talk shifts the entire page 62px sideways under a sticky header that
does not move. Nothing in the product motivates the difference.

**7.2 The same page is two different layouts on two shells.**
`ui-v110.css:5057-5062` caps `.shop-shell-plan` at 1040px with `!important`.
`desk/desk.css:1062-1071` overrides it to `width:100%; max-width:none`. `/desk/`
therefore renders Liste at 1164px and `index.html` at 1440px renders it at 1040px
centred. Same viewport, same user, two layouts, decided by which URL they
bookmarked.

**7.3 Two competing desktop layers with different constants.**
`desk/desk.css` says rail 232 / stage max 1280 / pad 28. `index.html:5469-5478`
(`body.layout-desktop:not(.mode-child)`) says rail 220 / stage max none / pad 24.
`ui-v110.css:2124-2127` says pad 32 `!important`. The runtime resolves to a mix of
all three — 220 (inline style from `syncLayoutMode`), 1280 + 28 (desk.css, later
source order) — and `--rail-w:232px` is unreachable. Any future desktop CSS lands in
a three-way specificity fight before it does anything.

**7.4 Duplicate page titles.** `.kids-hero` and `.pocket-hero` are correctly
`display:none` on desktop because the sticky chrome already carries the title.
Five other pages still render one: `.home-command-hero` **353px**, `.talk-overview`
203px, `.book-hero` 166px, `.admin-ops-hero` 158px, `.shop-overview` 87px. That is
87–353px of the first viewport spent restating the `header h1` two centimetres
below it. The Home hero alone is 39% of the fold.

**7.5 Five treatments of "three numbers".** `.kids-overview` (3 × 387, hairline-
joined, `desk/desk.css:447-455`), `.stock-context` (3-up tiles), `.shop-overview-stats`
(3 × 88px inline), `.home-command-pulse` (centred column tiles, `desk/desk.css:951-966`),
`.ops-metrics` (full-width band). Same semantic object, five visual languages, all
on the desktop surface.

**7.6 The kid desktop header never names the view.** `header h1` reads "Simon" on
all nine kid views; staff titles update correctly ("Plan · Woche", "Lager · Kalyvia",
"Einkauf · Kalyvia"). Also measured: `kid-plan` paints to x=1440 — past the 1412
content edge, i.e. it bleeds to the viewport edge on that one view.

**7.7 Two things are right — leave them alone.**
- The **week matrix** (`app.js:8687-8700`): ARIA table semantics, keyboard cells,
  working hover, sticky toolbar, a fullscreen escape hatch, `data-density`. It is
  the model the other five table surfaces should copy.
- **Taschengeld's `.pocket-layout`** (measured `220px 846px`, `ui-v213.css:987-999`):
  a real sticky master rail with a detail pane. It is archetype 2 already shipped.
  Both prove the codebase can hold this without a framework.

**7.8 Four segmented-control idioms.** `.kids-pane-tabs` (36px chips),
`.pocket-pane-tabs` (40px), `.shop-panel-seg` (3-col grid), `.book-panes` (flex),
`.admin-section-nav` (anchors with `aria-current`, `shared/workspace.css`). Only the
last is a real, addressable, accessible nav — and it is the one that gets hidden
below 1100px (`shared/workspace.css`, `desk/desk.css:1400-1403`).

---

## 8. Three system-level plans

### Plan A — Tighten

**Idea in one line:** one CSS layer that makes the existing single-column desktop
honest — one stage width, one type scale, hover everywhere, and no duplicate titles
— without moving a single template.

**Changes** (all in a new `ui-v246.css`, loaded after `ui-v245.css` in all four
shells; all scoped `body.layout-desktop:not(.mode-child)` unless noted):

1. Kill the three competing width caps (`ui-v110.css:4521`, `:5057`, `:6893`,
   `index.html:5235`). Every shell → 1164px, left edge 248px on every tab.
2. Scope the `ui-v244.css` §1 px floors to `@media(max-width:899px)` and set
   the desktop scale from §4.3 on `body.layout-desktop` — **without** touching the
   root font-size. Buys 9 distinguishable steps instead of 5-that-render-as-3;
   leaves the 14px root problem for Plan B.
3. Fix the Kinder row: `.kid-dir-metrics{width:auto; grid-template-columns:repeat(6,minmax(0,1fr))}`
   and `.kid-dir-row{grid-template-columns:minmax(0,1fr) 88px}`. Reclaims 304px per
   row, aligns 12 rows into six readable columns. Row height 58 → 44.
4. Move `desk/desk.css:875` out of the `prefers-reduced-motion` block. Add hover +
   selected states for `.kid-dir-row`, `.shop-item`, `.pocket-txn`, `.stock-product`,
   `.ops-metric`. Unbreak `.kid-dir-card:hover` by dropping the `!important` on
   `box-shadow`/`border` in `desk/desk.css:508-520`.
5. Hide duplicate page heroes on desktop the way `.kids-hero` already is:
   `.home-command-hero`, `.book-hero`, `.admin-ops-hero`, and the `h2` inside
   `.talk-overview` / `.shop-overview`. Recovers 87–353px of the fold on 5 tabs.
6. Hide `#dockMore` on desktop (`body.layout-desktop #dockMore{display:none}`) and
   add the four `.dock-section` labels; add `aria-current="page"` in `app.js:23571`
   (one line, the only JS in this plan).

**Cost:** ~1 day. One new CSS file plus a one-line `app.js` change. Low risk —
nothing reflows structurally.
**Regression risk:** removing the `!important` in item 4 could let phone rules leak;
scope the removal to `body.shell-desk`. Item 5 removes the only place some pages
render their subtitle copy — check each hero for text that is not in the chrome.
**Gains:** the surface stops looking like five different products, the Kinder
directory becomes readable as a table, small text regains hierarchy, and every
clickable thing responds to a mouse.
**Leaves unsolved:** every page is still a single column. Admin is still 4.6 screens.
No selection, no keyboard, no inspector. This is grooming, not design.

```
PLAN A — PC (Kinder, after)
┌─rail─┬──────────────────── Kinder & Schule ─────────────────────┐
│ 220  │ [Kinder][Anwesenheit][Hausaufgaben][Material][…]         │
│      │ ┌──────────┬──────────┬──────────┐                       │
│ nav  │ │ 12 Kinder│ 0 m.Noten│ 0 HA offen│                      │
│      │ └──────────┴──────────┴──────────┘                       │
│      │ + Kind hinzufügen                                        │
│      │ ┌──┬────────┬───────┬───────┬───────┬──────┬─────┬─────┐ │
│      │ │S │Simon   │  —    │  0%   │   0   │  —   │ Lv0 │ ⚙ ✕ │ │
│      │ ├──┼────────┼───────┼───────┼───────┼──────┼─────┼─────┤ │
│      │ │K │Kai     │  —    │  0%   │   0   │  —   │ Lv0 │ ⚙ ✕ │ │
│      │ └──┴────────┴───────┴───────┴───────┴──────┴─────┴─────┘ │
│      │  columns now span the full 1164 — no 304px hole          │
└──────┴──────────────────────────────────────────────────────────┘
```

---

### Plan B — Restructure  ★ recommended

**Idea in one line:** give `#view` a 12-column grid, sort all 20 pages into the four
archetypes in §3.2-3.3, and make the three master/detail consoles real.

**Changes:**

1. Everything in Plan A (it is the prerequisite, not an alternative).
2. **The grid**, exactly as §3.1 — including `#view > *{grid-column:1/-1}` so the
   change is a no-op until a page opts in. Replace `desk/desk.css:142-148`.
3. **Restore the 16px root on desktop** (§4.3) *together with* desktop `--space-*`
   overrides, so paddings do not inflate 14%. Ship this alone in its own pass with a
   full `qa-ui-audit-2026` run either side; it touches every rem in the system.
4. **Archetype adoption**, in this order (each is independently shippable):
   - **Kinder** — `viewKids()` `app.js:18177-18240`. Split `.kids-shell` into
     `.desk-master` (the directory, 276px, sticky) + `.desk-detail` (the profile,
     684px) + `.desk-side` (inspector: attendance, quick actions, notes). Directory-
     only mode keeps the wide table from Plan A. This is the flagship: it converts
     the worst page into the model.
   - **Lager** — `viewStock()` `app.js:10584`, `.stock-workspace` at `app.js:10783`
     (measured: a 1164px single-column grid containing one 1164px child, which is a
     grid doing nothing). Categories → `.desk-master`, products → `.desk-detail`,
     selected product → `.desk-side`.
   - **Taschengeld** — `viewPocket()` `app.js:13361`. Already 220+846; widen the
     rail to the 3-col track and lift `Schnellbeträge` out of the 3356px scroll into
     `.desk-side`. Smallest diff, immediate payoff.
   - **Liste** — `viewShop()` `app.js:14210`. `.shop-command`'s four stacked
     full-width bars (measured 35/100/34/36px) become the 4-col left pane
     (`Fehlendes aus Lager`, `Anfragen`, house, day); the list gets 5-12.
   - **Home** — `viewHome()` `app.js:22502`. `.home-command-grid` is already 846+300;
     re-slot to 8/4 and make the rail sticky.
   - **Admin** — `viewAdminOps()` `app.js:21421`. `.ops-overview` (`app.js:21225`) is
     five full-width blocks stacked into 4136px. Board layout for Übersicht;
     archetype 3 for Finanzen and Aktivität.
   - **Buch, Momente, Talk** — archetype 4. Talk needs only the width cap removed.
5. **Rail restructure** (§5.3): delete Mehr, four section labels, global house
   switcher, count badges. The house switcher removes four in-page `.house-selector`
   bars.
6. **`#topTools` on desktop:** un-hide `desk/desk.css:103` and have each `view*()`
   emit its primary action into it. This is what makes a 4.6-screen page usable.

**Cost:** ~2 weeks. Template surgery in 8 `view*()` functions plus one CSS layer.
**Risk:** medium-high, concentrated in item 3 (the root font-size). The archetype
work is low-risk because it is additive and page-by-page — `#view > *{grid-column:1/-1}`
means an un-migrated page is untouched.
**What could regress:** the sticky master rails have to survive `render()` re-injection
(the whole `#view` innerHTML is replaced), so scroll position in the master list will
reset on every state change unless it is restored — `.pocket-kids-rail` has the same
issue today and it is the thing to check first.
**Gains:** Kinder goes from 12 stretched rows to a directory + record + actions in
one screen. Taschengeld's entry controls stop being 3000px below the balance.
Admin becomes navigable. Desktop stops being a big phone in the only way that
matters: the record you are working on and the actions on it are on screen together.

```
PLAN B — PC (Kinder as master/detail, the flagship)
┌─rail──────┬─────────── Kinder & Schule ────────── [+ Kind] [Export] ┐  ← #topTools
│ Armonia   ├──────────┬──────────────────────────────┬───────────────┤
│ ⌂ Kalyvia │ 1-3      │ 4-9                          │ 10-12         │
│ ● bis 19h │ 276px    │ 684px                        │ 276px         │
│           │ ┌──────┐ │ ┌──────────────────────────┐ │ ┌───────────┐ │
│ HEUTE     │ │Simon◄│ │ │ S  Simon                 │ │ │ ANWESEND  │ │
│ ⌂ Home    │ │Kai   │ │ │    Starter · Lv 0        │ │ │ [Da][Weg] │ │
│ ▤ Plan  3 │ │Vincen│ │ ├────┬────┬────┬────┬──────┤ │ ├───────────┤ │
│ ▭ Buch  1 │ │Julian│ │ │ —  │ 0% │ 0  │ 0  │ 0.49€│ │ │ + Note    │ │
│ ⌸ Talk    │ │Lea   │ │ ├────┴────┴────┴────┴──────┤ │ │ + Geld    │ │
│           │ │Valeri│ │ │[Schule][Geld][Bewertung] │ │ │ + HA      │ │
│ VERSORGUNG│ │Jule  │ │ ├──────────────────────────┤ │ ├───────────┤ │
│ ⌷ Lager 2 │ │Saman.│ │ │ Fach     Note   HA   Anw │ │ │ LETZTE    │ │
│ ⛬ Liste 9 │ │Lilly │ │ │ Mathe     4     1     ✓  │ │ │ 07.09 +1  │ │
│           │ │Zoitsa│ │ │ Deutsch   3     0     ✓  │ │ │ 07.09 …   │ │
│ KINDER    │ │Leonie│ │ │ Englisch  —     2     ✕  │ │ └───────────┘ │
│ ⚇ Kinder ◄│ └──────┘ │ └──────────────────────────┘ │  sticky       │
│ ⛁ Taschen.│  sticky   │                              │               │
│ ✧ Schule  │  ↑↓ moves │  ⌘K · shift-click · sort     │               │
│ ⊞ Momente │           │                              │               │
├───────────┤           │                              │               │
│ TEAM      │           │                              │               │
│ ⚇ Personal│           │                              │               │
│ ✧ Admin   │           │                              │               │
├───────────┤           │                              │               │
│ ✧ Zo-Ai   │           │                              │               │
│ Angelos   │           │                              │               │
└───────────┴───────────┴──────────────────────────────┴───────────────┘
```

---

### Plan C — Rethink

**Idea in one line:** desktop stops being "the same 20 pages, wider" and becomes a
five-workspace records console with a command palette, where the phone's 20
destinations collapse into 5 and every record is URL-addressable.

**The premise being questioned:** that the desktop nav should mirror the phone nav.
It should not. The phone has 20 destinations because a phone can only show one thing
at a time, so every combination of (thing, view) needs its own screen. A desktop can
show three things at once, so it needs (thing) — not (thing × view).

**The five workspaces:**

| Workspace | Absorbs | Master | Detail | Inspector |
|---|---|---|---|---|
| **Tag** | Home, Plan · Tag, Plan · Woche, Buch | day/week switch | timeline or matrix | shift, handover, who is on |
| **Versorgung** | Lager, Liste, Einkauf history | house → category | products / list | selected item |
| **Kinder** | Kinder, Schule, Taschengeld, Bewertung, Momente (per child) | child directory | record tabs | actions on that child |
| **Team** | Personal, Talk, Dienst | person / topic | profile or thread | shift + contact |
| **Verwaltung** | Admin's 10 sections | section list | section table | selected record |

Rail drops from 13 rows to 5 + Zo-Ai, freeing ~400px for state: house, shift,
today's counts, and a **⌘K command palette** that is the real navigation ("Simon",
"Milch", "Freitag", "Übergabe 5.9.").

**What else changes:** every table becomes a real `<table>` with sortable headers,
shift-click ranges, a header checkbox with `indeterminate`, right-click row menus,
and drag in the week matrix. Routes become `#kinder/simon/schule` (the router
already parses `#admin/<section>` — `app.js:8234-8241` — so the pattern exists).

**What would have to be true for this to be worth it:**

1. **Desktop has to be a real share of usage.** The whole product is built
   phone-first, and if desktop is 5% of sessions this is a 6-week investment in a
   surface nobody uses. Nobody has measured it (§9.1).
2. **Somebody has to actually do multi-record work.** If the real desktop session is
   "the admin checks the Betriebszentrale for two minutes", Plan B is already more
   than enough and Plan C is over-engineering.
3. **The nav collapse has to survive the phone.** The phone dock has 5 slots + Mehr
   and its own IA. Two navigation models in one `app.js` is a permanent tax unless
   the workspace grouping is adopted on both surfaces — which is a much larger
   product decision than a desktop redesign.

**Cost:** 6+ weeks, and it changes the router, the nav model and every `view*()`.
**Recommendation:** do not do this now. Plan B's archetypes are the same idea applied
per-page; if it lands well and the usage data in §9.1 justifies it, Plan C is the
natural continuation and Plan B is not wasted work.

```
PLAN C — PC (five workspaces + command palette)
┌─rail─────┬──────────────────────────────────────────────────────────┐
│ Armonia  │  ⌘K  ▸ "sim"                          [Kalyvia ▾] [DE]   │
│ Thassos  ├──────────────────────────────────────────────────────────┤
│          │  ┌────────────────────────────────────────────────────┐  │
│ ⌂ Kalyvia│  │ ⚇ Simon                    Kinder · Kind           │  │
│ ● 15-19h │  │ ⌷ Simons Milch             Versorgung · Artikel    │  │
│          │  │ ▭ Übergabe 5.9. (Simon)    Tag · Buch              │  │
│ ▤ Tag  4 │  └────────────────────────────────────────────────────┘  │
│ ⌷ Versor 11│                                                        │
│ ⚇ Kinder │  behind it: master │ detail │ inspector, as Plan B       │
│ ⚇ Team   │                                                          │
│ ✧ Verwalt│                                                          │
├──────────┤                                                          │
│ ✧ Zo-Ai  │                                                          │
│ Angelos  │                                                          │
└──────────┴──────────────────────────────────────────────────────────┘
```

---

### Recommendation

**Plan B.** Plan A alone leaves every page a single column, which is the actual
problem. Plan C is unjustifiable until somebody knows what desktop is used for.
Plan B is the only one that changes the thing that matters — putting the record and
its actions on screen together — while staying inside vanilla template strings and
one CSS layer, and while being shippable one page at a time.

**Ship first, today:** the two-line fix to `scripts/qa-ui-audit-2026.mjs`
(`planView` → `scheduleView`; add `render()` after `setChildView`). Everything else
in this document is a plan built on 11 measured pages; that fix takes it to 20, and
until it lands nobody can tell whether a desktop change helped or hurt on half the
surface.

**Ship first, structurally:** the Kinder row (Plan A item 3, plus the archetype-2
conversion in Plan B item 4). It is the clearest instance of the core defect — 304px
of measured dead space per row × 12 rows — it is the page most likely to be used on
a desktop, and converting it produces the reference implementation of archetype 2
that the other four consoles copy.

---

## 9. Open questions for the owner

1. **What is the actual desktop share of sessions, and who is in them?** Every
   recommendation above assumes admin/planning. If Dora opens the desktop during a
   shift to fill Lager, the density argument in §2.2 changes.
2. **Is `/desk/` or `index.html` the real desktop entry point?** They render Liste
   differently at the same viewport (§7.2), and the QA harness only ever tests
   `/desk/`. If users reach the app at the root URL, half of `desk/desk.css` has
   never been seen by anyone.
3. **Is Plan · Woche or Plan · Tag the primary desktop planning view?** `state.scheduleView`
   defaults to `'week'` (`app.js:4022`) but `app.js:3766` defaults to `'day'`. Nobody
   has looked at Plan · Tag on a desktop (§0).
4. **Which house selection should be global?** Promoting the house switcher into the
   rail (§5.3) assumes one house at a time is the normal desktop state. Lager already
   has an "Alle Häuser" option — is cross-house the common desktop case?
5. **What is a realistic record count?** 12 children, 62 stock items, 8 team members
   today. Archetype 2's master rail is right for 12 and wrong for 200. Does this scale
   to a second house/site, and if so by how much?
6. **Do kids use desktop at all?** Nine kid views have never been captured on PC
   (§0), and the kid desktop is 1184px of single column at 2–2.6 screens per view.
   If kids only ever use phones, `body.layout-desktop.mode-child` should be a
   deliberately narrow, centred reading column and nothing more — which is a
   ten-line change instead of a redesign.
7. **Is the Easy/Pro toggle meaningful on desktop?** It occupies the sticky chrome on
   every page. Easy mode is designed to reduce phone density; on a 1164px stage its
   purpose is unclear.

---

## 10. Prioritised backlog

Severity: **P0** blocks measurement or is a functional defect · **P1** the core
problem · **P2** consistency · **P3** polish.
Effort: **S** ≤ 2h · **M** ≤ 1d · **L** ≤ 3d · **XL** > 3d.

| # | Change | Sev | Eff | Pages touched | Where |
|---|---|---|---|---|---|
| 1 | `planView` → `scheduleView`; add `render()` after `setChildView` in the audit harness | P0 | S | all 20 (measurement) | `scripts/qa-ui-audit-2026.mjs:412,428-431` |
| 2 | Move `nav.dock button:hover` out of the `prefers-reduced-motion` query | P0 | S | all (rail) | `desk/desk.css:863-878` |
| 3 | Unbreak `.kid-dir-card:hover` (drop `!important` on border/box-shadow) | P0 | S | Kinder | `desk/desk.css:508-520` |
| 4 | Kinder row: metrics `width:auto`, 6 × `1fr`, row `1fr 88px` — reclaims 304px | P1 | S | Kinder | `desk/desk.css:497-630` |
| 5 | One stage width: delete the 1040/1080/960 caps | P1 | S | Talk, Taschengeld, Liste, Kinder, Home | `ui-v110.css:4521,5057,6893`; `index.html:5235` |
| 6 | Desktop type scale; scope v244 floors to `max-width:899px` | P1 | M | all | `ui-v244.css:18-23` → `ui-v246.css` |
| 7 | Hover + selected states for `.shop-item`, `.pocket-txn`, `.stock-product`, `.kid-dir-row`, `.ops-metric` | P1 | M | Liste, Taschengeld, Lager, Kinder, Admin | `ui-v246.css` |
| 8 | Hide duplicate page heroes on desktop (5 tabs, 87–353px of fold) | P1 | S | Home, Talk, Buch, Admin, Liste | `ui-v246.css` |
| 9 | 12-column grid on `#view` + `> *{grid-column:1/-1}` (no-op until adopted) | P1 | M | all (enabling) | replaces `desk/desk.css:142-148` |
| 10 | Kinder → archetype 2 (master/detail/inspector) — reference implementation | P1 | L | Kinder | `viewKids()` `app.js:18177-18240` |
| 11 | Taschengeld → archetype 2; lift `Schnellbeträge` out of the 3356px scroll | P1 | M | Taschengeld | `viewPocket()` `app.js:13361` |
| 12 | Lager → archetype 2 (`.stock-workspace` is a 1-col grid with one child) | P1 | L | Lager | `viewStock()` `app.js:10584,10726,10783` |
| 13 | Liste → archetype 4 (4 stacked command bars → left pane) | P1 | L | Liste | `viewShop()` `app.js:14210` |
| 14 | Admin · Übersicht → board; Finanzen/Aktivität → wide table | P1 | L | Admin | `viewAdminOps()` `app.js:21421`, `app.js:21225` | 
| 15 | Home → 8/4 board with sticky rail | P2 | M | Home | `viewHome()` `app.js:22502` |
| 16 | Buch, Momente, Talk → archetype 4 | P2 | M | Buch, Momente, Talk | `viewBook()` `15956`, `viewGallery()` `6865`, `viewTalk()` `7397` |
| 17 | Restore 16px root on desktop **with** `--space-*` overrides | P1 | L | all | `index.html:95-97` + `ui-v246.css` |
| 18 | Rail: delete Mehr row, add 4 section labels, add `aria-current` | P2 | M | all (rail) | `desk/index.html:6174-6186`, `app.js:23571` |
| 19 | Rail: global house switcher; remove 4 in-page `.house-selector` bars | P2 | L | Lager, Liste, Plan, Taschengeld | rail + 4 `view*()` |
| 20 | Rail: count badges on Plan / Buch / Lager / Liste | P2 | M | all (rail) | rail + existing counters |
| 21 | Un-hide `#topTools` on desktop; each `view*()` emits its primary action | P1 | L | all | `desk/desk.css:103` + 11 `view*()` |
| 22 | Roving tabindex + arrow keys on the week matrix (116 tab stops → 1) | P2 | M | Plan | `app.js:8687-8695,24011` |
| 23 | Sortable columns on Kinder directory, Taschengeld ledger, Admin · Aktivität | P2 | L | Kinder, Taschengeld, Admin | 3 `view*()` |
| 24 | Shift-click ranges + select-all in `toggleSelect`; keep the touch mode on phone | P2 | M | Lager, Liste | `app.js:8334-8348` |
| 25 | ⌘K command palette (tabs + children + products) | P2 | L | all | new, uses `parseRoute` `app.js:8234` |
| 26 | Drag an entry between matrix cells to reschedule | P2 | L | Plan | `app.js:8687-8700` |
| 27 | Right-click row menus (edit / duplicate / remove) | P3 | M | Kinder, Lager, Liste, Taschengeld | 4 `view*()` |
| 28 | Unify the 5 stat-strip treatments into one `.desk-stats` component | P3 | M | Kinder, Lager, Liste, Home, Admin | `ui-v246.css` |
| 29 | Unify the 4 pane-switcher idioms on the `aria-current` anchor pattern | P3 | M | Kinder, Taschengeld, Liste, Buch, Admin | `shared/workspace.css` + 5 `view*()` |
| 30 | Kid desktop: 2-column Start/Bewertung; header `h1` names the view; fix `kid-plan` bleeding to x=1440 | P2 | M | 9 kid views | `index.html:3376-3387`, `renderChild()` |
| 31 | Delete unreachable `desk/desk.css:4 --rail-w:232px`; document the inline-style override | P3 | S | — | `desk/desk.css:4`, `app.js:23370` |
| 32 | Resolve `/desk/` vs `index.html` divergence on Liste (same viewport, two layouts) | P2 | M | Liste | `ui-v110.css:5057` vs `desk/desk.css:1062` |

**Suggested order:** 1-5 in one pass (half a day, all P0/P1, all CSS or two-line JS).
Then 6-9. Then 10 as the archetype reference, and 11-14 following it. 17 alone in its
own pass with a full audit either side. 21 as soon as the first archetype lands.
Everything from 22 down is the interaction layer and can run in parallel with the
layout work.
