# Apple-taste UI critique — full Playwright sweep (v226 local / v225 live)

**Date:** 2026-09-07  
**Method:** Playwright WebKit iPhone 15 Pro + Chromium desk; iOS Simulator Safari on live; authenticated local staff admin (`e4`), staff (`e1`), kids (`k1`); live gate-only (staff PINs ≠ local).  
**Artifacts:** `.qa-screens/full-apple-critique/` (`report.json`, ~140 screenshots)  
**Script:** `scripts/qa-full-apple-critique.mjs`

**Sweep totals:** 65 page visits · 778 button taps · 0 page render crashes · live `/` `/m/` `/desk/` = 200 · dead alias `a-thassos.vercel.app` = **404**

---

## Executive verdict

Local **v226** is functionally dense and mostly operable. It is **not** yet Apple-grade calm. The product still reads as “many capable panels” rather than “one clear next action.” Live production is still **v225** with audit-jargon changelog — ship v226 before judging live staff UX.

HIG citations below map to Apple Layout / Typography / Accessibility / Materials (Liquid Glass restraint) via `.cursor/skills/apple-design`.

---

## Critical (ship blockers / trust)

### C1. Live behind local by one release
- **What:** Live footer shows V225 + “UI-Audit: Overflow…”; local is V226 with human changelog.
- **Why:** Users on the public URL do not receive Talk/stock/gate fixes. Changelog jargon fails Writing/HIG clarity.
- **Fix:** Push v226 to `upstream` / Vercel. Keep `build.json.changed.*` user-facing only.

### C2. Dead hostname still discoverable
- **What:** `https://a-thassos.vercel.app` → 404. Simulator/Safari truncation can look like this host.
- **Why:** Blank `/m` + stale SW risk (already burned the team once).
- **Fix:** Redirect alias → `armonia-thassos.vercel.app` or delete the project; document only the canonical host.

### C3. Auto presence sheet owns Home on late shifts
- **What:** Late-shift sheet opens on Home for staff; covers dock; blocks first glance at the day.
- **Why:** HIG modality: one sheet is fine, but auto-modal on every Home paint feels like an interrupt storm. Dock under sheet fails “controls remain reachable or clearly dismissed.”
- **Fix:** Auto-open once per shift key (already partially keyed); prefer banner + “Jetzt melden” over full sheet until tap; ensure Escape / X / scrim always dismiss; never leave sheet `.on` after navigation away from Home.

### C4. Desk Easy/Pro compact toggle became a vertical slab (fixed in this pass)
- **What:** `.ui-mode-seg.is-compact > button` measured **44×166** on Home/Shop/Gallery desk — the “orphan white pill” in the hero.
- **Why:** Layout HIG — controls must not stretch with the content column. Icon-only segmented controls should stay ~36–44px.
- **Fix applied:** Global `.ui-mode-seg.is-compact` height lock in `ui-v110.css` + desk overrides.

### C5. Giant mobile CTAs — Liste Foto / Momente Neu (fixed in this pass)
- **What:** `#shopEasyFoto` **168px** tall; `#galShare` **155px** tall.
- **Why:** Tap targets ≥44 is the floor, not a license to inflate empty flex children into half-screen slabs.
- **Fix applied:** max-height 48–52px on shop-easy strip + gal-fab.

---

## High (interaction / hierarchy)

### H1. Chrome density on iPhone
- **What:** Bell / DE / avatar gap was **4px** (rule in `mobile/mobile.css` forced `gap:4px !important`).
- **Why:** HIG Layout — enough space between controls so they are distinct; badge collision with DE.
- **Fix applied:** `gap:12px` on `.topbar-core`. Re-check badge absolute position stays inside bell hit target without kissing DE.

### H2. Six-item dock crowding + label truncation
- **What:** Dock shows Home / Kinder / Plan / Lager / Liste / Mehr; Greek “Πρόγραμ…” truncates; Kids still visible despite “five primary destinations” intent (index.html `.dock-secondary[data-tab=kids]{display:flex!important}` wins over hide rule).
- **Why:** Tab bars should expose 3–5 primary destinations; overflow belongs in Mehr. Truncation destroys recognition (Typography / Navigation).
- **Fix:** Resolve conflict: either commit to 5 tabs (hide Kids/Pocket as secondary in Mehr only) or accept 6 and enlarge label area / shorten EL strings. Prefer 5.

### H3. Presence copy & late flow still noisy
- **What:** Step label “Anwesenheit” + CTA “Ich bin da” is better; late sheet still repeats “Ich bin da” in body + primary button.
- **Why:** Progressive disclosure — one verb per decision.
- **Fix:** Sheet primary = “Verspätung melden”; on-time path keeps “Ich bin da”. Body copy should not quote the button label.

### H4. Desk Home hero still overbuilt
- **What:** Dark hero + greeting + two CTAs + 2×2 pulse + decorative marks. Pulse icons sometimes fail to map to labels (icon/label mismatch observed in screenshots).
- **Why:** First viewport should answer “what do I do now?” not “here is a dashboard wallpaper.”
- **Fix:** One primary CTA (“Tag planen” or “Jetzt melden” when late). Pulse: max 2 signals or move to rail. Kill decorative vertical ornaments.

### H5. Kids Zo-Ai opens too eagerly during exploration
- **What:** Games / rate sweeps often land in Zo-Ai sheet; chatScrim covers the world.
- **Why:** Generative AI HIG — invite, don’t ambush. Kids especially need predictable nav.
- **Fix:** Do not auto-open Zo on view enter; FAB only. Ensure `#chatScrim` remains `display:none` unless `body.chat-open`.

