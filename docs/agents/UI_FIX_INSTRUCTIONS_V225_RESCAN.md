# UI / CSS fix instructions — v225 rescan (iOS Simulator + PC)

**Date:** 2026-09-07  
**Live:** https://armonia-thassos.vercel.app (**v225**)  
**Method:**
- **iPhone:** Xcode **iOS Simulator** (iPhone 17 Pro, Booted) Safari screenshots + Playwright **WebKit** `iPhone 15 Pro`
- **PC:** Playwright Chromium 1440×900
- Authenticated staff pages: local `:5173` (CSS/build **byte-identical** to live). Live staff PINs ≠ disposable local pins.

**Artifacts:** `.qa-screens/v225-rescan/` (`report.json`, `ios-sim-*.png`, `webkit-iphone-live-*.png`, `iphone-webkit-*.png`, `desk-chromium-*.png`)

**Automated score (staff pages):** **P0 = 0** · **P1 = 148** (mostly “oversized” cards/rows the detector still flags; real visual bugs listed below).

---

## Critical ops notes (read first)

### 1. Wrong / dead Vercel alias
- `https://a-thassos.vercel.app` → **DEPLOYMENT_NOT_FOUND (404)**
- First iOS Sim pass opened this host → **blank white** `/m` + `/desk`, and a **stale gate showing V190** (old Service Worker cache).
- Safari’s compact URL bar may **truncate** `armonia-thassos.vercel.app` to look like `a-thassos…` — always verify full host.
- **Fix ops:** Document only `armonia-thassos.vercel.app`. Optionally add a Vercel redirect from `a-thassos` → canonical, or remove the dead project. Instruct staff: Safari → clear website data for old host if blank/v190 appears.

### 2. What v225 already fixed (confirmed this pass)
- No page-level X overflow (detector)
- Talk compose no longer `position:fixed` over tabs
- Kids overview no longer double-counts (`12 Kinder` / `0 Hausaufgaben offen`)
- Primary CTA heights mostly capped on phone
- Live gate shows **V225** on correct host

---

## Executive summary — remaining fix order

| Pri | Issue | Where | Evidence |
|-----|--------|--------|----------|
| **P0** | Talk channel action buttons render as **tall vertical slabs** (camera / Zo icons) | Talk iPhone | `iphone-webkit-talk.png` |
| **P0** | Stock command row: search **truncated**, Hinzufügen + `…` crush the field | Lager iPhone | `iphone-webkit-stock.png` |
| **P1** | Desk stock tools still ~166px tall empty buttons | Lager PC | report `#stockOpenBoard` etc. |
| **P1** | Week AI / empty-agenda blocks too tall | Plan Woche | `schedule-week` oversized |
| **P1** | Gate header: redundant clipped “Armonia” on the right; lang toggle floats | Gate iPhone/PC | `ios-sim-armonia-gate.png`, `webkit-iphone-live-gate.png` |
| **P1** | Home presence: duplicate “Ich bin da” label + button | Home iPhone | `iphone-webkit-home.png` |
| **P1** | Chrome: bell badge overlap; cramped DE/avatar gap | All phone | home/stock/talk shots |
| **P1** | Desk Home pulse tiles / orphan vertical pill in hero | Home PC | `desk-chromium-home.png` (behind late sheet) |
| **P2** | Changelog string shown in gate footer looks like a TODO | Gate | `UI-Audit: Overflow…` |
| **P2** | Dock “Mehr” = plus icon; six-item crowding | Phone dock | all staff shots |

---

## P0 — Fix now

### A. Talk: vertical camera / Zo action columns

**Symptom:** Next to “Nachrichten” channel title, two **tall thin white columns** with camera + sparkle icons break the card (looks like vertical UI).

**Cause:** `.talk-channel-actions .btn` forced to `width:40px` + `font-size:0` while parent grid/flex **stretches** button height to the chat shell. Combined with icon-only mode at `max-width:560px`.

**Files:** `mobile/mobile.css` (v225 Talk block), `ui-v110.css` (`.talk-channel-head`, `.talk-channel-actions`).

**Fix:**

