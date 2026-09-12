# Staff Home (`data-tab="home"`) — redesign

Surfaces reviewed: PC 1440×900 (`.qa-screens/v245-final/pc-staff-home.png`) and
phone 393×852 (`.qa-screens/v245-final/phone-staff-home.png`), build v245.

Code: `viewHome()` `app.js:22502–22651` (mobile branch `22553–22592`, PC branch
`22628–22651`), `homeShiftStartCardHtml()` `app.js:7914–7968`,
`staffInboxItems()` `app.js:22119–22233`, `homePcRailHtml()` `app.js:22256–22286`,
`homeMomentsStripHtml()` `app.js:22235–22254`, `dashboardTaskCard()`
`app.js:21094–21107`, jump wiring in `wire()` `app.js:23736–23746`.

CSS: `ui-v110.css:52–353` (PC) and `356–542` (mobile), `ui-v213.css:140–156` /
`451–482`, `mobile/mobile.css:1261–1326` / `1596–1685`, `desk/desk.css:313–318` /
`932–1026`, `ui-v244.css:51–57` / `118–134` / `345–362`, `ui-v245.css:206–272`.

---

## 1. What this page is for

A carer opens this page at the top of a shift (or mid-shift, on a phone, in a
corridor) and arrives with exactly one question: **what is owed by me right now,
and can I do it from here?** Secondary: what is the state of the house I am
taking over.

The page currently answers a different question — "who are you, and what areas
does this app have?" The greeting, the lede, the Easy/Pro toggle and the three
navigation shortcuts are all answers to that second question. The frustrating
part is that the *right* answer already exists in the codebase: `staffInboxItems()`
(`app.js:22119–22233`) builds a ranked duty queue from eleven sources — late
alerts, presence, Lagercheck, low stock, open Liste, published events, empty
journal page, unacked handoffs, today's activities, ratings due, pending
Übergabe. On PC it is rendered as 12px muted rows in the 300px right rail,
capped at four (`inbox.slice(0,4)`, `app.js:22257`). On phone it is not rendered
at all — the only trace is the red "2" on the header bell.

---

## 2. Read of the current design

### Phone, in the order the eye receives it

1. **Greeting card** (~155px): date rule, `ARMONIA THASSOS` kicker, Easy/Pro
   toggle, "Guten Tag, **Angelos**", "Dein Tag auf Thassos — Aufgaben, Lager und
   Liste auf einen Blick". `app.js:22554–22562`, styled `ui-v110.css:366–415` +
   `mobile/mobile.css:1629–1646`.
2. **Shift-start card** (~250px): kicker "SCHICHT BEGINNT", h2 "Lagercheck",
   "Heute noch nicht geprüft", then two rows with full-width CTAs.
3. **"1 Überfällig"** pill.
4. **"Meine Aufgaben · 0"** with an empty row and a "Zum Plan" link.
5. Three shortcut buttons; a "Mehr" disclosure.

Of ~786px of content viewport, the greeting takes 20% and the shift card 32%.
Everything below the fold is an empty state.

### The hierarchy the layout implies vs. the one the task needs

The layout says: *identity → shift duties → one number → tasks*. The task needs:
*the one thing to do now → everything else owed today → tasks → identity, never*.
The single most valuable block on the page is third or fourth in reading order on
PC and absent on phone.

### Density — what earns its space

**The greeting hero does not, on either surface.** It carries no state at all.
Every fact in it is already on screen:

- the date is rendered a second time 400px lower as the tasks-card eyebrow —
  `eventDayLabel(today)` appears at `app.js:22556` *and* `22570`;
- "Armonia Thassos" is the app-header logo;
- the user's name is the header avatar;
- the lede is a permanent description of the product, not of today.

Net new information: the word "Guten". That is ~155px of the primary surface and
a 260px-tall dark block on PC (`min-height:260px`, `ui-v110.css:58–63`).

**The Easy/Pro toggle is in the wrong place.** `.ui-mode-row` is emitted inside
the hero (`app.js:22557`, `22632`). It is app-wide chrome parked in page content,
and on PC it is the highest-contrast interactive control above the fold — it
outranks the actual duty.

