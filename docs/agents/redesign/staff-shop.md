# Redesign — Staff Liste / Shop (`data-tab="shop"`)

Surface: PC 1440×900 (`body.shell-desk`) + phone 393×852 (`body.shell-m`).
Fixture: v245, Kalyvia, Friday 11 Sep 2026, **0 items**.
Entry point: `viewShop()` — `app.js:14210–14504`.

---

## 1. What this page is for

Two jobs, not one. **Building** the weekly list: over several days, at the house,
someone notices the milk is low and adds it — the question is *"is this already on
the list, and do we actually still have some?"*. **Shopping** it: on Friday, in a
supermarket, one-handed, in front of a shelf — the question is *"what's next, and
is this line done?"*.

The page currently answers a third question that nobody arrives with: *"what is the
status of the Friday batch for this house?"* It opens with a status hero, three
counters, a state machine label (`fridayPlanned` / `fridayActive` / `fridayCompleted`)
and a three-way view picker. That is a report on the list, delivered before the list.

---

## 2. Read of the current design

### Phone — the order the eye receives it

Measured off the attachment (472×1024 capture of a 393×852 viewport, ×1.2019):

| y (real px) | what |
|---|---|
| 0–50 | app header |
| 72–254 | `.shop-overview` hero: kicker, house name, date + count sentence, **three stat cells reading 0 / 0 / 0** (~70px of that) |
| 265–306 | house rail (`.house-selector`, 4 chips, "Vale…" clipped by the scroller) |
| 356–399 | `.friday-picker.compact` |
| 409–456 | `.shop-panel-seg` + `•••` |
| 471–509 | `.shop-easy-strip` — 2 buttons |
| 523–564 | `.shop-add-row` quick-add |
| 595–657 | `.shop-list-heading` "Auf der Liste / 0 Produkte…" |
| 681+ | empty state |
| 806 | dock top |

**~600px of the 852px viewport is chrome.** With a real list, the first item row
lands at y≈660 and the band between the heading and the dock is ~130px — at
`.shop-item { min-height: 64px }` (`ui-v110.css:5256`) that is **two visible rows out
of 42**. The page's own content occupies 15% of first paint.

The count of open items renders **five times** on one screen: hero subtitle
(`shopOverviewHint`, `app.js:14227`), hero stat 1 + `secOpen` label (`14228`), the
friday-picker sub-line `${fridayState} · ${open.length}` (`14240`), the CTA
`cartReady(n)` (`14257`), and the list-card heading — which uses the *identical string*
`shopOverviewHint(open.length)` again (`14464`). "0 Produkte für diesen Einkauf
geplant." appears verbatim twice, 350px apart.

### PC — same structure, worse use of space

`desk.css:1061` forces the whole page to a single column:

```1061:1072:desk/desk.css
body.shell-desk #view .shop-shell,
body.shell-desk #view .shop-shell-plan,
body.shell-desk[data-tab="shop"] #view .shop-shell-plan,
body.shell-desk.layout-desktop #view .shop-shell-plan {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) !important;
```

So a ~1216px content column carries a phone layout. The visible cost: the
`.friday-picker.compact` spans the full 1216px to centre a 24-character date string
between two 32px arrows — roughly 1100px of empty bar. The list heading sits at
y≈429 of 900, so half the desktop fold is chrome too, and the right half of every
list row is unused while stock, requests and history all sit off-screen or collapsed.

`desk.css:1103` correctly hides the hero kicker and the duplicate Einfach/Pro
toggle on desktop (the header already has one) — so the hero is *already* known to
be over-built; the phone just didn't get the same treatment.

### The segmented control is not three views of one thing

- **Planen** → `openCard` (`14463–14495`): the editable list. Rows with a ± stepper,
  a qty input and `×`.
- **Mitnehmen** → `takeListCard` (`14272–14292`): the **same items**
  (`[...open, ...pending.filter(e=>!e.decision)]`, `14273`) grouped by category,
  with **zero interactive elements**. It is a print/read-out view.
- **Anfragen** → `requestsCard` (`14301–14358`): a different data table
  (`listRequestsFor`, `12834`) holding *proposals*; accept creates a list entry
  (`acceptListRequest`, `13744`). This is a triage inbox.

