# Kid Spiele + Kid Lernen — redesign

Surfaces reviewed (v245-true harness, **Pro** mode):  
`.qa-screens/v245-true/pc-kid-games.png`, `phone-kid-games.png`,  
`pc-kid-learn.png`, `phone-kid-learn.png`.

Code anchors: `CHILD_GAMES` `app.js:16116–16135`, `childGamesLobby()`
`19872–19932`, `childGamesView()` `20349–20365`, `childOssFrameView()`
`20325–20347`, `leaveChildGame()` / `stopChildGameTimers()` /
`startChildGame()` `16709–16783`, `bindChildGames()` `20620+`,
`kidXpCalHtml()` `18991–19013`, `childLearnHubView()` `19497–19506`,
`childLearnView()` `20368–20422`, `tryGrantGameWin()` `16932–16937`,
`loadGameStats()` `16905–16907`. Strings: `gamesHint` / `game*Hint` /
`kidLearnHub*` around `app.js:921–954`. CSS: arcade tile/rail/grid
`index.html:1692–1741` (+ design-system arcade hero `5935–5946`,
mode-child heroes `4248–4294`); empty-cal hide + Easy rail stack + lobby
order `ui-v245.css:83–115`; `course-grid` / `course-tile`
`index.html:4055–4069`. Guide chrome: `kidGuideHtml()` `17234–17248`
(hidden on phone via `ui-v110.css:6315–6317`).

Known defect (owner fixing separately): Lernen hero `.eyebrow`
(“Armonia Learn”) at ~1.16:1 — noted, not re-planned below.

**Cannot verify from these screenshots:** any in-game screen
(`.game-shell`, `#gameBack`, score banners, OSS iframes). In-game
behaviour below is from code only.

---

# Kid Spiele (`childView === 'games'`)

## 1. What this page is for

A child (≈6–14) opens Spiele with one question: **which game do I play
right now?** Secondary: “did I get better / earn stars lately?”

The lobby should be a **picker** — recognise a game, tap Spielen, leave
with `#gameBack` → `leaveChildGame()`. Today the page also answers
“what is this section?” (hero + guide) and “when did I earn XP?”
(month calendar) *before* it answers the play question — especially on
PC, where the empty calendar owns the fold.

## 2. Read of the current design

### Phone (Pro) — eye order

1. App header (Simon / Spiele) + dock chrome.  
2. `.arcade-hero` — “ARMONIA / Spiele” + `gamesHint`: “Längere Runden ·
   Offline-Klassiker & Lernen · Easy = Highlights” (`app.js:921`).  
3. `.arcade-rail` — featured tiles (`featured:true` in `CHILD_GAMES`:
   2048, Schlange, 15-Puzzle, Griechisch, Wissen). Visible: 2048 with
   hint “Zahlen mergen · offline · MIT”, XP chip `6`, “Spielen”;
   Schlange peeking.  
4. `.arcade-grid.pro-only` — list rows (Breakout, Himmel-Hüpfer,
   Rechnen, Insel-Pfad, …) same tile grammar.  
5. Empty XP calendar is **suppressed** on phone when no `.cal-cell.has`
   (`ui-v245.css:90–92`); lobby flex-order puts cal *after* games when
   it does have data (`96–104`).

### PC (Pro) — eye order

1. Sidebar “Spiele” + header.  
2. `.kid-guide` “DU BIST HIER / Spiele” + “So geht’s” (PC only; phone
   hides guide).  
3. Same `.arcade-hero`.  
4. Full **September 2026** month via `kidXpCalHtml()` — fixture has
   today’s ring but no XP markers, so it is a blank grid. Empty-cal
   hide is **mobile-only**; desktop still shows it in **DOM order
   before** rail/grid (`childGamesLobby` `19929` then `19930–19931`).  
5. Game tiles below the fold — not in the capture.

### Hierarchy implied vs needed