**The pulse row is expensive per bit.** On PC the hero is
`grid-template-columns: minmax(0,1fr) minmax(430px,.82fr)` (`ui-v110.css:58–63`)
and the pulse block owns the right cell. With one live signal,
`:has(.home-pulse-item:only-child)` (`ui-v110.css:202–204`) collapses it to a
single column — so roughly 430×110px of hero is spent rendering the numeral `1`,
and the remaining ~430×150px is dark green nothing.

**What does earn its space:** the shift-start card's *content*, and the two rail
notification rows. Both name a real, dated, actionable duty.

### The duplication, stated precisely

There are two, and they are different in kind.

- **Duty duplication (the serious one).** In the PC capture, "Lagercheck /
  Check starten" and "Schichtbuch schreiben / Seite öffnen" appear as buttons in
  the shift card, *and* the same two duties appear as "Schicht-Lagercheck offen
  (Kalyvia)" and "Übergabe: heutige Seite noch leer" in the rail — because
  `staffInboxItems()` pushes them from the same predicates the shift card reads
  (`shiftStockCheckPending()` at `22147` and `27066–27072`; the empty journal
  note at `22177–22182`). The page renders one set of duties twice, in two
  visual languages, 500px apart, and gives the louder slot to the copy you
  cannot act on.
- **Count duplication (the mild one).** `pulsePool` (`app.js:22535–22540`)
  carries `overdue.length` and `todayOpen.length`; the tasks-card header renders
  `todayOpen.length` again (`app.js:22570`, `22603`). "Heute zu tun · 3" and
  "Meine Aufgaben · 3" are the same variable 300px apart. The fixture hides this
  because only `overdue` is non-zero and `pulsePool` filters out zeros.

### Two real defects that survived v244/v245

- **The overdue signal jumps to the wrong day.** `pulsePool` sets
  `{jump:'day', value:overdue.length}` (`app.js:22536`); the handler
  (`app.js:23736–23746`) resolves `'day'` to
  `navigateStaffTab('schedule',{scheduleView:'day'})` — *today*. Overdue items
  are collected from `dashboardDates(-7,-1)` (`app.js:22506–22508`), so tapping
  "1 Überfällig" lands on a day that provably does not contain it. The only
  place overdue items are actually listed is inside the collapsed
  `<details class="home-more">` (`app.js:22610–22614`), which is `pro-only
  mode-pro-block`. **In Easy mode, overdue work is countable and unreachable.**
- **`dashboardTaskCard()` uses emoji as iconography** — `📝`, `👥`, `🏠`
  (`app.js:21100–21104`) — against the explicit design-system rule, while the
  whole surrounding page uses `ui('u-*')`. It is the one place the page reverts.

### Is a step list the right model for the shift card?

No, but the fix is smaller than replacing it. The three steps are *strictly
sequential* — the hint string says so verbatim: `homeShiftStartHint` =
"Beim Start: Anwesenheit, Lagercheck, dann Seite im Schichtbuch". That hint is
`display:none` on PC (`ui-v110.css:269`), i.e. the ordering rationale is hidden
exactly where the list is widest and most likely to be read as parallel. The
`step()` helper already takes a `primary` flag encoding which step is next
(`app.js:7943–7950`, applied at `7963–7965`), but on phone every CTA is forced to
identical width and height (`mobile/mobile.css:1312–1320` and `1675–1680`), which
destroys the distinction. The result is three equally weighted buttons where only
one is currently actionable.

So: keep the checklist as *state* (it is genuinely useful to see that presence is
done), but stop rendering it as three equal choices. One "now" action, the rest
as status.

### Empty vs. realistic volume — and which is common

These fixtures are near-empty: 0 open tasks, 1 overdue, 2 inbox items. Model the
brief's scenario — 20 open tasks, 3 overdue, active shift, pending handover:

| Block | Behaviour at volume |
|---|---|
| Pulse | `pulseLive = …slice(0, 2)` (`app.js:22541`) — shows Überfällig + Heute, silently drops Liste and Lager **exactly when they are non-zero** |
| Meine Aufgaben | renders all 20 `dashboardTaskCard()` rows unpaginated (`app.js:22571–22573`), 3–4 lines each → ~1400px of scroll, no time grouping, no "next", no filter, overdue not sorted first |
| Inbox | ~10 items; still `slice(0,4)` on PC, still absent on phone |
| Shift card | unchanged — still 3 rows, now the least of the page's problems |
| `home-more` | four substantive panels (`adminTeamPanel`, overdue, all events, unassigned) still collapsed behind a `<summary>` |

