# QA Report — Kids / Child-mode UI

**Date:** 2026-08-30  
**Auditor:** QA / design-audit agent (code + production screenshot)  
**Live:** https://armonia-thassos.vercel.app (`#home`, child session)  
**Production at audit close:** **v143**; implementer close-out **v144**  
**Repo:** `/Users/aggelosdadalis/paidia`  
**Screenshot:** user-attached Chrome desktop capture (macOS) of kids UI with Zo-Ai float open  

**Local probe:** `localhost:5173` was **down** during audit. Findings below are from code inspection + the production screenshot + shipped commits `3545dec` (v142) and `6e6c586` (v143).

**Scope:** child-mode only (`body.mode-child`). Do **not** overhaul staff Home/PC glass in this workstream unless a fix is shared chrome.

---

## 0. Status at a glance

| Issue | Severity | Status |
|-------|----------|--------|
| Kids dock / left rail missing | was P0 | **Fixed / v142** (`3545dec`) |
| Zo-Ai title raw `<svg class="ui-ico"…>` | was P0 | **Fixed / v143** (`6e6c586`) |
| Sparse desktop Start / Bewertung content | was P0 | **Fixed / v144** |
| No desktop multi-column kid home (vs staff `.home-pc`) | was P1 | **Fixed / v144** |
| Easy mode hides secondary kid destinations | was P1 | **Fixed / v144** (Start CTAs always) |
| Tablet / mid-width layout density | was P1 | **Improved / v144** |
| Broader kids visual polish (“massive overhaul”) | **P2** | **Open** (backlog) |
| Zo-Ai float vs dock / macOS dock collision | **P2** | **Open** |

---

## 1. Screenshot observations (production kids UI)

Observed on desktop Chrome at `armonia-thassos.vercel.app`:

1. **Chrome bar:** dark topbar — brand / “Armonia · Αρχική”, “Καμία σύνδεση”, Easy toggle (**Απλά** on), bell, tools, **ΕΛ**, **Προφίλ**. Utility-heavy; primary kid destinations are not in the topbar (by design — dock/rail owns nav).
2. **Main column:** single stacked white surface(s). Visible blocks match **Bewertung** content more than rich Start:
   - **Μαθήματα** list (Μαθηματικά, Γερμανικά, Ελληνικά, Αγγλικά, Αθλητισμός) — `childSubjectsReadonlyHtml` / `.kid-subjects-ro`
   - **Τελευταίες 4 εβδομάδες** trend bars — `childBewertungenView` / `.kid-trend-row`
3. **Sparseness:** wide empty gutters; content reads as a phone list stretched into a desktop column. Little information density for a ≥900px viewport.
4. **Zo-Ai float (bottom-right):** panel open; user “Θέλω να φύγω”; bot reply about Profile logout. **At screenshot time**, header showed literal string  
   `` `<svg class="ui-ico" aria-hidden="true"><use href="#u-sparkle"/></svg> Zo-Ai` ``  
   (now fixed in v143 — verify on a hard refresh).
5. **FAB / close:** circular control near bottom-right; can sit close to the macOS dock.
6. **Nav note:** screenshot may predate or miss the v142 left rail depending on viewport/cache; treat **missing dock** as fixed after hard-reload on v142+. Re-verify rail at ≥900px.

---

## 2. Fixed — do not re-open without re-verify

### 2.1 Kids navigation chrome — **Fixed / v142** (`3545dec`)

**Was:** dock lived inside `#view` and disappeared / failed on desktop; no reliable Start · Spiele · Bewertung · Bonus · Notizen · Mehr.

**Shipped:**

| Piece | Location |
|-------|----------|
| `mountKidDock(active)` / `unmountKidDock()` | `app.js` — mounts `nav.kid-dock` into `#bottomPanel` |
| `kidDockHtml` / `sheetKidMore` / `kidGuideHtml` / `kidFirstRunHtml` | `app.js` |
| `renderChild()` calls `mountKidDock(dockActive)` | `app.js` ~`renderChild` |
| Desktop left rail ≥900px | `index.html` — `body.layout-desktop.mode-child` (`--rail-w:180px`, `.bottom-panel.is-kid-chrome`) |
| Guidance tips DE/EL | `kidGuideHtml`, first-run, So geht’s |

**Acceptance (regression):**

- [ ] Child login → bottom dock (mobile) or left rail (≥900px) always visible outside `#view`.
- [ ] Tabs: Start / Spiele / Bewertung / Bonus / Notizen / Mehr work; Mehr opens Plan / Lernen / Sterne / etc.
- [ ] Soft nav: guidance strip + first-run tip appear once; DE/EL strings present.
- [ ] Staff dock returns after leaving child mode (`unmountKidDock`).

**If “no nav” returns:** confirm `build.json` ≥142, hard-refresh / unregister SW `paidia-v*`, confirm `body.mode-child` + `#bottomPanel.is-kid-chrome` + `nav.kid-dock` in DOM.