Layout says: *explain Spiele → (PC) history calendar → pick game*.  
Task needs: *pick game → play → (optional) history*.

### Density / copy / XP

- **Hero** repeats the header title; `gamesHint` is product/meta copy
  (“Easy = Highlights”), not child language.  
- **Tiles** are icon + title + developer hint + `.arcade-xp` reward +
  “Spielen”. Children recognise 2048 / Schlange by look and name, not
  by “MIT” or “offline”.  
- **Lobby XP chips** advertise the *grant amount* from `CHILD_GAMES.xp`
  (paid on win via `tryGrantGameWin`). That turns the picker into an
  optimisation board (“play Insel-Pfad for 8, not Breakout for 5”)
  instead of “what looks fun?” Progress widgets (`gameWidget` /
  best rings) only appear after a best exists — fine when earned, noisy
  when every row also shows the static XP promise.  
- **Good (leave alone):** tinted tiles, 88px+ tap height, featured vs
  Pro rest split, Easy stacking the rail into a list (`ui-v245.css:106–115`),
  phone empty-cal hide, streak chip when `stats.streak>1`.

### Realistic data

Common case for a new/lightly-used child: empty XP log (phone hides
cal; **PC still shows blank month**), few or no bests (no widgets),
full Pro catalogue still long. Heavy player: cal fills with `+N`
labels — then history earns space *below* the picker, not above.

### In-game (code, not screenshots)

| Concern | What code does | Gap |
|---|---|---|
| Exit | `#gameBack` → `leaveChildGame()`; clears `gameId`/`game`, stops timers | Label always `gameBack` = “Alle Spiele” even if launched from Lernen |
| Pause | None | Leaving mid-round discards live state (except persisted bests / OSS `postMessage` scores) |
| Score in native games | `.game-stats` during play; `gameShareBar` + `#gameAgain` on finish | Not captured — cannot judge visual clarity |
| OSS (2048, Snake, …) | `childOssFrameView` iframe + “Open Source · lokal”; best via `onOssGameMessage` | Host chrome only; pause/score UI is inside iframe — unverified |
| Chrome back | `kidShowBackChrome` returns false while `state.gameId` set — `#gameBack` owns exit | Correct, but depends on child finding that chip |

## 3. Three plans

### Plan A — Tighten (CSS + string pass)

**Idea:** Same structure; make the *picker* win the fold and stop
talking like a README.

Concrete:

- Extend empty-cal hide to desktop:
  `body.layout-desktop.mode-child #view .arcade-lobby > .kid-tab-cal-wrap:not(:has(.cal-cell.has)) { display:none }`
  (mirror `ui-v245.css:90–92`).  
- On desktop with data, apply the same flex order as phone
  (`arcade-rail` / `arcade-grid` before `.kid-tab-cal-wrap`).  
- Shrink `.arcade-hero` further on both surfaces (reuse compact hero
  padding language from `ui-v245.css:63–80`); optionally hide
  `.arcade-hero p` on Easy.  
- Rewrite DE/EL hints in `app.js` strings: drop “MIT”, “offline”,
  “Easy = Highlights”, “PhET”; keep one short kid phrase
  (“Zahlen zusammenfügen”, “Iss und wachse”).  
- Soften lobby XP: hide `.arcade-xp` in Easy, or move reward to
  after-win only (CSS/`isEasy()` in `card()`).  
- Tile chrome: larger `.arcade-ico` (64–72), smaller `.arcade-hint`.

```
PHONE A                    PC A (~1220)
┌────────────────┐         ┌─sidebar─┬──────────────────────┐
│ [compact hero] │         │ Spiele  │ [thin hero]          │
│ 2048  Spielen →│         │         │ [tile][tile][tile]   │
│ Schlange    →  │         │         │ [tile][tile][tile]   │
│ … grid …       │         │         │ (cal only if .has)   │
│ dock           │         └─────────┴──────────────────────┘
```

