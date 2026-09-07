# Scroll / front-object collision audit — v228

**Surfaces:** iPhone WebKit `/m` · Desk Chromium `/desk`  
**Harness:** `scripts/qa-scroll-overlap.mjs`  
**Artifacts:** `.qa-screens/v228-scroll-iphone/` · `.qa-screens/v228-scroll-pc/` (local; not committed)

| Surface | Pages | Scroll shots | Raw hits | Dominant real classes |
|---------|------:|-------------:|---------:|------------------------|
| iPhone | 41 | 143 | 567 | under-dock, fixed-collide (FAB↔install), banner-stack, under-fab |
| PC | 41 | 146 | 389 | under-fab (rail kids), banner-stack |

Raw `under-chrome` / many `covered-point` counts include **expected sticky chrome** covering scrolled content — filtered below for actionable collisions.

---

## Critical — objects fighting in front

### C1 — Zo FAB vs PWA install bar (iPhone / kids)
Every kid view: fixed layers overlap ~1680px² (`zoai-fab` ∩ `.pwa-install-bar`).  
FAB sits on top of “Zum Home-Bildschirm” — two front layers, one thumb zone.

**Fix:** Raise FAB above install bar (`bottom: calc(install + dock + gap)`), or hide install while FAB focused / after dismiss.

### C2 — Primary CTAs scroll under the phone dock
Home mid-scroll: `Zum Plan`, `Buch & Schicht`, `Kinder` obscured by `nav.dock` (2–20k px²).  
Schedule bottom cards / AI clear actions also pass under dock.

**Fix:** Increase `#view` / `.app-stage` `padding-bottom` to `dock + safe-area + 12px`; ensure last content clears dock before end of scroll.

### C3 — Desk Zo FAB covers content (kids rail / book / admin)
Home desk: FAB overlaps Vincent avatar in “Kinder heute”.  
Book / admin similar — FAB paints over actionable controls.

**Fix:** Offset FAB left of rail, or shrink rail bottom padding; never cover interactive chips.

---

## High — stack / crowding that reads as collision

### H1 — Home shift checklist stacks 3 banners
`Anwesenheit` + `Lagercheck` + `Schichtbuch` all visible at once on Home (phone + desk). Not z-fight, but front-plane clutter; CTAs compete.

**Fix:** Collapse completed steps; keep one primary CTA (v227 late hero already owns late path).

### H2 — Icon×text collision in Home mobile action row
`Buch & Schicht` — document icon overlaps the letter “B” (tight `ui-fit` wrap).

**Fix:** Gap between icon and label ≥6px; allow 2-line label without icon overlap.

### H3 — Kid game tiles under Zo FAB
Games / notes / stars: Spielen CTAs and tiles sit under FAB hit area.

**Fix:** Same as C1 — FAB clearance in kid shell; content `padding-bottom` includes FAB footprint.

---

## Medium / noise to ignore in raw report

| Kind | Why noisy |
|------|-----------|
| under-chrome | Sticky header correctly covers scrolled content behind it |
| covered-point (chrome) | Same — `elementFromPoint` hits chrome over scrolled nodes |
| banner-stack mid-scroll | Same three Home steps counted at every scroll stop |

---

## Recommended fix order (next ship)

1. FAB clearance vs dock + PWA install (phone) and vs right rail (desk)  
2. Bottom content inset under dock (phone)  
3. Home action-row icon/label gap  
4. Home shift-step density (one primary)

---

## Method

```bash
node scripts/qa-scroll-overlap.mjs --surface=iphone
node scripts/qa-scroll-overlap.mjs --surface=pc
```

Each page scrolled top → ~35% → ~70% → bottom; screenshots + collision detectors for fixed-layer overlap, dock/chrome obscuring controls, FAB cover, banner stack, z-neighbors.