**The loaded state is the common one.** This is a running care home with six
children in the fixture and eleven notification sources wired. The near-empty
capture is a 07:00-before-anything-happens artifact of an under-seeded demo DB.
Every design decision below assumes the loaded state and treats the empty state
as the reward, not the baseline.

### Deliberate, good decisions — leave these alone

- The shift-start card is **conditional**: `if(!active && !stockPending) return ''`
  (`app.js:7920`). The page genuinely changes shape by state. Rare and correct.
- The semantic left border and `late` / `go` / `done` tones (`app.js:7940`;
  `ui-v110.css:257–267`) — colour used as meaning, not decoration.
- `primaryLabel` (`app.js:22526–22528`) already picks a different hero verb for
  late-presence vs. plan-the-day. The logic is right; only its rendering is wrong.
- The mobile empty state is an inline `.mobile-empty-row` with a CTA
  (`app.js:22573`) rather than a full `emptyState()` slab. Correct for phone.
- The sticky rail (`ui-v110.css:252–255`) and the dark dock as chrome.

---

## 3. Three plans

### Plan A — Tighten

**Idea:** stop spending the first fifth of the phone on a greeting, and make the
one actionable step look different from the two that aren't.

Changes:

- **Shrink the hero.** Phone: in `ui-v110.css:366–415` /
  `mobile/mobile.css:1629–1646`, set `.home-start-hero` to a single 20px line and
  `display:none` on `.home-start-lede`; the date rule `.home-start-date` and the
  kicker `.home-start-kicker` fold into that line. PC: `ui-v110.css:58–71`,
  `min-height: 260px → 150px`, and hide
  `.home-command-copy > p:not(.home-start-kicker)` (`ui-v110.css:121–127`).
  Buys ~110px on phone, ~110px on PC.
- **Move the mode toggle out of page content.** `.ui-mode-row` inside
  `.home-command-hero` / `.home-start-hero` — one line each at `app.js:22557` and
  `22632`. Cheapest version: keep the markup, `position:absolute` it to the hero's
  top-right on PC (`desk/desk.css:967–1026` already scopes it) and hide it on
  phone, where the header already has the density affordance.
- **Fix the overdue jump.** `app.js:22536` — the `overdue` entry needs a jump
  target that lands on the overdue list, not `'day'`. Simplest correct
  one-liner today: point it at the notification centre
  (`runInboxJump` / `sheetNotifCenter()`, `app.js:22288–22338`) until Plan B gives
  it a real destination.
- **Restore step weighting on phone.** In `ui-v245.css` §4, exempt
  `.home-shift-step-cta.primary` from the uniform sizing at
  `mobile/mobile.css:1312–1320` / `1675–1680`; render non-primary open steps as
  a text row plus chevron rather than a filled button. Also un-hide
  `.home-shift-hint` on PC (`ui-v110.css:269`) — it is the only thing that
  explains the order.
- **Open `home-more` when it has content.** `ui-v110.css:352` styles
  `.home-more`; add the `open` attribute at `app.js:22605` when
  `overdue.length || unassigned.length`.

**Cost:** ~1 pass, CSS plus four one-line template edits. Risk: low. Regression
watch — `.home-start-hero` collapse interacts with `body.shell-m #view` padding
rules at `mobile/mobile.css:1596–1614`; the mode toggle has `!important` sizing
at `ui-v110.css:159–189` that will fight absolute positioning.

**Leaves unsolved:** the duty duplication, the invisible inbox on phone, task
volume, the empty PC width.

```
PHONE — Plan A
┌─────────────────────────────┐
│ ≡  Home        ? 🔔2 DE  A  │  header (unchanged)
├─────────────────────────────┤
│ Mo., 7. Sept. · Guten Tag,  │  1 line, 20px  (was ~155px)
│ Angelos                     │
├─────────────────────────────┤
│ SCHICHT BEGINNT             │
│ Lagercheck                  │
│ Heute noch nicht geprüft    │
│ ┌─────────────────────────┐ │
│ │  Check starten          │ │  ← only filled CTA
│ └─────────────────────────┘ │
│ ○ Schichtbuch schreiben   › │  ← demoted to a row
├─────────────────────────────┤
│ ⚠ 1  Überfällig             │
├─────────────────────────────┤
│ MO., 7. SEPT.           (0) │
│ Meine Aufgaben              │
│ Keine offenen Aufgaben.  →  │
└─────────────────────────────┘
```

