# QA Report — Staff UI (design / chrome audit)

**Audience:** fix agents (Cursor / Claude Code). Do **not** treat this as implementation.  
**Scope:** Staff surfaces — Home, Plan, Lager, Liste (incl. Αιτήματα), Galerie, Talk, Buch/Übergabe, login/gate.  
**Out of scope:** Kids Spiele polish (see `CURSOR_HANDOFF_SPIELE_WIDGETS.md`), Zo-Ai action semantics.  
**Baseline:** Design system [`design/VISUAL_MOTION_SYSTEM.md`](../../design/VISUAL_MOTION_SYSTEM.md); staff handoffs [`CURSOR_HANDOFF_STAFF_SCREENS.md`](CURSOR_HANDOFF_STAFF_SCREENS.md), [`CURSOR_HANDOFF_PC_MOBILE_GLASS.md`](CURSOR_HANDOFF_PC_MOBILE_GLASS.md).  
**Recent context:** Easy/Pro (`body.mode-easy` / `mode-pro`), Lager pantry walk, Plan week tables, Liste Αιτήματα, auth v140.  
**Audited build cues:** cache `?v=142`, CSS layers in `index.html` + final `ui-v110.css`.  
**Method:** static code/CSS audit (no browser pass). Severity = user harm × how often staff hit it.

---

## Executive summary

Staff UI is a **stack of competing presentation eras** (pre-token cards → design-system glass → PC rail → Mobile Glass 2026 → v109 flat reset → `ui-v110.css` dark heroes). Many “fixes” win with `!important`, so small changes regress other breakpoints.

Highest-leverage work for fix agents:

1. **Reconcile one staff chrome contract** (header + dock + rail) and stop re-styling it three times.  
2. **Kill leftover dark gradient heroes** on Home (mobile), Talk, Liste — they fight the light ops-hero / pantry language.  
3. **Fix light-header control contrast** (Easy/Pro in chrome, `topbtn.danger` / `.ok`).  
4. **Keep pantry / week tables / Αιτήματα** — they are directionally right; polish density and tokens only.

---

## Severity key

| Sev | Meaning |
|-----|---------|
| **P0** | Broken / unusable chrome, illegible text, missing primary nav on a supported layout |
| **P1** | Clear design-system violation or contrast/density failure on a daily staff path |
| **P2** | Leftover 2010s / prototype aesthetic; polish or motion debt |
| **P3** | Cleanup / docs / i18n / icon debt — ship when touching the area |

---

## P0 — Fix first

### P0.1 CSS cascade war: three+ staff chrome stacks

**Symptom:** Header/dock look different depending on which layer “wins”; agents add more `!important` and break desktop or mobile.

**Where:**

| Layer | File | Notes |
|-------|------|--------|
| Legacy shell | `index.html` ~L100–450 | Dark header tokens, early `.topbtn` light-on-dark |
| Design system v2 | `index.html` ~L2960–3250 | Sea-deep header, inverted dock (`--chrome`) |
| Mobile Glass / PC rail | `index.html` ~L4178–4633 | Light frosted header; desktop 220px rail |
| v109 / v109.1 flat reset | `index.html` ~L4635–4880 | Mobile solid white header/dock; kills glass |
| Final paint | `ui-v110.css` (linked last `?v=142`) | Re-implements desktop rail + dark page heroes |

**Acceptance:**

- [ ] Document **one** staff chrome matrix in this folder (or extend `CURSOR_HANDOFF_PC_MOBILE_GLASS.md`): mobile header, mobile dock, desktop rail, tablet (≥900).  
- [ ] New staff chrome rules land in **one** place (`ui-v110.css` *or* a single named block in `index.html`), not both.  
- [ ] No new `!important` on `header.app-chrome` / `nav.dock` without deleting the superseded rule.  
- [ ] Desktop ≥900px: left rail visible, labeled nav, Zo-Ai in rail (`#dockZoAi`), floating FAB hidden.  
- [ ] Mobile &lt;900px: five primary tabs + Mehr; Galerie/Talk/Buch reachable via Mehr (or documented exception for Kids).