**Cost:** low; string + CSS. Risk: bilingual parity.  
**Leaves unsolved:** list-vs-poster recognition; no continue; in-game
pause; PC still a tall single column of rows.

### Plan B — Restructure (recommended direction)

**Idea:** Lobby = **Continue + recognisable posters**; history demoted;
XP reward leaves the lobby.

Concrete (`childGamesLobby`, `card()`, maybe `ui-v245` / desk CSS):

1. **Continue row** from `loadGameStats().lastGameId` /
   `lastPlayedAt` (written in `startChildGame` `16719–16724`, **never
   read for UI today**) → one big “Weiter: {title}” button calling
   `startChildGame(id)`.  
2. **Poster grid:** `.arcade-tile` becomes icon-dominant (cover-ish
   tint block + title + Spielen); drop hint from lobby (keep for
   howto / in-game coach). Hide `.arcade-xp` on lobby; keep
   `tryGrantGameWin` celebration in-shell.  
3. **Featured:** Easy = 4–5 posters only; Pro = same grid, more
   cells — drop the dual rail+list grammar (or keep rail as
   “Neu / Beliebt” only if needed).  
4. **Calendar:** disclosure “Sterne-Tage” under the grid, or link to
   Sterne (`childView=rewards`) instead of embedding `kidXpCalHtml`.  
5. **PC 1220px:** `grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))`
   for posters; optional right rail for streak + last bests — desktop
   as a real arcade wall, not a phone list stretched wide.  
6. **In-game (small):** context-aware back label
   (`Alle Spiele` vs `Zurück zum Lernen` when `childView==='learn'`);
   confirm before `leaveChildGame` on timed games (`catch`, `math`,
   `colors`) if `!g.finished`.

```
PHONE B                      PC B
┌──────────────────┐         ┌────────┬─────────────────────────┐
│ Weiter: 2048  ▶  │         │ Spiele │ Weiter: 2048         ▶  │
│ ┌────┐ ┌────┐    │         │        │ ┌──┐┌──┐┌──┐┌──┐┌──┐   │
│ │2048│ │🐍  │    │         │        │ │  ││  ││  ││  ││  │   │
│ │Spiel│ │Spiel│   │         │        │ └──┘└──┘└──┘└──┘└──┘   │
│ └────┘ └────┘    │         │        │ [Sterne-Tage ▾]  streak │
│ ┌────┐ ┌────┐    │         └────────┴─────────────────────────┘
│ dock             │
```

**Cost:** medium — template + CSS + copy; small leave confirm.  
**Risk:** Easy/Pro featured flags; tour `data-tour="kid-games"`;
kids who used hints to distinguish similar icons.  
**Gains:** fold = play; recognition over reading; XP after play;
PC finally better than phone for browsing many games.

### Plan C — Rethink

**Idea:** Spiele dock opens **last game or a daily pick**, not a
catalogue. Catalogue lives under “Alle Spiele” inside the shell
(same as `#gameBack` target today, inverted).

- `setChildView('games')` → if `lastGameId` and recent
  `lastPlayedAt`, `startChildGame` immediately; else show a 3-pick
  “Heute” set.  
- Merge learning titles out of `CHILD_GAMES` featured into Lernen only
  (stop double entry for Griechisch/Wissen).  
- XP calendar never on this route — Sterne owns history.

```
PHONE/PC C (default)
┌─────────────────────┐
│  2048  (resumed)    │
│  [#gameBack Alle…]  │
│  [board / iframe]   │
└─────────────────────┘
```

**Worth it if:** kids almost always replay the same 1–2 games and the
catalogue frustrates younger users. **Not** if carers want a visible
menu of offline options, or if cold-start with no `lastGameId` is the
common case (then C needs a strong empty picker anyway → collapses to B).

## 4. Recommendation