---

### Plan B — Restructure  *(recommended)*

**Idea:** the page is one ranked duty stack with a "now" slot on top, then the
task list — and the greeting is deleted, not shrunk.

The insight is that `staffInboxItems()` is already the page. The shift-start
card, the pulse row and the rail notifications are three partial renderings of
the same queue. Render it once, properly, at the top of the main column, on both
surfaces.

Changes:

1. **Add a weight to `staffInboxItems()`** (`app.js:22119–22233`). Today priority
   is accidental — it is `push()` order. Give each item an explicit `weight`
   (late alert > presence > Lagercheck > handover > unacked handoff > journal >
   low stock > Liste > activities > ratings > events) and sort. Keep the shape
   otherwise so `sheetNotifCenter()` (`22288`) and `runInboxJump()`
   (`22325–22338`) keep working unchanged.
2. **New "Jetzt" card** rendered from `items[0]`: full-width, tone-bordered
   (reuse `.home-shift-start` tones from `ui-v110.css:257–280`), one primary CTA
   wired through `runInboxJump(item.jump)`. This is the answer to the question
   the user arrives with, and it is the first thing on the page.
3. **"Auch offen" list** from `items[1..5]`: 44pt rows, title + tone chip, one
   `data-inbox-jump` each. Overflow → "Alle anzeigen (n)" into
   `sheetNotifCenter()`.
4. **Retire the shift-start card as a card.** `homeShiftStartCardHtml()`
   (`app.js:7914–7968`) becomes a compact three-dot progress chip inside the
   "Jetzt" card header (`● ● ○ Schichtstart`) — the *state* survives, the three
   competing buttons do not. Presence, Lagercheck and journal are already inbox
   sources (`22137–22146`, `22147–22152`, `22177–22182`), so nothing is lost.
5. **Replace the hero with a shift strip** (~44px, light, not a dark slab):
   `Mo., 7. Sept. · Kalyvia · 07:00–15:00 · angemeldet` plus one trailing button
   that is `Jetzt melden` / `Schicht beenden` depending on
   `activeShiftPresence()` (`app.js:7854`). Delete `t('homeOverview')` from the
   view. Keep `homeHello` only in Easy mode, inline in the strip.
6. **Pulse becomes non-duplicating.** Filter `pulsePool` (`22535–22541`) to
   signals not already present in the duty stack, and raise the cap from 2 —
   at volume, four small tiles beat two large ones.
7. **Tasks card earns its volume.** In `app.js:22568–22574` / `22602–22605`:
   sort overdue-first, group by `entryTime(e)`, cap at 5 with
   "Alle n anzeigen" → `navigateStaffTab('schedule',{scheduleView:'day'})`.
   Replace the emoji in `dashboardTaskCard()` (`21100–21104`) with `ui('u-*')`.
8. **PC: fill the width with what is already written.** `.home-command-grid`
   (`ui-v110.css:237–243`) goes `minmax(0,1fr) 320px`. Left: Jetzt → Auch offen →
   Meine Aufgaben → *the contents of `home-more`, uncollapsed* (`adminTeamPanel`,
   overdue, unassigned, events — `app.js:22605–22622`, currently four real panels
   hidden behind a `<summary>` while the page bottom is white). Right rail keeps
   Kinder heute, Momente, Schichtende, and **loses** Benachrichtigungen, which
   has moved left and become the page.

**Cost:** ~1 week. Template surgery across `viewHome()` `22502–22651`,
`homeShiftStartCardHtml()` `7914–7968`, `homePcRailHtml()` `22256–22286`, plus a
new CSS section. Risks:

- **Tour anchors.** `data-tour="home-main"`, `home-pulse`, `home-tasks`,
  `home-actions` (`app.js:22553`, `22545`, `22548`, `22568`, `22576`) must move
  with the blocks or the spotlight tour points at nothing — see
  `docs/agents/TOUR_SYSTEM.md`.
- **Easy/Pro gating.** `pro-only mode-pro-block` currently hides `home-more` and
  the moments strip in Easy. Un-collapsing on PC must not un-hide in Easy.
- **Weighting is a judgement call**: if the sort is wrong, the "Jetzt" slot is
  confidently wrong, which is worse than the current diffuse layout. Ship the
  stack before the "Jetzt" promotion if the ordering isn't agreed.
