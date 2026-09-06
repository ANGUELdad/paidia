# iOS Safari site-wide UI fix notes (v176)

**Audience:** fix agents (Cursor / Claude Code). Broken UI + practicality only — not feature specs.  
**Method:** Playwright iPhone 14 Pro (393×660), DE, scroll + button probes, Easy **and** Pro.  
**Run:** `node docs/marketing/.local-auth/qa_ios_sitewide.mjs` (local auth `e5` staff / `k1` child).  
**Artifacts:** `docs/marketing/.local-auth/qa_ios_sitewide_results.json` + `qa_ios_screenshots/*.png` (gitignored path — regenerate locally).  
**Build audited:** v176 @ `http://127.0.0.1:5173`

---

## Executive summary (fix order)

| Priority | Theme | User impact |
|----------|--------|-------------|
| **P0** | Zo FAB + sticky toast cover primary actions (Talk send, Liste date nav, Buch calendar) | Staff cannot message / tap controls |
| **P0** | Talk compose row buried under toast + FAB on iPhone | Team chat unusable after any stock toast |
| **P1** | Duplicate Easy/Pro toggles (header + in-page float) on almost every staff + kid screen | Clutter, confusion, wasted vertical space |
| **P1** | Header subtitle truncation (`Armoni…`, `Plan · W…`, `Einkauf…`, `Buch & S…`) | Looks broken / unfinished |
| **P1** | Kids floating dock overlaps bottom CTA tiles + Zo FAB collision | Mis-taps, hidden game tiles |
| **P1** | Tap targets &lt;44px (Easy/Pro 30×36, `Zum Plan` 80×20, Lager edit rows ~35px) | Daily ops friction |
| **P2** | Kids subpages: redundant “DU BIST HIER” guide + Easy/Pro in child chrome | Not playful; feels like staff app |

---

## P0 — Ship blockers

### P0.1 Toast survives route change and stacks on FAB

**Symptom:** After Lager ± action, green toast `+1 Stk · … · Rückgängig` stays visible on **Talk**, **Liste**, **Buch** (and covers inputs).  
**Repro (iOS):** Staff → Lager → tap `+` on any product → navigate to Talk or Liste via dock. Toast still pinned bottom-center.  
**Screens:** `staff_easy_talk.png`, `staff_easy_liste-plan.png`, `staff_easy_buch.png`

**Fix hint:** Dismiss toast on `render()` tab change, or shorten TTL + lower z-index below `#bottomPanel` / sheet. Toast must never overlap `#talkInput` / `#talkSend`.  
**Files:** `app.js` (toast helper + stock undo), `index.html` / `ui-v110.css` (`.toast`, z-index stack)

**Acceptance:**
- [ ] Toast auto-dismiss ≤4s OR clears on any `state.tab` / hash change
- [ ] Talk: message field + Send fully visible and tappable with toast present
- [ ] No toast z-index above compose bars on mobile

---

### P0.2 Zo-Ai FAB overlaps primary controls (staff mobile)

**Symptom:** `#dockZoAi` / floating Zo circle sits on top of Send (Talk), calendar cells (Buch), date chevrons (Liste), Plan week card footer.  
**Repro:** Open Talk on 390px width — Send button half under Zo. Same on Buch calendar day 13–20 area.  
**Screens:** `staff_easy_talk.png`, `staff_easy_buch.png`, `staff_easy_liste-plan.png`, `staff_easy_plan-week.png`

**Fix hint:** On mobile staff, hide floating FAB when `#bottomPanel` dock visible (rail Zo already in Mehr/desktop). Or move FAB above dock with `bottom: calc(var(--dock-h) + 12px)` and add `#view` bottom padding. Hide FAB when chat panel open (partially done — verify on v176).  
**Files:** `index.html` (FAB + chat scrim v174+), `ui-v110.css`, `app.js` `mountDock` / chat open handlers

**Acceptance:**
- [ ] 390px: no FAB overlap on Talk Send, Liste date arrows, Buch calendar grid
- [ ] FAB tap target does not steal taps from adjacent CTAs (44px separation)
- [ ] Chat open → FAB hidden (regression check)

---

## P1 — Top UI / daily paths