So the control mixes a *display option* (flat vs. by category) with a *mode* and an
*inbox*, and presents all three as peers. And Mitnehmen is store mode minus the
ability to do anything — store mode already renders category blocks with sticky
headers (`storeCatBlocks`, `14402`; `.store-cat-h`, `ui-v110.css:4888`).

### Shopping mode already exists — and is hidden

`.store-page` (`ui-v110.css:4809`) is a real full-screen takeover: `position:fixed;
inset:0; z-index:60` over a z-30 dock, dark chrome header, progress bar, search,
sticky aisle headers, a bottom finish dock. That is the right architecture. Its
problems are all about the seams:

- **No door.** The only entry is `#startFriday` / `#startFridayTop`, labelled
  `cartReady(n)` = "12 Produkte – Einkauf starten". Nothing on the page names a
  shopping mode, and the button does not exist at all when `open.length === 0`
  (`14257`). Nothing hints the mode exists until you have items.
- **Entry is a one-way flip.** `startFridayBatch()` (`14507`) sets every open entry
  to `status:'pending'`. `openCard` then renders only `if(!pending.length)` (`14463`),
  so the quick-add row is gone: **you cannot add an item while shopping.** The most
  common in-store event — remembering something, seeing an offer — has no affordance.
- **Exit is blocked.** `#confirmBatch` is `disabled` until `remaining === 0`
  (`14449`), and its label restates the same fraction the 68px progress column
  already shows. With 50 items, one undecided line at the till blocks finishing.
  The escapes — `←` (`pauseFridayStore`, non-destructive, good) and `•••` → abort —
  are both discoverable only by exploration.
- **Row height.** `.store-choice { min-height: 104px }`, 108px at ≤680px
  (`ui-v110.css:4890`, `4979`). 50 items over 8 categories = 50×108 + 8×39 ≈ **5.7k px**,
  ~15 phone screens per trip.
- **A 3-column grid with 2 buttons.** `.store-choice-actions` is
  `grid-template-columns: repeat(3, minmax(0,1fr))` (`ui-v110.css:4912`) but the markup
  emits only `∅ unavailable` and `€ expensive` (`14396–14397`). A third of every row's
  action strip is dead, ×50 rows. `.store-decision.yes` rules (`4930`, `4933`) style a
  button that no longer renders. Same family as v244 §4e, but §4e's
  `nth-child(odd):last-child` rule only catches 2-column grids.
- **The legend is hidden exactly where it's needed.** `storeTapHint` = "✓ gekauft ·
  ∅ nicht da · € zu teuer" is the only explanation of the two glyph buttons, and
  `ui-v110.css:4975` sets `.store-guidance span:last-child { display:none }` below
  680px — i.e. on every phone.
- In Easy mode `.store-choice-actions` is `pro-only mode-pro-block`, so an Easy user
  can only mark bought/undo, never "not available" — and the 104px row is then
  mostly whitespace.

### Pending-removal: five steps to delete one wrong item

Tap `×` → `toggleListPendingRemove` (`11018`) marks the row
(`.shop-item.list-pending-mark`, `ui-v110.css:7560`) → `listPendingDockHtml` (`11029`)
pins a dock above the tab bar → "Entfernen bestätigen" opens `sheetRemoveListItem`
(`11047`) → choose a reason chip → confirm. Plus:

```14509:14512:app.js
  if((state.listPendingRemove||[]).length){
    toast(t('listPendingBeforeShop'),'info');
    return;
  }
```

A stray `×` tap **blocks the shopping trip** until it's resolved with a reason. And
the reason's only consumer is the audit log: `entry.removeReasonId` /
`entry.removeReason` plus `logEntry('SHOP', …)` (`11133–11146`), surfaced only in the
Admin audit search (`21402`). Nothing on the shop side reads it. So the ceremony
buys an audit line — which does not require *blocking* anything.

This is also the mechanism that generated one of v245's three false "Changes not
saved" sources. v245 fixed the symptom correctly (`listPendingRemoveLive()`,
`11348`); the model that made stale ids possible is still there.

