# Armonia Thassos — Visual & Motion System

**Status:** proposal, v1 — for Figma build-out and later CSS implementation
**Scope:** color roles, type scale, spacing, elevation (glass), 3 motions, dark-mode policy, moodboards
**Non-goals:** no code in this doc. Existing tokens in `design/armonia.tokens.json` and `apps/web/src/app/globals.css` are the current baseline — this proposal extends them, it does not replace the brand hex values that already ship.

---

## 0. Premise: what makes this Thassos, not "wellness app #4127"

Thassos is a real, specific place: white marble quarries above a wine-dark sea, pitch-pine forest running down to the shore, whitewashed courtyards, terracotta roof tile, dry-stone retaining walls, olive silver-green in the wind, ferry-dock blue hour. Armonia is a *care operation* — shift handovers, stock counts, medication windows, a child's afternoon schedule — run by tired humans on phones in bright island light, not a lifestyle brand.

Two rules follow from that:

1. **Photography and texture do real work.** Every hero surface should feel like it could be a photo taken on the island this morning — stone, pine bark, sea haze, olive leaf, laundry-line linen — even when we render it as a tint or a duotone wash, not a literal photo. Abstract color-blob gradients are allowed only as a *quiet* backdrop behind real material texture, never as the entire visual.
2. **Calm, not decorative.** Nothing animates for delight alone. Every motion either (a) orients the user in a list/timeline, (b) confirms an action was received, or (c) reveals content the way daylight/tide reveals things on the island. See §5.

### AI-design clichés this system explicitly avoids
Call these out in Figma review — if a frame has one of these, it's wrong:
- Purple→blue (or teal→magenta) abstract gradient as the *only* background element
- Glowing/neon accent lines, particle sparkles, floating 3D blobs or glass orbs
- Glassmorphism used decoratively with no real surface/hierarchy reason
- Generic rounded-pill-everything + Inter/SF Pro + drop-shadow-on-everything look
- Neumorphism (soft inset/outset shadows on flat color)
- Stock-photo diverse-people-high-fiving imagery, or generic "healthcare app" iconography (stethoscopes, abstract heart-pulse lines)
- Dark mode as a default/toggle — see §4
- Confetti/celebration bursts, bouncy spring overshoot on every tap
- Emoji used as primary iconography (current legacy build leans on this as a placeholder — replace with a proper icon set at implementation time)

---

## 1. Color roles

Base palette keeps the shipped hexes (`design/armonia.tokens.json`) and organizes them into **semantic roles** so Figma styles map 1:1 to CSS custom properties later. "Stone" replaces the idea of a neutral gray scale — it's warm, quarried, never cool gray.

| Role | Token name | Value | Use |
|---|---|---|---|
| Canvas | `color/stone/50` | `#f3f5f2` | Page background top-of-gradient, lightest quarried marble |
| Canvas deep | `color/stone/100` | `#e9ece8` | Existing `--bg`. Default page surface |
| Canvas shade | `color/stone/200` | `#d4dbd5` | Existing `--bg-deep`. Gradient floor, section dividers |
| Canvas ridge | `color/stone/300` | `#c3ccc4` | *New.* Pressed/inset states, skeleton loaders |
| Ink | `color/ink/900` | `#1a2822` | Primary text, icon fill |
| Ink muted | `color/ink/700` | `#455851` | Existing `--muted`. Secondary text, labels |
| Ink soft | `color/ink/500` | `#4a6a74` | Existing `--muted-soft`. Tertiary text on light glass |
| Ink meta | `color/ink/400` | `#6b8a94` | Existing `--meta`. Timestamps, helper text |
| Hairline | `color/line/12` | `rgba(26,40,34,.12)` | All borders. Never solid gray borders |
| Hairline strong | `color/line/20` | `rgba(26,40,34,.20)` | *New.* Focus-adjacent borders, table rules |
| Pine (brand) | `color/pine/600` | `#2a6b52` | Existing `--brand`. Primary actions, active states, links |
| Pine light | `color/pine/500` | `#3d8a6a` | Existing `--brand-2`. Hover, secondary emphasis, success fills |
| Pine wash | `color/pine/tint` | `rgba(42,107,82,.10)` | Selected chip/tile fill, subtle section tint |
| Sea (secondary) | `color/sea/600` | `#2f5a63` | Eyebrows, section kickers, informational accents, child-mode chrome |
| Sea deep | `color/sea/800` | `#1a3a42` | *New.* Chrome/nav backgrounds needing more contrast than pine |
| Amber (accent) | `color/amber/600` | `#c48a1a` | Existing `--sun`. Warm highlight, "today" markers, warmth accent — **use sparingly**, it's the one hot note in an otherwise cool-green/blue-gray world |
| Amber wash | `color/amber/tint` | `rgba(196,138,26,.10)` | Warning-adjacent tiles, golden-hour hero overlays |
| Success | `color/state/in` | `#2a6b52` | Confirmed / checked-in / stock OK (same as pine — success *is* the brand color here, not a separate green) |
| Attention | `color/state/out` | `#c2410c` | Terracotta — overdue, checked-out, low stock. *New role naming*, same hex as `--out` |
| Warning | `color/state/warn` | `#a16207` | Caution banners, expiring items |
| Chrome (dark UI) | `color/chrome/900` | `rgba(26,40,34,.90)` | Bottom dock, tour overlay scrim — the *only* place near-black appears |
| Glass surface | `color/glass/64` | `rgba(255,255,255,.64)` | Existing `--glass`. Default glass tile/panel |
| Glass surface strong | `color/glass/86` | `rgba(255,255,255,.86)` | Existing `--glass-strong`. Modals, tour cards, inputs-on-glass |
| Glass rim | `color/glass/rim` | `rgba(255,255,255,.55)` | *New.* 1px inner highlight on glass edges (see §3) |
| Mark A | `color/mark/a` | `#9bc4b0` | Avatar/mark gradient start, decorative pine sprig motif |
| Mark B | `color/mark/b` | `#7a9eaa` | Avatar/mark gradient end, decorative sea motif |

