# Handoff — Staff screens (Figma rebuild, mechanics preserved)

Continues [CURSOR_HANDOFF.md](CURSOR_HANDOFF.md) and [CURSOR_HANDOFF_SPIELE_WIDGETS.md](CURSOR_HANDOFF_SPIELE_WIDGETS.md).
Read Guardrails in those docs before editing `app.js` / `index.html`.

Current shipped build: **v105**. Stack unchanged: vanilla `app.js` + `index.html` CSS.

v101 Liquid Glass remains; **v105** adds staff Kids/school (profiles, subjects,
attendance, homework, timetable), Home/Plan/Lager widgets + texture/motion,
tutorial glass polish, and Zo-Ai school actions (Confirm required).

---

## 0. What shipped in v100

| Surface | Renderer | Change |
|---|---|---|
| Home | `viewHome` ~11570 | Figma mast (brand kicker + Fraunces greeting + lede), CTA row, `.home-signal` tiles (`data-home-jump`), glass shift card, tasks card, admin/events/unassigned under `<details class="home-more">` |
| Shift start | `homeShiftStartCardHtml` ~4609 | Glass-1 + semantic edge (design-system CSS); `ui('u-check')` marks; handlers `#homeShiftPresence` / `#homeShiftPresenceStep` / `#homeShiftStock` / `#homeShiftJournal` unchanged |
| Plan | `viewSchedule` / `viewScheduleDay` | Planner seg icons → `ui(...)`; day hero + `miniCalendarHtml` of last-7 active days |
| Lager | `viewStock` | `.stock-shell` + `.ops-hero` with `statTileHtml`; command bar / in-out / drafts / shift-check unchanged |
| Liste | `viewShop` | `.shop-shell` + hero stats; tools → stroke icons; take/store/OCR/bulk pine bar preserved |
| Galerie / Talk / Übergabe | `viewGallery` / `viewTalk` / `viewBook` | Light heroes (design-system), glass panels; book title `.tide-line` |
| Zo-Ai | FAB + `.chat-panel.chat-float` | Visual polish only; `paidia-action` confirm + PIN untouched |
| Chrome | dock / page-actions | Dock remains only inverted `--chrome`; page-actions glass strip |

**Not deleted:** anything Figma omits stays under Home “Mehr”, adaptive chrome, or existing sheets.

---

## 1. Anchors (do not paste whole files)

| Concern | Where |
|---|---|
| Home | `app.js` `viewHome`, `homeShiftStartCardHtml` |
| Home bind | `data-home-jump`, `#homeShift*`, `#homeQuickBook`, `#homeWriteBook` |
| Plan | `viewSchedule`, `viewScheduleDay` (~5027), `plan-hero` CSS |
| Stock / Shop | `viewStock` (~5903), `viewShop` (~7142) |
| Gallery / Talk / Book | ~3830 / ~4155 / ~8322 |
| Widgets | `statTileHtml`, `miniCalendarHtml`, `sparklineHtml`, `ringHtml` |
| Tokens / staff CSS | `index.html` block after `ARMONIA DESIGN SYSTEM v2` — Home v2 + ops-hero rules |
| i18n | `stockHeroHint`, `shopHeroHint` (+ existing `homeOverview`, `homeMore`, …) |

---

## 2. Cache bump checklist (next ship)

1. `build.json` — version / label / changed.de+el  
2. `gate.js` `APP_BUILD`  
3. `app.js` `APP_BUILD` + SW register fallback  
4. `sw.js` `CACHE = 'paidia-vN'`  
5. `index.html` `?v=` on gate/notifications  
6. `CHANGELOG.md`

Push production via `git push upstream HEAD:main` as **`ANGUELdad`** — see [DEPLOY_WIRING.md](DEPLOY_WIRING.md).

---

## 3. Verify locally

```bash
node --check app.js gate.js sw.js
python3 server.py   # http://localhost:5173
```

Staff PIN → Home: shift-start CTAs, signal jumps (day/shop/stock), “Mehr” admin if admin.  
Plan day: hero + minical + add entry. Lager in/out draft save. Liste Friday flow. DE + EL. Widths 390 / 768 / 1280.

---

## 4. Still open (optional follow-ups)

- Broader staff chrome emoji → `ui(...)` (headers, empty states beyond Plan/Liste tools)
- Real Thassos photography for heroes (placeholders remain)
- Figma Screens MCP access was flaky; if Screens nodes become visible, diff against Cover + this handoff
- Plan week/calendar/shift matrix: shell only lightly touched — day view was the Figma-first target

---

## 5. Guardrails (repeat)

- No `font` shorthand; check specificity before “CSS didn’t apply”
- Tokens only — no new hex in staff screens
- Never auto-apply Zo-Ai `paidia-action` without Confirm (+ PIN for schedule)
- Prefer small diffs; do not invent a parallel “v2” module
