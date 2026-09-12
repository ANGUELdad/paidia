# Staff — Taschengeld (`data-tab="pocket"`)

Surfaces reviewed: `.qa-screens/v245-true/pc-staff-pocket.png` (1440×900,
`shell-desk`, Pro, admin) and `.qa-screens/v245-true/phone-staff-pocket.png`
(393×852, `shell-m`). Fixture is near-empty (a few cents on Simon/Kai; two
large negative balances on Julian klein/groß).

Code under review:

| What | Where |
|---|---|
| Page shell + panes | `viewPocket()` — `app.js` 13361–13508 |
| Wire | `wirePocketView()` — 13510–13614; `wirePocketActions()` 13265–13338 |
| Compose | `pocketComposeHtml()` 13188–13225; `openPocketCompose()` 13226; `wirePocketCompose()` 13239 |
| Quick book | `pocketPresetChipsHtml()` 13056; `applyPocketPreset()` 13079; `POCKET_PRESETS` 13025 |
| Ledger rows | inline in `viewPocket` 13438–13451; shared `pocketTxnRowsHtml()` 13143 |
| Balance / post / reverse | `pocketBalance()` 12986; `postPocketCommand()` 3421; `deletePocketTxn()` 13113; `addPocketTxn()` 13000 |
| Categories / allowances | `pocketCategories()` 12914; settings pane 13385–13427 |
| Kid mirror | `childPocketView()` 13616–13661; shared panel `pocketMoneyPanelHtml()` 13165 |
| Desk master/detail | `desk/desk.css` 730–754; `ui-v213.css` 986–999; base `ui-v110.css` 6892–7005 |
| Phone rail | `ui-v213.css` 1000–1004 (column stack wins); `mobile/mobile.css` 455–462 |
| Txn paint | `ui-v110.css` 6716–6738 (`.pocket-txn.in` / `.out` only — no `.adjust`) |

Do **not** re-propose the v245 unsaved-guard fix (`pocketComposeDirty()` /
`UI_AUDIT_V245.md` §"Changes not saved"). Empty compose no longer warns; typed
amount does. That is settled.

---

## 1. What this page is for

A carer opens Taschengeld to answer one question: **"for this child, how much
money are we holding, and what just happened to it?"** The shift job is usually
smaller still — *Simon spent €3 at the kiosk; book it before I forget* — and
occasionally larger: *who entered the −330 € on Julian groß, can we reverse it,
and does the child see the same number?*

The page currently answers a different first question: **"what dashboard can I
build around one child's month?"** Balance, month stats, by-source breakdown,
calendar, and one-tap Schnellbeträge all sit above the chronological ledger.
The ledger — who / what / when — is the trust surface for real money held on
behalf of children, and it is the last thing the eye reaches.

---

## 2. Read of the current design

### PC (1440×900) — master/detail is real

**Say this clearly:** `.pocket-layout` is already a proper master/detail split
on desktop. Measured elsewhere as ~220 + 846 (`DEVICE-pc.md` §7.7;
`ui-v213.css` 987–999; reinforced `desk/desk.css` 730–742 sticky rail). Left
rail = one `.pocket-kid-card` per child with name + balance; right =
`.pocket-main-col` ledger. Other pages (Kinder, Liste, Lager) are being told to
copy this. Leave the split itself alone.

Eye order in the v245 PC capture (Simon selected, Pro):

1. **Pane chips** Verlauf · Einstellungen (`.pocket-pane-tabs`) — fine.
2. **Kid rail** — readable, selection tint on Simon, negative balances visually
   loud (−100 / −330). Good density for ~20 children.
3. **Balance card** (`.pocket-balance-card`) — name kicker, big Guthaben,
   Dieser Monat / Einzahlungen / Auszahlungen, then "Diesen Monat nach Quelle".
4. **Monatsübersicht** calendar beside it (`.pocket-ledger-top` dual column at
   ≥1100px / desk override).
5. **Schnellbeträge** — eight income source chips + six +amounts, three expense
   chips + six −amounts. Hint copy: *"Quelle wählen, dann Betrag tippen —
   sofort gebucht."* (`pocketMoneyQuickHint`). Books via `applyPocketPreset` →
   `postPocketCommand` with **no confirm**.
