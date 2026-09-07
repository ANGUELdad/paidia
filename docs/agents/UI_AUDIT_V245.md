# UI audit v245 — real iPhone login pass

v244 fixed *measurable* correctness (contrast, 44pt tap floors, clipped labels) but
was audited by logging in through the API and jumping straight to each tab. v245
came from driving the **actual gate** on an iPhone viewport — mode card → profile →
pinpad → app → dock walk — which surfaced a different class of problem: too much
chrome before any content, and four pinned layers competing for the bottom of the
screen.

## Tooling

| Script | What it does |
|---|---|
| `scripts/qa-iphone-login-flow.mjs` | Real gate login at 393×852, screenshots the whole journey for staff + kid, records every native dialog and console error. `--role=staff\|child\|both` |
| `scripts/qa-ui-audit-2026.mjs` | Measured dual-surface audit (PC 1440×900 + iPhone 393×852), 40 pages |
| `scripts/qa-unsaved-guard.mjs` | Regression test for the unsaved-changes guard (exits non-zero on failure) |
| `scripts/qa-arcade-probe.mjs`, `scripts/qa-kid-dock-probe.mjs` | Ad-hoc layout probes used to isolate two of the fixes |

## Result

| | v243 | v244 | v245 |
|---|---|---|---|
| P0 | 60 | 0 | 0 |
| P1 | 132 | 16 | 3 |
| P2 | 196 | 1 | 1 |
| Phone findings | many | some | **0** |

The four remaining are PC-only and sub-pixel-scale: three labels overflowing their
box by 3–26px and one 11.4px caption.

## What the login flow found

### Bottom chrome stack (kid, first login)

The PWA install bar positioned itself off `--nav-h`, the *staff* dock token, while
kid mode sizes its dock from `--kid-dock-h`. It therefore rendered 4px underneath
the dock, and the Zo-Ai FAB (`z-index:60` vs the bar's `35`) sat on top of the
bar's "Später" button — two dismiss affordances inside one 48px square.

The FAB was the deeper problem. It is `position:fixed` bottom-right and the kid
calendars are full-bleed 7-column grids, so the Sunday column sat under it at
*every* scroll offset. There is no CSS fix for that. Zo-Ai moved into the Mehr
sheet (`kidMoreExtraItems`), where the kid dock already deliberately suppresses
`.dock-zoai`, and the FAB is hidden on phones.

Desktop had the same bug for a different reason: the sidebar already carries a
171×44 Zo-Ai row, so the floating button was a duplicate entry point that covered
the Buch calendar's last date cells. Hidden there too.

### Chrome before content

- The green "Willkommen in deiner App" banner rendered on **all five** kid tabs.
  It is dismiss-once (`paidia.kidGuideSeen`), but until tapped it cost ~120px on
  every view while only earning that space on Start. Now scoped to Start.
- Its copy said *"Öffne Menü oben"* — the header nav it referred to is
  `display:none` on phones (`index.html:3923`). Rewritten to point at the dock.
- `.kid-back-bar` spent a full row offering a back affordance to peer tabs the
  dock already exposes. Now limited to the Mehr-only views.
- `.kid-hero-compact` was never compact: `body.mode-child #view .kid-hero` in
  ui-v110 carries an id and re-applied 24px padding and a 28–40px display face.
- Empty month calendars (`kidXpCalHtml`, `kidNotesCalHtml`) rendered 345px of 30
  blank cells above the real content for any new child. `paidiaCalHtml` stamps
  `.has` on marked cells, so `:not(:has(.cal-cell.has))` collapses them.

Net effect on Spiele: the first game moved from y≈791 (below the fold, behind the
dock) to y≈250.

Collapsing the calendar then exposed a void — Easy mode hides
`.arcade-grid.pro-only`, so the featured rail was the whole page, and as a
72%-wide horizontal snap scroller it put four of five games off-screen. Stacked
into a single column it fills the page as a readable game list.

### Staff Plan

Two nav rows then five equally-weighted full-width CTAs, three of them filled
Armonia green, with zero week data above the fold. The Lagercheck prompt was
rendering on Home, Plan *and* Lager — by the third tab it reads as decoration.
Dropped from `viewSchedule`; `.week-ai-clear:disabled` hidden (disabled only ever
means "nothing to undo"); the photo CTA demoted so `+ Eintrag` is the single
primary. `Wochenprogramm` now sits above the fold.

`Diese Woche` carried both `disabled` and `.on`, and `.week-today-btn.on` paints
`opacity:.55` — the only "you are here" marker in the week switcher rendered as a
dead grey button.

### Other

- Staff dock icons were the last user of the 512-viewBox filled sprite pack;
  everything else in the app uses the 24-viewBox 1.7px-stroke `u-*` set. Swapped
  in all four shells.
- `t('unassigned')` = "wer?" reads fine inline ("Kalyvia: Nachmittag — wer?") but
  is nonsense as a KPI caption. New `unassignedStat` key for the two stat rows.
- Liste rendered two identical "Foto → Liste" buttons 24px apart.
- Active chips in horizontal rails could sit scrolled out of view;
  `revealActiveRailChips()` runs after every render.
- Home's tasks card nested three paddings written for a padding-less shell, so
  its ink sat 42–50px from the edge against a 22px column.

## "Changes not saved" — spammy and wrong

`unsavedChangeParts()` had three false-positive sources:

1. **`state.pocketCompose`** was set by `openPocketCompose()` the moment the form
   opened. Merely *looking* at the Taschengeld form and leaving triggered a native
   `window.confirm`. Now `pocketComposeDirty()` reads `#pocketAmt` / `#pocketNote`
   and only counts typed input.
2. **`state.listPendingRemove`** was read raw. `listPendingDockHtml()` prunes ids
   whose entry is no longer `open`, but only when the shop view re-renders — so
   stale ids stayed "unsaved" from any other tab. Pruning moved into
   `listPendingRemoveLive()`, which the guard and the `PaidiaDirty` mirror share.
3. **`stockDraftEntries()`** filtered on JS truthiness, so float noise from
   repeated ±steps counted. Now thresholded at `>= 0.0001`.

Dead `pending.pid` / `pending.bulkOut` branches removed — nothing has written them
since the bulk-out UI was retired.

`scripts/qa-unsaved-guard.mjs` locks the behaviour in: empty form → no dialog,
typed amount → dialog, stale ids → pruned and clean.

## Files

- `ui-v245.css` — new last-loading layer, wired after `ui-v244.css` in all four
  shells and allowlisted in `server.py` + `api/index.py`
- `app.js` — kid first-run/back-bar/Mehr wiring, staff banner + button de-dupe,
  `unassignedStat`, `revealActiveRailChips`, the unsaved-guard rewrite
- `index.html`, `mobile/index.html`, `desk/index.html`, `school/index.html` —
  dock icon swap, v245 link, `?v=245`