### H6. Click-sweep detaches nodes (false “975 failures”)
- **What:** Re-render after first clicks invalidates element handles → “Element is not attached to the DOM”.
- **Why:** Not a user bug; means the app re-renders aggressively (good for sync, hard for automation).
- **Fix:** QA script should re-query selectors each click (improve `qa-full-apple-critique.mjs`). User-facing: ensure critical actions don’t depend on stale DOM.

---

## Medium (spacing, type, motion, materials)

### M1. Type scale floors
- Detector flagged many `<11px` nodes (often SVG/chrome). Real issue: dock labels ~10–12px, stock zone small text, gate footer 11px.
- **HIG:** Mobile body default ~17; minimum ~11. Prefer ≥12 for any readable label.
- **Fix:** Dock labels 11→12 (partially done); ban 8–9px microcopy in zone chips — use two-line 12/11 instead.

### M2. Card stacking rhythm
- Home / Stock / Shop stack large cards with similar radius/shadow → flat hierarchy.
- **Fix:** One “hero” elevation per page; subsequent sections flatter (border only). Match Armonia tokens, not iOS system gray cards everywhere.

### M3. Horizontal rails without progressive disclosure
- House chips / plan day chips peek padding improved, but rails still feel endless.
- **Fix:** Fade edge mask + “Noch X” affordance; snap alignment consistent.

### M4. Glass / blur restraint
- Chrome glass is brand-correct; applying soft white cards to every row dilutes Liquid Glass intent (glass = chrome layer, content = solid).
- **Fix:** Keep blur on topbar/dock/sheets only; list rows opaque.

### M5. Motion
- `pine-settle` exists; sheets/tour still need `prefers-reduced-motion` completeness.
- **Fix:** Audit sheet enter/exit, gal-enter, liked-burst against reduce-motion; 200–280ms ease, no bounce on staff tools.

### M6. Empty states
- Talk / Shop empty areas are large quiet fields — good calm, weak invitation.
- **Fix:** One illustration or single primary action centered; avoid giant empty button chrome.

### M7. Admin section nav
- 10 admin sections as text links — powerful, dense, not scannable on phone (picker helps).
- **Fix:** Keep picker on mobile; desk: grouped sections (Ops / Care / System) with spacing, not a single long underline strip.

### M8. Color semantics
- Late = red/brown, Admin pill = yellow, stock bars = green — mostly coherent.
- Risk: gold badge on gold bell (sun on sun) — contrast weak.
- **Fix:** Badge uses out/red or ink-on-sun with ring; never same hue as icon fill.

### M9. Focus / keyboard (desk)
- Need visible `:focus-visible` on sidebar + matrix (partially present).
- **Fix:** Audit sidebar links and admin records for 2px brand ring.

### M10. Safe area
- Dock + PWA install bar compete for bottom inset; install bar copy truncates.
- **Fix:** Shorten PWA copy; ensure bar bottom = dock + 8 + safe-area; dismiss sticky.

---

## Low (polish)

1. Mehr icon ··· — done; keep weight matched to other dock glyphs.  
2. Gate entrance “Wer bist du?” — good; pull cards up, less empty white.  
3. Desk sidebar brand mark vs wordmark alignment (±2px).  
4. Pulse grid hairlines too faint on dark hero.  
5. Kid arcade featured tiles ~290px — acceptable as content cards, not CTAs.  
6. EL truncation in dock — shorten `navSchedule` EL or allow 2-line dock labels.  
7. Stock product rows tall by content — don’t max-height crush steppers.  
8. Notifications list on desk Home — good rail; ensure 44px row min.

---

## Role-specific notes

### Staff (non-admin)
- All primary tabs operable; Admin shows required message — correct.  
- Late presence dominates session — treat as product priority #1 for calm.

### Admin
- All 10 panes reachable; tools open sheets.  
- Ops desk stats / team cards: content density OK; avoid stretching primary buttons full-bleed height.

### Kids
- Views: today / games / rate / bonus / notes / plan / stars / learn / gallery visited.  
- Zo-Ai modal quality is high; restrain auto-open.  
- Header “Nicht angemeldet” during some kid shots suggests session/chrome copy glitch when Zo overlays — investigate `who` line.

---

## Live public site (gate only)

| Path | Status | Notes |
|------|--------|-------|
| `/` | 200 | Gate V225, Personal/Kinder cards |
| `/m/` | 200 | Same |
| `/desk/` | 200 | Same |
| PIN pad | UI ok | Cannot complete staff login with local pins |
| `a-thassos.vercel.app` | 404 | Remove/redirect |

iOS Simulator screenshots: `ios-sim-live-m-gate.png`, `ios-sim-live-desk.png`.

---

## Fixes applied in this session (on top of v226 UI rescan)

1. Kill global `max-height:none` side-effects (earlier) + Talk 44×44  
2. Stock search wrap; desk stock ≤48  
3. Gate landmark / changelog / Wer bist du?  
4. Home Anwesenheit vs Ich bin da  
5. Compact Easy/Pro slab lock (all pages)  
6. shopEasyFoto / galShare height caps  
7. topbar-core gap 12px (mobile) / 10px (desk)  
8. kidAddBtn height cap on desk  

**Still open for next ship:** dock 5-vs-6 conflict, live deploy, dead alias, presence auto-sheet product decision, pulse icon/label mapping, PWA bar copy, EL dock truncation.

---

## Recommended next engineering order

1. Deploy v226 to live  
2. Resolve dock primary set (5 tabs) in one CSS source of truth  
3. Presence: banner-first, sheet-on-demand  
4. Desk Home hero simplification  
5. Re-run `node scripts/qa-full-apple-critique.mjs` — expect P0 clip noise ↓ after ignoring SVG; assert zero `tap-giant` for `.btn`/`.gal-fab`/`.ui-mode-seg`
