# Handoff — Spiele hub, widget catalogue, icon pass

Continues [CURSOR_HANDOFF.md](CURSOR_HANDOFF.md). That doc's Phase 1 (Kids) is
**shipped**; this one covers what is still Figma-only. Read the Guardrails
section before writing anything — this codebase has no bundler and a few sharp
edges that will silently revert your work.

Current shipped build: **v98**. Database: Supabase Postgres, `durableStorage: true`.

---

## 0. What is already done — do not rebuild it

| Thing | Where | State |
|---|---|---|
| Token layer (colour/type/space/elevation/motion) | `index.html`, block `ARMONIA DESIGN SYSTEM v2` | shipped |
| Responsive tiers (5 + landscape) | `index.html`, block `RESPONSIVE — every aspect ratio` | shipped |
| Kids: Bewertungen / Bonus / Notizen | `app.js` `childBewertungenView` / `childBonusView` / `childNotizenView` | shipped |
| Kid data persistence (`kidRatings`, `kidNotes`) | `app.js` `scheduleKidPush`, `server.py` `put_kid_ops` | shipped + verified |
| Games lobby (functional, unstyled to spec) | `app.js` `childGamesLobby` (~line 9940) | **needs the redesign below** |
| 18 stroke icons | `index.html` `#uiSprite`, helper `ui(id, cls)` | sprite exists, **mostly unused** |
| `levelMeterHtml`, `segmentedProgressHtml`, `kidStarsHtml` | `app.js` ~9181, ~9432 | shipped — reuse, don't rewrite |

So: three jobs remain. **Spiele hub restyle**, **widget catalogue**, **icon pass**.

---

## 1. Figma — read this before you click the link

File: `https://www.figma.com/design/chWjXFxyCaFzFC6438lk4N`

Pages: Cover · Foundations · Material · Widgets · Screens · Kids · Motion ·
Responsive · Staff · Responsive.

**Caveat, stated plainly:** at the time of writing, the Figma MCP
(`get_metadata`) enumerated only the `Cover` page (`0:1`) for this file key. The
Cover's own index frame lists all the other pages, so they exist in the document,
but I could not confirm every frame is reachable through the MCP from a fresh
session. **Do not block on Figma.** Every spec you need is written out
below in CSS terms. Treat Figma as the picture, this document as the contract —
and if the two disagree, this document is what the shipped tokens actually are.

Cover index node ids, if you do get in: Foundations `30:98`, Material `30:101`,
Widgets `30:104`, Screens `30:107`, Kids `30:110`, Motion `30:113`.

---

## 2. Job A — Spiele hub (`childGamesLobby`)

### What exists

`app.js` ~9940. Renders `.arcade-lobby` → `.arcade-hero` + two `.arcade-grid`s of
`.arcade-tile`. Data is `CHILD_GAMES` (`app.js:8480`) — 13 games, each with
`{id, emoji, titleKey, hintKey, tint, featured, xp}`. Per-game bests come from
`readGameBest(id)` / `gameBestKey(id)`; streak from `loadGameStats(kidId)`.

### What to change

The structure is right. The **surface treatment is 2010s** — flat tinted tiles
with a big emoji. Bring it to the v2 system:

1. **Tile becomes a card, not a button-with-a-glow.** Use `glass-1` elevation.
   `--game-tint` stays, but drop it to a 6–8% wash via
   `color-mix(in oklab, var(--game-tint) 7%, var(--surface))` plus a **1px tint
   border at 22%**. Delete `.arcade-glow` — the blur-glow is the single most
   dated element on the screen.
2. **Featured row is a horizontal snap rail**, not a grid: 2 tiles visible at
   360px, 3 at 480px, full grid ≥720px. `scroll-snap-type: x mandatory`,
   `scroll-snap-align: start`, no visible scrollbar. This is the "university
   app" read the user asked for.
