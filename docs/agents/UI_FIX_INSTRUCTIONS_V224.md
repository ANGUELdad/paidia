# UI / CSS / frontend fix instructions — live v224 audit

> **Status (2026-09-07):** Implemented as **v225**. Screenshots: `.qa-screens/v225-verify/`. Hard-refresh local `/m/` or `/desk/` to verify; commit/push when ready.

**Audience:** fix agents (Cursor / Claude Code)  
**Live site:** https://armonia-thassos.vercel.app (`build.json` = **v224** until v225 deploys)  
**Artifacts:** `.qa-screens/live-v224-audit/` (screenshots + `report.json`)  
**Method:** Playwright iPhone 14 + desktop 1440×900. Live gate captured on production. Authenticated staff pages audited on local `http://127.0.0.1:5173` after confirming **byte-identical** CSS/build assets vs live (`ui-v110.css`, `ui-v213.css`, `desk/desk.css`, `mobile/mobile.css`, `shared/workspace.css`, `build.json`).  
**Why not full live login:** production staff PINs ≠ disposable `docs/marketing/.local-auth/pins.json` (all `e1`–`e8` → HTTP 401 on live).

---

## Executive summary (fix order)


| Pri | Theme | Worst pages | User impact |
|-----|--------|-------------|-------------|
| **P0** | Horizontal scroll strips clip / overflow viewport | Pocket kid cards, Kids tabs, Stock/Shop house chips | Content cut off; looks “broken” |
| **P0** | Overlapping / floating compose over tabs | Talk (iPhone) | Send bar covers Nachrichten/Besprechung; input text clipped |
| **P0** | Duplicate / bad copy | PWA install sheet | Same iPhone install sentence twice |
| **P0** | Letter-stack / tiny day chips | Plan Tag strip | Day chips ~30×62, text reads stacked |
| **P1** | Giant single-line buttons (~150–210px tall) | Kids `+ Kind hinzufügen`, Stock `Hinzufügen`, Home CTAs, Talk tabs, Shop autofill | Wasted space; content pushed below fold |
| **P1** | Misaligned label/value rows | Pocket balance card | Labels not vertically centered with large € amounts |
| **P1** | Bad icons / placeholders | Pocket month nav | Apostrophe `‘` `’` instead of chevrons |
| **P1** | Desk Home hero imbalance | `/desk/` Home | `Tag planen` vs tall `Buch & Schicht`; floaty metric tiles |
| **P2** | Crowded chrome / dock | All phone pages | Header actions cramped; 6-item dock tiny labels |
| **P2** | Gate redundancy + footer truncate | Live gate | Brand/slogan repeated; v224 note ellipsized |

Automated detector counts (staff pages, PWA sheet dismissed): **111** flags · **19 P0** · kinds: `oversized-control` 64, `bad-button-sizing` 26, `element-overflow-x` 17, `letter-stack` 2, `tiny-tap` 2.

---

## How to re-run the audit

```bash
# Local must serve same build as live (already true for v224)
curl -s https://armonia-thassos.vercel.app/build.json
python3 docs/marketing/.local-auth/run_server.py   # :5173

# Screenshots live in:
#   .qa-screens/live-v224-audit/iphone14-*.png
#   .qa-screens/live-v224-audit/desk1440-*.png
#   .qa-screens/live-v224-audit/live-*-gate.png
# Metrics:
#   .qa-screens/live-v224-audit/report.json
```

When re-capturing, dismiss PWA with localStorage key **`paidia.pwaInstallDismiss`** (not `…Dismissed`), and call `closeSheet()` / remove `#pwaInstallBar`.

Ship checklist after CSS/JS fixes: bump `build.json` + `gate.js` `APP_BUILD` + `sw.js` `paidia-vN` + `?v=` in `index.html` → `python3 scripts/build-shell-sites.py`.

---

## P0 — Fix now

### 1. Horizontal strips that overflow (Pocket / Kids / Stock / Shop)

**Evidence:** `iphone14-pocket.png`, `iphone14-kids.png`, `iphone14-stock.png`, `iphone14-shop.png`  
**Detector:** `.pocket-kid-card`, Kids `.chip`, house chips with `right > viewport`.