### Requests

A request differs from a planned item today by being **on a different screen**.
Inside that screen it differs by carrying a `.req-status.pill` in `--sea` (#2f5a63,
`index.html:3453`) — the only non-pine accent on the page — and two action buttons.
`.req-filters` offers five status filters plus a requester `<select>` for a queue that
is normally 0–3 rows. Accepting stores `fromRequestId` on the new entry (`13762`) and
then never shows it: **"Julian asked for this" is captured and discarded**, exactly
at the moment (standing in the aisle, deciding whether to buy Nutella) when it is the
deciding fact.

### Empty and low-data states

The empty state itself is fine — `startListTitle` + `startListHint` + two CTAs
(`14480–14488`). Two problems: it arrives *after* 600px of controls that do the same
two things its buttons do, and its copy says "Wähle Freitag und Haus **oben**",
pointing back at chrome the user has already scrolled past. It also uses `🧺` as
iconography (`14481`, `14286`) while the sibling empty state 60 lines away uses
`ui('u-cart')` (`14346`) — the brand rule is the icon set, not emoji.

**Which case is common?** Near-empty is a Monday state and lasts hours; a 40–60 item
list is the state the page is in from Wednesday to Friday, and the state it is in
during the only session that has a deadline. **The full list is the design target**,
and the current layout is tuned for the empty one.

### Deliberate, good — leave alone

- `listEntryStockChipHtml` (`11197`): on-hand stock on every list row
  ("0 im Haus" / "wenig"). This is the best idea on the page — it answers "do we
  actually need this?" inline. Promote it, don't touch it.
- The store-mode takeover being full-screen and **dark** — consistent with the rule
  that dark = chrome.
- Sticky `.store-cat-h` — correct for aisle-walking.
- `pauseFridayStore()` (`14522`) preserving decisions; each tap already saved.
- `missingCard` / `boughtCard` as collapsed `<details>` at the bottom (`14497–14501`)
  — correct ranking of history below intent.
- `shoppingHistory()` / `sheetShoppingHistory()` (`12756`, `12770`) — a real trip
  audit trail, correctly kept in a sheet rather than on the page.
- Already fixed, not re-proposed: the duplicated "Foto → Liste" (v245 — `14257` and
  `14260` are now mutually exclusive on `open.length`), the 2-column
  `.shop-panel-seg` spill (v244 §4, `ui-v244.css:155`), the 44pt floor on segmented
  buttons (v244 §6c, `ui-v244.css:279`), and `revealActiveRailChips()` for the
  clipped house chip.

---

## 3. Three plans

### Plan A — Tighten (CSS only, one pass)

**Idea:** stop spending 600px restating facts the list itself states, and halve the
in-store scroll.

Changes, all in a new last-loading `ui-v246.css` (wire after `ui-v245.css` in the
four shells + allowlist in `server.py` / `api/index.py`, per the v245 pattern):

1. `body.shell-m[data-tab="shop"] #view .shop-overview-stats { display:none }` — all
   three counters are duplicated elsewhere on the same screen (open → list heading,
   requests → the seg label already appends `· n` at `14246`, bought → the `boughtCard`
   pill). **−70px.**
2. `body.shell-m[data-tab="shop"] #view .shop-overview-copy > span { display:none }`
   and pull `.shop-overview` padding to `10px 14px`, `h2` to 20px — kills the verbatim
   duplicate of the list heading. **−90px.** (Desktop already does exactly this to the
   kicker and mode row at `desk.css:1103`.)
3. `body.shell-m[data-tab="shop"] #view .shop-photo-banner { display:none }` — with
   items on the list this is a third photo entry point next to `•••` → Scannen and the
   empty-state CTA. **−64px.**
4. Make the list heading a sticky context bar:
   `.shop-list-card .shop-list-heading { position:sticky; top:0; z-index:4 }` plus
   `min-height:52px`. "Auf der Liste · 42" and the `Einkauf starten` CTA stay reachable
   through 42 rows instead of scrolling away after two.
5. Fix the store row orphan: `.store-choice-actions { grid-template-columns:
   repeat(2, minmax(0,1fr)) }`. Reclaims 33% of every action strip.
