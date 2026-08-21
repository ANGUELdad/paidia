# Handoff — implement the Figma design system v2 in the PWA

**For:** Cursor (or any coding agent picking this up)
**Repo:** `/Users/aggelosdadalis/paidia` — Armonia Thassos / PAIDIA
**Figma:** [Armonia Thassos — Design System v2](https://www.figma.com/design/chWjXFxyCaFzFC6438lk4N)
**Written:** 2026-08-21, against build **v78**

Read [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md) first. This
document assumes them and does not repeat them.

---

## 0. Where things stand

| Layer | State |
|---|---|
| Design system tokens, type scale, elevation, motion | **Shipped in code** (v78) |
| Figma file: Foundations, Material, Widgets, Screens, Kids, Motion | **Built** |
| Staff screens (Home, Übergabe, Plan, Lager, Liste, Galerie, Zo-Ai) | Styled by the token layer; **not restructured** to match the Figma frames |
| Kids / child mode | **Designed in Figma, not built.** This is the main job |
| Widgets (rings, streak, charts, meters, calendar) | **Designed in Figma, not built** |
| Iconography | Still emoji throughout child mode — the design system calls this a placeholder |

The CSS design system already ships. Do **not** re-derive colours, sizes, radii,
easings or durations — every one of them is a CSS custom property. Using a raw
hex or a magic pixel value is the single most common way to get this wrong.

---

## 1. Hard constraints

These are not preferences.

- **No bundler, no framework.** Static `index.html` + `app.js` + `gate.js`, plus
  Python `server.py` (local) / `api/index.py` (Vercel). Match the surrounding
  vanilla JS and template-literal style. Do not introduce React, a build step, or
  npm runtime deps.
- **Never paste whole `app.js` or `server.py` into context.** They are 13.4k and
  5k lines. Use the maps in `docs/agents/` and the anchors in §4 below.
- **Every user-facing string is bilingual.** `T` in `app.js:14` has a `de` block
  (~line 415) and an `el` block (~line 1098). A key added to one and not the
  other ships a blank label. Add both, in the same relative position.
- **Never commit** `.env`, PINs, WhatsApp tokens, or live caregiver phone numbers.
- **Small diffs.** Restyle and restructure existing render functions; don't
  rewrite modules wholesale.

---

## 2. The token layer — use these, not values

Defined in the `ARMONIA DESIGN SYSTEM v2` block at the end of the `<style>`
element in `index.html`. Full rationale in
[design/VISUAL_MOTION_SYSTEM.md](../../design/VISUAL_MOTION_SYSTEM.md).

### Colour

```
--stone-50 --bg --bg-deep --stone-300      canvas ramp (warm, never cool gray)
--ink --muted --muted-soft --meta          text ramp
--line --line-strong                       hairlines — never a solid gray border
--brand --brand-2 --pine-tint              pine: primary actions, active states
--sea --sea-deep                           eyebrows, kickers, child-mode chrome
--sun --amber-tint                         ONE accent note, ~3% of a surface
--in --out --out-tint --warn               state: success / attention / warning
--glass --glass-strong --glass-rim         translucent display surfaces
--chrome                                   the dock, and nothing else
--mark-a --mark-b                          brand mark gradient
```

Derive tints with `color-mix(in srgb, var(--brand) 10%, transparent)` rather than
adding new hexes.

### Space, radius, type, motion

```
--space-1…20         4 8 12 16 20 24 32 40 48 64 80   (no off-scale numbers)
--radius-sm/-/-lg/-dock/-pill    12 / 18 / 20 / 24 / 999
--t-display-xl…-micro            Fraunces display + numerals, Outfit UI
--m-fast/-base/-slow/-reveal     120 / 220 / 380 / 480ms
--m-stagger-sm/-md               60 / 80ms
--ease-settle --ease-tide        the only two easings
```

Rule: paddings step in 4s below 16px and in 8s above. A component's internal
padding is one step smaller than the gap between components.

### Elevation

Four levels only. Glass 1 = tiles/panels/rows. Glass 2 = sheets/modals, reserved
for the single topmost floating layer. Chrome = the dock. Shadows are always
tinted with ink at low opacity, never black, never over 40px blur.

### Motion

Three named motions, already implemented as CSS: **tide-line reveal** (hero
entrance, once per navigation), **pine settle** (press feedback — 120ms in, 220ms
back, no overshoot), **handover ribbon** (time-ordered lists, 80ms stagger capped
at five steps). All collapse under `prefers-reduced-motion`. Don't add a fourth.

### No dark mode

Deliberate, documented in §6 of the design doc. Do not add a theme toggle. If a
night-shift surface ever needs addressing, the answer is a warmer, slightly
deeper stone — not an inversion.

---

## 3. The job

### Phase 1 — Kids as a student app (the priority)

The Figma **Kids** page has five 390×844 frames. Child mode currently renders as
a tab strip of emoji-labelled views; the design reframes it as a student
dashboard. **The XP economy already exists in code** — this is largely
restructuring and restyling, not new business logic.

| Figma frame | Build as | Notes |
|---|---|---|
| `Kids — Start` | Rework `renderChild()` today-view | Level ring, today's lesson strip with completion ticks, dark "Als Nächstes" card, four course tiles with progress |
| `Kids — Stundenplan` | **New view** | Hour rail, colour-coded blocks, terracotta now-line. Closest existing data: the week/entries view |
| `Kids — Aufgaben` | Rework chores list | Assignment cards: subject tag, due, progress, star reward. Overdue takes an `--out` border |
| `Kids — Sterne` | Rework `childRewardsView()` | Balance ring, weekly delta, 7-day streak, 8-badge grid with earned/locked, redeemable rewards priced in stars |
| `Kids — Lernen` | Restyle `childLearnView()` / `childQuizView()` | Segmented progress (one segment per question), question card, four answer states |

Child mode also gets its own dock in the design — **Start · Plan · Lernen ·
Sterne · Spiele** — replacing the `.seg.child-tabs` strip. Note `renderChild()`
currently *hides* `nav` and `bottomPanel` (`app.js:10886-10889`); a child dock
means changing that, so check nothing else depends on those being hidden in
child mode.

### Phase 2 — Widgets

The Figma **Widgets** page has ~24 primitives across four groups. Build the ones
Phase 1 needs first — progress ring, streak, level meter, segmented progress,
badge tile — then the rest as they're called for. Don't build the whole
catalogue speculatively.

The progress ring is the only one needing real thought: an SVG `<circle>` with
`stroke-dasharray`/`stroke-dashoffset` is the right approach here (no canvas, no
library). Give it `role="img"` and an `aria-label` with the actual value.

### Phase 3 — Icons

Replace emoji with a real icon set. `.nav-ico` already establishes the pattern:
inline SVG, no `fill` in the source, `fill: currentColor`, **explicit width and
height** — an unsized inline `<svg>` defaults to ~300px and swallows the
viewport (there's a comment in `index.html` about exactly this). Emoji as primary
iconography is on the design system's explicit list of things to fix.

---

## 4. Anchors

Verified against the working tree at v78. Line numbers drift — grep the function
name, don't trust the number alone.

```
app.js:14        const T = { de: {...}, el: {...} }   i18n root
app.js:415       de block (childToday, childRewards, chore*, xp* …)
app.js:1098      el block — mirror every key you add
app.js:2088      emptyState(icon, title, hint = '', ctaHtml = '')
app.js:3725      childGalleryView()
app.js:8329      childEventsView(cid)
app.js:9038      childRewardsView(kidId)     ← XP hero, chore cards
app.js:9280      childGamesLobby()
app.js:9661      childEduHubView()
app.js:9712      childLearnView()
app.js:9770      childQuizView()
app.js:10866     renderChild()               ← child shell, tabs, view switch
app.js:10921     .seg.child-tabs markup      ← the strip the dock replaces
```

### Data model already in place — reuse, don't reinvent

```
kidXp(kidId)                  total XP for a child
kidLevel(xp) / kidLevelName(lv) / XP_LEVELS
DB.chores                     chore records
choreForKid(chore, kidId)     membership test
choreDoneToday(id, kidId)     completion
chorePendingToday(id, kidId)  awaiting adult approval
chore.xp / chore.emoji / choreLabel(chore)
```

### CSS classes that already exist for these surfaces

`.rewards-hero` `.level-badge` `.xp-name` `.xp-sub` `.xp-bar-wrap` `.xp-bar`
`.xp-bar-fill` `.chore-card` `.chore-icon` `.chore-body` `.chore-title`
`.chore-meta` `.chore-xp` `.child-profile` `.child-tabs` `.empty-state`
`.empty-title` `.empty-hint`

Prefer restyling these over inventing parallel class names — the token layer
already targets several of them, and duplicate names are how a 200KB stylesheet
happens.

---

## 5. Reading the Figma file

Eight pages: Cover → Foundations → Material → `———` → Widgets → Screens → Kids →
Motion.

- **Foundations** — 74 variables. Every semantic colour variable carries WEB code
  syntax matching the shipped CSS custom property, so Dev Mode shows
  `var(--brand)`, not a hex. Read the variable name, use the CSS var.
- **Material** — texture plates and the four-step hero recipe.
  **These are placeholders.** They are procedural material washes, not
  photographs, and the page says so. Real Thassos photography has to be shot
  before launch; shipping a hero on a placeholder plate is a review failure.
  Until then, hero bands keep the stone gradient.
- **Motion** — durations and easings are a closed set. Anything outside it is a
  bug, not a choice.

The Figma frames are **design frames, not a component library** — no
`COMPONENT` sets, no variants. Treat them as the visual target, not as an
importable API.

---

## 6. Ship checklist

Every client-visible change:

1. Bump `build.json` (`version`, `label`, `changed.de`, `changed.el`)
2. Bump `APP_BUILD` in `gate.js` to match — it's the first-paint fallback for the
   login version banner, so a stale value shows a release-behind version
3. Bump the `?v=` cache busters: `gate.js` (`app.js?v=`), `index.html`
   (`gate.js?v=`), the SW register in `app.js` (`sw.js?v=`)
4. Bump `CACHE` in `sw.js` to `paidia-vNN`
5. Add a `CHANGELOG.md` entry
6. If you touched CSS, regenerate the style guide:
   `python3 scripts/build-style-guide.py`

`build.json` is served by both handlers (allowlisted, exact match) — the login
screen fetches it at runtime.

---

## 7. Guardrails

**Don't:**

- Hardcode a colour, radius, duration or easing. Every one is a token.
- Use the CSS `font` shorthand — it silently resets `font-size` and has already
  broken the ≥900px desktop density step once.
- Add a fourth named motion, a dark theme, or a spring/overshoot animation.
- Use amber as a second primary. It's one bowl of lemons on a whitewashed table.
- Add a rule at `.foo` when the shipped stylesheet has `.bar .foo` — yours loses
  silently, and a lost override is indistinguishable from one never written.
  Match the specificity or scope it properly.
- Weaken the static-file allowlists in `server.py` / `api/index.py`. They are
  deliberately exact-match with no directory fallthrough, so source, `.env` and
  the SQLite file are never served.
- Let Zo-Ai mutate data without a confirm. It changes **app data only**, via
  confirmable `paidia-action` JSON, never source, PINs or secrets — and schedule
  changes additionally require the PIN.

**Do:**

- Keep counts, times and prices on `font-variant-numeric: tabular-nums` so a
  value ticking 9 → 10 doesn't nudge the row beside it.
- Keep inputs fully opaque. Glass is for display, never for anything a caregiver
  types a stock count into under time pressure.
- Clear 48px tap targets and give every interactive element a visible
  `:focus-visible` ring.
- Overlay by nesting, not by coordinates — inside a flex/auto-layout container
  the parent owns child position.

---

## 8. Verifying

```bash
cp .env.example .env   # set GROQ_API_KEY
python3 server.py      # http://localhost:5173
```

Do **not** open `index.html` over `file://` — AI routes need the server.

The app sits behind a PIN gate, so in-app screens can't be checked without
logging in. Two things that work without it:

- `design/system-preview.html` — a living style guide built from the shipped
  stylesheet by `scripts/build-style-guide.py`. Regenerate after any CSS change
  and check the primitives there.
- The login gate itself is real UI and renders unauthenticated.

For child-mode work you'll need a child profile login. Check visually at 390px
first — this is a mobile-first product used one-handed in bright island light,
and desktop is the secondary case.

---

## 9. Open items not to silently close

- Real photography for the hero treatment (§8 of the design doc) — unshot.
- Figma Smart Animate prototypes for the three motions — documented as timings,
  not prototyped.
- A publishable Figma component library with variants — the tokens exist for it,
  the components don't.
- Staff screens are token-styled but not restructured to the Figma frames.

If you finish Phase 1 and something above is still open, say so explicitly
rather than reporting the work as complete.