### P0.2 Easy/Pro toggle contrast in light header

**Symptom:** Toggle styles assume a **dark** `header.app-chrome` (`color:#d7e6e8`, active `color:#fff`) but staff header is light (Glass 2026 / v109 white). Inactive Easy/Pro can be near-invisible in the top bar.

**Where:** `index.html` ~L5051–5062 (`.ui-mode-btn` / `header.app-chrome .ui-mode-btn`). Toggle also appears in-page on Lager/Liste heroes (`viewStock` / `viewShop` in `app.js`).

**Acceptance:**

- [ ] On light header, inactive = `var(--muted)` / ink; active = pine wash + `var(--ink)` (or solid pine + white).  
- [ ] Contrast ≥ 4.5:1 for label/icon at 11px.  
- [ ] Dark-header rules removed or scoped only if a dark chrome variant still exists (it should not for staff).  
- [ ] Easy mode still hides `.pro-only` / `.mode-pro-block`; Pro restores them (smoke: Plan calendar seg, Liste Αιτήματα filters, Talk video).

### P0.3 Mobile Home hero still dark “dashboard” band

**Symptom:** Mobile Home (`viewHome` branch `max-width:899px`) uses `.home-start-hero` with `#1b382e`, white Fraunces, decorative gold rings — contradicts v109 flat stone canvas and design-system light mast.

**Where:** `app.js` `viewHome` ~L15021+; `ui-v110.css` ~L304–358.

**Acceptance:**

- [ ] Mobile Home first viewport: stone/ink mast (or transparent over page gradient), **not** full-bleed near-black card.  
- [ ] Brand / greeting use display type + sea kicker per §1–§2; no decorative orb/ring pseudo-elements.  
- [ ] Shift-start card + signal strip remain usable; Easy/Pro row readable on the hero surface.

---

## P1 — Daily staff paths

### P1.1 Liste / Talk dark overview heroes (2010s SaaS)

**Symptom:** Design-system block strips dark gradients from `.talk-hero` / `.shop-hero`, but **live markup** uses `.shop-overview` / `.talk-overview`, which `ui-v110.css` paints as dark teal/amber gradient cards with 8–9px meta text.

**Where:**

- `app.js` `viewShop` ~L9072 (`shop-overview`), `viewTalk` ~L4827 (`talk-overview`)  
- `ui-v110.css` ~L3689–3721 (Talk), ~L4158–4187 (Liste)  
- Contrast: design intent in `index.html` ~L3772–3789 (light heroes)

**Acceptance:**

- [ ] Talk + Liste heroes match Lager pantry / ops-hero: ink on glass/stone, sea kicker, Fraunces title.  
- [ ] Stat chips: body-sm / caption (≥11–12px), not 7–8px grey-on-dark.  
- [ ] No amber/gold glow as primary hero treatment (amber ≤~3% accent only).

### P1.2 PIN reset / mail gate still dark island card

**Symptom:** Main gate flattened to light stone (v109.1); forgot-PIN / reset path keeps `.gate-mail-hero` teal gradient + dark fields (`index.html` ~L2369–2380; `ui-v110.css` ~L712–714). Auth v140 hardened logic, not this chrome.

**Where:** `app.js` `renderGate*` reset branch ~L17369; styles above.

**Acceptance:**

- [ ] Reset / forgot-PIN screens match light gate: ink on stone, solid white inputs, pine primary CTA.  
- [ ] Error/success status colors meet 4.5:1 on the light canvas.  
- [ ] No leftover `rgba(15,61,76,…)` active states on forgot link.

### P1.3 `topbtn.danger` / `.ok` same-hue text on fill

**Symptom:** `.topbtn.danger{ background:var(--out); color:var(--out) }` and `.topbtn.ok{ background:var(--in); color:var(--pine-tint) }` — label/icon can disappear or fail contrast when those modifiers are used.

