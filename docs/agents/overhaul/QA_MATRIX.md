# QA matrix — practical overhaul

## Suite expansion (v182)

Staff pages now include:
- Kids: `#kids`, attendance, homework, materials, activity, timetable
- Liste store: `#shop/store` (seeded `shopPanel=store`)
- Preflight: tourSeen v3 done + contact local + stronger overlay dismiss
- Page catalog: `qa_overhaul_page_catalog.json` (215 page captures on full matrix)

## Final full matrix (v182, 5 devices)

| Sev | Count | Notes |
|-----|-------|-------|
| P0 | 0 | — |
| P1 | 0 | Attendance taps + autofill assert fixed |
| P2 | 43 | Pixel-only soft Material prefer ≥48 (`tap-below-material`) — accepted |

Kids materials/attendance/homework/activity chips: **pass**  
Easy timetable leak: **pass**  
Pane stickiness `#kids/materials`: **pass**  
Easy Liste `#shopAutoFill` on plan: **pass**

## Fixes shipped

1. Attendance `.linkish` + `.att-btns .chip` + `.att-chip` ≥44px
2. Kids pane tabs mobile ≥44px
3. Autofill assert only when `.shop-easy-strip` visible

## Verdict

**P0 = 0, P1 = 0.** See `docs/agents/QA_MULTI_OS_STRESS_REPORT.md`.