6. Reflow the store row from stacked to side-by-side above 360px:
   `.store-choice { grid-template-columns: minmax(0,1fr) 168px; min-height:72px }`,
   keeping the existing `:has(.bulk-check)` override (`ui-v110.css:4936`) working by
   restating it as `42px minmax(0,1fr) 168px`. **5.7k px → ~3.1k px per trip.**
7. Re-show the glyph legend on phone as a second line instead of deleting it:
   revert `ui-v110.css:4975` under `body.shell-m` and let `.store-guidance` wrap.
8. `.friday-picker.compact` on desktop: cap it —
   `body.shell-desk #view .shop-flow-row .friday-picker.compact { flex:0 0 auto;
   width:max-content }` so it stops eating a 1216px row, and the seg lifts onto the
   same line.

**Cost:** ~110 lines of CSS, one pass, no template change. **Risk:** low. Two things
to re-measure: `@media (max-width:380px)` already re-stacks `.store-decision` into a
1-column grid (`ui-v110.css:4991`), so item 6 needs a 320px check; and the sticky
heading must clear the fixed app header on `shell-m`.

**Leaves unsolved:** the seg still claims Anfragen is a peer view; Mitnehmen is still
a dead-end read-only panel; you still can't add an item in the store; `×` still costs
five steps and still blocks the trip; requests are still invisible from the list.

```
PHONE — Plan A
┌────────────────────────────────────────┐
│ A  Liste          ?  🔔2  DE     (A)   │
├────────────────────────────────────────┤
│ Kalyvia                                │  ← 1-line hero
├────────────────────────────────────────┤
│ ‹Kalyvia› Limenaria  Julian gr…   →    │
│ ‹    Freitag, 11. September       ›    │
│ [Planen] Mitnehmen  Anfragen·2  [•••]  │
│ [Fehlendes aus Lager] [＋ Hinzufügen]  │
├════════════════════════════════════════┤
│ AUF DER LISTE · 42     [Einkauf ›]     │ ← sticky
├────────────────────────────────────────┤
│ 🥛 Milch          1,5 L   0 im Haus  ×│
│ 🍞 Brot           4 St    wenig      ×│
│ 🧴 Öl             1 L     3 im Haus  ×│
│ … 39 more                              │
└────────────────────────────────────────┘
        ▔▔▔ dock ▔▔▔      first row at y≈380
```

---

### Plan B — Restructure  *(recommended)*

**Idea:** one list with **two modes** (build / shop) and **one inbox** — kill the
three-way view picker, promote shopping mode to a permanent, named destination, and
put requests *in* the list where the decision happens.

Changes:

1. **The seg becomes a mode switch.** `app.js:14242–14247`: replace the three
   `data-shop-panel` buttons with **Liste · Im Supermarkt** — the second label is the
   existing `t('storeMode')` (`app.js:672` / `1931`), so no new string is needed.
   `state.shopPanel` becomes `'plan' | 'store'`; `'take'` retires. The store segment
   **always renders** — so the mode is named and visible on day one, unlike today's
   `#startFridayTop`, which only exists once `open.length > 0` (`14257`) — and routes
   to `startFridayBatch()` or, when `pending.length`, `resumeFridayStore()` (`14544`).
   Empty list → it stays inert with the existing `nothingToStart` toast. Resuming a
   paused trip stops being buried in `resumeCard` (`14454`). Handler: the
   `[data-shop-panel]` block at `24327`.
2. **Delete `takeListCard`** (`14272–14292`, −21 lines). Replace its actual value — "by
   aisle" — with a display toggle on the list itself: `state.shopGroup = 'flat'|'cat'`
   applied inside the `openCard` map at `14470`, reusing the `catOrder` already
   computed at `14221`. Net −5 lines, and the aisle view gains the stepper and `×` it
   never had.
3. **Merge the hero into the list card.** Drop `.shop-overview` (`14225–14232`) on
   phone; `.shop-command` (house rail + friday picker) becomes the page's only header.
   `.shop-list-heading` (`ui-v110.css:5242`) carries `Auf der Liste · 42` +
   `12 gekauft` + the primary CTA. Five renderings of one integer → two.