3. **Progress is a widget, not a `<small>`.** Replace the `prog` string with:
   - `learn` → `levelMeterHtml(pct)` (XP against next level)
   - `simon` → `segmentedProgressHtml(best, 10)`
   - `react` → sparkline of the last 8 attempts (Job B, `sparklineHtml`)
   - everything else → a **ring** (Job B, `ringHtml`) showing best vs personal max
   Keep the numeric label as the ring's centre text. Never show an empty widget:
   if `!best`, render nothing where the widget would go and let the tile shrink.
4. **Emoji → icons.** `g.emoji` is decorative and inconsistent at small sizes.
   Add an `icon:` field to each `CHILD_GAMES` row mapping to a `u-*` symbol
   (`u-book`, `u-sparkle`, `u-party`, `u-clock`, …). Keep `emoji` as the
   fallback for the four games with no sensible stroke icon — see Job C.
5. **XP chip.** `⭐${g.xp}` becomes a proper chip: `ui('u-sparkle')` + the number,
   `--amber` tint, `border-radius: var(--r-pill)`.
6. **Streak.** Currently a sentence fragment in the hero. Promote to a chip on
   the hero's right edge with `ui('u-party')`, only when `stats.streak > 1`.

### Motion

Tiles enter with **pine settle** (already tokenised). Stagger by 40ms, cap the
stagger at 6 tiles so the last row never feels late. Respect
`prefers-reduced-motion` — the system already has the guard, use it, don't
reinvent it.

---

## 3. Job B — widget catalogue

Four helpers to add, next to `levelMeterHtml` (`app.js` ~9181). Same shape as the
existing ones: **pure functions returning HTML strings**, no DOM, no state, no
classes. That is the house style; match it exactly.

```js
function ringHtml(pct, label = '', tone = '')       // conic ring, centre label
function sparklineHtml(values, tone = '')           // inline SVG polyline, no axes
function statTileHtml(value, label, icon, trend)    // number + caption + u-* icon
function miniCalendarHtml(dates, activeIso)         // 7-cell week strip
```

Rules that matter:

- **`aria-hidden` on decoration, `role="img"` + `aria-label` on data.**
  `levelMeterHtml` is decorative (there is always a text label beside it) so it is
  `aria-hidden`. `segmentedProgressHtml` carries the label. Follow that logic —
  a ring that is the *only* carrier of a number must be labelled.
- **No canvas, no chart library.** Inline SVG only. `sparklineHtml` gets a
  `viewBox` and `preserveAspectRatio="none"`; stroke width must be set in
  absolute px via `vector-effect: non-scaling-stroke` or it distorts.
- **Colour comes from tokens.** `tone` selects among `--pine`, `--sea`, `--amber`,
  never a literal hex. The `CHILD_GAMES.tint` hexes are legacy data; wash them,
  don't extend the pattern.
- **Empty state is `''`.** Every helper returns an empty string for empty input.
  Callers concatenate directly, so a placeholder would render a ghost box.

Where to use them beyond the games hub — staff side, same session if budget
allows: `statTileHtml` on the staff home summary row, `miniCalendarHtml` in the
Plan hero, `sparklineHtml` in Lager for stock trend.

---

## 4. Job C — icon pass

`#uiSprite` in `index.html` has 18 symbols: `u-check u-tasks u-calendar u-book
u-camera u-cart u-sparkle u-alert u-megaphone u-person u-note u-receipt u-plus
u-clock u-leaf u-search u-chat u-party`. Helper: `ui(id, cls)` (`app.js:2201`).

Replace **UI-chrome emoji** with `ui(...)`: nav, tabs, buttons, empty states,
section headers, the games tiles.

**Do not replace content emoji.** Food categories, chore glyphs and the child
avatars are *data*, chosen by staff, and several are user-editable. Changing them
would rewrite people's records. This distinction was a deliberate decision —
keep it.

If you need a symbol that does not exist, add it to `#uiSprite` in the same
stroke style (1.5px, round caps, 24×24 viewBox, `currentColor`) rather than
reaching for a font or an inline one-off.

