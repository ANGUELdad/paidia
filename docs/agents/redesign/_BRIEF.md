# Redesign brief — shared context for every page/device agent

Read this first, then do only the page or device you were assigned.

## The product

**Armonia Thassos / PAIDIA** — a bilingual (DE/EL) childcare-operations PWA for a
family-run care home on Thassos. Two audiences in one codebase:

- **Staff** (`mode-pro` / `mode-easy`): carers and admins running a shift — plan,
  stock, shopping list, handover book, kid records, pocket money, talk, gallery.
- **Kids** (`mode-child`): a child's own view of their day, games, self-rating,
  pocket money, notes, bonus, learning, stars.

Also a Zo-Ai in-app assistant, an "Easy / Pro" density toggle, and a spotlight
tour. It is deployed as a PWA; phone is the primary surface for staff on shift.

## Stack — read before proposing anything

Vanilla JS, **no bundler, no framework**. Static frontend + Python API.

| Area | Files |
|---|---|
| UI + client DB | `index.html` (huge `<style>` block + SVG sprite), `app.js` (~27k lines), `gate.js` (login) |
| Shells | `index.html` (auto), `mobile/index.html` (`body.shell-m`), `desk/index.html` (`body.shell-desk` / `layout-desktop`), `school/index.html` |
| CSS layers, in cascade order | `ui-v110.css` → `ui-v213.css` → `shared/workspace.css` → `mobile/mobile.css` or `desk/desk.css` → `ui-v244.css` → `ui-v245.css` |
| API | `server.py` (local), `api/index.py` (Vercel), `db.py` |

**Views are built by string templates in `app.js`** (`viewHome()`, `viewSchedule()`,
`viewStock()`, `viewShop()`, `renderChild()`, …) and injected into `#view`. There
are no components. A "redesign" here means changing template strings and CSS, not
introducing a framework.

## Token-cheap orientation (do this, don't grep blindly)

1. `knowledge/AGENT_START.md`, `docs/agents/map.json` — keyword → files + snippet
2. `design/VISUAL_MOTION_SYSTEM.md` — **the design authority**
3. `.cursor/skills/apple-design/SKILL.md` + `references/hig/{layout,typography,accessibility,color}.md`
4. `ui-v244.css` and `ui-v245.css` — the two most recent correctness layers.
   **Read both.** Do not re-propose anything already fixed there.
5. `docs/agents/UI_AUDIT_V244.md`, `docs/agents/UI_AUDIT_V245.md` — what was already
   found and fixed, and why

To locate the markup behind something you see in a screenshot, grep `app.js` for the
**German string** in the screenshot, then read a narrow range (±80 lines).
**Never paste large chunks of `app.js` or `index.html` into your output.**

## Design system, in one paragraph

Brand is Armonia: deep pine green (`--brand` ≈ `#2a6b52`), gold accent
(`--gold` ≈ `#e3b23c`), warm off-white surfaces, soft cards with generous radii,
Outfit for display + body. Explicitly **anti-cliché**: no teal/cyan neon, no
emoji-as-iconography, no purple SaaS gradients. Icons are the 24-viewBox
`u-*` stroke set (`stroke-width:1.7`), used via `ui('u-name','sm')`.
The bottom dock is the one place the UI goes dark, because it is chrome.

## The two surfaces

- **PC**: 1440×900. `body.layout-desktop` / `body.shell-desk`. 220px left sidebar
  with the nav rail, content column ~1220px, root font-size drops to 14px.
- **Phone**: 393×852 (iPhone 15 Pro). `body.shell-m` / `body.layout-mobile`.
  Fixed app header, fixed bottom dock (5 destinations + "Mehr" overflow),
  ~10px page gutter, 44pt touch floor.

## State of play (v245, the screenshots you were given)

The last two passes fixed *measurable* defects: WCAG contrast, 44pt tap floors,
clipped labels, overlapping controls, grid orphans, chrome that covered content,
and pages that were entirely chrome above the fold. The measured audit is now at
3 P1 + 1 P2, all PC, all sub-pixel-scale.

**So do not hand back another correctness audit.** The remaining problem is not
"this label is 3px too small". It is that these pages were grown feature by
feature and never designed: unclear hierarchy, no consistent page grammar, weak
empty states, actions that don't communicate their relative weight, and
information that is present but not *readable as an answer to a question*.

That is what you are being asked to fix.

## What to deliver

Write **one markdown file** at the path you were given. Write nothing else.
**Do not edit source files.** You are producing a plan, not a change.

Structure it exactly like this:

### 1. What this page is for
Two or three sentences: the job the user hires this page to do, and the question
they arrive with. Infer it from the markup and the data, and say so if the page
currently answers a different question than the one it should.

### 2. Read of the current design
What the page actually communicates today, in priority order as the eye receives
it. Be specific and cite the screenshot (PC and phone separately where they
differ). Call out:
- the hierarchy the layout implies vs. the hierarchy the task needs
- density: what earns its space, what doesn't
- empty and low-data states (most of these screenshots are near-empty fixtures —
  judge how the page behaves at *realistic* data volume too, and say which is
  the more common case)
- anything that is a deliberate, good decision — say so, and leave it alone

### 3. Three plans
Give **three genuinely different plans**, not one plan at three sizes:

- **Plan A — Tighten.** CSS-only or near. Ships in one pass, no behaviour change,
  low risk. What it buys and what it leaves unsolved.
- **Plan B — Restructure.** Re-orders or re-groups the page; template changes in
  `app.js`. The plan you would actually recommend if you had a week.
- **Plan C — Rethink.** Question the page's premise. Merge it with another page,
  split it, make it task-first instead of data-first, change what the default
  view is. Say what would have to be true for this to be worth it.

For each plan give: **the idea in one line**, the concrete changes (real selectors
from the CSS layers, real function names and line ranges from `app.js`), what it
costs (effort, risk, what could regress), and what the user gains. Include an
ASCII wireframe of the resulting layout for each plan — phone first, then PC if
it differs structurally.

### 4. Recommendation
Pick one. Say why, and say what you would do first — the single highest-value
change on this page, sized so it could ship today.

### 5. Open questions for the owner
Anything that is a product decision rather than a design one: what data actually
matters here, what the real usage volume is, which of two workflows is primary.
Do not guess at these — list them.

## Rules

- Selectors and function names must be **real**. Verify by grepping. A plan built
  on an invented selector is worse than no plan.
- Respect the brand. "Better UI" does not mean "looks like a generic dashboard".
- Phone is the primary surface for staff on shift. Weight your thinking that way.
- Kids' views are used by children roughly 6–14 in Easy mode. Reading level,
  target size and forgiveness matter more than density there.
- Be concrete and terse. No filler, no restating the brief back.
