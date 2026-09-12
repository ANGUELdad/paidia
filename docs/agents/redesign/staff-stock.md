# Staff Lager / Stock (`data-tab="stock"`) — redesign plan

Surface: `viewStock()` `app.js:10584–10830`. Screens: `.qa-screens/v245-final/{pc,phone}-staff-stock.png`.

---

## 1. What this page is for

A carer is standing in a storeroom with a phone in one hand. The job is to make
the app's numbers match the shelf in front of them, and to push what is missing
onto the shopping list. They arrive with one of two questions: *"I just took two
litres of milk — record it"* (targeted, ten seconds) or *"it's my shift, I have
to walk the shelves"* (a sweep, ten minutes).

The page today answers a third question — *"how healthy is the inventory?"* — and
answers it four times before it shows a single product. That is a reporting
question, and the person holding the phone is the one who already knows the
answer; they are the source of the data, not its consumer.

---

## 2. Read of the current design

### Phone, in the order the eye receives it

1. **`.stock-pantry-hero`** (~270px) — `LAGER` / `Kalyvia` / `100%` /
   `VORRATSSICHERHEIT` / a full-width bar / `62 Gut versorgt · 0 Wenig · 0 Leer`.
2. **`.stock-context`** (~150px) — `62 Artikelarten`, `5 Kategorien`,
   `0 Auf der Einkaufsliste`, plus a two-line explanatory paragraph.
3. **`.stock-command-center`** (~200px) — house rail, search, a full-width filled
   `--brand` **`+ Hinzufügen`**, `•••`.
4. **`.stock-view-tabs.stock-zone-pier`** — `0 Achtung` / `0 Leer` / `62 Regale`.
5. **`.shift-check-banner.pending`** — *Lagercheck*, clipped by the fold.

Zero product rows above the fold. Five blocks of chrome.

**The same three numbers are rendered three times each.** `counts.empty` appears
in the hero legend (10739), the `Achtung` tab's `<small>` and the `Leer` tab
(10774–10775). `allProducts.length` appears as *62 Gut versorgt*, *62
Artikelarten* and *62 Regale*. And `t('stockHeroHint')` (`app.js:645`,
"Mindestbestand steht am Artikel") is the same sentence as the `.stock-context`
paragraph (10747, "Der Mindestbestand steht bei jedem Artikel") — a tutorial
printed twice, 200px apart, on a screen a carer opens fifty times a week.

**The weight is inverted.** The loudest control is `#stockQuickAdd` (10756), a
full-width filled-green primary that creates a *new product type in the
catalogue* — an admin task done maybe monthly. The action performed fifty times a
shift, `[data-stock-step]`, is off-screen.

### PC (1440)

Same content, two columns at the top (`ui-v110.css:7027–7033`: hero left,
command panel right), a 3-column `.stock-priority-grid` (`ui-v110.css:7060` +
`:7114`), and `.stock-recent` "Letzte Bewegungen" at the bottom. It reads as the
phone page cut into thirds. Two specific consequences:

- The `emptyState()` for "Alles ist ausreichend vorhanden." (10715) is one cell
  of a three-column grid, so it renders as a small box with two thirds of the row
  blank. v244 §4e added the trailing-orphan span for `.stock-context` but not for
  `.stock-priority-grid`.
- The desktop category nav `<nav class="stock-shelf-rail">` (10784) is gated
  `!flatView && isPro()`, and the default filter is `attention` → `flatView` is
  true → **the rail never renders in the default view.** The only PC-specific
  navigation aid on the page is unreachable unless you switch to the catalogue.

### What PC gives you that phone doesn't: almost nothing

Bulk select is behind the same `•••` `<details>` on both surfaces
(`#stockSelectToggle`, 10761). There is no table, no keyboard entry design, no
shortcuts. Each row *does* carry a real `<input class="stock-qty-input">`
(10658), so tabbing through quantities works — by accident, not by design, and
into a 3-column grid where tab order snakes sideways. This is the biggest
unclaimed opportunity on the page.

### Density

Earning its space: the three view tabs — `Achtung / Leer / Regale` is the correct
triage taxonomy for this job. And `.stock-product.has-stepper` itself (10645–10662)
is a well-composed row: category icon, name, state pill, `min N`, last movement
with actor and relative time, then a 44×44 `−` / qty / `+` group. The touch
targets are right for a storeroom.

