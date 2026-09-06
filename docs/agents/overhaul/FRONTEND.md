# Frontend notes — overhaul

## Routing

- Staff tabs: `home | gallery | schedule | stock | shop | book | talk | kids`
- Kids hashes (v181+): `#kids`, `#kids/attendance|homework|materials|activity|timetable|subjects`
- `hashForState` / `routeFromHash` / `applyRouteFromHash` in `app.js` — kids must not sync to empty hash (broke deep links + suite)

## Easy gates (`normalizeUiModeSurfaces`)

- Easy kids allow-list: `directory | attendance | homework | materials | activity`
- Pro-only: `timetable`, `subjects` (also `.pro-only` / `mode-pro-block` on chips)
- **v181 bug:** Easy reset all kids panes → directory; fixed allow-list

## Liste ↔ Lager

- Easy strip: `#shopAutoFill`, start Friday, photo CTA
- Stock chips: `.shop-stock-chip`
- Confirm books stock only via `confirmFridayBatch`
- Assert `#shopAutoFill` only on `#shop/plan` (store/requests do not show it)

## Tour / contact interference

- `tourPlaceStep` sets `state.tab` from step.place and `render()` — overrides dock
- QA must set `paidia.tourSeen:{id}:{mode}:3` done
- Contact: `paidia-contact:` local or sheet blocks taps

## School UI anchors

- `viewKids` / `viewAttendanceGrid` / `viewSchoolMaterials` / `viewSchoolActivityPane`
- Pane chips: `[data-kids-pane]`
- Attendance: `.att-grid-row`, `.att-btns .chip`, `[data-att-status]`