**Where:** `index.html` ~L377–379. Confirm call sites that add `.danger` / `.ok` on header chips.

**Acceptance:**

- [ ] Filled danger/ok use `#fff` (or `--stone-50`) on brand fills.  
- [ ] Ghost/outline variants keep semantic border + ink/muted text.  
- [ ] Smoke under light header after P0.1.

### P1.4 Mobile hit targets under 44px

**Symptom:** v109 mobile forces `.topbtn` to **40×40** (`index.html` ~L4730). Design system / Glass handoff require ≥44×44.

**Acceptance:**

- [ ] Staff header tools ≥44×44 on phone.  
- [ ] Dock labels remain legible (current 10px on crowded 6-slot dock is P2 if Kids stays in primary row).

### P1.5 Plan day-chip spring overshoot

**Symptom:** `.plan-day-chip.day` uses `cubic-bezier(.34,1.4,.64,1)` and `scale(1.06)` on `.on` — explicit design-system “no overshoot” violation (`VISUAL_MOTION_SYSTEM.md` §5; settle = `.2,.8,.2,1`).

**Where:** `index.html` ~L712–727. Reduced-motion partially covered ~L937.

**Acceptance:**

- [ ] Transitions use `--ease-settle` / `--m-base` only; no bounce in the bezier.  
- [ ] Selected day: hairline / pine fill, optional ≤2px translate — no scale &gt;1.02.  
- [ ] `prefers-reduced-motion: reduce` disables chip transform.

### P1.6 Opaque white “card” default vs glass elevation

**Symptom:** Hundreds of `background:#fff` list/panel rules (Plan entries, Talk topics, Book panels, stock categories, shop items). Design system §4: Glass-1 tiles over stone, not paper cards — except inputs.

**Where:** Widespread in `index.html` early blocks; v109.1 forces more `#fff` on mobile Home.

**Acceptance (incremental OK):**

- [ ] When editing a staff screen, migrate its primary surfaces to `var(--glass)` / `var(--glass-strong)` + `var(--line)`.  
- [ ] Keep `#fff` for inputs and in-store decision UI if needed for glare.  
- [ ] Do not invent a third surface language in `ui-v110.css`.

### P1.7 Tablet band (768–899) = stretched phone chrome

**Symptom:** `layout-desktop` only at ≥900px (`app.js` `syncLayoutMode`). iPad portrait gets mobile dock + mobile Home dark hero, not PC rail.

**Where:** Documented debt in `index.html` ~L3792–3797; still true.

**Acceptance:**

- [ ] Either: promote rail earlier (e.g. 768+) **or** document “phone chrome until 900” and tune dock density for 768–899 (no floating 700px-wide pill).  
- [ ] Verify Mehr sheet + Kids primary slot don’t clip labels at 768.

---

## P2 — Leftover 2010s / polish

### P2.1 Duplicate desktop sidebar rules

`index.html` ~L4489–4633 and `ui-v110.css` ~L1541–1680 both define `body.layout-desktop:not(.mode-child)` rail. Drift risk (padding, brand mark, Zo-Ai).

**Acceptance:** One source of truth; the other deleted or reduced to comments pointing to it.

### P2.2 Mobile dock: design-system inverted chrome vs flat white underline

v109.1 sets white dock + inset underline active (`index.html` ~L4871–4877). Design system §4 reserved near-black only for inverted dock.

**Acceptance:** Product call — either (A) restore inverted glass dock on mobile, or (B) amend design-system note “staff mobile dock is flat white work-tool chrome.” Fix agents must not mix both.

### P2.3 Typography: Outfit forced onto display titles

Examples: mobile Home brand `font: … var(--font-ui)!important` (`index.html` ~L4841–4843); Talk/Liste overview titles `font: 750 … var(--font-ui)` in `ui-v110.css`. Design system: Fraunces for display.