**Plan B.** Highest value today: (1) hide empty PC calendar + reorder
cal below games (Plan A slice — ship same day), (2) rewrite lobby
hints / hide lobby `.arcade-xp`, (3) Continue from `lastGameId`.

Do **not** invest in a prettier hero before the tiles own the fold.

## 5. Open questions for the owner

- Should lobby show **reward XP** at all, or only post-win?  
- Is the XP month calendar load-bearing for carers/kids, or is Sterne
  enough?  
- Target Easy catalogue size (3 vs 5 featured)?  
- Confirm-on-exit for timed games — desired or too naggy for 6-year-olds?  
- Keep Griechisch/Wissen as featured *games* tiles when Lernen exists?

---

# Kid Lernen (`childView === 'learn'`)

## 1. What this page is for

The child arrives asking: **what should I practice next?** (one tap).
Secondary: streak / stars / which topic.

The hub should feel like a **session launcher** (“continue the lesson”),
not a course catalogue. Copy already claims “wie Duolingo”
(`gameLearnHint` `app.js:931`); Duolingo’s core is **one next action +
streak**. This page is a **2×2 card grid** with no continue and no
streak on the hub — so it currently answers “what learning products
exist?” instead of “what do I do next?”

Entry: Mehr overflow (`kidMoreNavItems` includes `learn`), not the
primary dock — so the hub must earn the tap fast.

## 2. Read of the current design

### Phone & PC — eye order

1. Header “Lernen”; phone shows **Zurück** (`kidShowBackChrome` —
   learn is a Mehr sibling). PC also shows `.kid-guide` (“DU BIST HIER /
   Lernen” + Easy hint).  
2. `.kid-header` hero: eyebrow “Armonia Learn” (**known 1.16:1 —
   owner fix**), title Lernen, `kidLearnHubHint` “Karten, Quiz und
   Rechnen — sammle Sterne.”  
3. `.course-grid` of four `.course-tile`s (`childLearnHubView`
   `19497–19506`): Griechisch, Wissen, Rechnen, Lern-Spiele — developer
   subcopy (“20 Karten · Themen · Zo-Ai · wie Duolingo”, “PhET · sicher”).  
4. PC: four tiles in one wide row, large empty stage below. Phone: 2×2.

### Hierarchy implied vs needed

Layout: *brand hero → pick a product*.  
Needed: *continue / start today’s cards → optional other modes*.

### Density / data

- Four equal tiles = no primary action.  
- No use of `lastGameId` / learn topic (`readLearnTopic`) / weak deck
  on the hub — though in-session `childLearnView` already has hearts,
  streak flame, topic select, DE↔EL, Zo-Ai (`20368–20422`).  
- Empty/new learner and daily returner see the **same** static grid.  
- **Good:** large tiles, colour bars, starting a module is one
  `data-game` → `startChildGame` via `bindChildGames`. In-lesson UX is
  closer to Duolingo than the hub is — redesign weight belongs on the
  hub + exit label, not on rebuilding the card prompt.

### In-game learn (code)

Exit `#gameBack` still says “Alle Spiele” while `childView==='learn'`
(`leaveChildGame` correctly keeps `learn`). Mid-lesson leave drops
progress (new `makeLearnGame` on next start). Finished state uses
`gameShareBar`. **Not in screenshots** — flag only.

## 3. Three plans

### Plan A — Tighten

**Idea:** Same four tiles; child copy; quieter hero; eyebrow fix
(owner) only.

- Rewrite `gameLearnHint`, `gameQuizHint`, `gameMathHint`,
  `gameEduHubHint`, `kidLearnHubHint` to kid DE/EL (no PhET, no
  Duolingo name-drop, no “Zo-Ai” in the subtitle).  
- Compact `.kid-header` like other kid heroes (`ui-v245` padding).  
- On PC, cap `.course-grid` to 2×2 centred `max-width` instead of
  four stretched columns (`index.html` desktop `repeat(4,…)` at
  `4507`).  