### P1.1 Duplicate Easy/Pro toggles (header + page float)

**Symptom:** Leaf/sparkle toggle appears in **header** and again floating mid-page (Home hero, Plan, Lager, Liste, Talk, Buch, child Spiele/Bewertung/etc.).  
**Repro:** Staff Home Easy — two identical toggles visible without scrolling.  
**Screens:** `staff_easy_home.png`, `staff_easy_plan-week.png`, `child_games.png`, `child_rate.png`

**Fix hint:** Keep **one** global toggle in header only. Remove in-hero / floating duplicates from `viewHome`, `viewSchedule*`, `viewStock`, `viewShop`, `viewTalk`, `viewBook`, child views. Per-page override belongs in Profil, not a second widget.  
**Files:** `app.js` (view* HTML), `index.html` (`.ui-mode-float`, hero embeds)

**Acceptance:**
- [ ] Exactly one Easy/Pro control visible per screen on mobile
- [ ] Toggling header switch still updates `body.mode-easy` / `mode-pro` everywhere

---

### P1.2 Header brand / context line truncates on iPhone

**Symptom:** `header.app-chrome` crushes center title: `Armoni…`, `Plan · W…`, `Einkauf…`, `Buch & S…`, `Lager · K…`.  
**Fix hint:** Short mobile title pattern: icon + active tab label only; move house/context to in-page kicker. Or allow 2-line wrap with `line-clamp: 2` min-width on title block.  
**Files:** `index.html` header layout, `ui-v110.css` `@media (max-width:899px) header…`

**Acceptance:**
- [ ] 390px: primary tab name fully readable (Plan, Liste, Lager, Buch)
- [ ] No ellipsis on default DE copy for main tabs

---

### P1.3 Kids dock + FAB overlap content tiles

**Symptom:** Bottom pill dock covers lower half of 2×2 CTA grid on Start; Spiele arcade cards (2048, …) clipped behind dock. Coral Zo FAB overlaps green tile + dock “Mehr”. Footer copy (“Noch offene Bewertungen…”) barely visible.  
**Repro:** Child k1 → Start → scroll to bottom tiles.  
**Screens:** `child_today.png`, `child_games.png`

**Fix hint:** Add `#view` / `.kid-home-play` bottom padding `calc(var(--kid-dock-h) + var(--safe-b) + 24px)`. Shrink FAB bottom offset when kid dock mounted. Consider 2-column grid with shorter cards on narrow screens.  
**Files:** `index.html` v176 kids block, `app.js` `childStartView`, `mountKidDock`

**Acceptance:**
- [ ] All four Start CTA tiles fully visible above dock without scroll
- [ ] Spiele: at least two game cards fully tappable above dock
- [ ] FAB not overlapping dock “Mehr” hit area

---

### P1.4 Tap targets below 44×44 (staff + kids)

**Automated hits (sample):**

| Control | Size | Pages |
|---------|------|--------|
| Easy / Pro pills | 30–34 × 36 | Plan, Gallery, all child subpages |
| `Zum Plan` link | 80 × 20 | Home |
| Plan remove (×) | 22 × 22 | Plan week (Pro) |
| Lager “Produkt bearbeiten” rows | ~152×35 | Lager Easy+Pro |
| Buch house chips | 65–88 × 36 | Buch Pro |

**Fix hint:** Header mode pills → min 44×44 touch box. Home jump links → `btn sm` height 44. Icon-only controls → 44×44 padding.  
**Files:** `index.html` `.ui-mode-btn`, `ui-v110.css`, `app.js` home / plan templates

**Acceptance:**
- [ ] WCAG 2.5.5: primary actions ≥44×44 CSS px on 390 viewport
- [ ] No new horizontal overflow from larger targets

---

### P1.5 Easy mode still surfaces Lager “Regale” pro block

**Symptom:** On Lager with `body.mode-easy`, category/regal pro strip visible (`Regale nach Kategorie` — audit `easy-shows-pro`).  
**Repro:** Staff Easy → `#stock` → see regal/category pro UI.  
**Fix hint:** Wrap block in `.pro-only.mode-pro-block`; Easy should show simplified zone chips only (v174 intent).  
**Files:** `app.js` `viewStock`, `ui-v110.css` Lager v174 block

