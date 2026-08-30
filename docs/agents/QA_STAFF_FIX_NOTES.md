# Staff UI fix notes (v145)

Implements P0 + selected P1 from [`QA_REPORT_STAFF_UI.md`](QA_REPORT_STAFF_UI.md).  
Kids v142/v144 and Zo-Ai title v143 left untouched. Lager pantry / Easy·Pro wiring / Αιτήματα not rewritten.

## Staff chrome contract (P0.1)

Authoritative paint: **`ui-v110.css`** (linked last). Product call for mobile dock: **flat white work-tool** (v109), not inverted glass.

| Surface | &lt;900 mobile | ≥900 desktop staff |
|---------|---------------|--------------------|
| Header | Light frosted / solid white | Light frosted |
| Dock | Flat white + underline active | Dark inverted left rail |
| Tabs | Home · Plan · Lager · Liste · Kids · Mehr | Labeled rail + `#dockZoAi` |
| Tablet 768–899 | Phone chrome until 900 (documented debt P1.7) | — |

Do not add new `!important` on `header.app-chrome` / `nav.dock` without deleting the superseded rule.

## Checklist

### P0

- [x] **P0.1** Chrome cascade — contract documented here + header of `ui-v110.css`
- [x] **P0.2** Easy/Pro header contrast — inactive `var(--muted)`, active pine wash + ink
- [x] **P0.3** Mobile Home hero — stone/ink mast; gold rings / `#1b382e` band removed (Plan mobile hero lightened same pass)

### P1 (this ship)

- [x] **P1.1** Talk / Liste `.talk-overview` / `.shop-overview` → light ops/pantry language
- [x] **P1.2** Gate mail / PIN reset → light stone card, white inputs
- [x] **P1.3** `.topbtn.danger` / `.ok` → white text on fill
- [x] **P1.4** Mobile header tools ≥44×44
- [x] **P1.5** Plan day-chip — settle easing, no bounce/scale&gt;1.02
- [ ] **P1.6** Broad `#fff` → glass migration (incremental; not bulk this PR)
- [x] **P1.7** Documented: phone chrome until 900 (no rail promotion this PR)

### Left healthy (untouched)

- Lager pantry tide/jars, Easy/Pro body class wiring, Liste Αιτήματα, kids dock v142/v144, Zo-Ai title v143

## Smoke

Widths 390 / 768 / 1280 · Easy + Pro · DE/EL: Home mast, Plan day, Liste/Talk heroes, header Easy/Pro, forgot-PIN, desktop rail.