Not earning it: the tide bar at 100% (a bar that is full), the `.stock-context`
census, and the duplicated instruction paragraph.

### Empty and low-data states — the common case, served worst

An inventory in good order has 0–6 attention items on most days. So the
screenshot is not an unrealistic fixture; **for the default `attention` filter it
is the modal state.** Yet that state gets: a hero saying 100%, a legend saying
`0 Wenig · 0 Leer`, a tab saying `0 Achtung`, a section header saying
`Jetzt prüfen · 0`, a hint saying `0 Produkte brauchen Nachschub`, and finally an
orphaned card saying `Alles ist ausreichend vorhanden.` Six restatements of "no".

### At realistic volume

The fixture is **not** small: `DB.products` (`app.js:2692–2759`) is 62 real
products across 5 shelves — Trockenware 25, Obst & Gemüse 15, Kühlregal 11,
Haushalt 9, Getränke 2. At 100 the largest shelf is ~40. Where volume actually
bites:

- **Easy mode gets a flat list of everything.** `resultsHtml` (10717) routes
  `isEasy()` to `.stock-priority` with `boardVisible` = all products, sorted by
  state, with no category grouping — and the `Regale` tab that would restore
  grouping is `isPro()`-gated (10776). An Easy user cannot reach the shelves at
  all. Worse, `resultTitle` (10689) falls through to `stockNeedsAction`, so the
  header reads **"Jetzt prüfen · 62"** above a list where 62 items are fine.
- **The Lagercheck is 62 forced decisions in one modal.** `sheetShiftStockCheck()`
  (11735) builds `draft.order` from every product; `#shiftCheckSave` is
  `disabled` until `done === total` (11730). There is no save-and-resume — the
  draft lives in a closure, so dismissing the sheet loses the sweep. At 100
  products this is a 100-decision modal that cannot be paused. Its own escape
  hatch, `#shiftCheckAllYes` ("Rest OK", 11797), sits *directly beside* Save, so
  the rational move under time pressure is: Rest OK → tick responsibility → save.
  The flow is defeated by the button next to its finish line.

### Is the draft state legible mid-task? No — and it is a CSS defect, not a design gap

`productCard` stamps `has-draft` on any touched row (10645). Two rules exist to
render it, and **both are dead**:

- `#view .stock-product.has-draft` (`ui-v213.css:179`) sets a 6% pine background
  and a mixed border-colour, neither `!important`. It loses outright to
  `body:not(.mode-child) .stock-product.has-stepper` (`ui-v110.css:4088–4093`),
  which declares `border: 1px solid var(--line) !important` and
  `background: rgba(255,255,255,.78) !important`.
- `.stock-product.has-draft .stock-qty` (`ui-v110.css:7567`) targets `.stock-qty`,
  which is only emitted in the multi-house read-only card (10620). The
  draft-capable single-house row uses `.stock-qty-input`. The selector matches
  nothing in the view where drafting is possible.

`.stock-product.drafting` *is* styled (`index.html:2611`, `ui-v110.css:4123`) —
and nothing anywhere adds that class.

So mid-sweep, the only evidence of an uncommitted change is `draftBit` (10650): a
grey `· +2` fragment inside `.stock-product-meta`, fourth in a dot-separated run
after the state pill, `min N` and the last-movement stamp. Everything else comes
from the dock's `stockDraftSummary` count (10811). **On a 100-row list you cannot
scroll back and see which rows you touched.** For a task whose whole premise is
"tap many, save once", that is the central failure.

Two aggravating factors: `.stock-footer-actions` is `position:fixed`
(`index.html:2468`) above `--nav-total + --chat-h`, so it covers the last rows —
exactly where you are working if you swept downward. And `commitStockDraft()`
(11637) posts the batch with **no undo**: `stockUndoPayload` is written only by
`applyStockDelta()` (11551), the legacy immediate-write path. Reversing a
30-movement commit means entering 30 opposite deltas by hand.

### Houses: the rail is right, the constant behind it is wrong

`.seg.house-selector#sHouse` (10751) sits inside the command card. Per-page house
chrome is correct here — stock is keyed `stockKey(hid, pid)` and every ± writes
to one house. Two problems:

- On phone the rail is a clipped horizontal scroller, and in the v245 capture the
  active chip is not visible: the rail starts at *Limenaria*. The only place the
  phone states which house you are editing is the hero `<h2>`, 300px up. For a
  page where every tap is a house-scoped write, the answer to "which house?" must
  not be scrollable off-screen. (`revealActiveRailChips()` includes
  `.house-selector` — it is not centring reliably here.)
- **`SHIFT_STOCK_HOUSE = 'h1'` (11664) is a hard-coded constant.** The Lagercheck
  banner, `stockCheckForDate()`, `sheetShiftStockCheck()` and the whole save path
  (11829–11868) target Kalyvia regardless of which chip is lit. A carer on
  Limenaria sees a Lagercheck prompt that will write to a different house's stock.
  This is a correctness bug the current design conceals by putting the house rail
  and the Lagercheck banner in visually unrelated blocks.

### Deliberate, good decisions — leave these alone

- **Default filter is `attention`** (`app.js:4049`). The page opens on triage, not
  on the catalogue. Right call.
- **`stockSortByState()`** (11236) — empty → low → ok, then locale-aware name.
- **`captureStockOrderFreeze()` / `stockComputeVisible(…, respectFreeze)`**
  (11242–11274). Rows do not reshuffle under your thumb when you fix one. This is
  the single best decision on the page and it is completely invisible. Most
  inventory UIs get this wrong.
- **Reason asked once at commit, never per `−` tap** — the guard in
  `stockOutReasonModalHtml()` (11308) is explicit about it. Correct.
- **`sheetInitialStockCount()`** (11600): `adjustStockDraft()` refuses to apply a
  delta to a product with no recorded base (11618) and demands a count first. A
  delta on an unknown base is meaningless; this is the right refusal.
- **`insertStockOrderPid()`** (11276) — a newly added product slots into its
  category instead of forcing a re-sort.
- **The `.stock-product` row composition and its 44px steppers.** Keep.

### One verified hygiene defect worth naming

`.stock-shelf-rail` is declared twice as a bare class in the same file for two
different components: `ui-v110.css:4160` (the 4px gradient bar inside a shelf
`<summary>`, emitted at 10675) and `ui-v110.css:6469` (`flex:0 0 148px`, the
desktop category nav, emitted at 10784). The later declaration wins for both; the
decorative bar survives only because `body.mode-pro .stock-catalogue
.stock-shelf-rail` (`:6424`) patches `width:4px` back. Any work on this page
should rename one of them first.

---

## 3. Three plans

### Plan A — Tighten

**Give the first screen to the work, and make the draft visible.** CSS-only, one
new block in a `ui-v246.css` layer (or appended to `ui-v245.css`).

Changes, all scoped `body.shell-m[data-tab="stock"]` unless noted:

1. **Make `has-draft` actually render.** The existing rules lose to
   `!important`, so use a channel nothing else claims — `border-left-color` is
   already the state indicator (`.low` / `.empty` / `.ok`, `ui-v110.css:4112–4122`):

   ```css
   #view .stock-product.has-draft {
     box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--brand) 45%, transparent);
     background: color-mix(in srgb, var(--brand) 7%, #fff) !important;
   }
   ```
   and promote `draftBit` out of the grey run by giving
   `#view .stock-product.has-draft .stock-product-meta .muted` a pine pill
   (`background: var(--pine-tint); color: var(--brand); font-weight:750;
   padding:1px 6px; border-radius:999px`). Retire `.stock-product.drafting` and
   `.stock-product.has-draft .stock-qty` as dead.
2. **Reclaim the fold.** Hide `.stock-context` on phone (every figure in it is
   rendered elsewhere; the paragraph duplicates `stockHeroHint`). Compress
   `.stock-pantry-hero` the way ui-v245 §2 compressed `.kid-hero`: `padding:12px
   16px`, `h2` at 22px, `.stock-overview-copy > span` hidden. That is ~330px
   returned — enough to put the first product row above the fold.
3. **Un-invert the primary.** Style `#stockQuickAdd` / `#stockQuickAddEasy` as
   `.btn.sec` on phone. Nothing on this page should be filled `--brand` except
   the draft dock's Save.