### 2.2 Zo-Ai panel title raw SVG — **Fixed / v143** (`6e6c586`)

**Was (root cause):** `openChatPanel()` set `#chatPanelTitle` with:

```js
title.textContent = `${ui('u-sparkle')} ${t('helpChat')}`;
```

`ui()` returns HTML (`<svg class="ui-ico"…><use href="#u-sparkle"/></svg>`). `textContent` escapes tags → literal markup in the header (exact screenshot bug).

**Fix:**

```js
title.innerHTML = `${ui('u-sparkle')} ${esc(t('helpChat'))}`;
```

| Piece | Location |
|-------|----------|
| `openChatPanel` | `app.js` — `#chatPanelTitle` |
| `ui()` | `app.js` — returns SVG string |
| Static shell | `index.html` — `#chatPanel` / `#chatPanelTitle` (default `✨ Zo-Ai`) |

**Acceptance (regression):**

- [ ] Open Zo-Ai (`#navChat` / dock) → sparkle **icon** + “Zo-Ai”, no raw `<svg` text.
- [ ] Title text still escaped (`esc(t('helpChat'))`) — no XSS via i18n.
- [ ] Sprite `#u-sparkle` present in page sprites; icon strokes visible on `.chat-panel-title .ui-ico`.

**Do not** set `innerHTML` to unescaped user/LLM strings. Only `ui()` markup + `esc()` label.

---

## 3. Open bugs (severity)

### P0 — Sparse desktop child home / Bewertung column

**Symptom:** On wide desktop, kids content is a single narrow-feeling stacked column (subjects + week bars, or Start cards in a thin stream) with large empty side space. Feels like “mobile stretched on desktop,” not a real PC kids home.

**Code anchors:**

| Symbol / selector | Role |
|-------------------|------|
| `renderChild` | Chooses view; wraps in `.kid-shell` |
| `childStartView` | Start: header, `.level-card`, `childSchoolSnapshotHtml`, lessons, `.course-grid`, game challenge |
| `childBewertungenView` | Bewertung: rate cards + `childSubjectsReadonlyHtml` + week trend |
| `childSubjectsReadonlyHtml` | **Μαθήματα** list (screenshot) |
| `.kid-trend-*` | **Τελευταίες 4 εβδομάδες** |
| `body.layout-desktop.mode-child main.app-stage` | `max-width:900px; margin:0 auto` — centered column only |
| Staff contrast | `.home-pc` / `.home-pc-rail` — **staff only** (`:not(.mode-child)`) |

**Why it feels empty:**

1. No kid equivalent of staff `.home-pc` two-column layout.
2. Desktop CSS widens the stage but does not compose Start into a dense grid/rail.
3. Screenshot content (subjects + weeks) is inherently list-y; without a side rail (next lesson, game CTA, XP), desktop looks abandoned.
4. Easy mode (`body.mode-easy`) hides `.pro-only` / `.mode-pro-block` — secondary chips (events/gallery) and some rate groups vanish, increasing sparseness when **Απλά** is on.

**Implementer instructions:**

1. Add a desktop composition for `body.layout-desktop.mode-child` Start (`childView==='today'`), e.g. `.kid-home-pc`:
   - **Main:** hello + level + today’s lessons / next-up  
   - **Rail:** school KPIs, game challenge, quick chips (Plan / Spiele / Bewertung)
2. Optionally densify Bewertung: subjects + trend side-by-side ≥900px (CSS grid on `.kid-shell` sections).
3. Reuse tokens from `design/VISUAL_MOTION_SYSTEM.md` / existing kid cards — no new purple glass.
4. Keep mobile single column; gate desktop rules under `body.layout-desktop.mode-child`.

**Acceptance:**

- [ ] ≥900px Start: first viewport fills usefully (hero + ≥2 content regions); no huge empty side gutters with only one skinny card stack.
- [ ] Mobile unchanged (single column + bottom dock).
- [ ] Easy mode still simpler, but Start still shows level + today + one clear next action.

---

### P1 — Missing desktop multi-column pattern (parity gap)

**Symptom:** Staff got PC Home rail (v106+); kids only got nav rail (v142). Content area still phone-first.

**Hints:** Mirror patterns from `docs/agents/CURSOR_HANDOFF_PC_MOBILE_GLASS.md` (`.home-pc`) but under `mode-child` with kid copy/CTAs. Prefer CSS grid in `index.html` + light HTML wrappers in `childStartView` / `childBewertungenView` — avoid rewriting all kid views at once.

**Acceptance:** At least Start (and ideally Bewertung) use a documented desktop grid; other tabs can stay stacked in a follow-up.

---

### P1 — Easy mode reduces visible destinations (guidance gap)

**Symptom:** With **Απλά** / Einfach, `.pro-only` / `.mode-pro-block` hidden (`index.html` Easy/Pro CSS). Events/gallery chips and some Bewertung blocks disappear. Combined with sparse desktop, kids may think “there is only school list.”