---

### P1.6 Liste hero copy layout broken

**Symptom:** Date line wraps mid-phrase: `Freitag, 04. September 2026 .` orphan period; cramped next to stats column.  
**Screen:** `staff_easy_liste-plan.png`

**Fix hint:** Stack meta column below title on `<480px`; fix string join so punctuation stays with sentence.  
**Files:** `app.js` `viewShop` hero branch

---

## P2 — Polish / practicality

### P2.1 Kids subpages feel like staff (guide banner noise)

**Symptom:** Spiele/Bewertung show large “DU BIST HIER” card + “So geht’s” + “Zurück” — ~40% viewport before real content.  
**Fix hint:** Show guide once per view (localStorage); collapse to single inline hint on repeat visits. Start already hides guide (v176) — extend pattern.  
**Files:** `app.js` `kidGuideHtml`, child view templates

---

### P2.2 Easy/Pro toggle visible in child mode header

**Symptom:** Kids see leaf/sparkle staff mode toggle (Simon header). Children should not choose staff Easy/Pro.  
**Fix hint:** Hide `.ui-mode-toggle` when `body.mode-child`.  
**Files:** `index.html` `body.mode-child` rules, `app.js` render chrome

---

### P2.3 Staff dock density (6 tabs)

**Symptom:** Home · Kinder · Plan · Lager · Liste · Mehr — labels 11px, tight on 390px.  
**Fix hint:** Keep 5 + Mehr pattern from chrome contract; consider Kinder → Mehr on mobile if width fails. Document decision in `QA_STAFF_FIX_NOTES.md`.  
**Files:** `app.js` dockHtml, `ui-v110.css`

---

### P2.4 First-login Kontaktdaten sheet blocks all staff QA until filled

**Symptom:** Fresh staff session shows blocking contact sheet over every route (modal `ERSTER LOGIN / Kontaktdaten`).  
**Note for QA agents:** Seed `localStorage` key `paidia-contact:{profileId}:staff` before audit (see `qa_ios_sitewide.mjs`). Product question: allow “Später” skip on trusted devices?  
**Files:** `app.js` `ensureContactDetails`

---

## Page coverage checklist (iOS scroll + buttons)

| Area | Easy | Pro | Notes |
|------|------|-----|-------|
| Staff Home | ✓ | ✓ | Duplicate toggle; small `Zum Plan` |
| Plan day/week | ✓ | ✓ | Duplicate toggle; week remove tiny |
| Lager | ✓ | ✓ | Easy pro-leak; reason modal OK |
| Liste plan/requests | ✓ | ✓ | Hero wrap; toast leak |
| Buch | ✓ | ✓ | Toast + FAB on calendar |
| Talk | ✓ | ✓ | **P0** compose blocked |
| Gallery | ✓ | ✓ | Mode pills small |
| Staff Kids tab | ✓ | ✓ | Same chrome issues |
| Mehr sheet | ✓ | ✓ | OK — Momente/Talk/Buch |
| Child Start/Spiele/Rate/Bonus/Notes/Mehr/Gallery | ✓ | n/a | Dock overlap; guide clutter |

---

## Re-run instructions

```bash
# Terminal 1
python3 docs/marketing/.local-auth/run_server.py

# Terminal 2
node docs/marketing/.local-auth/qa_ios_sitewide.mjs
```

Compare screenshots under `docs/marketing/.local-auth/qa_ios_screenshots/`.  
Target: **P0 = 0**, Easy/Pro single toggle, no dock/FAB overlaps on 390px.

---

## Related docs

- [`QA_REPORT_STAFF_UI.md`](QA_REPORT_STAFF_UI.md) — static staff chrome debt  
- [`QA_REPORT_KIDS_UI.md`](QA_REPORT_KIDS_UI.md) — kids design targets  
- [`CURSOR_HANDOFF_PC_MOBILE_GLASS.md`](CURSOR_HANDOFF_PC_MOBILE_GLASS.md) — dock / rail contract  
- [`design/VISUAL_MOTION_SYSTEM.md`](../../design/VISUAL_MOTION_SYSTEM.md) — tokens & motion