- Client-UI ship checklist applies: `build.json`, `APP_BUILD` in `gate.js`, `?v=`
  in `gate.js` / `index.html` / `sw.js` / the `app.js` SW register, `paidia-vN`.

```
PHONE — Plan B
┌─────────────────────────────┐
│ ≡  Home        ? 🔔2 DE  A  │
├─────────────────────────────┤
│ Mo., 7.9. · Kalyvia         │  shift strip, ~44px
│ 07:00–15:00 · angemeldet  ⏻ │
├─────────────────────────────┤
│ ┃ JETZT            ● ● ○    │  ← items[0], tone border
│ ┃ Lagercheck Kalyvia        │     + shift-start progress
│ ┃ Heute noch nicht geprüft  │
│ ┃ ┌───────────────────────┐ │
│ ┃ │   Check starten       │ │
│ ┃ └───────────────────────┘ │
├─────────────────────────────┤
│ AUCH OFFEN               5  │
│ Übergabe: Seite leer  SCHICHT ›│
│ 3 Aufgaben überfällig   PLAN ›│
│ 4 Artikel knapp        LAGER ›│
│ Liste: 6 offen          LISTE ›│
│ Alle anzeigen (5)           │
├─────────────────────────────┤
│ MEINE AUFGABEN          20  │
│ ⏱ 08:00  Frühstück       ○ │
│ ⏱ 09:30  Schule bringen  ○ │
│ ⏱ 12:00  Mittagessen     ○ │
│ … Alle 20 anzeigen        › │
├─────────────────────────────┤
│ [Plan] [Buch]  [Kinder]     │
└─────────────────────────────┘
```

```
PC 1440 — Plan B
┌────────┬─────────────────────────────────────────────┬──────────────┐
│ nav    │ Mo., 7.9. · Kalyvia · 07:00–15:00      [⏻]  │              │
│ rail   ├─────────────────────────────────────────────┤ Kinder heute │
│ 220px  │ ┃ JETZT                        ● ● ○        │ ○○○ ○○○      │
│        │ ┃ Lagercheck Kalyvia    [ Check starten ]   │              │
│        │ ┃ Heute noch nicht geprüft                  ├──────────────┤
│        ├──────────────────────┬──────────────────────┤ Momente      │
│        │ AUCH OFFEN        5  │ MEINE AUFGABEN   20  │ ▣ ▣ ▣ ▣      │
│        │ Übergabe leer      › │ 08:00 Frühstück   ○  │              │
│        │ 3 überfällig       › │ 09:30 Schule      ○  ├──────────────┤
│        │ 4 knapp            › │ 12:00 Mittag      ○  │ Schichtende  │
│        │ Liste: 6 offen     › │ Alle 20 anzeigen  ›  │ [Beenden]    │
│        ├──────────────────────┴──────────────────────┤              │
│        │ Team heute · Überfällig · Ohne Person       │              │
│        │ (was collapsed in `home-more`, now visible) │              │
└────────┴─────────────────────────────────────────────┴──────────────┘
```

---

### Plan C — Rethink

**Idea:** Home is not a dashboard; it is **the shift**. Delete the dashboard
premise and make the page the lifecycle of one shift, start to end.

The page becomes three states, not one layout:

- **Before / at start** — presence check-in, Lagercheck, read the outgoing
  carer's handover. `sheetShiftPresence()` and `sheetShiftStockCheck()` become
  inline sections instead of sheets; nobody is deep-linking into a sheet at
  07:00 with one hand.
- **During** — the duty stack and the tasks, in time order, is the whole page.
- **At end** — Übergabe, Buch schließen, abmelden. `sheetShiftEnd()`
  (wired at `app.js:23774`, currently reachable only via a rail card and one
  inbox item at `22226–22231`) is promoted to a page state.
- **Off shift** — next shift, house state, nothing actionable. Honest, and it
  frees the page from pretending there is always work.

This absorbs the presence/handover flow, makes the pulse and the tasks card
subordinate to shift phase, and gives "Zum Plan" a reason to exist as a link
rather than a destination.

**What would have to be true:**

1. Presence check-in is actually performed every shift, not aspirational —
   check how many `DB.shiftCheckins` rows exist per staff-week in production.
