# School + Supermarket (v180)

## Liste Easy ↔ Lager
- Easy strip: `#shopAutoFill` (fill from stock), `#startFridayTop`, photo CTA
- Live `.shop-stock-chip` on plan rows + store choices
- `markListRequestBought` joins Friday list (stock only via `confirmFridayBatch`)
- `syncListRequestsFromFridayEntries` + `sheetShopBookedSummary` after PIN confirm

## School
- Ops: `schoolMaterials`, `schoolMaterialMedia`, `schoolActivity` (SHARED_KEYS + server OPS)
- Staff panes: materials + activity; Easy gets attendance/HW/materials/activity
- Photos: `compressGalleryPhoto` → stored as `mediaPath` on media rows (not giant ops blobs beyond compress)
- Child Start snapshot: HW toggle, materials, today timetable, activity
- Zo-Ai: `material_set`, `material_status`, `homework_done`, `school_note` (scores 1–6)

## Re-test
```bash
python3 docs/marketing/.local-auth/run_server.py
# Easy Liste: fill → start → confirm → Lager
# Kids: Material + Foto; Anwesenheit; child HW checkbox
```

## v181 follow-up (agent QA)
- Easy `normalizeUiModeSurfaces` was forcing all kids panes → directory (broke Material/Anwesenheit/HW/Verlauf). Fixed allow-list.
- `hashForState` / `routeFromHash` now support `#kids` and `#kids/<pane>`.
- Verified locally: Easy `#shopAutoFill` visible; `#kids/materials` shows checklist add UI; timetable chip hidden in Easy.