```css
body.shell-m[data-tab="talk"] #view .talk-channel-head {
  display: grid !important;
  grid-template-columns: 36px minmax(0,1fr) auto !important;
  align-items: center !important;
  min-height: 52px !important;
  max-height: 64px !important;
}
body.shell-m[data-tab="talk"] #view .talk-channel-actions {
  display: inline-flex !important;
  flex-direction: row !important;
  align-items: center !important;
  align-self: center !important;
  gap: 6px !important;
  height: 44px !important;
  max-height: 44px !important;
}
body.shell-m[data-tab="talk"] #view .talk-channel-actions .btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 44px !important;
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  align-self: center !important;
  padding: 0 !important;
  flex: 0 0 44px !important;
}
```

**Also:** Do **not** apply the global “CTA max-height / flex-direction” batch selector to `#talkVideoOpen` / `#talkToZoAi` if it fights this grid.

**Done when:** Channel head is one ~52–64px row; icons are 44×44 squares; title “Nachrichten” fully readable beside them.

---

### B. Stock (iPhone): search row crushed

**Symptom:** Placeholder shows “Produkt such…”; search field tiny; `Hinzufügen` + `…` share one row and starve the input. Zone chips below also clip.

**Files:** `ui-v110.css` (`.stock-command-row` mobile rules ~4182 / ~5776), `mobile/mobile.css`.

**Fix pattern:**

```css
/* Phone Pro stock command: wrap to 2 rows */
body.shell-m #view .stock-command-row,
body.layout-mobile.mode-pro:not(.mode-child) .stock-command-row {
  display: grid !important;
  grid-template-columns: minmax(0,1fr) 44px !important; /* search + more */
  grid-template-rows: auto auto;
  gap: 8px !important;
}
body.shell-m #view .stock-command-row .stock-search {
  grid-column: 1 / 2;
  min-width: 0 !important;
}
body.shell-m #view .stock-command-row .stock-search input {
  width: 100% !important;
  min-width: 0 !important;
  height: 44px !important;
}
body.shell-m #view .stock-primary-action,
body.shell-m #view #stockQuickAdd {
  grid-column: 1 / -1; /* full-width second row */
  width: 100% !important;
  max-height: 48px !important;
}
```

**Done when:** Full placeholder “Produkt suchen…” visible; add button on its own row or equal flex without truncating search.

---

## P1 — Layout / sizing / copy

### C. Desk stock tools still ~166px tall

**Evidence:** `#stockOpenBoard`, `#stockSelectToggle`, `#stockShiftCheck`, `#stockQuickList` height 166–168 on desk.

**File:** `desk/desk.css` — extend the existing max-height rules to **all** `.stock-tool` / icon tools, not only `.stock-primary-action`:

```css
body.shell-desk #view .stock-command-row .stock-tool,
body.shell-desk #view .stock-command-row button {
  min-height: 44px !important;
  max-height: 48px !important;
  height: 44px !important;
  align-self: center !important;
  writing-mode: horizontal-tb !important;
}
```

Same for `#shopEasyFoto`, `#galShare`, `#talkToZoAi` on desk if still >56px.

---

### D. Plan Woche — AI / empty blocks

**Evidence:** `.week-ai-clear` h=128, `.schedule-agenda-empty` h=100–130.

**Fix:** Cap week AI button row:

```css
body.shell-m #view .week-ai-actions .btn,
body.shell-m #view .schedule-agenda-empty {
  min-height: 44px !important;
  max-height: 72px !important; /* empty state may be 2 lines */
  height: auto !important;
  align-items: center !important;
}
body.shell-m #view .schedule-agenda-empty {
  padding: 12px !important;
}
```

Exclude `.schedule-agenda-empty` from “oversized button” panic if it’s a multi-line empty state — but keep it compact.

---

### E. Gate (iPhone + PC)

**Evidence:** `ios-sim-armonia-gate.png`, `webkit-iphone-live-gate.png`, `chromium-desk-live-desk.png`