- Hide `.kid-guide` duplication when hero already titles Lernen (or
  shorten guide hint).

```
PHONE A                 PC A
┌──────────────┐        ┌──────┬─────────────────┐
│ [thin hero]  │        │ Mehr │ [thin hero]     │
│ [GR] [Wissen]│        │      │ [GR] [Wissen]   │
│ [Re] [PhET]  │        │      │ [Re] [Lernspiele]│
│ dock         │        └──────┴─────────────────┘
```

**Cost:** very low. **Leaves unsolved:** no continue, no streak, equal
weight tiles, Mehr burial.

### Plan B — Restructure (recommended)

**Idea:** Hub = **Continue lesson + streak**; grid becomes secondary.

Concrete:

1. Top CTA from `loadGameStats(lastGameId)` if in
   `{learn,quiz,math,eduhub}`, else default `learn` +
   `readLearnTopic()` → “Weiter üben” / “20 Karten · Thema X”.  
2. Show streak from `loadGameStats().streak` or `kidStreakDays` (same
   family as Sterne) on the hub — one number, not a calendar.  
3. Demote the four `.course-tile`s to a “Mehr Übungen” list under the
   CTA; primary tile visually larger (Griechisch).  
4. Soft-gate EduHub (“needs internet”) in copy only when offline.  
5. Back label in `childLearnView` / shared `#gameBack`: “Zur Lern-Übersicht”
   when `childView==='learn'`.  
6. Optional: persist mid-lesson index in `state.game` / `DB` so Continue
   resumes the deck (bigger behaviour change — can phase after CTA).

```
PHONE B                       PC B
┌─────────────────────┐       ┌──────┬──────────────────────────┐
│ Serie 3 🔥          │       │      │ Serie 3    Weiter: Hallo ▶│
│ Weiter: Griechisch ▶│       │      │ ┌──────────┐ ┌────┐ ┌───┐│
│ ─────────────       │       │      │ │ primary  │ │Wis │ │Re ││
│ Wissen / Rechnen /  │       │      │ │ Griech.  │ │    │ │   ││
│ Lern-Spiele         │       │      │ └──────────┘ └────┘ └───┘│
└─────────────────────┘       └──────┴──────────────────────────┘
```

**Cost:** medium — `childLearnHubView` template + stats read + strings;
small `#gameBack` label branch.  
**Risk:** Easy mode still lists learn under Mehr; streak semantics
(game streak vs chore streak) must be one clear story.  
**Gains:** matches the Duolingo promise already in copy; return visits
get one answer.

### Plan C — Rethink

**Idea:** Delete the Lernen hub. Dock “Spiele” Easy featured includes
Griechisch; “Lernen” Mehr deep-links `startChildGame('learn')`
straight into `childLearnView`. Quiz/Math/EduHub are rows inside the
lesson shell’s topic/mode chrome (already partly there).

```
Mehr → Lernen  ⇒  immediate card session
(Alle Lern-Modi via in-shell chips)
```

**Worth it if:** hub never adds value beyond a second tap and carers
want fewer kid destinations. **Not** if PhET / quiz need a visible
safe catalogue, or if you want a place for streak without entering a
game.

## 4. Recommendation

**Plan B.** Ship-today first cut: one **Weiter** button on
`childLearnHubView` using `lastGameId` || `'learn'`, plus kid-facing
hint strings (Plan A copy). Eyebrow contrast stays with the owner’s
fix.

## 5. Open questions for the owner

- Is Lernen meant to stay behind **Mehr**, or earn a dock slot?  
- One streak story: game-win streak (`loadGameStats`) vs Sterne day
  streak — which should the hub show?  
- Resume mid-lesson vs always fresh 20-card session?  
- Keep “wie Duolingo” in marketing to kids, or drop brand comparisons?  
- Should Wissen/Rechnen/PhET stay on this hub or only under Spiele Pro?