**Hints:** `uiMode` / `applyUiModeClass` / `isEasy()` in `app.js`; `body.mode-easy .pro-only`. Dock tabs remain — ensure Easy Start still surfaces Spiele / Bewertung CTAs in the main column, not only Pro chips.

**Acceptance:** Easy Start always shows ≥3 primary next steps (e.g. today lessons, Spiele, Bewertung) without requiring Pro.

---

### P1 — Tablet / mid-width (≈600–899px)

**Symptom:** Between phone dock and desktop rail breakpoint (900px), layout can still be a stretched phone column with awkward max-widths (`body.mode-child .kid-shell{max-width:none}` in places).

**Hints:** Audit `@media` blocks around kid `.course-grid` (2→3→4 cols) vs `syncLayoutMode` / `layout-desktop` threshold. Consider a tablet max-width or 2-column Start earlier than 900px.

**Acceptance:** iPad portrait/landscape: content readable, dock usable, no ultra-wide single-line subject rows.

---

### P2 — Broader kids polish (“massive overhaul”)

Backlog only — not a single bug. Candidates after P0/P1:

- Align kid header / cards with Design System v2 Kids page (Figma `chWjXFxyCaFzFC6438lk4N`).
- Stronger empty states when no lessons / grades (`emptyState` already used in Start).
- Zo-Ai float clearance vs kid dock + OS dock (`body.mode-child .chat-panel.chat-float` bottom offsets).
- Consistency of `.kid-card` vs `.child-school-card` vs `.kid-panel` naming/spacing.
- Header “Καμία σύνδεση” honesty when offline (ops, not kids-only).

Ship as small versioned slices; bump cache per [CURSOR_HANDOFF_PC_MOBILE_GLASS.md](CURSOR_HANDOFF_PC_MOBILE_GLASS.md) §5.

---

### P2 — Zo-Ai FAB / panel vs system dock

**Symptom:** Screenshot shows float + circular control near macOS dock. Risk of hard-to-tap close/send.

**Hints:** `index.html` — `.zoai-fab`, `.chat-panel.chat-float`, `body.mode-child` / `layout-desktop.mode-child` bottom offsets.

**Acceptance:** Full chat chrome (close, input, send) clear of safe-area + typical OS dock overlap on desktop.

---

## 4. What the screenshot is *not*

- Not staff Home (no `.home-pc-rail`).
- Not proof that v142 dock is broken — re-verify after cache clear.
- Zo-Ai **title** escape is **not** still open on v143+ (was the raw SVG string).

---

## 5. Priority queue for implementers

1. **P0 — Desktop kid home density** (`childStartView` + desktop CSS; optional Bewertung grid).  
2. **P1 — Easy-mode primary CTAs** still visible on Start.  
3. **P1 — Tablet mid-width** pass.  
4. **P2 — Polish backlog** (design-system pass, Zo-Ai clearance).  
5. **Regression only:** dock v142 + Zo-Ai title v143 after every kids ship.

---

## 6. Suggested test matrix

| Check | Mobile | Desktop ≥900px |
|-------|--------|----------------|
| Kid dock / rail present | bottom pill | left rail |
| Start density | stacked OK | multi-region / rail |
| Bewertung subjects + weeks | stacked | prefer 2-col |
| Zo-Ai title icon | icon, not raw HTML | same |
| Easy vs Pro | fewer blocks, still guided | same |
| Leave child → staff dock | restored | restored |

Hard-refresh or bump SW after deploys. Login banner should show **v143+**.

---

## 7. Guardrails

- Confirmable Zo-Ai `paidia-action` only; child Zo-Ai remains read-only for mutations.
- No PIN/secrets in commits; no full `app.js` paste into agent context — use this report + `docs/agents/map.json`.
- Cache bust: `build.json`, `CHANGELOG.md`, `gate.js` `APP_BUILD`, `app.js` `APP_BUILD`, `sw.js` `CACHE`, `?v=` in `index.html` / `gate.js`.
- Push kids fixes via **upstream / ANGUELdad** per [PUSH_ORIGIN.md](PUSH_ORIGIN.md).

---

## 8. File / function cheat sheet

```
app.js
  renderChild, mountKidDock, unmountKidDock, kidDockHtml, sheetKidMore
  kidGuideHtml, childStartView, childBewertungenView, childSubjectsReadonlyHtml
  openChatPanel, paintChatPanel, ui(), esc()
index.html
  body.mode-child, body.layout-desktop.mode-child
  .kid-shell, .kid-dock, .bottom-panel.is-kid-chrome
  #chatPanel, #chatPanelTitle, #navChat
  body.mode-easy .pro-only / .mode-pro-block
docs/agents/CURSOR_HANDOFF_PC_MOBILE_GLASS.md  — staff PC patterns (adapt, don’t copy blindly)
design/VISUAL_MOTION_SYSTEM.md                 — tokens / motion authority
```

---

*End of report. Update this file when P0 desktop density ships; leave Fixed/v142 and Fixed/v143 rows intact unless regressions are confirmed.*