| Problem | Fix |
|--------|-----|
| Right-side landmark text “Armonia” clips / redundant | Hide `.gate-landmark-message strong` on narrow, or remove right label from mobile landmark; keep left brand only |
| Lang toggle floats alone under header | Move into header right or center under title with `justify-content:flex-end; margin:8px 0` |
| Large empty white band | Reduce gate-main top padding; pull cards up (`margin-top` on `.profiles`) |
| Footer shows raw changelog “UI-Audit: Overflow…” | Shorten `build.json` `changed.de/el` to user-facing copy (e.g. “Layout- und Sync-Fixes”) — not agent audit jargon |
| Safe-area | Ensure `.gate-landmark` / header uses `padding-top: env(safe-area-inset-top)` |

**Files:** `gate.js` (landmark HTML already simplified once — finish mobile CSS), `ui-v110.css` `.gate-*`, `build.json` changed strings on next bump.

---

### F. Home — presence copy redundancy

**Evidence:** `iphone-webkit-home.png` — row label “Ich bin da” + button “Ich bin da”.

**Fix (app.js):** Presence row should be label-only on the left (“Anwesenheit”) or icon-only button; don’t repeat the same string twice. Search `Ich bin da` / `shiftPresence` builders.

Also: greeting “Guten Tag,” / “Angelos” line-break — tighten `.home-command-copy h1` `line-height` / allow one line with `clamp` font size on phone.

---

### G. Phone chrome spacing

**Symptom:** Bell badge overlaps icon; DE + avatar cramped.

```css
body.shell-m .chrome-actions,
body.shell-m header.chrome .actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding-right: 2px;
}
body.shell-m .bell-count {
  transform: translate(30%, -30%); /* keep fully inside hit target */
}
```

---

### H. Desk Home hero

**Evidence:** Vertical orphan pill in hero; pulse tiles still tall (`home-pulse-item` h≈232 in detector).

**File:** `desk/desk.css` + `ui-v110.css` home-command rules.

- Remove or shrink center decorative pill.
- Pulse tiles: `min-height:88px; max-height:110px; justify-content:center`.
- Match primary/secondary CTA heights (already partly done — re-verify without presence sheet open).

---

## P2 — Polish

1. **Dock:** Consider `⋯` / grid icon for Mehr instead of `+`; ensure only one `.on` when Kids/Plan/Lager are primary (Talk/Pocket under Mehr may keep Mehr `.on` — OK if primary tab button is `display:none`).
2. **Admin team cards / kid-dir cards:** Detector flags h>72 — these are **content cards**, not CTAs; only compact if visually sparse.
3. **Stock product rows** h=168: often multi-line product + stepper — verify real layout in `iphone-webkit-stock-full.png` before forcing max-height (don’t crush steppers).

---

## Suggested implementation order

1. Talk channel-actions (P0 visual break)  
2. Stock search row wrap (P0 usability)  
3. Desk stock-tool height  
4. Gate landmark + changelog copy  
5. Home presence duplicate string  
6. Chrome badge spacing  
7. Week AI / empty compact  
8. Bump **v226**, regen shells, re-run this folder’s audit script  

Ship checklist: `build.json` + `gate.js` `APP_BUILD` + `sw.js` + `?v=` + `python3 scripts/build-shell-sites.py`.

---

## File map

| Area | Files |
|------|--------|
| Talk channel head | `mobile/mobile.css`, `ui-v110.css` |
| Stock command | `ui-v110.css`, `mobile/mobile.css`, `desk/desk.css` |
| Gate | `gate.js`, `ui-v110.css`, `build.json` |
| Home presence / greeting | `app.js` (rg `Ich bin da`, `shiftPresence`, `home-command`) |
| Desk home | `desk/desk.css`, `ui-v110.css` |
| Week AI | `ui-v110.css` / schedule builders in `app.js` |

Never paste full `app.js` — `rg` symbols and read ±80 lines.

---

## Re-run

```bash
# iOS Simulator (Booted iPhone)
xcrun simctl openurl booted 'https://armonia-thassos.vercel.app/'
xcrun simctl io booted screenshot .qa-screens/v225-rescan/ios-sim-armonia-gate.png

# Full WebKit + desk (local auth mirror)
# (reuse the node audit from this session; artifacts in .qa-screens/v225-rescan/)
```

**Done when:** Talk channel icons are square; stock search shows full placeholder; desk stock tools ≤48px; gate has one clear brand signal and human changelog; iOS Sim on canonical host shows V226+ without blank `/m`.