**Cause:** Scroll rows lack edge padding / peek fade; children are measured as overflowing even when intentional scroll. Visually the **last visible card is hard-clipped** with no right inset, so it looks broken rather than “more to scroll”.

**Fix (CSS — prefer `mobile/mobile.css` then `ui-v110.css`):**

```css
/* Pattern for all horizontal chip/card rails on phone */
body.shell-m .pocket-kid-rail,
body.shell-m .kids-pane-chips,
body.shell-m .house-selector,
body.shell-m .stock-house-rail {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  padding-inline: 16px 24px;   /* right peek so last card isn’t flush-cut */
  margin-inline: -4px;         /* optional optical align with stage */
  scrollbar-width: none;
}
body.shell-m .pocket-kid-rail > *,
body.shell-m .kids-pane-chips > *,
body.shell-m .house-selector button {
  flex: 0 0 auto;
  scroll-snap-align: start;
  max-width: min(72vw, 220px);
  white-space: nowrap;
}
```

Also ensure parent stage uses `overflow-x: clip` on `#view` / `.stage` so **page** never gains horizontal scrollbar (`html` scrollWidth).

**Files:** `mobile/mobile.css`, `ui-v110.css` (`.house-selector`, `.pocket-kid-*`, kids chip row).  
**Do not** set `white-space: normal` on house chips (that previously blew height to ~168px).

---

### 2. Talk: compose bar overlaps tabs + clipped placeholder

**Evidence:** `iphone14-talk.png`  
**Symptom:** White compose (input + mic + Senden) floats over **Nachrichten / Besprechung**; placeholder “Nachricht an das Team” vertically clipped.

**Fix:**

1. In Talk mobile layout (`ui-v110.css` ~`body[data-tab="talk"]` / `.talk-page` / `.talk-compose` / `.talk-mobile-switch`):
   - Put compose **in document flow** above the dock, or `position: sticky; bottom: calc(dock + safe-area)`.
   - Give `.talk-chat-shell` / message list `padding-bottom` ≥ compose height + 12px.
   - Tabs (`.talk-mobile-switch`) must sit **above** compose, never underneath.
2. Input: `min-height: 44px; padding: 10px 12px; line-height: 1.25; overflow: visible;` — remove fixed height that clips glyphs.
3. Cap tab buttons: `min-height: 48px; max-height: 56px; align-items: center; justify-content: center;` (they currently report ~164px tall).

**Verify:** Nachrichten/Besprechung fully visible; no overlap with compose; Send still above dock.

---

### 3. Duplicate PWA install copy

**Evidence:** Install sheet showed `notifInstallSteps` **and** `childInstallIos` (second line is a shorter duplicate).

**Code:** `sheetInstallNotif()` in `app.js` (~24990):

```js
<p>${esc(t('notifInstallSteps'))}</p>
<p>${esc(t('childInstallIos'))}</p>  // DELETE on iOS path — redundant
```

**Fix:** Keep **one** paragraph (`notifInstallSteps` for staff notif install, or `childInstallIos` for kids). Prefer a single string; drop the second `<p>`.

**Also:** dismiss key is `paidia.pwaInstallDismiss` — keep consistent in QA scripts.

---

### 4. Plan day chips — letter-stack / tiny width

**Evidence:** `iphone14-schedule-day.png` · detector `letter-stack` on `.plan-day-chip` (~30×62).

**Fix (`mobile/mobile.css` / `ui-v110.css`):**

```css
body.shell-m #view .plan-day-chip {
  min-width: 44px;
  width: auto;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  white-space: nowrap;
  line-height: 1.1;
  font-size: 11px;
}
body.shell-m #view .plan-day-chip b,
body.shell-m #view .plan-day-chip span {
  display: block;
  text-align: center;
}
```

Ensure `ui-fit-text` does **not** shrink chip width below 44px or force character-by-character wrap.

---

## P1 — Layout / sizing / arrangement

### 5. Giant CTA blocks (Kids / Stock / Shop / Home / Talk)

**Evidence:** Kids `#kidAddBtn` ~176px tall; Stock `#stockQuickAdd` ~176px; Home `#homeQuickBook` / “Zum Plan” ~209px; Shop `#shopAutoFill` ~168px.

**Cause:** Flex/grid children stretching to row height (`align-items: stretch`) plus `ui-fit-text` / multi-line icon wrappers; sometimes a whole **bar** is one stretched button.