4. **Requests inline.** An `open` request renders as a `.shop-item` variant
   `.shop-item-req` **inside the list**, at the top: dashed 3px left border in
   `--sea`, name at normal weight instead of 750, and `✓ übernehmen / ✕` replacing the
   stepper. That is the visual difference the brief asks for — *a request is a row
   that is not yet yours*, same shape and same place as a planned item, differing in
   weight and edge rather than in location. Accepting calls the existing
   `acceptListRequest` (`13744`) and converts it in place; the resulting row keeps a
   `von Julian` sub-line read off `fromRequestId` (`13762`), so provenance survives to
   the aisle and into store mode's `.store-choice-qty` line.
   `.req-filters` (`14333–14343`) drops to *offen / alle*; the five-way status filter
   and the requester `<select>` move behind `•••`.
5. **Add in the store.** `storeNoMatch` (`14431–14438`) already fires when the search
   finds nothing — give it `＋ "Feta" hinzufügen`, creating a `pending` entry with
   `decision:'bought'`. Zero new UI surface, ~20 lines, and it closes the biggest
   functional hole.
6. **Removal becomes immediate + undo.** `×` sets `status:'removed'` and raises a
   toast with *Rückgängig* and *Grund angeben* (the toast API already takes a
   duration — `toast(t('shopPauseStore'),'success',3600)` at `14529`). The audit line
   is still written by `logEntry('SHOP', …)`; the reason becomes optional and
   post-hoc, which is all the Admin audit search (`21402`) needs. Retires
   `listPendingDockHtml` (`11029`), `toggleListPendingRemove` (`11018`),
   `markAllOpenListPending` (`11024`), `clearListPendingRemove` (`11013`),
   `listPendingRemoveLive` (`11348`), the `startFridayBatch` guard (`14509`),
   `.list-pending-dock` + `.shop-item.list-pending-mark` (`ui-v110.css:7546–7566`) and
   the `state.listPendingRemove` branch of `unsavedChangeParts()`. **Net negative
   diff**, and it deletes the whole class of false "unsaved changes" v245 had to patch.
   `sheetRemoveListItem` (`11047`) survives as the bulk path from select mode.
7. **Unblock the till.** `#confirmBatch` (`14449`) stops being `disabled`. When
   `remaining > 0` it reads `Abschließen · 3 offen` and opens a small confirm listing
   the undecided rows with one bulk *nicht gekauft*. Preserves the intent of
   `storeFocusHint` ("nothing is silently marked missing") without holding the user
   hostage at the checkout.
8. Empty state: keep the copy, swap `🧺` (`14481`, `14286`) for `ui('u-cart')` as
   `14346` already does, and rewrite `startListHint` so it stops pointing "oben" at
   chrome the phone user scrolled past.

**Cost:** ~150 lines changed in `viewShop()`, ~40 in the handler block around
`24317–24350`, ~120 lines of `ui-v246.css`. **Risk:** medium.
Watch: `navigateStaffTab('shop',{shopPanel:'plan'})` (`22331`, `23740`) and
`state.shopPanel` consumers at `11429`; the tour anchors `data-tour="shop-command"`,
`shop-houses`, `shop-friday` (`14233`, `14234`, `14237`) must keep their elements —
check `docs/agents/TOUR_SYSTEM.md` before moving them; `qa-unsaved-guard.mjs` needs
its `listPendingRemove` case replaced, not deleted.

**Gains:** first list row at y≈300 on phone instead of 660 (2 rows visible → 7);
shopping mode is a named destination instead of a side effect of a counter button;
requests get read because they're in the only list anyone opens; one wrong `×` costs
one tap and one undo instead of five steps and a blocked trip.