**Acceptance:** Page H1 / hero titles use `var(--font-display)`; UI chrome stays Outfit.

### P2.4 Pure black shadows / emoji chrome leftovers

- `.plan-hero-cta` still has `box-shadow: … rgba(0,0,0,.18)!important` in early Plan CSS (~L703) even though later light hero overrides background.  
- Zo-Ai panel title still `✨ Zo-Ai` (`index.html` ~L5202).  
- Tutorial / help strings still emoji-led (`app.js` tutorial steps) — content OK; chrome should stay `ui(...)`.

**Acceptance:** Shadows tinted with ink (`rgba(26,40,34,…)`); Zo-Ai title uses sparkle SVG; no new emoji as nav/chrome.

### P2.5 Book / Galerie density

Book chips `border-radius:999px`, solid `#fff` panels (`index.html` ~L196–206). Galerie early dark `.gal-hero` overridden later — verify lightbox + compose bar don’t regress to dark card.

**Acceptance:** Book panes use glass-1; chips use `radius-pill` token but pine/sea selected states; Galerie hero matches light ops treatment in both Easy and Pro.

### P2.6 Plan week / shift matrix density vs Easy/Pro

Hooks exist (`index.html` ~L844–852; `app.js` week/shift renderers). Pro mobile can force desktop matrix (`body.mode-pro.layout-mobile .week-matrix-desktop`).

**Acceptance:**

- [ ] Easy: day stack / large cells (≥72px), no calendar seg clutter.  
- [ ] Pro: compact matrix OK; horizontal scroll indicated; sticky person column doesn’t cover actions.  
- [ ] Fullscreen matrix still hides header/dock intentionally; escape path visible.

### P2.7 Liste Αιτήματα panel

Recent feature (`req-*` in `index.html` ~L2864–2895; `viewShop` requests panel). Solid white rows, pill statuses — functional.

**Acceptance:**

- [ ] Easy: large Accept/Reject (≥44px); filters in Pro only (already `.pro-only`).  
- [ ] Open count on tab matches `openListRequestCount`.  
- [ ] Empty state uses shared empty-state pattern (no emoji blob).

### P2.8 Lager pantry walk

Directionally aligned (stone glass hero, tide meter, jars in `ui-v110.css` ~L2895+; `viewStock` ~L7257+).

**Acceptance:**

- [ ] Jar meters visible in single-house mode; multi-house tiles don’t clip jars.  
- [ ] Tide fill uses brand/sea, not neon.  
- [ ] Easy hides bulk/`•••` more menu; ± steppers stay ≥44px (`v141` polish — don’t regress).

---

## P3 — Cleanup / docs

| ID | Issue | Hint |
|----|--------|------|
| P3.1 | Staff handoff anchors outdated (`viewHome` ~11570 etc.) | Update `CURSOR_HANDOFF_STAFF_SCREENS.md` after next staff CSS PR |
| P3.2 | `#chatModeSeg{display:none!important}` dead chrome | Remove when Talk ownership is clear |
| P3.3 | Early `.tile{background:#fff}` vs later glass tiles | Prefer tokens when consolidating |
| P3.4 | Gate landmark aside vs flat mobile gate | Confirm desktop gate landmark still intentional in `ui-v110.css` |
| P3.5 | Auth lockout copy (v140) vs gate visual | Logic OK; only chrome in P1.2 |

---

## Per-screen checklist (for fix agents)

Use as a PR smoke list. Widths: **390 / 768 / 1280**. Modes: **Easy + Pro**. Lang: **DE + EL**.

### Login / gate

- [ ] Profile pick + PIN + Face ID entry readable on light canvas  
- [ ] Forgot-PIN / email reset matches light gate (P1.2)  
- [ ] Build banner (`gate-build`) visible, not dark-on-dark  
- [ ] Lockout / wrong-PIN messages honest (v140) — no chrome regression  

### Home