**Fix pattern:**

```css
.kids-admin-bar .btn,
.stock-primary-action,
#shopAutoFill,
.home-command-actions .btn,
.home-command-actions .home-secondary {
  min-height: 44px;
  max-height: 52px;
  height: auto;
  align-self: center;          /* don’t stretch in grid */
  padding: 10px 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
}
.kids-admin-bar {              /* bar can be full width; button should not fill bar height */
  display: flex;
  align-items: center;
  min-height: 0;
}
```

**JS:** `#kidAddBtn` is in `.kids-admin-bar` (`app.js` ~17123) — keep markup; fix CSS only unless the bar wraps an icon column incorrectly.

---

### 6. Kids overview: duplicated count in copy

**Evidence:** `iphone14-kids.png` — third metric reads like **“0 0 Hausaufgaben offen”**.

**Cause:** `app.js` renders both `<b>${openHomework}</b>` and `t('kidsOpenHomework')(openHomework)` where the string already includes `n`:

```js
kidsOpenHomework: n => `${n} Hausaufgaben offen`
// +
<div><b>${openHomework}</b><span>${esc(t('kidsOpenHomework')(openHomework))}</span></div>
```

**Fix (pick one):**

- A) Change i18n to label-only: `kidsOpenHomework: 'Hausaufgaben offen'` and keep `<b>n</b><span>label</span>`, **or**
- B) Drop `<b>` and only use the function string.

Same pattern likely on `kidsTracked` — audit that row.

---

### 7. Pocket balance card — label vs value alignment

**Evidence:** `iphone14-pocket.png` — “Dieser Monat / Einzahlungen / Auszahlungen” sit on the baseline of huge `0,00 €`.

**Fix:**

```css
.pocket-balance-rows > div,
.pocket-month-stats > div {
  display: flex;
  align-items: center;     /* vertical center */
  justify-content: space-between;
  gap: 12px;
  min-height: 36px;
}
.pocket-balance-rows .label { font-size: 13px; color: var(--muted); }
.pocket-balance-rows .value {
  font-size: 18px;         /* was oversized vs label */
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}
```

Month nav: replace apostrophe characters with real chevron SVGs / `ui('u-chev-left')` (same icons as elsewhere).

---

### 8. Stock stats grid asymmetry

**Evidence:** `iphone14-stock.png` — “62 / 5 / 6” not a clean 3-column grid (empty cell under categories).

**Fix:** Force 3 equal columns:

```css
.stock-summary-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.stock-summary-stats > * { text-align: center; min-width: 0; }
```

Legend under Vorratssicherheit: put % + bar on one row; dots legend as `display:flex; flex-wrap:wrap; gap:8px 12px` full width under the bar (no orphaned left % with empty center).

---

### 9. Desktop Home hero (`desk/desk.css`)

**Evidence:** `desk1440-home.png`

| Issue | Fix |
|--------|-----|
| Vertical white pill / icon cluster in hero center feels orphaned | Remove or turn into a single compact badge aligned to greeting |
| `Tag planen` height ≠ `Buch & Schicht` | Same `min-height: 48px; max-height: 52px; align-items: center` for both |
| Metric tiles (0 Heute / Überfällig / Liste / Lager) — content floats high | `display:flex; flex-direction:column; justify-content:center; align-items:center; gap:6px; min-height:88px` |
| Header right cluster (Einfach/Pro/bell/coin/DE/avatar) uneven gaps | `display:flex; align-items:center; gap:8px` single row; hide coin on desk if redundant with bell |

---

### 10. Desktop Admin section nav

**Evidence:** `desk1440-admin-ops.png` — 10 section links in one row; will wrap/crowd on ≤1280px.

**Fix:**

- Desktop: horizontal scroll **or** 2-row wrap with `max-width` chips, current page `aria-current` stronger.
- Keep `<select id="adminSectionSelect">` as the phone primary (already in markup); on desk hide picker, on phone hide long nav (`workspace.css` already has picker styles — tighten).

```css
@media (max-width: 1100px) {
  .admin-section-nav { display: none; }
  .admin-section-picker { display: flex; }
}
@media (min-width: 1101px) {
  .admin-section-picker { display: none; }
  .admin-section-nav { display: flex; flex-wrap: wrap; gap: 6px; }
}
```

