# UI audit v244 — PC + iPhone, from scratch

Both surfaces re-measured from scratch with a new instrumented auditor rather
than by eye. Everything below is a defect the auditor measured, the root cause
it traced to, and where the fix lives.

## How to reproduce

```bash
python3 scripts/run-local-qa.py                 # serves 127.0.0.1:5173
node scripts/qa-ui-audit-2026.mjs --tag=<name>  # both surfaces, ~30s
node scripts/qa-ui-audit-2026.mjs --surface=phone --tag=<name>
node scripts/qa-probe.mjs --surface=phone --tab=stock --sel='.a|.b'
```

Coverage: 10 staff tabs + the week planner + 9 kid views, on desktop
(1440x900) and iPhone 15 Pro (393x852). Output lands in
`.qa-screens/<tag>/` as a screenshot per view, plus `report.json` and
`NOTES.md`.

## What the auditor measures

| Check | Catches |
|---|---|
| `contrast` | WCAG 1.4.3 AA, resolving gradient backgrounds and translucent ink |
| `type-tiny` / `type-small` | rendered font size under 11px / 12px |
| `control-covered` | a control whose own centre hit-tests to something else |
| `fab-covers-control` | the floating Zo-Ai button overlapping a control |
| `overflow-x` / `page-overflow` | content escaping the viewport |
| `tap-small` / `tap-sub44` | pointer floor everywhere, 44pt touch floor on phone |
| `text-truncated` / `text-clip-y` | labels clipped by their own box |
| `grid-orphan` | a tile grid ending on one lone tile |
| `dock-clearance` | scroll container not reserving room for the fixed dock |
| `align-drift` / `narrow-fill` | stage children off the column, or not filling the phone |

Visibility is hit-test based (`elementFromPoint` plus `checkVisibility`), so
closed `<details>` popovers and other clipped-but-laid-out elements do not
produce phantom findings — an earlier pass reported 25 "overlaps" that were all
hidden popovers.

## Result

| | before | after |
|---|---|---|
| P0 | 60 | 0 |
| P1 | 132 | 16 |
| P2 | 196 | 1 |

## Defects found and fixed

### Invisible text (P0)

`#view .eyebrow` in `ui-v213.css` carries ID specificity and beat the
`body.mode-child .next-up .eyebrow` white override, painting the kid
"Als Nächstes" label sea-on-sea at **1.00:1** — invisible on all nine kid
views. The card's "Zu Spielen" chip measured 1.05:1 on the same gradient.

The desktop Home hero had the same class of bug from the other direction: an
ink-coloured `h1` ("Guten Tag") and a sea-coloured kicker on the dark green
gradient, at 1.57:1.

Fixed in `ui-v244.css` §3 by restoring light ink on both dark surfaces.

### Icon boxes laid out at 150px (P0, systemic)

The responsive-media reset `#view img, #view svg, #view video { height:auto }`
outranks every `.ui-ico` height rule, so icons laid out at the SVG default
height of 150px. Buttons clipped the box so the glyph still *looked* right, but
every icon button reported `scrollHeight ≈ 150` against a ~44px client height.
That is the input `fitButtonLabels()` uses, so it left buttons permanently in
`ui-fit-tight` and shrank their labels to 12px app-wide.

Fixed in `ui-v244.css` §1b with `aspect-ratio: 1/1` plus `height:auto`, which
derives the height from whichever width the per-context rule already set — no
width is overridden, so every existing icon size is preserved.

### Type scale collapse on desktop (P1, 191 findings)

Desktop drops the root to 14px, and the whole scale is in `rem`, so caption
rendered at 11.4px, eyebrow at 9.6px and micro at **8.75px**. The small end of
the scale is now pinned in px (`ui-v244.css` §1), and the nine hardcoded
10px/11px `!important` rules in `desk/desk.css` and `mobile/mobile.css` were
raised to 11-12px.

### Muted ink below AA (P1)

The muted token measured 4.13:1 on white and 3.75:1 on tinted card surfaces.
Darkened to `#5c6a63`, which clears 4.5:1 on every surface in the system. The
sun accent used as label text (2.74:1) was darkened to `#8a5a00` for that use
only; the token itself is unchanged for fills and icons.

### Controls that render but cannot be clicked (P0)

- Taschengeld's action bar was `position:sticky` inside its own card, floating
  over the source and preset chip rails that wrap above it.
- Liste's Planen / Mitnehmen / Anfragen control declares three buttons in a
  two-column grid, so "Anfragen" wrapped into an implicit row and spilled under
  the ••• trigger.

### Phone chrome

- The kid header kept five 44px actions behind a 46% width cap, squeezing the
  title to "S…" and the role line to "Sta…". Kids now hide the same two
  secondary actions staff already hides, and the three-line brand block is one
  line.
- The kid dock cut "Taschengeld" to "Taschen…" at six columns; labels now wrap
  on word boundaries (`hyphens:auto` was splitting "Bewertung" as "Bewer-tung").
- The Zo-Ai FAB sat dead-centre on the bottom-right kid shortcut tile, making
  it unclickable. Now 48px and tucked into the corner.

### Phone layout and arrangement

- Plan rendered an empty 22px card: `.adaptive-chrome-summary` is hidden inside
  the planner wrapper on phones, so the wrapper had no opener and no reachable
  panel — hidden outright.
- Home alternated card / loose text / card, which is what read as "not
  adjusted". The shift-start block and pulse row now use the same surface as
  the rest of the column.
- Segmented controls, house rails, pane tabs and section links sat at 38-42px;
  the 44pt floor is now applied broadly so new rails inherit it.
- The kid shortcut grid and the Lager stat row ended on a lone half-width tile;
  a trailing odd tile now spans the row.

## Knowingly accepted

- **`fab-covers-control` (13).** The floating Zo-Ai button clips the corner of a
  control on a scrolling surface. Every affected control still hit-tests to
  itself (`control-covered` is 0), and a FAB passing over scrolling content is
  the expected behaviour for the pattern.
- **`text-truncated` (3, desktop).** Long labels ellipsised in narrow columns:
  the Talk topic list, "— Team-Wochenschnitt", and a calendar amount chip.
- **`type-small` (1).** One 11.5px label; 11.5px is above the readability floor.