---

## 5. Guardrails — these have each already broken this codebase once

1. **No bundler.** Vanilla JS, no imports, no JSX, no build step. `app.js` is one
   file loaded with a `?v=` query. Match the surrounding style.
2. **All CSS lives in one `<style>` block in `index.html`.** Append a commented
   block at the end. Do not add a stylesheet, do not inline styles into `app.js`
   templates except for genuinely dynamic values (`--game-tint`, `width:${p}%`).
3. **Specificity.** A bare `.empty-title` lost to an existing
   `.empty-state .empty-title` and silently did nothing. When a rule appears not
   to apply, check specificity before assuming your selector is wrong.
4. **Never use the `font` shorthand.** It resets `font-size` on `:root` and killed
   the ≥900px density step. Longhand only.
5. **Python takes the *last* definition.** A duplicated `run_chore_verify` after a
   merge silently reverted the sanitised version. After any merge in `server.py`,
   `grep -c "def <name>"` for anything you touched.
6. **Check your JS before shipping.** `node --check app.js gate.js sw.js`. An icon
   replacement once landed inside a single-quoted string; only `node --check`
   caught it.
7. **`prefers-reduced-motion`, `-reduced-transparency`, `-contrast`** are all
   honoured today. Any new surface must honour them too.
8. **No dark mode.** Deliberate, not an oversight. The dock is the only dark
   surface in the app.

---

## 6. Cache-busting — required, and easy to get wrong

Every client change must bump **all five**, in lockstep:

1. `build.json` → `version` + `label` + `changed.de` / `changed.el`
2. `gate.js` → the `APP_BUILD` object (**same numbers**) — this is the first-paint
   fallback for the login version banner; a stale value ships a release-behind
   version number to users
3. `sw.js` → `const CACHE = 'paidia-vNN'`
4. `?v=NN` in `index.html` (2 occurrences)
5. `CHANGELOG.md` → a new top entry

Verify with `grep -rn "v=NN-1\|paidia-vNN-1" index.html gate.js sw.js app.js` —
must return nothing.

---

## 7. Verifying

```bash
cp .env.example .env    # set GROQ_API_KEY
python3 server.py       # http://localhost:5173
```

Never open `index.html` over `file://` — the AI and ops routes need the server.

- Kid surfaces need a **child session**. Use a test profile; do not use a real
  caregiver PIN.
- Check both languages. Every string goes through `t(...)`; DE **and** EL blocks
  must both be added or the EL user gets a raw key on screen.
- Test at 360, 390, 430, 768, 1024, 1280 and one landscape phone. The tiers exist;
  new surfaces have to survive them.
- Contrast: a gallery caption once shipped at 1.61:1. Check anything on a tinted
  wash — that is exactly where the games tiles now live.

---

## 8. Deploy

Vercel builds from **`upstream`** (`github.com/ANGUELdad/paidia`), **not**
`origin`. `git push origin main` is rejected — permission denied — and it is easy
to read that as "the push failed" when the real remote simply differs.

```bash
git push upstream main
```

Then confirm: `curl -s https://armonia-thassos.vercel.app/build.json` shows the
new label, and `/api/auth/health` still reports `durableStorage: true`.

Vercel builds from `pyproject.toml`, not `requirements.txt`.

---

## 9. Open items — do not silently close these

- **The Neon store is still connected** to the Vercel project at "All
  Environments", so it re-injects a dead `DATABASE_URL` on every deploy. `db.py`
  now ranks it last, so this is handled — but if you see a Neon host in a health
  check, that is why, and the fix is in `_postgres_rank`, not in the dashboard.
- **The PIN `944608` is in the session transcript** and should be rotated.
- **Emoji as content** stays. See Job C.
- **`--dock-max: 560px`** centres the dock on tablets. If a new surface fights the
  dock, adjust the surface.