4. **Fix the empty-state orphan** — the v244 §4e pattern applied to the grid it
   missed: `#view .stock-priority-grid > .empty-state { grid-column: 1 / -1; }`.
5. **Stop the dock covering the work:**
   `#view .stock-workspace:has(~ .stock-draft-dock) { padding-bottom: 96px; }`
   (`:has()` is already used freely in `ui-v110.css:4095–4110`).

**Cost:** one CSS block, no `app.js`, one pass. **Risk:** low. The hero rules must
land after `mobile/mobile.css:382–431`, which already sizes it — the v245/v246
layer loads last, so this is satisfied. The `!important` on the draft background
is deliberate and should carry a comment saying which rule it is beating.

**Gain:** the sweep becomes auditable — you can scroll back and see your own
edits. The fold moves from the Lagercheck banner to the first product.

**Leaves unsolved:** the Lagercheck is still an unpausable 62-decision modal;
`commitStockDraft` still has no undo; the `SHIFT_STOCK_HOUSE` mismatch stands;
Easy mode still gets a flat list mislabelled *Jetzt prüfen*; PC is still the phone
page in thirds.

```
PHONE — Plan A (non-empty case)
┌──────────────────────────────────┐
│ A  Lager · Kalyvia      ? 🔔 DE  │ fixed
├──────────────────────────────────┤
│ LAGER   Kalyvia            100%  │ hero, ~76px
│ 62 gut · 0 wenig · 0 leer        │
├──────────────────────────────────┤
│ [Kalyvia][Limenaria][Julian gr…] │
│ 🔍 Produkt suchen…         [•••] │
│ [    + Hinzufügen    ] ← ghost   │
├──────────────────────────────────┤
│ ( 3 Achtung )( 1 Leer )(62 Rgl.) │
├──────────────────────────────────┤
│ ⚠ Lagercheck      [Jetzt prüfen] │
├──────────────────────────────────┤
│▓▓ Milch     leer · min 1 · +2 ▓▓ │ ← has-draft, 2px pine inset
│▓▓ 0 L            [−][ 2 ][+]  ▓▓ │
├──────────────────────────────────┤ ← fold
│ ▎Reis      wenig · min 2         │
│  1 kg            [−][ 1 ][+]     │
└──────────────────────────────────┘
  ┌ 2 · +1 / −1    Noch nicht gesp. ┐ fixed
  │ [ Verwerfen ] [ ✓ Speichern    ] │
  └──────────────────────────────────┘
```

---

### Plan B — Restructure *(recommended)*

**One header strip, then the board.** The census becomes something you look up,
not something that greets you; the draft becomes a standing object on the page;
the Lagercheck tells the truth about which house it will write to.

Concrete changes:

1. **Collapse the top into one strip.** Replace `.stock-overview.stock-pantry-hero`
   + `.stock-context` (10726–10748) with a single sticky `.stock-headbar`: house
   name, `healthyPct` as a small inline figure, and today's check state read from
   `stockCheckForDate(hid, iso(new Date()))` (11666). Then delete
   `shiftStockCheckBannerHtml()` from the stock view (10781) — its content is now
   the strip's second line. Keep the function; Home still uses it. (v245 already
   found this banner rendering on three tabs and dropped it from Plan.)
2. **Make the check house-aware — do this first, it is a bug.** Replace
   `SHIFT_STOCK_HOUSE` (11664) with `state.house` across 11666–11869 (12 call
   sites), guarding `hid === 'all'`. `stockCheckForDate()` already takes a
   `houseId`, and `DB.stockChecks` rows already carry one, so reads survive
   unchanged; existing rows are simply all `h1`.
3. **A standing draft strip.** Between the tabs and the board, when
   `stockDraftEntries()` is non-empty, render `.stock-draft-strip`: one removable
   chip per touched product (`L(prod(pid))` + signed delta, `×` clears that pid
   from `state.stockDraft`). The fixed dock keeps only the summary and Save. This
   answers *"what have I changed"* without scrolling, which is the thing the page
   cannot do today. Pair with Plan A's `has-draft` row treatment.