6. **Not in the capture above the fold:** `.pocket-staff-actions` (＋Einzahlung /
   −Auszahlung / Korrektur / allowance pay), filter chips, search, and
   `.pocket-txn-full` — the actual audit trail.

Hierarchy the layout implies: *summarise the month, then offer fast entry.*
Hierarchy the task needs: *pick child → see recent lines → enter one movement
(with a way to undo).* Density: the rail and the big balance earn their space;
the by-source block and full-month calendar do not, at fixture scale *or* at
realistic volume (calendar markers become noise at 30–200 txns/year; by-source
is a report, not a shift tool).

**Deliberate goods — leave alone:**
- Master/detail grid and sticky `.pocket-kids-rail` on desk.
- Soft-delete as compensating `adjust` with `reverses` (`deletePocketTxn`,
  `pocket.reverse` in `IMPLEMENTATION.md`) — original stays; second reverse
  rejected. Correct mental model for money.
- Compose kinds `in` / `out` / `adjust` (`openPocketCompose`).
- Shared `pocketBalance()` / txn store between staff and `childPocketView`.

### Phone (393×852) — master/detail collapses into a wall of names

The capture shows only: pane chips + vertical kid list + dock. No balance, no
ledger, no book controls above the fold. That matches measurement in
`DEVICE-phone.md` D12: `.pocket-kids-rail` renders as a **~618px vertical stack**
(ui-v213 `max-width:899px` column wins over ui-v110's horizontal snap rail), so
the selected child's detail starts around Y≈767 — below the dock.

So on the primary surface the page answers *"who has a balance?"* and withholds
*"what happened / book now"* until a long scroll. Selecting Simon tints the row
but does not navigate or collapse the rail — detail stays stacked underneath
all ~20 cards.

Negative balances (−100 / −330) use the same ink weight as 0,00 € on the phone
list (`.pocket-kid-line small`); the PC rail at least reads them as alarming.

### Trust, auditability, error recovery

| Need | Current behaviour |
|---|---|
| What was entered | Ledger row: amount, note, category, relative time, `balanceAfter`. Lives **below** Schnellbeträge + action row. |
| By whom | `emp(r.by)?.name` appended in the span — easy to miss; kid view **omits** `by` entirely (`childPocketView` 13630–13634). |
| When | `relativeTime` — good for "just now", weak for "last Tuesday 16:40" when reconciling a month. |
| Correct a mistake | Row `×` → confirm → `pocket.reverse` (good). Or ghost **Korrektur** → `openPocketCompose(…,'adjust')`. |
| See corrections as corrections | Rows only get `.pocket-txn.in` / `.out` from **sign of amount** (13444, 13155). `kind==='adjust'` never adds a class. Filter chip "Korrektur" exists; visual grammar does not. Storno note text is the only cue. |
| Discover adjust | Ghost button in `.pocket-staff-actions`, after the entire Schnellbeträge block and peer to allowance pay. Not in quick chips. Not in compose until you open it. |
| €3 kiosk spend | `POCKET_PRESETS = [1,2,5,10,20,50]` — **no 3**. Must open −Auszahlung compose and type. Source chips force a category tap first on the fast path; expense defaults are Einkauf / Ausgabe / Sonstiges — workable, but the fast path's "sofort gebucht" is the wrong risk profile for money. |

### Realistic data (20 kids × 30–200 lines / year + allowances)

- Month-scoped list (`pocketTxnInMonth` in `viewPocket` 13432) keeps the open
  month sane, but year history is only via calendar month paging — no year
  summary, no "last 20" escape that ignores month.
- Schnellbeträge stay the same size forever; ledger grows. Today the fixed chrome
  wins the fold; at real volume the ledger should win.
- Allowance pay buttons appear per child when rules exist — good — but sit in the
  same ghost row as Korrektur, so rare admin actions compete with the correction
  tool.
- Fixture emptiness hides the scroll problem; the phone rail problem does not
  need data to fail.

### Staff ↔ kid consistency

Same `DB.pocketMoneyTxns` and `pocketBalance()`. Kid gets balance + rules +
calendar + history, read-only, no `by`, no reverse, no Schnellbeträge. Staff
Schnellbeträge and month-by-source have no kid equivalent (correct). The risk is
**narrative mismatch**: a storno that looks like a normal −/+ line on the kid
screen ("why did my money go down again?") because adjust is not labelled.

---

## 3. Three plans

### Plan A — Tighten

**Idea in one line:** Keep the PC split and the data model; on phone restore a
horizontal kid picker and put the ledger above Schnellbeträge with a visible
Korrektur treatment — CSS + tiny template reorder, no new flows.

**Concrete changes:**

1. **Phone rail = horizontal snap again.** In a new last layer (or `ui-v246.css`),
   override the ui-v213 column stack:

   ```css
   body.shell-m #view .pocket-kids-rail {
     display: flex !important;
     flex-direction: row !important;
     flex-wrap: nowrap !important;
     overflow-x: auto !important;
     max-height: none !important;
     gap: 8px;
     scroll-snap-type: x proximity;
     -webkit-overflow-scrolling: touch;
   }
   body.shell-m #view .pocket-kids-rail .pocket-kid-card {
     flex: 0 0 auto;
     min-width: 148px;
     max-width: 180px;
     scroll-snap-align: start;
   }
   ```

   Aligns with the original `ui-v110.css` 6974–6989 intent; beats
   `ui-v213.css` 1000–1004. Call `revealActiveRailChips` (or a pocket-specific
   scroll-into-view of `.pocket-kid-card.on`) from `wirePocketView` after render
   so the selected child is not off-screen.

2. **Negative balance paint** on `.pocket-kid-line small` when balance &lt; 0
   (needs a class from `viewPocket` 13375–13381, e.g. `.neg` — one attribute in
   the template). Phone and PC.

3. **Reorder ledger body** in `viewPocket` (~13452–13488): after
   `.pocket-ledger-top`, emit filters + search + `.pocket-history-h` +
   `.pocket-txn-full` **before** `pocketPresetChipsHtml` and
   `.pocket-staff-actions`. Compose stage (`pocketComposeHtml`) stays above the
   list when open.

4. **Mark adjustments in the row template** (13444 and `pocketTxnRowsHtml`
   13155): class `adjust` when `r.kind==='adjust'` (and/or `r.reverses`); CSS
   in the same layer — muted border, label chip using existing
   `t('pocketMoneyAdjust')`, do not colour as ordinary in/out solely by sign.

5. **Promote Korrektur** in `.pocket-staff-actions`: keep ghost, but place it
   immediately under the txn list heading as a text button "Falsche Buchung?" /
   keep label `Korrektur`, and demote Schnellbeträge visually
   (`.pocket-presets { opacity` / collapse under `<details class="pocket-presets">`
   on phone only — CSS + one wrapper in `pocketPresetChipsHtml`).

6. **Hide or compress** `.pocket-by-source` and `.pocket-cal-wrap` on
   `body.shell-m` (calendar already collapses when empty elsewhere; here even
   with markers it costs fold). PC can keep the dual `.pocket-ledger-top`.

**Cost:** ~0.5–1 day. Risk: low if class hooks are additive. Could regress anyone
relying on vertical kid list on tablet widths — scope strictly `shell-m` /
`max-width:899px`.

**Gain:** Phone shows a child + recent lines without scrolling past the roster.
Corrections become visible in the trail. Fast chips stop owning the page.

**Leaves unsolved:** one-tap "sofort gebucht" still posts money with no confirm;
€3 still missing from presets; kid view still silent on who booked / what is a
storno; settings pane untouched.

```
PHONE — Plan A
┌──────────────────────────────────┐
│ A  Taschengeld        ? 🔔 DE  A │
├──────────────────────────────────┤
│ [Verlauf]  [Einstellungen]       │
├──────────────────────────────────┤
│[Simon 0,49][Kai 0,18][Vincent…]→│ ← horizontal rail
├──────────────────────────────────┤
│ SIMON · Guthaben                 │
│ 0,49 €                           │
│ Dieser Monat  …                  │
├──────────────────────────────────┤
│ [Alle][Ein][Aus][Korrektur]  🔍  │
│ VERLAUF                          │
│ +0,40 €  Eltern · Angelos · 1d   │
│ −0,20 €  Einkauf · …             │
│ × storno rows marked Korrektur   │
├──────────────────────────────────┤ ← fold
│ ▾ Schnellbeträge (collapsed)     │
│ [＋ Ein] [− Aus] [Korrektur]     │
└──────────────────────────────────┘

PC — Plan A (structure unchanged)
┌──── rail 220 ──┬──────── detail ────────┐
│ Simon · 0,49   │ balance | calendar     │
│ Kai            │ VERLAUF (moved up)     │
│ Julian −100    │ Schnellbeträge below   │
│ …              │ actions / Korrektur    │
└────────────────┴────────────────────────┘
```

---

### Plan B — Restructure *(recommended)*

**Idea in one line:** Make the page a **ledger console**: pick child → recent
movements → one deliberate book action; demote dashboards and one-tap posting;
make Korrektur / Storno first-class.

**Concrete changes (template + CSS, still vanilla):**

1. **Phone navigation:** tapping `.pocket-kid-card` scrolls/focuses detail and
   optionally sets `state.pocketFocus='detail'` so the rail collapses to a single
   selected chip + "Alle Kinder" back control (`wirePocketView` 13514–13522).
   Avoid a second route; keep hash `#pocket/:id`.

2. **Default body order** in `viewPocket` ledger branch:
   - Compact balance strip (amount + month net only; drop by-source from default).
   - Primary actions: filled **− Ausgabe** (shift-common) + sec **＋ Einzahlung** +
     ghost **Korrektur** — three buttons, not five. Move allowance pay into
     Einstellungen or a `⋯` on the balance card.
   - **Verlauf** list (last N of current month, with "älter…" via existing month
     cal or a `limit` raise).
   - Schnellbeträge only inside compose (`pocket-presets-compose` already exists)
     or behind Pro + `<details>`. Remove always-on immediate `applyPocketPreset`
     from the ledger surface — or require the same confirm copy as delete
     (`pocketMoneyDeleteAsk` pattern) before `postPocketCommand`.

3. **Compose becomes the booking surface.** `openPocketCompose(kidId,'out')` is
   the happy path for the kiosk story: amount (type or fill chips including
   **3** in `POCKET_PRESETS` or a phone numpad), category, note, Save.
   `applyPocketPreset` fill-only when compose open (already partially true via
   `fillOnly` / `state.pocketCompose`); **stop auto-post from the ledger page**.

4. **Ledger row grammar** (`pocketTxnRowsHtml` + `viewPocket` list map):
   - Columns: amount | kind badge (Ein / Aus / Korrektur) | note · category |
     who · absolute time | balanceAfter | storno action.
   - If `r.reverses`, show "Storno zu …" and dim the pair; if a row is already
     reversed (`DB.pocketMoneyTxns.some(x=>x.reverses===id)`), hide `×` (logic
     already in `deletePocketTxn`) and show a "storniert" marker.
   - Class `.pocket-txn.adjust` + `.pocket-txn.reversed`.

5. **PC:** keep `.pocket-layout` 220 + 1fr. Move calendar to a Pro-only collapsible
   under the list (or Einstellungen → "Monatsübersicht"). Balance card stays;
   by-source moves to Einstellungen or a report chip. Detail column becomes
   roughly 40% list / 60% when compose open (compose already centers in
   `.pocket-compose-stage`).

6. **Kid parity:** in `childPocketView`, reuse the same kind badge and storno
   label (read-only). Still hide staff names if product wants privacy — but show
   "Korrektur" so a reverse does not look like a new purchase. Optional: show
   first name of `by` only in staff mode.

7. **Settings pane:** keep rules / categories / weekly & monthly allowances;
   add a short "so bucht ihr" note that Storno keeps history (already true in
   `pocketMoneyDeleteAsk` strings).

**Cost:** 3–5 days. Risk: medium — carers who love one-tap ±5 will feel slowed;
mitigate with compose presets and a Pro opt-in for immediate book. Regression
surface: `wirePocketActions`, `applyPocketPreset`, kid pocket, any tour
`data-tour="pocket-ledger"`.

**Gain:** Matches the real task (book €3 out with a source and a note; see who
did what; reverse without rewriting history). Phone becomes usable on shift.
PC keeps the split others should copy, with a detail pane worth copying.

```
PHONE — Plan B
┌──────────────────────────────────┐
│ A  Taschengeld                   │
│ [Verlauf] [Einstellungen]        │
│ ← Simon 0,49 €          [Kinder] │  selected chip / back
├──────────────────────────────────┤
│ 0,49 €                           │
│ Monat −0,00 · Ein 1,40 · Aus … │
│ [ − Ausgabe ] [ ＋ Einzahlung ]  │  primary = out
│ [ Korrektur ]                    │
├──────────────────────────────────┤
│ VERLAUF · September              │
│ −3,00 €  Aus · Kiosk             │
│          Angelos · 7.9. 16:42    │
│          Saldo 0,49 €        [×] │
│ +5,00 €  Ein · Wochen-TG · …     │
│ ↺ −5,00  Korrektur · Storno zu…  │
├──────────────────────────────────┤
│ (compose slides in when −/＋)    │
│ Betrag [3]  Kat [Einkauf]        │
│ Notiz  [Kiosk]     [ Speichern ] │
└──────────────────────────────────┘

PC — Plan B
┌── kids ──┬────────────── detail ──────────────┐
│ Simon on │ 0,49 €   [− Aus][＋ Ein][Korrektur]│
│ Kai      │────────────────────────────────────│
│ Julian−  │ VERLAUF (scroll)                   │
│ …        │ rows with kind · who · time · ×    │
│          │ optional ▾ Monatsübersicht (Pro)   │
└──────────┴────────────────────────────────────┘
```

---

### Plan C — Rethink

**Idea in one line:** Stop treating Taschengeld as a standalone "finance app"
tab; make **booking a task from the child** and keep the tab as an
admin/reconciliation house view.

**What would have to be true:** carers almost always book while already looking
at a child (profile / Home / Plan), and the house-wide tab is used for
exceptions (negative balances, month-end, settings). If most taps today start
from `#pocket`, this is wrong.

**Concrete shape:**

1. Primary entry: from kid profile / `pocketMoneyPanelHtml` (already has ± and
   "open tab") — deepen that into the full compose, not a teaser.
2. `#pocket` becomes a **house overview**: sorted by balance (negatives first),
   "unbooked allowance due", search across kids — not a second copy of one
   child's dashboard. Master list stays; detail defaults to a cross-kid exception
   queue rather than Simon's calendar.
3. Merge Monatsübersicht with kid calendar patterns elsewhere; drop duplicate
   paidia-cal on this tab.
4. Consider whether Einstellungen belongs under Admin (categories + house rules)
   vs per-shift page.

**Cost:** large (nav, hash, tours, kid links). Risk: high — breaks the one
desktop pattern the rest of the redesign wants to clone. **Worth it only if**
usage data shows pocket is rarely opened cold and negatives/allowances are the
real house-level jobs.

```
PHONE — Plan C (house view)
┌──────────────────────────────────┐
│ Taschengeld · Haus               │
│ ⚠ 2 negative · 3 Woche fällig    │
│ Julian groß   −330 €          ›  │
│ Julian klein  −100 €          ›  │
│ Simon            0,49 €       ›  │
│ …                                │
│ tap › → child compose/ledger     │
└──────────────────────────────────┘
```

---

## 4. Recommendation

**Ship Plan B**, preceded by Plan A's phone rail + ledger-above-presets + adjust
class as a same-day patch if B slips.

Why B: trust outranks density for custodial money; the current Pro Schnellbeträge
surface optimises for speed of posting, not for confidence of posting. The PC
master/detail split is already right — B fills the detail pane with the audit
trail and a deliberate compose, which is what other pages should copy, not the
dashboard chrome around it.

**Single highest-value change that could ship today:** on `body.shell-m`, restore
the horizontal `.pocket-kids-rail` (override ui-v213) and move
`.pocket-txn-full` above `.pocket-presets` in `viewPocket`. That alone turns the
phone screenshot from "a list of names" into "a child's money," without touching
posting semantics or the unsaved guard.

---

## 5. Open questions for the owner

1. Should one-tap Schnellbeträge **ever** post without confirm, or only fill
   compose? (Product risk vs speed.)
2. Is **− Ausgabe** or **＋ Einzahlung** the more common shift action? (Decides
   which button is filled primary.)
3. Which preset amounts are real in the house (is **€3** / **€1,50** common)?
   Current `POCKET_PRESETS` are round euros only.
4. May children see **who** booked a line, or only Ein/Aus/Korrektur?
5. Are large negatives (−100 / −330) expected debt, data-entry errors, or
   migration artefacts — and should the rail block further `out` while
   negative?
6. Is the house-level tab used for month-end reconciliation (favours calendar +
   by-source) or almost only for per-child booking (favours Plan B demotion of
   those)?
7. Should weekly/monthly allowance pay live on the ledger or only under
   Einstellungen / a scheduled job?
