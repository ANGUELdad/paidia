# Redesign notes — index

Generated from a fan-out of one agent per device surface and one agent per page
(or page cluster), reading the real v245 captures at 393×852 and 1440×900.

> **Harness note.** The first capture set (`.qa-screens/v245-final/`) had two
> bugs: kid views never re-rendered (`setChildView` without `render`), and Plan
> day/week set a non-existent `state.planView`. Fixed in
> `scripts/qa-ui-audit-2026.mjs`. A third bug: `KID_VIEWS` listed `'stars'`
> instead of `'rewards'`, so Sterne captures fell through to Start — also
> fixed. Wave-2 used `.qa-screens/v245-true/` (render + planView fixed; Sterne
> still poisoned until re-capture). Staff conclusions from wave-1 still hold.

Shared brief: [`_BRIEF.md`](_BRIEF.md)

---

## Status

| Doc | Scope | Status |
|---|---|---|
| [`DEVICE-phone.md`](DEVICE-phone.md) | iPhone system (grammar, chrome, nav, type, cards) | **done** |
| [`DEVICE-pc.md`](DEVICE-pc.md) | Desktop system (grid, density, sidebar, keyboard) | **done** |
| [`staff-home.md`](staff-home.md) | Staff Home | **done** |
| [`staff-plan.md`](staff-plan.md) | Staff Plan (day + week) | **done** |
| [`staff-stock.md`](staff-stock.md) | Staff Lager | **done** |
| [`staff-shop.md`](staff-shop.md) | Staff Liste | **done** |
| [`staff-kids.md`](staff-kids.md) | Staff Kinder | **done** |
| [`staff-pocket.md`](staff-pocket.md) | Staff Taschengeld | **done** |
| [`staff-book-talk.md`](staff-book-talk.md) | Staff Buch + Talk | **done** |
| [`staff-admin-gallery.md`](staff-admin-gallery.md) | Staff Admin + Momente | **done** |
| [`kid-today-bonus.md`](kid-today-bonus.md) | Kid Start + Bonus | **done** |
| [`kid-games-learn.md`](kid-games-learn.md) | Kid Spiele + Lernen | **done** |
| [`kid-rate-stars.md`](kid-rate-stars.md) | Kid Bewertung + Sterne | **done** |
| [`kid-notes-plan-gallery.md`](kid-notes-plan-gallery.md) | Kid Notizen + Plan + Momente | **done** |

Each page doc has **three plans** (A tighten / B restructure / C rethink), ASCII
wireframes, a recommendation, and open product questions. Device docs set the
constraints the page plans must fit inside.

---

## Cross-cutting findings (from completed work)

These keep coming up. They are the real redesign work, not another correctness
pass.

### 1. The phone spends 200–900px before content
Measured on a real login: fixed chrome is only ~130px; the rest is hero cards,
stat rows, banners and filter rails. Lager's first shelf sits at y=892 — off an
852px screen. Device-phone proposes a three-slot grammar capped at 144px
(collapsing app bar + answer block + one primary act row).

### 2. Desktop is not a stretched phone — the *rows* are
Six of eleven staff tabs already have a two-column band. What is universally
phone-shaped is the record row: each Kinder row wastes a measured 304px between
the last metric and the action buttons. Device-pc proposes a 12-column `#view`
grid that ships as a no-op, then four page archetypes starting with Kinder as
the master/detail reference.

### 3. Pages already compute the right answer and hide it

| Page | Already computed | Currently shown as |
|---|---|---|
| Home | `staffInboxItems()` — 11-source ranked duty queue | 12px muted rows on PC (cap 4); **invisible on phone** |
| Liste | `.store-page` full-screen shopping mode | No visible door; Mitnehmen panel is the same list with actions stripped |
| Lager | `has-draft` class on every touched row | **Invisible** — two CSS rules both dead against `!important` |
| Plan | Real 7-column `week-agenda-board` grid | Not the Pro desktop default; three stacked independent tables instead |

### 4. Live defects that look like design but are bugs

- **Home "Überfällig" jumps to today's plan**, which cannot contain items from
  `dashboardDates(-7,-1)`. Overdue list is inside a `pro-only` collapsed
  disclosure — countable and unreachable in Easy mode.
- **Lagercheck hard-codes `SHIFT_STOCK_HOUSE = 'h1'`** (Kalyvia) regardless of
  which house chip is lit.
- **Kinder attendance on phone**: `ui-v244.css` forces every attendance state to
  the same grey; `.att-excused` has no colour rule anywhere; the attendance %
  is the metric phone CSS explicitly hides.
- **Plan swipe is dead code**: `data-week-swipe` is queried, never emitted.
- **Plan phone overflow**: `···` proxy-clicks into `.planner-chrome-wrap`, which
  v244 sets to `display:none` on phone — Dienst/Events may be unreachable.
- **Kid desktop FAB** still covers calendar cells (v245 only hid it for staff
  desktop + kid phone). Kid Plan/Lernen eyebrows at **1.16:1** (invisible).
  Surfaced only after the harness fix.

### 5. Consensus recommendation pattern
Every completed page agent independently picked **Plan B (restructure)** as the
one to actually ship, with a Plan A CSS/template trim as the same-day first
step. Plan C is consistently "wait for a product decision."

| Page | Ship today (Plan A slice) | Recommended (Plan B) |
|---|---|---|
| Home | Render `staffInboxItems()` at top of mobile branch | One ranked duty stack; delete greeting hero |
| Plan | Four CSS rules reclaiming ~229px → Monday above fold | One zoom axis, one week grid, one add affordance |
| Lager | Restore `has-draft` CSS (one specificity block) | Draft-visible board; pauseable Lagercheck |
| Liste | Delete Mitnehmen; rebind segment to "Im Supermarkt" | Real door into existing `.store-page`; mark→confirm → undo toast |
| Kinder | Attendance colour rules in a new CSS layer | Search + group by attendance; PC master/detail like pocket |
| Taschengeld | Horizontal kid rail on phone; Verlauf above Schnellbeträge | Ledger-first; deliberate compose; Korrektur first-class |
| Buch + Talk | Talk width/truncation; keep pages separate | Buch: duty/incoming first; Talk: demote handover-shaped copy |
| Admin + Momente | Admin: attention first, hide charts on phone; Gallery: drop 520px width cap | Admin: Lage/Team/Kontrolle/Zugang; Momente: contact-sheet grid |
| Kid Start + Bonus | Fresh zero-star state; un-gate Bonus missions in Easy | Start: today first, drop dock CTAs; Bonus: mission board |
| Kid Spiele + Lernen | Hide empty PC XP calendar; Weiter from `lastGameId` | Recognition lobby + session-first Lernen hub |
| Kid Bewertung + Sterne | Fix lying CTAs; lift week tint to PC; collapse empty Sterne | Week-first Bewertung; Sterne = “why I earned them” (or fold into Start) |
| Kid Notizen + Plan + Momente | Honest Notizen kicker; hide Momente Feed/People chrome | Shared journal write-first; next-up Plan; real kid album |

---

## How to use these docs

1. Read the two **DEVICE-** docs first — they constrain everything else.
2. Pick a page. Read its Plan A "ship today" slice. That is usually a half-day.
3. Do not start Plan B on a page until the device-level grammar decision is made
   (especially: global house filter in the app bar, collapsing header, whether
   the dock drops to 4+Mehr).
4. Open questions in each doc are product decisions. Do not let an agent guess them.

## Corrected captures

```
.qa-screens/v245-true/     ← use these (harness fixed)
.qa-screens/v245-final/    ← staff pages OK; kid + plan day/week are poisoned
```