4. **Undo the commit.** In `commitStockDraft()` (11637–11661), after a successful
   `runDomainOperation('stock.adjust', …)`, raise the existing `toastAction`
   pattern from 11557–11563 with a batch payload; the reversal is the same
   `changes` array with negated deltas through the same command. The domain layer
   already treats `stock.adjust` as atomic (`IMPLEMENTATION.md`), so this is a
   second command, not a rollback.
5. **Fix Easy mode.** At 10717, stop routing `isEasy()` to the flat priority grid
   when `stockFilter === 'all'` — let Easy reach `.stock-catalogue` too — and
   un-gate the third tab at 10776. Fix `resultTitle` (10689) so `filter === 'all'`
   is not titled *Jetzt prüfen*.
6. **Sticky shelf headers on phone.** Keep the `<details>` markup; add
   `position: sticky; top: var(--header-h)` to
   `body.shell-m #view .stock-shelf > summary` so at 100 products you always know
   which shelf you are in. (Rename the colliding `.stock-shelf-rail` first.)
7. **Give PC a real second capability.** At `min-width:900px`, drop
   `.stock-priority-grid` from `repeat(2/3, …)` (`ui-v110.css:7060`, `:7114`) to a
   single-column table-like board — `name | min | Bestand | ± | zuletzt` — with
   `.stock-qty-input` as the primary entry mechanism and a sane vertical tab
   order. Lift `#stockSelectToggle` (10761) out of the `•••` `<details>` into
   `.stock-command-row`. Three narrow cards side by side is the phone row cut into
   thirds; a wide row with a typed-quantity column is what a keyboard is for.