---

## P2 — Polish

### 11. Phone chrome + dock

- Header actions: `gap: 8px`, equal 40×40 hit targets; vertically center title with icons (`align-items: center` on `.chrome`).
- Dock: keep 6 items but enforce `font-size: 10px; min-width: 0; max-width: 64px; text-align: center;` and `padding-bottom: env(safe-area-inset-bottom)`.
- Active underline: only **one** dock item (Kids vs Mehr double-underline was reported — verify `.dock-item.on` exclusivity in JS).

### 12. Live gate (`live-iphone14-gate.png`)

- Drop repeated slogan either from green topbar **or** from hero kicker (keep one).
- Language toggle: move into topbar right, not floating alone under header.
- Footer `.gate-build`: allow 2-line wrap or shorten `changed.de` string so v224 note isn’t ellipsized mid-word.

### 13. Plan Tag date typography

Huge serif “Montag 7.9.2026” dominates the fold (`iphone14-schedule-day.png`). Cap: `font-size: clamp(22px, 6vw, 28px); line-height: 1.15;` keep serif if brand requires, but don’t exceed ~2 lines of viewport before “+ Eintrag”.

### 14. Empty grey bar under “Jetzt prüfen”

Looks like a dead progress track. Either bind real progress or remove the empty element from markup/CSS.

---

## Suggested implementation order

1. **Talk compose overlap** + input clip (P0, high user pain).  
2. **CTA max-height 52px** sitewide for primary bars (Kids/Stock/Shop/Home) — one CSS batch.  
3. **Horizontal rail padding** (Pocket/Kids/houses).  
4. **Kids homework double count** i18n.  
5. **PWA sheet duplicate string**.  
6. **Plan day chips** min 44px.  
7. **Pocket rows + chevrons**.  
8. **Desk Home hero** alignment.  
9. **Gate** redundancy.  
10. Bump **v225**, regenerate shells, screenshot-diff the same OUT folder.

---

## File map (edit these, not whole `app.js`)

| Area | Files |
|------|--------|
| Phone layout / overflow / CTAs | `mobile/mobile.css`, `ui-v110.css` |
| Desk chrome / Home hero | `desk/desk.css` |
| Admin sections | `shared/workspace.css`, `app.js` (`ADMIN_SECTIONS` / `viewAdminOps` only if markup) |
| Copy / i18n / install sheet | `app.js` (search `sheetInstallNotif`, `kidsOpenHomework`) |
| Talk structure | `ui-v110.css` (`body[data-tab="talk"]`), Talk HTML builders in `app.js` (rg `talk-compose` / `talk-mobile-switch`) |
| Shell regen | `scripts/build-shell-sites.py` after `index.html` `?v=` bump |

Never paste full `app.js` / `server.py` into context — `rg` the symbols above and read ±80 lines.

---

## Done when

- [ ] No page-level `scrollWidth > innerWidth` on iPhone 14 staff routes  
- [ ] Talk: compose never covers tabs; placeholder fully visible  
- [ ] No primary button taller than ~56px on phone  
- [ ] Kids metric text has a single count  
- [ ] Install sheet has one install instruction  
- [ ] Pocket kid rail shows clear scroll peek; balance rows optically centered  
- [ ] Fresh screenshots in `.qa-screens/live-v224-audit/` (or `v225-audit/`) with PWA dismissed  
- [ ] Cache bumped and shells rebuilt  

---

## Screenshot index

| File | What to look for |
|------|------------------|
| `live-iphone14-gate.png` / `live-desk1440-gate.png` | Production gate v224 |
| `iphone14-home.png` | Chrome density, hero height |
| `iphone14-schedule-day.png` | Day chips, date size, empty bar |
| `iphone14-stock.png` / `shop.png` | House rail clip, tall CTAs |
| `iphone14-pocket.png` | Kid rail clip, € row alignment, month chevrons |
| `iphone14-kids.png` | Tab overflow, giant add, double “0” |
| `iphone14-talk.png` | Compose over tabs |
| `desk1440-home.png` | Hero CTA mismatch, metric tiles |
| `desk1440-admin-ops.png` | Section nav density |
| `report.json` | Machine metrics per route |