- [ ] Desktop: mast + signals + shift card + rail (notifs / kids / Schichtende)  
- [ ] Mobile: no dark full-bleed hero (P0.3); journal duty / shift CTAs work  
- [ ] Easy hides “Mehr” admin clutter; Pro shows it  

### Plan

- [ ] Day agenda + week stack/matrix + shift roster  
- [ ] No bounce on day chips (P1.5)  
- [ ] Adaptive chrome: sheet on mobile, expanded on desktop  

### Lager

- [ ] Pantry hero + tide + jars  
- [ ] House selector, search, ±, quick-add  
- [ ] Desktop: command rail sticky; mobile: no overlapping docks  

### Liste

- [ ] Plan / Take / Αιτήματα panels  
- [ ] Light overview hero (P1.1)  
- [ ] Friday picker doesn’t collide with tools (known fix ~L3759–L3768 — don’t regress)  
- [ ] In-store flow fullscreen OK  

### Galerie

- [ ] Light hero; refresh/Pro-only drive line  
- [ ] Lightbox hides dock; close reachable  

### Talk

- [ ] Light overview (P1.1); topics + chat  
- [ ] Mobile pane switch Chat / Agenda  
- [ ] Desktop two-column; video control Pro-only  

### Buch / Übergabe

- [ ] Journal write path from Home  
- [ ] Panes (journal / log / people); Pro-only panes stay hidden in Easy  
- [ ] `.tide-line` title readable (clip-path text has reduced-motion fallback)  

### Chrome / nav

- [ ] Desktop rail always present for staff (P0.1)  
- [ ] Mobile: Home, Plan, Lager, Liste, Kids?, Mehr — Talk/Galerie/Buch via Mehr  
- [ ] Easy/Pro contrast in header (P0.2)  
- [ ] Zo-Ai: FAB mobile (or Mehr only if v109 intentional); rail button desktop  

---

## Suggested fix order (agents)

1. **P0.2** Easy/Pro header contrast (small, safe).  
2. **P1.3** `topbtn.danger` / `.ok` colors.  
3. **P0.3 + P1.1** Align Home / Talk / Liste heroes to light ops language (mostly `ui-v110.css`).  
4. **P1.2** Gate reset chrome.  
5. **P0.1** Collapse chrome stacks (larger; needs product call on flat vs inverted dock — P2.2).  
6. **P1.5 / P1.4 / P1.6** motion, targets, glass migration as you touch files.  

**Cache bump** when shipping client CSS/HTML/JS: `build.json`, `gate.js` `APP_BUILD`, `app.js` SW register, `sw.js` CACHE, `index.html` `?v=`, `CHANGELOG.md` — see `CLAUDE.md`.

---

## What looks healthy (do not “fix”)

- Lager pantry tide + jar meters (v138–v141 direction).  
- Easy/Pro body class contract + `.pro-only` / `.mode-pro-block` wiring.  
- Plan week/shift **real tables** restore (`ef6e281`).  
- Liste Αιτήματα accept/reject into Friday list (`0da7d67`).  
- Auth lockouts / honest email reset behavior (v140) — separate from visual P1.2.  
- Stroke `ui(...)` / `#uiSprite` for dock icons (keep replacing emoji chrome only where still leftover).  

---

## References

| Doc | Role |
|-----|------|
| [`design/VISUAL_MOTION_SYSTEM.md`](../../design/VISUAL_MOTION_SYSTEM.md) | Tokens, glass, three motions, anti-clichés |
| [`CURSOR_HANDOFF_STAFF_SCREENS.md`](CURSOR_HANDOFF_STAFF_SCREENS.md) | Staff view anchors (verify line numbers) |
| [`CURSOR_HANDOFF_PC_MOBILE_GLASS.md`](CURSOR_HANDOFF_PC_MOBILE_GLASS.md) | Desktop rail + Mobile Glass 2026 |
| [`AGENTS.md`](../../AGENTS.md) | Maps entry; never paste full `app.js` |

---

*Report only — no product code changes in the commit that adds this file.*