```
PHONE — Plan B, list mode
┌────────────────────────────────────────┐
│ A  Liste          ?  🔔2  DE     (A)   │
├────────────────────────────────────────┤
│ ‹Kalyvia› Limenaria  Julian gr…   →    │
│ ‹    Freitag, 11. September       ›    │
│ [ Liste ]  Im Supermarkt       [•••]   │ ← mode, not view
├════════════════════════════════════════┤
│ AUF DER LISTE · 42 · 12 gekauft        │ ← sticky
│ ⌸ nach Gang    [＋ Produkt hinzufügen] │
├────────────────────────────────────────┤
│┃ Nutella        von Julian  ✓überneh ✕│ ← request, in place
│┃ Chips          von Lea     ✓überneh ✕│
├────────────────────────────────────────┤
│ 🥛 Milch      1,5 L   0 im Haus  −2＋ ×│
│ 🍞 Brot       4 St    wenig      −4＋ ×│
│ 🧴 Öl         1 L     3 im Haus  −1＋ ×│
│ … 39 more                              │
└────────────────────────────────────────┘
        ▔▔▔ dock ▔▔▔      first row at y≈300

PHONE — Plan B, shopping mode  (existing .store-page, tightened)
┌────────────────────────────────────────┐
│ ← EINKAUFSMODUS  Kalyvia   18/42  43% │ dark
│ ████████████░░░░░░░░░░░░░░░░░░░  [•••]│
│ 🔍 Suchen / hinzufügen…                │
│ 24 offen · ✓ gekauft ∅ nicht da € teuer│ ← legend back
├────────────────────────────────────────┤
│ OBST & GEMÜSE                       6 │ sticky
│ ☐ 🥕 Karotten  2 kg      [∅][€]       │ 72px, 2-col
│ ☑ 🍎 Äpfel     1 kg      [∅][€]       │
│ MILCHPRODUKTE                       9 │
│ ☐ 🥛 Milch     1,5 L  von Julian [∅][€]│
├────────────────────────────────────────┤
│ 18/42 · Einkauf   [Kassenzettel][Abschl│ ← never disabled
└────────────────────────────────────────┘

PC — differs structurally: two columns
┌───────┬────────────────────────────────┬──────────────┐
│ nav   │ Kalyvia ‹ Fr 11. Sep › [Liste│Supermarkt]│  │
│ rail  ├────────────────────────────────┼──────────────┤
│       │ AUF DER LISTE · 42             │ ANFRAGEN  2  │
│       │ 🥛 Milch  1,5L 0 im Haus −2＋ ×│ Nutella/Juli │
│       │ 🍞 Brot   4St  wenig    −4＋ ×│ Chips/Lea    │
│       │ …                              ├──────────────┤
│       │                                │ FEHLMENGEN 3 │
│ Zo-Ai │                                │ LETZTE FAHRT │
└───────┴────────────────────────────────┴──────────────┘
```
The PC change is one grid declaration: relax `desk.css:1061`'s
`grid-template-columns: minmax(0,1fr)` to `minmax(0,1fr) 320px` and re-target the
`> .req-card` / `> .shop-history` rules at `1074–1081` into column 2. Requests,
Fehlmengen and history become permanently visible instead of collapsed — which is
what a 1216px column is for.

---

### Plan C — Rethink

**Idea:** the Friday list is not a page, it is a *state of the pantry*. Merge Liste
into Lager and let the standalone page be the **trip**.

The premise worth questioning: Liste and Lager are the same object at two moments.
`autoFillShoppingFromStock()` (`12790`) already derives the list from stock;
`listEntryStockChipHtml` (`11197`) already renders stock onto the list. Every row
means "this product, in this house, needs topping up".

- **Lager** gains a per-house *Soll* (target) alongside on-hand. The deficit *is* the
  list; adding to the list becomes bumping a target — an operation staff already
  understand from counting stock.
- **The dock's `Liste` becomes `Einkauf`**: one destination that is only the trip —
  pre-trip (review the derived list, add extras, hand it over), in-trip (today's
  `.store-page`), post-trip (receipt + put-away, which already exists as the
  `bought` status whose label is literally `secBought:'Gekauft & eingeräumt'`).
- **Requests leave the shop** and join one global inbox alongside the existing
  feedback system (`docs/agents/FEEDBACK_SYSTEM.md`) — a kid asking for Nutella and a
  kid reporting a broken chair are the same interaction.

**What would have to be true:**
1. Products carry per-house *target* levels. Today there is only
   `lowThreshold(product)` (`11187`) — no target, no schema for one.