**Ratio guidance for Figma page structure:** ~55% stone canvas, ~25% ink/text, ~12% pine, ~5% sea, ~3% amber. Amber is a single accent note (think one bowl of lemons on a whitewashed table), never a second primary.

---

## 2. Type scale

Two families, doing distinct jobs — never blend them mid-sentence:
- **Fraunces** (`--font-display`) — display/editorial, all headings, big numbers, the wordmark. Weight 600–800, optical size lets it get a little quirky/serif-warm at large sizes (this is where "real place" personality lives — Fraunces has soul, don't flatten it with heavy letter-spacing).
- **Outfit** (`--font-ui`) — everything else: body, labels, buttons, nav, data tables. Weight 400–700, geometric, calm, high legibility on glass.

Mobile-first scale, base 16px, roughly 1.25 ratio with `clamp()` for hero sizes so it holds up from a 360px phone to a tablet. `rem` values assume 16px root.

| Token | Family / weight | Size (mobile → clamp) | Line-height | Letter-spacing | Use |
|---|---|---|---|---|---|
| `type/display-xl` | Fraunces 700 | `clamp(2rem, 6vw, 2.75rem)` (32–44px) | 1.08 | −0.02em | Hero page title (e.g. "Übergabe", gate wordmark) |
| `type/display-lg` | Fraunces 700 | `clamp(1.75rem, 4vw, 2.1rem)` (28–34px) | 1.12 | −0.02em | Section/page H1 (existing `.shell-title`) |
| `type/display-md` | Fraunces 600 | `1.375rem` (22px) | 1.2 | −0.01em | Card/module titles, day headers in Plan |
| `type/display-sm` | Fraunces 600 | `1.125rem` (18px) | 1.25 | 0 | Tile headline (stat number label pairs) |
| `type/body-lg` | Outfit 500 | `1.05rem` (16.8px) | 1.5 | 0 | Lead paragraph under hero (existing `.handover-lead`) |
| `type/body` | Outfit 400 | `1rem` (16px) | 1.5 | 0 | Default body text, list rows |
| `type/body-sm` | Outfit 400 | `0.9rem` (14.4px) | 1.45 | 0 | Secondary/meta text (existing `.muted`) |
| `type/label` | Outfit 600 | `0.85rem` (13.6px) | 1.3 | 0 | Form labels, tab labels |
| `type/caption` | Outfit 600 | `0.8125rem` (13px) | 1.35 | 0 | Chips, badges |
| `type/eyebrow` | Outfit 700 | `0.6875rem` (11px) | 1.3 | +0.14em, uppercase | Section kickers, existing `.eyebrow` |
| `type/micro` | Outfit 600 | `0.625rem` (10px) | 1.2 | +0.02em | Dock labels, timestamps in dense tables |
| `type/numeral` | Fraunces 700 | `1.75rem` (28px) | 1 | −0.01em | Stat tile big numbers (existing `.tile b`) — Fraunces numerals have real character, don't swap to a tabular sans here |

Figma setup: create these as **Text Styles** named exactly as the token path (`type/display-lg`, etc.) so a future "Figma → CSS" export maps cleanly to `font-size`/`line-height`/`letter-spacing` custom properties.

---

## 3. Spacing (4 / 8 base)

Single scale, everything else derives from it. No off-scale magic numbers in Figma (no 15px, no 22px paddings).

| Token | Value | Typical use |
|---|---|---|
| `space/1` | 4px | icon-to-label gap, tight chip padding |
| `space/2` | 8px | row gaps, tile gaps (existing `--gap`) |
| `space/3` | 12px | tile/panel internal padding (small), form field gaps |
| `space/4` | 16px | page inline margin (existing `--page-x`), card padding, standard stack gap |
| `space/5` | 20px | hero padding, tour card padding |
| `space/6` | 24px | section-to-section rhythm, top safe-area minimum |
| `space/8` | 32px | major section break, empty-state padding |
| `space/10` | 40px | rare: hero top clearance on tablet |
| `space/12` | 48px | min tap-target height baseline (buttons already at 48px) |
| `space/16` | 64px | dock height allowance / bottom clearance region |
| `space/20` | 80px | scroll-clearance above dock (existing 7rem page padding ≈ `space/20` + safe-area) |

Rule: **paddings step in 4s below 16px, in 8s above it.** Component internal padding is one step smaller than the gap between components (e.g. tile padding `space/3`–`space/4`, gap between tiles `space/2`).

---

## 4. Elevation: glass, not cards

Default posture: **surfaces are translucent layers of light over the stone gradient, not opaque cards with drop shadows.** A "card" implies paper on a desk; this product should feel like looking through clean glass at the island itself — the gradient/texture behind should always be faintly perceptible through primary surfaces.

Three glass levels + one hard exception:

| Level | Token | Composition | Use |
|---|---|---|---|
| Glass 0 — Ambient | *(no surface)* | just the page gradient/texture | Page background, hero zones |
| Glass 1 — Tile | `elevation/glass-1` | `background: color/glass/64`, `border: 1px solid color/line/12`, `backdrop-filter: blur(10px)`, radius `radius/md` (18px) | Default tiles, panels, chips, list rows (existing `.card/.panel/.tile`) |
| Glass 2 — Raised | `elevation/glass-2` | `background: color/glass/86`, `border: 1px solid color/line/12`, top inner highlight `1px color/glass/rim`, `backdrop-filter: blur(16px)`, soft **tinted** shadow `0 18px 40px rgba(26,40,34,.14)`, radius 20px | Modals, tour/onboarding cards, action sheets — things genuinely floating above content |
| Chrome — Inverted | `elevation/chrome` | `background: color/chrome/900`, `backdrop-filter: blur(12px)`, radius `radius/dock` (24px, top corners only) | Bottom nav dock only. The one place we go dark, because it's chrome/hardware, not content |

**Shadow rule:** never use pure black shadows. Shadows are always tinted with `color/ink/900` at low opacity (`rgba(26,40,34,.12–.18)`) — this keeps elevation feeling like soft daylight falloff on stone, not a UI-kit default. No shadow should exceed 40px blur; this isn't a floating-card SaaS aesthetic.

**When opacity goes to 100%:** form inputs (`#fff` solid, per existing CSS) and the phone/device-lab chrome frame. Inputs need max legibility for data entry (medication times, stock counts) — glass is for *display* surfaces, not for anything the caregiver is typing numbers into under time pressure.

**Hierarchy without shadows:** prefer border-hairline + fill-opacity steps over shadow depth to separate layers. Reserve Glass-2's shadow for the single topmost floating layer on screen at a time.

---

## 5. Three intentional motions

Named, purposeful, and each tied to something the island/product actually does. Durations use a restrained set: `motion/fast` 120ms, `motion/base` 220ms, `motion/slow` 380ms, `motion/reveal` 480ms. Easing: `motion/ease-settle` `cubic-bezier(.2,.8,.2,1)` (decisive, no overshoot), `motion/ease-tide` `cubic-bezier(.65,0,.35,1)` (slow-start, confident finish, like water receding).

### 1. Tide-line reveal — page/section entrance
What: on first paint of a hero or major section, content is masked by a soft horizontal edge (like a tide line on sand) that recedes from bottom to top, revealing the hero title, then the lead line, then the first row of content, each ~60ms behind the last (stagger `space`-scaled: 0, 60, 120ms). Not a fade, not a slide-up-and-bounce — a *reveal*, using `motion/ease-tide` over `motion/reveal` (480ms) for the mask, with content itself only shifting 8px (`space/2`) as it clears the line.
Where: hero blocks only (gate screen, home "Guten Tag" mast, Übergabe hero) — once per navigation, never re-triggered on scroll (no scroll-jacking, no repeated reveal-on-scroll gimmick).
Why not a cliché: this isn't a generic fade/slide-up — it has a literal referent (the tide line) that ties motion to place, and it's used exactly once per screen so it reads as an arrival, not decoration.

### 2. Pine settle — action confirmation (press/confirm feedback)
What: on tap of a primary button, tile, or checkbox-style confirm (stock count, plan checkbox, "Confirm" in a Zo-Ai action), the element does a quick two-stage settle: scale to 0.98 over `motion/fast` (120ms, `motion/ease-settle`), then a slightly slower return to 1.0 over `motion/base` (220ms) with a 2px shadow-depth increase and release — the sensation of setting a stone down firmly, not a bouncy spring. Existing `.btn:active{transform:scale(.98)}` is the seed of this; extend it with the settle-back and a subtle shadow pulse using the tinted shadow from §4.
Where: every primary confirm action app-wide (buttons, chips toggling on, plan/stock checkmarks). This is the highest-frequency motion in the whole system, so it must be the most restrained — under 350ms total, no color flash, no overshoot.
Why not a cliché: explicitly *not* a spring-with-overshoot (the default in most component libraries and a dead giveaway of unconsidered motion). "Settle" reads as trustworthy for care-ops — the app should feel like it takes the action seriously, not celebrate it.

### 3. Handover ribbon — sequential/timeline reveal
What: for any ordered list that represents a sequence over time (shift handover ribbon, plan-day blocks, Talk/Zo-Ai message stream, kids' "today" timeline), items draw in top-to-bottom with the connecting rail line (existing `.ribbon-line`) growing from 0 to full height in sync with each item's fade+8px-rise (`motion/base`, `motion/ease-settle`), staggered 80ms apart, capped at 5 visible stagger steps (remaining items appear instantly to avoid a long wait on big lists). The dot (`.ribbon-dot`) pulses once (scale 1→1.15→1, 300ms) as its item lands, like a checkpoint being marked.
Where: shift handover ribbon, plan-day timeline, any vertically-connected list. Not used for grid/tile layouts (those don't imply sequence).
Why not a cliché: it's driven by the existing ribbon/rail visual metaphor already in the codebase (a literal thread connecting handover events) rather than a generic "stagger children" list animation — the motion reinforces that these are causally/temporally linked events, which is the actual point of a shift handover.

**Motion tokens summary for Figma (use Smart Animate + these as named easing curves/durations):**

| Token | Value |
|---|---|
| `motion/fast` | 120ms |
| `motion/base` | 220ms |
| `motion/slow` | 380ms |
| `motion/reveal` | 480ms |
| `motion/stagger-sm` | 60ms step |
| `motion/stagger-md` | 80ms step |
| `motion/ease-settle` | cubic-bezier(.2,.8,.2,1) |
| `motion/ease-tide` | cubic-bezier(.65,0,.35,1) |

Global rule: nothing animates for more than 500ms, nothing loops indefinitely except the two functional exceptions (a spinner on network wait, and the tour progress bar fill), and every motion above must be disableable via `prefers-reduced-motion` (swap to instant opacity-only cross-fade at `motion/fast`).

---

## 6. Dark mode: avoid it, deliberately

**No dark theme.** Stay in light stone across the entire product, including the Talk/chat surface and any late-shift ("Nachtdienst") screens. Rationale, stated plainly for the record (and for anyone who later asks "shouldn't we add dark mode"):

1. **It's not what the place looks like.** Thassos care-home interiors are whitewashed stone, tile floors, daylight through shutters — dark-mode UI has no referent here and would read as generic-app rather than Armonia.
2. **Users are on their feet in bright rooms/outdoor light**, often handing a phone to a colleague or a child — a dark UI has worse readability in direct island daylight and worse hand-off legibility than a light one.
3. **Dark mode is the single most common "default expectation" cliché in modern app design** — deliberately not doing it is itself a brand decision worth stating, not an oversight.

If a genuinely dim environment ever needs addressing (e.g. a night-shift screen at 3am), do **not** invert to near-black. Instead define a narrow **"Dusk" state**: same stone family, just shift `color/stone/100` → a warmer, slightly deeper stone (`#ddd8cc`-range, amber-tinted rather than blue-tinted) and drop overall surface brightness ~8–10%, keeping ink-on-light contrast intact. This is out of scope for v1 — flag it as a future variant, not a toggle to build now.

---

## 7. Full token table (Figma variables / CSS custom properties)

Columns: Figma variable path → suggested CSS custom property → value → notes. Existing = already in `design/armonia.tokens.json` / `globals.css`; New = proposed addition.

### Color

| Figma variable | CSS property | Value | Status |
|---|---|---|---|
| `color/stone/50` | `--stone-50` | `#f3f5f2` | New (gradient top, currently inline) |
| `color/stone/100` | `--bg` | `#e9ece8` | Existing |
| `color/stone/200` | `--bg-deep` | `#d4dbd5` | Existing |
| `color/stone/300` | `--stone-300` | `#c3ccc4` | New |
| `color/ink/900` | `--ink` | `#1a2822` | Existing |
| `color/ink/700` | `--muted` | `#455851` | Existing |
| `color/ink/500` | `--muted-soft` | `#4a6a74` | Existing |
| `color/ink/400` | `--meta` | `#6b8a94` | Existing |
| `color/line/12` | `--line` | `rgba(26,40,34,.12)` | Existing |
| `color/line/20` | `--line-strong` | `rgba(26,40,34,.20)` | New |
| `color/pine/600` | `--brand` | `#2a6b52` | Existing |
| `color/pine/500` | `--brand-2` | `#3d8a6a` | Existing |
| `color/pine/tint` | `--pine-tint` | `rgba(42,107,82,.10)` | New (formalizes ad-hoc `.chip.on`/`.bubble` fills) |
| `color/sea/600` | `--sea` | `#2f5a63` | Existing |
| `color/sea/800` | `--sea-deep` | `#1a3a42` | New |
| `color/amber/600` | `--sun` | `#c48a1a` | Existing |
| `color/amber/tint` | `--amber-tint` | `rgba(196,138,26,.10)` | New |
| `color/state/in` | `--in` | `#2a6b52` | Existing |
| `color/state/out` | `--out` | `#c2410c` | Existing |
| `color/state/warn` | `--warn` | `#a16207` | Existing |
| `color/chrome/900` | `--chrome` | `rgba(26,40,34,.90)` | Existing (was `.78`, tightened for dock legibility) |
| `color/glass/64` | `--glass` | `rgba(255,255,255,.64)` | Existing |
| `color/glass/86` | `--glass-strong` | `rgba(255,255,255,.86)` | Existing |
| `color/glass/rim` | `--glass-rim` | `rgba(255,255,255,.55)` | New |
| `color/mark/a` | `--mark-a` | `#9bc4b0` | Existing |
| `color/mark/b` | `--mark-b` | `#7a9eaa` | Existing |

### Typography

| Figma text style | Font / weight | Size | Line-height | Tracking |
|---|---|---|---|---|
| `type/display-xl` | Fraunces 700 | 32–44px (clamp) | 1.08 | −0.02em |
| `type/display-lg` | Fraunces 700 | 28–34px (clamp) | 1.12 | −0.02em |
| `type/display-md` | Fraunces 600 | 22px | 1.2 | −0.01em |
| `type/display-sm` | Fraunces 600 | 18px | 1.25 | 0 |
| `type/numeral` | Fraunces 700 | 28px | 1.0 | −0.01em |
| `type/body-lg` | Outfit 500 | 16.8px | 1.5 | 0 |
| `type/body` | Outfit 400 | 16px | 1.5 | 0 |
| `type/body-sm` | Outfit 400 | 14.4px | 1.45 | 0 |
| `type/label` | Outfit 600 | 13.6px | 1.3 | 0 |
| `type/caption` | Outfit 600 | 13px | 1.35 | 0 |
| `type/eyebrow` | Outfit 700 | 11px | 1.3 | +0.14em (upper) |
| `type/micro` | Outfit 600 | 10px | 1.2 | +0.02em |

### Spacing

| Token | Value |
|---|---|
| `space/1` | 4px |
| `space/2` | 8px |
| `space/3` | 12px |
| `space/4` | 16px |
| `space/5` | 20px |
| `space/6` | 24px |
| `space/8` | 32px |
| `space/10` | 40px |
| `space/12` | 48px |
| `space/16` | 64px |
| `space/20` | 80px |

### Radius

| Figma variable | CSS property | Value | Status |
|---|---|---|---|
| `radius/sm` | `--radius-sm` | 12px | Existing |
| `radius/md` | `--radius` | 18px | Existing |
| `radius/lg` | `--radius-lg` | 20px | New (Glass-2 surfaces) |
| `radius/dock` | `--radius-dock` | 24px | Existing |
| `radius/pill` | `--radius-pill` | 999px | New (chips/badges — used sparingly, not "everything is a pill") |

### Elevation

| Token | Composition |
|---|---|
| `elevation/glass-1` | `--glass`, 1px `--line` border, blur 10px, `radius/md` |
| `elevation/glass-2` | `--glass-strong`, 1px `--line` border + 1px `--glass-rim` inner highlight, blur 16px, shadow `0 18px 40px rgba(26,40,34,.14)`, `radius/lg` |
| `elevation/chrome` | `--chrome`, blur 12px, `radius/dock` (top corners only) |

### Motion

| Token | Value |
|---|---|
| `motion/fast` | 120ms |
| `motion/base` | 220ms |
| `motion/slow` | 380ms |
| `motion/reveal` | 480ms |
| `motion/stagger-sm` | 60ms |
| `motion/stagger-md` | 80ms |
| `motion/ease-settle` | cubic-bezier(.2,.8,.2,1) |
| `motion/ease-tide` | cubic-bezier(.65,0,.35,1) |

### Fonts

| Token | Value |
|---|---|
| `font/display` | Fraunces (var, opsz 9–144, wght 600/700/800) |
| `font/ui` | Outfit (wght 400/500/600/700) |

---

## 8. Three hero moodboards (text spec for Figma)

Each moodboard = one Figma page, 1600×1000 frame, dark charcoal (`#0a1e24`, matching the existing `design/armonia-board.html` review-canvas convention) canvas holding: a large photographic/textural reference collage on the left ~55%, and a UI application panel (one real screen mock at 390×844 or a hero crop) on the right ~45%. Label each with the eyebrow style (`type/eyebrow`, sea color, on dark canvas use `#9bc4b0`).

### Moodboard 01 — "Morning Dock" (primary hero direction, used for Gate/Login + Home)
**Photographic references to source/shoot:** a Thassos fishing-village quay at early morning — wet stone steps, moored blue-and-white boats, pine-covered hillside behind, soft low-angle sun giving long warm highlights on whitewashed walls, one string of drying laundry or fishing net for texture-of-life (not staged). Secondary crop: close-up of pine bark or a dry-stone wall corner, desaturated toward `color/pine/600`/`color/sea/600`.
**Color treatment:** duotone wash over the photo using `color/sea/800` → `color/pine/600` at ~35% opacity multiply, so the photo reads through but the app's palette dominates; the one warm break is a small amber highlight where direct sun hits stone (ties to `color/amber/600`).
**Type pairing sample on board:** "Armonia" in `type/display-xl` Fraunces over the photo (white, subtle `color/ink/900` text-shadow at 20% for legibility on light sky), "Guten Tag, Aggelos" in `type/body-lg` Outfit beneath.
**Texture note:** add a very fine grain/noise overlay (2–3% opacity) across the whole board — this single detail is what separates "real place" from "stock gradient," call it out explicitly to the Figma team as a required layer, not optional polish.
**UI application panel:** the Home screen hero mast (existing `.mast`) at Glass-2 elevation sitting over this photographic hero band (currently a flat gradient — this moodboard proposes the gradient band become an actual treated photo/texture at low contrast, with UI glass layered on top). Show the Tide-line reveal motion as 3 keyframe thumbnails (mask at 0%, 50%, 100%) alongside the panel.
**Where this direction lands in-product:** Gate/login background, Home hero mast, Übergabe (handover) hero band, PWA splash/App Store screenshots.

### Moodboard 02 — "Pine Ridge Interior" (secondary hero direction, used for Plan/Kids/Talk)
**Photographic references:** looking out from a shaded pine-forest interior toward a bright sea gap — deep green-black pine trunks in foreground shadow, a bright wedge of turquoise-blue sea and pale sky in the middle distance, dappled light on needle-covered ground. Secondary crop: a child's-eye detail — pine cone, olive branch, a woven basket — grounding the Kids surface without becoming twee/illustrated.
**Color treatment:** this is where `color/sea/600`/`color/sea/800` leads instead of pine — the "bright gap" becomes the accent zone where UI content sits (i.e., content areas are placed compositionally where the photo is brightest, dark pine framing stays at the edges as passive texture). Amber appears only as a single warm accent chip (e.g., "Heute" badge) never as a wash.
**Type pairing sample on board:** day-of-week numeral in `type/numeral` Fraunces sitting inside the bright sea-gap area, `type/eyebrow` "DIENSTAG · TAG" above it in `color/sea/600`.
**Texture note:** same fine-grain overlay; additionally suggest a subtle vertical vignette (dark pine top/bottom, bright center band) so UI text always lands on the brightest, calmest part of the image — a compositional rule, not just decoration.
**UI application panel:** Plan-day screen with week chips (existing `.chip`) and time blocks (existing `.block`) shown at Glass-1 elevation over a cropped/blurred version of this photo as page background (very low opacity, ~8–12%, mostly behind the topmost hero band only — lower content stays on plain stone canvas per §4's "glass over gradient, not glass over photo everywhere" rule). Show the Handover ribbon motion as a 4-step stagger diagram next to it.
**Where this direction lands in-product:** Plan/PlanWeek hero, Kids mode top band (softened further, more sea+pine, less amber), Talk/Zo-Ai header.

### Moodboard 03 — "Marble Courtyard, Golden Hour" (accent/celebratory-but-restrained direction, used sparingly — empty states, completion states, onboarding tour)
**Photographic references:** a whitewashed courtyard with a marble-chip or terrazzo-style ground (real Thassos marble is a distinctive material — lean into it), potted olive tree casting a long late-afternoon shadow, terracotta pot, one wooden chair — quiet, human-scaled, slightly warm light. This is the closest the system gets to "golden hour" but grounded in an actual courtyard, not an abstract sunset gradient.
**Color treatment:** this is the one place `color/amber/600` gets real presence — warm light wash at ~20% over the stone/marble tones, but the marble whites stay dominant (this board should read as 70% warm-white stone, 20% pine-green shadow, 10% amber light, never the reverse).
**Type pairing sample on board:** a short affirming line ("Alles erledigt für heute.") in `type/display-md` Fraunces, centered, generous surrounding whitespace (`space/8`+ margins) — this board is about restraint and space, the opposite of a celebratory confetti moment.
**Texture note:** grain overlay slightly stronger here (~4%) since it's meant to feel almost like a printed photograph tucked into the app, reinforcing "this is a real place," not a generated illustration.
**UI application panel:** an empty-state or "shift complete" card at Glass-2 elevation, small and centered rather than full-bleed, with a single Pine-settle button ("Zurück zur Übersicht") shown mid-press in the settle motion (two keyframes: 0.98 scale / 1.0 scale + shadow pulse).
**Where this direction lands in-product:** empty states (no tasks today, stock list empty), onboarding/tour completion screen, PWA install success moment. Used deliberately rarely — if this palette starts appearing on every screen, that's a sign it's being used decoratively rather than for the specific "quiet completion" moments it's meant for.

---

## 9. Figma file setup checklist (for whoever builds this)

1. Create Variables collections: `Color`, `Radius`, `Spacing`, `Elevation` (as effect styles), matching §7 exactly by name so a future token-export script can round-trip to `design/armonia.tokens.json`.
2. Create Text Styles for every row in §2/§7 typography table.
3. Build the 3 moodboard pages (§8) first — they set the photographic/texture direction the rest of the file should visually agree with.
4. Reuse existing frame names from `design/armonia.platform.tokens.json` (`Login`, `Home`, `PlanWeek`, `Stock`, `Talk`, `Kids`) plus add `Handover` (already shipped in code, needs a Figma frame) so design and code stay mapped 1:1.
5. Prototype the 3 motions (§5) as Smart Animate transitions between frame variants using the named easing/duration tokens, so engineering can read durations directly off the prototype rather than guessing.
6. Flag any frame using a plain abstract gradient with no texture/photo layer for revision — per §0, that's the one hard rule this whole system exists to enforce.