**Cost:** six template edits inside `viewStock()`, one function rewrite, a 12-site
constant change, and a CSS pass. A week. **Risk:** the house change alters what a
`DB.stockChecks` row means operationally (staff who assume "the Lagercheck = the
main store" will now get one per house) — a product decision, see §5. The Easy
routing change is visible to non-technical staff and should be watched. The PC
table risks regressing the `:has()`-driven column templates at
`ui-v110.css:7068–7093`, which are already fragile.

**Gain:** the page opens on work; the draft is legible without scrolling and
reversible after commit; a carer on Limenaria gets a Limenaria Lagercheck; Easy
mode stops lying about what it is showing; PC earns its width.

```
PHONE — Plan B
┌──────────────────────────────────┐
│ A  Lager · Kalyvia      ? 🔔 DE  │ fixed
├──────────────────────────────────┤
│ Kalyvia ▾      100% · 62 Artikel │ sticky headbar
│ Lagercheck heute: offen      [→] │
├──────────────────────────────────┤
│ ( 3 Achtung )( 1 Leer )(62 Rgl.) │
│ 🔍 Produkt suchen…         [•••] │
├──────────────────────────────────┤
│ Entwurf  [Milch −2 ×] [Reis +1 ×]│ .stock-draft-strip
├──────────────────────────────────┤
│▓▓ Milch      leer · min 1 · −2 ▓▓│
│▓▓ 0 L             [−][ 0 ][+]  ▓▓│
├──────────────────────────────────┤
│ ▎Reis       wenig · min 2 · +1   │
│  1 kg             [−][ 2 ][+]    │
├──────────────────────────────────┤
│ ▎Olivenöl        ok · min 1      │
│  4 L              [−][ 4 ][+]    │
└──────────────────────────────────┘
  ┌ 2 · +1 / −1                     ┐ fixed
  │ [ Verwerfen ] [ ✓ Speichern    ] │
  └──────────────────────────────────┘
```

```
PC — Plan B (structurally different: one wide board, typed entry)
┌────────┬─────────────────────────────────────────────────────────────┐
│ Armonia│ Kalyvia    100% · 62 Artikel   Lagercheck heute: offen  [→]  │
│ Thassos├─────────────────────────────────────────────────────────────┤
│        │ (3 Achtung)(1 Leer)(62 Regale)  🔍 suchen  [Auswählen] [•••] │
│ Home   ├──────────────┬──────────────────────────────────────────────┤
│ Momente│ REGALE       │ Produkt      min  Bestand      ±     zuletzt │
│ Kinder │ Kühlregal 11 │▓Milch          1  [   0  ] L  [−][+] −1 gest.│
│ Plan   │ Obst      15 │ Reis           2  [   1  ] kg [−][+] +2 Mo   │
│▸Lager  │ Trocken   25 │ Olivenöl       1  [   4  ] L  [−][+]   —     │
│ Liste  │ Getränke   2 │ Mehl           2  [   6  ] kg [−][+] +5 Fr   │
│ Talk   │ Haushalt   9 │ …                                            │
│ …      ├──────────────┴──────────────────────────────────────────────┤
│        │ Entwurf  [Milch −2 ×] [Reis +1 ×]    [Verwerfen][✓ Speichern]│
│ Zo-Ai  ├─────────────────────────────────────────────────────────────┤
│        │ Letzte Bewegungen   Milch +1 · 07.09. 18:43 · Angelos        │
└────────┴─────────────────────────────────────────────────────────────┘
   (the shelf rail — `nav.stock-shelf-rail`, 10784 — finally renders in the
    default view, because the board is no longer filter-gated to flatView)
```

---

### Plan C — Rethink

**Split the page by job: `Lager` becomes a read-and-search reference; recording
moves into a resumable, shelf-scoped, one-product-at-a-time session.**

The premise to question: this page hosts two tasks with opposite requirements.
*"Did we run out of milk?"* wants density, search, and **no accidental writes** —
today it is served by a screen covered in ± buttons that a one-handed grip will
hit. *"Record the shelf"* wants one decision at a time, huge targets, and no
navigation — today it is a flat list whose save button is under a fixed dock.
Sharing one scroll compromises both.

Concrete:

1. **Landing `viewStock()` goes read-only.** Drop `.stock-stepper` from
   `productCard` (10654–10661); keep `.stock-product-main` (tapping already opens
   the product sheet via `data-stock-product`, 10648), keep search, the three
   tabs, and `.stock-recent`. The attention list keeps exactly one row action:
   `→ Liste` (`data-stock-want`, 10651). Accidental writes become impossible.
2. **Generalise the check into a session.** `sheetStockSession(hid, shelfId)`
   built from `paintShiftStockCheckSheet()` (11694) and `sheetShiftStockCheck()`
   (11735): **one product per screen**, `OK / wenig / leer` as three full-width
   buttons plus a ± and numeric fallback, progress reading
   `12 von 25 · Trockenware`, back / skip, and — critically — the draft persisted
   in `state` rather than a closure, so putting the phone down does not lose the
   sweep. `shiftCheckQtyForMark()` (11688) is already the mark→quantity mapper;
   keep it verbatim.
3. **Scope sessions to a shelf.** `#shiftCheckSave` (11730) requires
   `done === total` across all products — unfinishable at 100. A shelf session
   requires `done === total` across 25, which a carer can actually complete, and
   the day's check is done when every shelf is. That removes the *reason* to
   reach for `Rest OK` (11797) instead of removing the button.
4. **Reuse the commit path.** The session writes into `state.stockDraft`, so
   `commitStockDraft()` (11637), the reason modal (11305) and the PIN prompt are
   inherited unchanged.

**What would have to be true for this to be worth it:** (a) the sweep is a real
recurring shift ritual — if it is weekly, the flat list is adequate and this is
over-engineering; (b) staff genuinely use Lager as a between-sweeps lookup — the
log distinguishes `data-stock-product` sheet opens from `data-stock-step` taps, so
this is measurable, not a guess; (c) somebody owns "is today's check complete",
because shelf-scoping turns completeness into a computed rollup rather than one
`DB.stockChecks` row.

**Cost:** highest — a new sheet flow (~250 lines), a `DB.stockChecks` shape change
to per-shelf records, and a landing view that loses its steppers, which staff will
notice on day one. **Risk:** if targeted single-item recording is actually the
dominant job, you have made the common case one tap slower for everyone.

```
PHONE — Plan C, surface 1: reference (no write affordances)
┌──────────────────────────────────┐
│ A  Lager · Kalyvia      ? 🔔 DE  │
├──────────────────────────────────┤
│ Kalyvia ▾   Lagercheck: 3/5 Rgl. │
│ [ ▶ Regal erfassen ]             │ ← the one primary
├──────────────────────────────────┤
│ ( 3 Achtung )( 1 Leer )(62 Rgl.) │
│ 🔍 Produkt suchen…               │
├──────────────────────────────────┤
│ ▎Milch        leer · min 1  [→]  │ [→] = auf die Liste
│ ▎Reis        wenig · min 2  [→]  │
│ ▎Mehl        wenig · min 2  [→]  │
├──────────────────────────────────┤
│ Letzte Bewegungen                │
│  Milch +1 · 07.09. 18:43 · Angelos│
└──────────────────────────────────┘

PHONE — Plan C, surface 2: session sheet (one product, full bleed)
┌──────────────────────────────────┐
│ ✕           12 von 25 · Trocken  │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░          │
├──────────────────────────────────┤
│                                  │
│              [icon]              │
│              Reis                │
│         zuletzt 1 kg · min 2     │
│                                  │
│  ┌────────────────────────────┐  │
│  │          O K               │  │ ≥64px
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │         wenig              │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │          leer              │  │
│  └────────────────────────────┘  │
│                                  │
│  genau zählen:  [−][ 1 kg ][+]   │
├──────────────────────────────────┤
│ [ ‹ zurück ]        [ übersp. › ]│
└──────────────────────────────────┘
```

PC keeps Plan B's wide board for this plan; the session sheet is phone-shaped and
does not need a desktop variant beyond centring it.

---

## 4. Recommendation

**Plan B.** Plan A does not touch the two things that actually cost a carer time —
an unpausable check and an unreversible commit — and Plan C is a bet on a usage
pattern nobody has measured yet (see §5). Plan B fixes the hierarchy, makes the
draft a first-class object, and repairs the house/Lagercheck mismatch, all without
betting on which of the two jobs wins.

**Ship today:** the `has-draft` CSS from Plan A step 1.

It is the highest-value change on the page and it is pure CSS on a class the
template already emits. Today, a carer who taps ± down twenty rows has no way to
review those twenty edits before committing them under a PIN — the two rules meant
to show them are both dead (`ui-v213.css:179` loses to an `!important` in
`ui-v110.css:4090`; `ui-v110.css:7567` targets `.stock-qty`, which the drafting row
does not render). Restoring a visible draft mark turns "tap many, save once" from
an act of faith into something reviewable, and it is a one-block diff in the last
CSS layer with no template change and no behaviour change.

Then, in order: the `SHIFT_STOCK_HOUSE` fix (a bug, not a redesign), the draft
strip, the commit undo, the headbar collapse, the Easy-mode routing, the PC board.

---

## 5. Open questions for the owner

1. **How big does the catalogue actually get?** 62 today. If the ceiling is ~100,
   shelves with sticky headers are enough. If it is 300+ (per-house SKUs, seasonal
   items), the flat priority list needs windowing and Plan B step 6 is not enough.
2. **How often does the Lagercheck complete honestly versus via "Rest OK"?**
   `DB.stockChecks[].allYes` already records this. If `allYes` dominates, the
   ritual is theatre and Plan C's shelf-scoping is the real fix; if not, leave the
   flow alone and just make it resumable.
3. **Is `SHIFT_STOCK_HOUSE = 'h1'` deliberate?** Does only Kalyvia hold the shared
   store, with the other houses drawing from it — or is this an unfinished
   generalisation? The answer decides whether the house rail belongs on this page
   at all, or whether stock is a Kalyvia-only concept with per-house consumption
   logged elsewhere.
4. **Who is this page for — the carer on shift, or the person placing the weekly
   order?** If the latter, `Auf der Einkaufsliste` and `.stock-recent` deserve far
   more room and the ± steppers deserve far less.
5. **Does `±` mean "I just took one litre" or "the shelf now reads 3"?** The row
   offers a delta stepper and an absolute quantity input side by side (10655–10660)
   and treats them as the same act, while `REASONS()` (11007) implies consumption.
   If corrections are the common case, absolute entry should be primary and the
   reason prompt should not fire for them.
6. **Is "Alle Häuser" a real workflow?** It disables drafting entirely
   (`adjustStockDraft` bails at 11615) and swaps every row for a read-only
   multi-house card. If nobody uses it, deleting it removes an entire branch from
   `viewStock()`.
7. **Is Easy mode's loss of the shelves intentional?** The `Regale` tab is
   `isPro()`-gated (10776), so the least technical users get the flat 62-row list
   and no grouping — which is the opposite of what Easy mode is for elsewhere in
   the app.
