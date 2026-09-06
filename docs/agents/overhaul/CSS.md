# CSS notes — overhaul

## Sources

- Design tokens / layout: `index.html` `<style>` (incl. school/attendance)
- Glass / chrome: `ui-v110.css`
- Authority: `design/VISUAL_MOTION_SYSTEM.md`

## Scroll contract (v188+)

**Primary scroll owner:** the document (`#app` grows; window scrolls).

**Bottom clearance:** one token `--chrome-bottom` set by `measureChrome()` in `app.js`.
Applied only on `#app.app-shell` (`padding-bottom: calc(var(--chrome-bottom) + var(--chat-h) + 24px)`).
Do **not** add competing `#view` / `main.app-stage` bottom paddings for dock clearance.

| Token | Meaning |
|-------|---------|
| `--nav-total` | Measured bottom dock / kid-dock height only (FAB/tip `bottom:` calc) |
| `--dock-h` | Secondary stock/store finish dock |
| `--fab-clear` | Zo FAB clearance when visible |
| `--chrome-bottom` | `nav + dock + fab` once — shell padding |

**Nested scroll exceptions only:**

| Pane | Selector |
|------|----------|
| Plan matrix | `.matrix` |
| Supermarket | `.store-page` + `.store-scroll` |
| Sheets | `#sheet` body; `body.sheet-open { overflow:hidden }` |
| Talk log | `.talk-chat-fast` / chat log inside flex shell |
| Lager board sheet | `.stock-board-scroll` |

## Tap targets

| Surface | Rule | Fix (v182) |
|---------|------|------------|
| Attendance name `.linkish` | ≥44 mobile / ≥36 desktop | `min-height:44px; padding:10px 12px` |
| Attendance status `.att-btns .chip` | same | `min-height:44px` |
| Profile week `.att-chip` | same | padded to 44 |
| Kids pane tabs mobile | was 40px | `min-height:44px` |

## Easy / Pro

- `.pro-only` / `body.mode-easy` hide Pro chrome
- Kids timetable/subjects use `pro-only mode-pro-block`
- Liste Easy strip: `.shop-easy-strip` (must stay visible in Easy)

## Apple HIG (v183+)

- Skill + map: `docs/agents/APPLE_HIG_PAIDIA.md`
- Global `:focus-visible` on primary controls; stronger `prefers-reduced-motion`
- Do not confuse HIG with “make it look like iOS” — Armonia brand wins

## Desktop rail

Canonical sticky rail: `body.layout-desktop .bottom-panel` in `index.html` (~3251+) and PC block (~5259+). Prefer `--rail-w` from `measureChrome` (220 staff / 200 child). Avoid adding a third copy of rail layout in `ui-v110.css`.