2. Shifts have a performed end. If carers simply stop using the app, the
   "end" state never renders and a third of the design is dead.
3. **Admins do not use Home as their overview.** They have `viewAdmin`, but the
   PC Home currently renders `adminTeamPanel(today)` (`app.js:22609`,
   `21640`) — evidence that someone treats Home as an admin dashboard. If that
   is real, Plan C splits Home into a carer shift page and an admin overview,
   which roughly doubles the work.

```
PHONE — Plan C, three states
  START                DURING               END
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ SCHICHT 07:00 │    │ 07:00–15:00   │    │ SCHICHT ENDET │
│ Kalyvia       │    │ läuft · 3h    │    │ 15:00 · in 20'│
├───────────────┤    ├───────────────┤    ├───────────────┤
│ ① Anwesenheit │    │ JETZT         │    │ ① Übergabe    │
│  [ Ich bin da]│    │ Lagercheck    │    │  [ Schreiben ]│
│               │    │ [ Starten ]   │    │               │
│ ② Lagercheck  │    ├───────────────┤    │ ② Buch prüfen │
│ ③ Übergabe    │    │ 08:00 Früh. ○ │    │ ③ Abmelden    │
│    lesen      │    │ 09:30 Schule○ │    │               │
├───────────────┤    │ 12:00 Mittag○ │    ├───────────────┤
│ VON DER       │    ├───────────────┤    │ NÄCHSTE       │
│ NACHTSCHICHT: │    │ AUCH OFFEN  4 │    │ SCHICHT: Maria│
│ "Lea hustet…" │    │ …             │    │ 15:00–23:00   │
└───────────────┘    └───────────────┘    └───────────────┘
```

PC is the same three states in the `1fr / 320px` grid; the rail stays constant
(Kinder heute, Momente) so the page does not feel like it is being replaced.

---

## 4. Recommendation

**Plan B.** Plan A buys ~110px and fixes a broken link but leaves the page
answering the wrong question. Plan C is probably where this ends up, but it
depends on three product facts nobody has confirmed and it swallows two sheets.
Plan B needs no new data model — it promotes a ranked queue that already exists
and is already wired to a working jump router.

**What I would do first, sized to ship today:**

> Render `staffInboxItems()` on the phone, at the top of the mobile branch of
> `viewHome()` (insert at `app.js:22563`, before `${shiftStartCard}`), capped at
> five rows with `data-inbox-jump`, plus "Alle anzeigen" into
> `sheetNotifCenter()`. Reuse the existing `.home-rail-notif` row styling from
> `ui-v110.css:332–339` — no new visual language, no template deletions, no risk
> to the tour anchors.

That one change takes the page's best content from *invisible on the primary
surface* to *first thing a carer sees*, and it makes every later step of Plan B
an edit rather than an invention. Pair it with the two-line overdue-jump fix
(`app.js:22536`) so the numbers on the page stop lying about where they lead.

---

## 5. Open questions for the owner

1. **Who is Home for?** `adminTeamPanel()` renders here (`app.js:22609`).
   Is Home a carer's shift page, an admin overview, or both? Everything above
   assumes carer-first. If admins depend on it, Plan B's left column needs a
   role split.
2. **What is the real priority order** of the eleven inbox sources? Plan B needs
   an explicit ranking. Concretely: does a pending Übergabe outrank an unstarted
   Lagercheck? Does low stock ever outrank a task that is 3 days overdue?
3. **Is presence check-in actually performed** every shift, or is the shift-start
   card modelling a process that only half happens? This decides whether the
   shift-start progress chip in Plan B is signal or clutter.
4. **What is realistic task volume** per carer per day — 3, or 20? Both the pulse
   cap (`slice(0,2)`) and the unpaginated task list are designed for near-zero,
   and I have no production numbers.
5. **Do carers ever open Home off-shift?** If yes, the page needs a fourth,
   honest state ("nichts zu tun, nächste Schicht Mi. 07:00"), which none of the
   three plans currently spends space on.
6. **Should the Easy/Pro toggle be page content at all,** or app chrome that
   belongs next to the language switch in the header? It appears in the Home hero
   on both surfaces and nowhere else — which suggests it was placed for
   discoverability, not for use.
7. **Is "Momente heute" load-bearing** for anyone, or is it a nice-to-have
   occupying prime sticky-rail space above "Schichtende"?