2. Most list items originate from stock rather than from someone's head. If the list
   is mostly ad-hoc ("Julian wants Nutella", "candles for the terrace"), it is not a
   stock derivative and this plan is simply wrong.
3. A trip serves one house. `shoppingHouses()` is `() => DB.houses||[]` (`3728`) and
   everything in `viewShop()` is scoped by `shopHouse()` — but a real Friday drive to
   Limenaria probably fills one cart for several houses. If so, the house axis is
   wrong for the trip and C has to solve multi-house carts before it solves anything
   else.

**Cost:** large. Touches `viewStock`, `viewShop`, the dock and its four shells, the
`DB` schema, the tour, and Zo-Ai's `paidia-action` vocabulary
(`docs/zoai/KNOWLEDGE_MAP.md`). Weeks, and it makes Lager the app's heaviest page.
**Gain if the premises hold:** the list stops being a second inventory to maintain by
hand, and "what do we need?" gets one answer instead of two that drift.

---

## 4. Recommendation

**Plan B.** The page's defects are structural, not metric: a view picker that mixes a
display option with a mode with an inbox, a shopping mode that already exists and is
good but unreachable and un-exitable, and a removal flow whose ceremony blocks the
one session with a deadline. None of that is reachable from CSS, and none of it needs
Plan C's schema work. Plan A's items 1–7 are worth keeping — fold them into B as its
CSS layer.

**Ship first, today:** *retire the `take` panel and rebind that segment to
`Im Supermarkt`.*

- Delete `takeListCard` (`14272–14292`) and its `state.shopPanel==='take'` branches
  (`14245`, `14272`).
- Relabel that segment with the existing `t('storeMode')` and, in the
  `[data-shop-panel]` handler (`24327`), route `'store'` to `startFridayBatch()` when
  `pending.length === 0`, else `resumeFridayStore()` (`14544`).
- Render it enabled whenever `open.length || pending.length`.

One label, one branch, one deletion — a **net-negative diff** — and it converts the
page's dead-end read-only panel into the door to the mode the page exists to serve.
If there is room in the same pass, add Plan A items 1–3 (the hero collapse), which
buy ~220px above the fold for CSS only and no behaviour change.

---

## 5. Open questions for the owner

1. **Does one trip serve one house or several?** Everything is scoped by
   `shopHouse()`, but one Friday drive plausibly fills one cart for all four. If it is
   several, store mode needs a house tag per row and the house rail is the wrong axis
   for the trip — this changes Plan B's store screen materially.
2. **What are the four "houses" actually?** `shoppingHouses()` returns `DB.houses`,
   but the fixture reads *Kalyvia, Limenaria, Julian groß, Valeria+Lea* — two place
   names and two person names — and the chips use `ui('u-person')`, not a home icon.
   If this rail mixes houses with kid-rooms, it needs two levels, not one row.
3. **Realistic volume:** 40–60 items per house per Friday, or 40–60 total? Category
   grouping is enough at 40; past ~80 the store needs aisle *ordering*, which needs a
   per-store aisle sequence nobody has entered.
4. **Who shops — the person who planned, or a driver?** If a driver, "Mitnehmen" was
   answering a real need (a hand-off artefact) and should come back as a share/print
   action, not a tab. Plan B assumes planner = shopper.
5. **Is the removal reason required for a reason?** It currently reaches only the
   Admin audit search. If a policy requires a reason on every removal, immediate-
   remove-with-undo needs a nightly "reason missing" prompt instead of a blocking
   dialog. If not, drop the requirement.
6. **Is `#confirmBatch`'s completeness gate a policy or an accident?** If policy,
   Plan B's bulk "Rest nicht gekauft" at the till is the right shape; if accident,
   just remove the gate.
7. **Request volume and origin** — mostly kids, or mostly staff? A handful per week
   belongs inline in the list (Plan B item 4); dozens per week needs the inbox it has
   today, and the five-way filter earns its place.
8. **Does anyone shop in Easy mode?** `.store-choice-actions` is
   `pro-only mode-pro-block`, so an Easy user can mark bought/undo but can never mark
   "not available" or "too expensive". Intended, or an oversight?
