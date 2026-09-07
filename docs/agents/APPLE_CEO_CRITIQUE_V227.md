# CEO / OCD UI Critique — v227 full sweep

**Verdict:** Ship is functional (0 click errors across **1,974** taps) but **not yet presentation-grade**. Mobile still fails an Apple-taste bar on chrome hit targets, horizontal-rail peeks, and conflict-sheet hygiene. Desktop is calmer; empty hero pulse slots and oversize tip tiles remain.

**Artifacts**
| Surface | Pages | Clicks | PNGs | Notes |
|---------|------:|-------:|-----:|-------|
| iPhone WebKit `/m` | 43 | 870 | 90 | `.qa-screens/v227-ceo-iphone/` |
| Desk Chromium `/desk` | 43 | 1104 | 86 | `.qa-screens/v227-ceo-pc/` |
| iOS Simulator Safari | 4 | — | 4 | `.qa-screens/v227-ceo-ios-sim/` |

Harness: `scripts/qa-ceo-ocd-sweep.mjs` · Live gate confirmed **V227**.

---

## Executive scorecard (strict)

| Lens | iPhone | Desk | Notes |
|------|--------|------|-------|
| Layout / overflow | **C** | **B+** | Horizontal chip rails “overflow” without fade peek; desk clean |
| Tap targets (≥44) | **D** | B | Chrome bell / DE·ΕΛ / avatar consistently &lt;44 |
| Typography / readability | B− | B | Dense pocket/stock copy; many 10–11px labels |
| Button width / centering | B | B− | Primary CTAs OK; Easy/Kids tip tiles 160–168px tall (desk) |
| Visual calm / hierarchy | B− | **C+** | Desk Home empty pulse outlines scream unfinished |
| Professional polish | **C+** | B | Conflict sheet + bilingual mismatch under concurrency |
| Functional integrity | **A** | **A** | No broken handlers in sweep |

**Would I demo this to a funder on iPhone today?** Only after chrome targets + conflict sheet + empty pulse cleanup.

---

## Critical (fix before next public demo)

### C1 — Conflict / sync sheet hijacks the UI mid-task
Seen on Stock, Talk, Pocket, Kids, Admin Review (and many `*-after.png` shots). Sheet copy: *Daten geändert / Έλεγχος αλλαγών* with **Δοκίμασε ξανά**.

- Overlaps dock (`sheet-covers-dock` on `admin-review`).
- On **Kids (DE UI)** the toast rendered in **Greek** while chrome showed `DE` — language lock broken for that surface.
- Partially reveals underlying CTAs (`Ich bin da`) behind the modal → looks broken, not “calm”.

**Fix:** Single-flight conflict UI; always match `paidia.lang`; never cover dock; queue behind open sheets; don’t interrupt click sweeps with auto-open (debounce).

### C2 — Chrome controls under 44×44 (iPhone)
Measured repeatedly: bell (+badge), language pill `DE`/`ΕΛ`, profile avatar `A` → **tap-small**. HIG mobile minimum is 44pt. Staff use these every session.

**Fix:** Expand hit slop to ≥44 without growing visual chrome (padding / invisible hit area). Keep badge contrast (v227 red) but don’t shrink the bell hit box.

### C3 — Desk Home empty pulse ghosts
Hero shows two empty outlined rectangles when pulse has nothing to say. Looks like missing assets / unfinished Figma, not “calm”.

**Fix:** If pulse count is 0, **omit the pulse grid entirely** (or one subtle “Alles ruhig” line). Never render empty cells.

---

## High (polish that screams amateur if left)

### H1 — Horizontal rails without affordance
Auditor flags off-screen chips as `clip-overflow` (false-positive for intentional scroll, true-positive for UX):

- Stock / Liste house chips: `Valeria+Lea`, `Alle Häuser` clipped
- Kids tabs: `Material`, `Verlauf`, `Stundenplan`, `Fächer` clipped mid-word
- Pocket kid cards scroll off without fade mask

**Fix:** Leading/trailing fade masks + optional peek of next chip (prior M3). Never cut a label mid-glyph without scroll cue.

### H2 — Dual “A” avatars in top chrome
Left brand mark + right profile both read as “A” circles. OCD fail: two identical identity signals compete.

**Fix:** Left stays brand mark; right uses photo / distinct treatment / initials only when unique.

### H3 — Gate changelog truncation
iOS Simulator live + local gate: `V227` note truncates mid-sentence (`weniger…`). Looks unfinished.

**Fix:** 2-line clamp or shorter DE/EL blurb in `build.json`.

### H4 — Kids Zo auto-presence on Today
`kid-m-kid-today.png` captured with Zo sheet open (“Hallo Simon…”) and welcome banner behind. After v227 “close Zo on nav”, **entry still feels sticky** on first paint / tip path.

**Fix:** Confirm `zoaiTipNotifySession` fully skipped; don’t auto-open chat on kid boot; welcome banner and Zo must not stack.

### H5 — Desk Easy / Kids tip tiles are giant CTAs
`tap-giant` ~161–168px on Tutorial / So geht’s / numbered tiles. Fine as **cards**, wrong if styled as buttons. Visually dominate secondary surfaces.

**Fix:** Cap tip-card height or demote to non-button containers with inner 44pt CTA.

---

## Medium (OCD backlog)

| ID | Issue | Where |
|----|-------|-------|
| M1 | Presence + stock banners stack (“Schicht melden” + “Lagercheck”) — two greens fighting | Desk Stock |
| M2 | Pocket summary denser than Apple list density; large `0,60 €` fights balance hero | Pocket |
| M3 | Kids action row `bearbeiten` / `entfernen` equal weight — destructive should be demoted | Kids |
| M4 | Serif greeting vs sans everywhere — brand OK, but Talk hero serif + Home serif need one rule | Talk / Home |
| M5 | `center-skew` heuristic noise (497 on desk) — ignore; real issue is icon+label buttons | harness |
| M6 | Admin sidebar lists Momente/Kids/Pocket as primaries while phone docks them under Mehr — IA drift | Desk vs phone |
| M7 | “Translation Available” Safari banner on live gate — not our bug, but pollutes first impression | iOS Sim live |

---

## What already looks professional (keep)

- Live + local gate **V227** banner present; Personal / Kinder cards aligned; brand header strong.
- Phone dock: 5 primaries, secondary under Mehr — correct after v226/v227.
- Desk Stock: clear hierarchy, consistent green CTAs, no horizontal page overflow.
- Bell badge solid red + white (v227) — readable.
- **Zero functional click failures** across admin / staff / kid roles on both surfaces.

---

## Ordered fix list for next ship (v228)

1. Conflict sheet: lang-locked, dock-safe, non-reentrant  
2. Chrome hit targets ≥44 (bell / lang / avatar)  
3. Hide empty desk Home pulse cells  
4. Horizontal rail fade + peek (Stock houses, Kids tabs, Pocket kids)  
5. Gate changelog 2-line / shorter copy  
6. Kids: no Zo auto-open on Today; don’t stack with welcome  
7. Demote Kids “entfernen”; calm Easy tip tile height on desk  

---

## Method notes

- [iPhone CEO QA](ec40d18b-8486-4b12-ad91-b35734b04bb9) stalled; parent took over and ran `qa-ceo-ocd-sweep.mjs` in-process.
- Concurrent iPhone+PC writes earlier caused duplicate processes — cleaned; final runs are authoritative.
- Some `clip-overflow` counts include off-screen scroll peers (expected); treat as affordance debt, not CSS bugs.
- Conflict sheets inflated mid-sweep because two roles mutated shared local data — still a real multi-device UX failure mode.
