# DEVICE — iPhone (393×852, `body.shell-m`)

**System-level document.** This is not a page plan. It sets the grammar, the chrome
budget, the navigation model, the type scale and the surface rules that the 20
per-page plans must fit inside. Where a per-page plan wants to break one of these
constraints it has to say so explicitly and justify it against §1.4.

Deliberately deviates from the brief's per-page structure, per assignment.

---

## 0. How the numbers in this document were produced

Everything below marked *measured* comes from a Playwright pass against the running
local QA server (`scripts/run-local-qa.py`, port 5173) driving the **real gate**
(mode card → profile → pinpad) at `393×852` on `devices['iPhone 15 Pro']`, as staff
`e4` and child `k1`, then walking every dock destination with `window.go(tab)` /
`window.goChildView(view)`, resetting scroll to 0, and measuring:

- `header.app-chrome` and `#bottomPanel` bounding boxes
- the flattened visible block stack of `#view`, each block classified
  `hero | nav | stat | cmd | banner | rail | content`
- the document-Y of the first `content` block ("first content")
- computed `font-size` / `line-height` / `font-weight` / `font-family` for 13
  representative type roles
- every tap target's centre against four thumb-reach bands

The probe scripts were temporary and have been deleted; the method is written out
above so the pass is reproducible. Raw output was retained at
`/tmp/paidia-phone-grammar2.json` and `/tmp/paidia-phone-type.json` for this pass.

**One caveat that matters for every number below.** In headless Chromium
`env(safe-area-inset-*)` resolves to `0px` (measured: `--safe-t: 0px`,
`--safe-b: 0px`). On a real iPhone 15 Pro in standalone PWA mode those are ~59px
and ~34px. Every "chrome" figure in this document is therefore **optimistic by
~93px**. The live scroll region measured at 730px is ~637px on the device.

---

## 0.1 Measured baseline — the whole surface on one page

Shell tokens on `body.shell-m` (measured, computed on `body`):
`--nav-h: 64px` · `--header-h: 52px` · `--m-gutter: 10px` · `--m-radius: 14px`
· `--m-btn-h: 44px` · `--m-card-pad: 12px` · root font-size `16px`
· `body.className = "shell-m paidia-shell layout-mobile mode-pro"`.

Note `--header-h: 52px` and `--nav-h: 64px` are both **wrong** as descriptions of
what renders. `mobile/mobile.css:177` sets them; the header actually measures
57px (staff) / 72px (kid) and the dock wrapper 65px / 70px. `index.html:5689`
declares `--nav-h:70px; --header-h:64px` for `max-width:899px` but is overridden
because `mobile/mobile.css` is linked *after* the inline `<style>` block
(`mobile/index.html:34` vs `:6110`). Four numbers describe two heights and none of
them is the rendered one.

### Fixed chrome

| | staff | kid | note |
|---|---|---|---|
| `header.app-chrome` | **57px** | **72px** | `mobile/mobile.css:55` min-height `52+safe-t`, `.topbar-row{height:44px}` |
| `#bottomPanel` | **65px** | **70px** | staff `nav.dock`, kid `nav.kid-dock` (`mountKidDock`, app.js:17400) |
| live scroll region | **730px** | **702px** | on device with insets: ~637px / ~609px |
| stage padding-top | 8px | 12px | `mobile/mobile.css:1581` |
| stage gutter | 10px | 14px | `--m-gutter` vs `--page-x` |

### In-page chrome above the first content block — staff

| tab | first content at Y | in-page chrome | chrome chain (measured heights) |
|---|---|---|---|
| `book` | 122 | **65** | `nav:book-panes@45` |
| `gallery` | 153 | **96** | `hero:section-shell-hero@70` |
| `home` | 220 | **163** | `hero:home-start-hero@147` |
| `admin` | 232 | **175** | `nav:admin-section-picker@70` → `hero:admin-ops-hero@162` |
| `kids` | 302 | **245** | `nav:kids-pane-tabs@46` → `hero:kids-overview@83` → `cmd:kids-admin-bar@44` |
| `talk` | 359 | **302** | `hero:talk-overview@197` → `nav:talk-mobile-switch@58` |
| `shop` | 587 | **530** | `hero:shop-overview@205` → `cmd:shop-command@289` |
| `schedule` | 665 | **608** | `nav:planner-focus-switch@46` → `nav:planner-mobile-house@45` → `cmd:plan-week-chrome@406` → `rail:week-jump@74` |
| `pocket` | 767 | **710** | `nav:pocket-pane-tabs@46` → `rail:pocket-kids-rail@618` |
| `stock` | 892 | **835** | `hero:stock-pantry-hero@230` → `stat:stock-context@171` → `cmd:stock-command-center@175` → `nav:stock-zone-pier@46` → `banner:shift-check-banner@143` |

Median staff in-page chrome **254px**. Four of ten tabs exceed 500px. **Lager's
first content block starts at Y=892 — 162px below the entire 852px viewport, and
255px below it on a real device.** A carer opening Lager sees zero shelves.

### In-page chrome above the first content block — kid

| view | first content at Y | in-page chrome | chrome chain |
|---|---|---|---|
| `bonus` | 142 | **70** | `banner:kid-back-bar@44` |
| `games` | 184 | **112** | `hero:arcade-hero@112` |
| `today` | 188 | **116** | `hero:kid-header.kid-hero@98` |
| `notes` | 196 | **124** | `hero:kid-hero-compact@98` |
| `pocket` | 204 | **132** | `hero:kid-hero-compact@98` |
| `rate` | 228 | **156** | `hero:kid-hero-compact@115` |
| `plan` | 264 | **192** | `banner:kid-back-bar@44` → `hero:kid-header@116` |
| `learn` | 265 | **193** | `banner:kid-back-bar@44` → `hero:kid-header@117` |
| `rewards` | 529 | **457** | `banner:kid-back-bar@44` → `hero:kid-header@117` → `hero:sterne-hero@242` |

The kid surface is in far better shape than the staff surface — v245 §2 did its
job. Median 132px. Only `rewards` is broken.

**Read across the two tables: the kid views are already close to the budget this
document proposes, and the staff views are 2–6× over it. The redesign work is
overwhelmingly on the staff side.**

---

## 1. The page grammar

### 1.1 What the grammar is today

Every staff view except `book` and `gallery` is assembled from the same five slots,
in the same order, by hand, in a different way each time:

```
header.app-chrome            fixed, 57px, carries the page title
────────────────────────────────────────────────────────────
1  hero          .stock-overview / .shop-overview / .talk-overview /
                 .kids-hero / .book-hero / .home-start-hero / .admin-ops-hero
                 = kicker + ui-mode-row + h2 + lede p + optional easy-hint
2  stat row      .stock-context / .shop-overview-stats / .kids-overview /
                 .talk-overview-stats / .plan-week-summary / .home-mobile-pulse
3  nav rows      .planner-focus-switch + .planner-mobile-house (Plan: two)
                 .kids-pane-tabs / .book-panes / .talk-mobile-switch /
                 .shop-panel-seg / .stock-view-tabs / .admin-section-picker
4  command block .stock-command-center / .shop-command / .plan-week-chrome
                 = house rail + search + primary + ••• + easy strip
5  banners       shiftPresenceBannerHtml() / shiftStockCheckBannerHtml() /
                 teamNoticeBannerHtml() / .shop-photo-banner / .stock-notice
────────────────────────────────────────────────────────────
   content
────────────────────────────────────────────────────────────
nav.dock                     fixed, 65px
```

Verified in `viewStock` (app.js:10584, shell at 10725–10785), `viewShop` (14210,
hero+command at 14226–14268), `viewSchedule` (10145, chrome at 10171–10197),
`viewKids` (18177, hero+tabs at 18239–18247), `viewTalk` (7397, hero at
7406–7423), `viewBook` (15956, hero at 15987–15997), `viewHome` (22502, mobile
branch at 22553–22592), `viewAdminOps` (21421, `seg` at 21425).

### 1.2 Is that grammar right?

**The slot order is right. The slot contents are wrong, and there are two slots
too many.**

The order is right because it matches how someone reads an unfamiliar screen:
where am I → how are things → what can I narrow to → what can I do → the data.
Nothing below proposes reordering it.

What's wrong is that four of the five pre-content slots currently spend space
without answering a question:

1. **The hero repeats the header.** The fixed header already renders the page
   title (`#title`, set per tab). Lager then renders kicker `LAGER` + `h2`
   `Kalyvia` + lede "Der Mindestbestand steht bei jedem Artikel…". The header says
   *Lager*; the hero says *Lager* again in 12px tracked caps, then says the house,
   then explains the feature. 230px measured. On a page a carer opens 20 times a
   shift, the third of those is instructions.
2. **The stat row is not the answer, it is trivia.** `.stock-context` reports
   *Artikelarten 62 / Kategorien 5 / Auf der Einkaufsliste 0*. The question a
   carer arrives with is "what's missing?" — which is `counts.low` and
   `counts.empty`, both computed at that point in `viewStock` and both rendered
   *elsewhere*, in `.stock-view-tabs` 217px further down. The page has the answer
   and puts the catalogue size where the answer should be.
3. **The command block is a page inside the page.** `.plan-week-chrome` measures
   **406px** — a range line, a `Besprechung` chip, an Agenda/Tabelle segment, a
   4-control week switcher, `+ Eintrag`, `Foto → Woche`, `Mit Text füllen`,
   `Woche importieren`, and a 3-up summary. Nine controls and three numbers before
   any of the week.
4. **Banners have no budget.** Lager renders `shiftPresenceBannerHtml()` **and**
   `shiftStockCheckBannerHtml()` (app.js:10780–10781, 143px measured) on top of
   the hero and the stat row. v245 already had to remove the Lagercheck prompt
   from `viewSchedule` because it was rendering on Home, Plan *and* Lager. Nothing
   stops the next one.

The hero and the stat row are, correctly combined, **one thing**: a statement of
where you are and how it is going. They are two blocks because they were written
at different times.

### 1.3 The grammar these screens should share

Three slots above content. Hard cap 144px including the app bar.

```
┌───────────────────────────────────────────────┐
│ ⌂ Lager · Kalyvia ▾           •••        48px │  app bar — collapses on scroll
├───────────────────────────────────────────────┤
│                                               │
│  4 Artikel fehlen.                            │  ANSWER  ~56px, plain content,
│  2 leer · 2 wenig · 58 ok                     │  no card. h1 IS the page title.
│                                               │
│  ┌───────────────────────┐ ┌────┐ ┌────┐      │  ACT  44px, sticky
│  │  + Hinzufügen         │ │ 🔍 │ │••• │      │  exactly one filled primary
│  └───────────────────────┘ └────┘ └────┘      │
├───────────────────────────────────────────────┤  ← content starts here, y≤148
│  Milch                        0    leer   ›   │
│  ─────────────────────────────────────────────│  rows, hairline-separated,
│  Butter                       1    wenig  ›   │  full gutter width
│  ─────────────────────────────────────────────│
│  Eier                        12    ok     ›   │
│                                               │
│                    ⋮                          │
├───────────────────────────────────────────────┤
│  ⌂     ▤     ▢     ▦     •••            56px  │  dock
└───────────────────────────────────────────────┘
```

**Slot 1 — App bar, 48px, collapsing.** Contains: a context chip
(`Lager · Kalyvia ▾` — page + global house, tappable, opens the house sheet) and
`•••` (the overflow that today lives in the top-right cluster). Nothing else.
Collapses to a 3px progress hairline on scroll down, restores on scroll up.

**Slot 2 — Answer block, ≤64px, plain content, not a card.** An `h1` that *is* the
page title (so the app bar's title becomes redundant and can shrink to the context
chip), and one line of live numbers. Replaces hero + stat row + lede. The
instruction paragraph moves into the Easy-mode hint and the `?` help sheet, which
is where the app already keeps explanations (`sheetHelp`, `sheetHelpCenter`,
`kidViewHint`). This is the single highest-leverage change in this document:
it deletes 147–230px of hero plus 54–171px of stat row from every staff page and
replaces it with 64px that answers the arrival question.

**Slot 3 — Act row, 44px, sticky.** One filled primary, up to two icon-only
secondaries (search, camera), one `•••`. Sticky to the top of the scroll region so
the page's primary action never scrolls away. Everything currently in
`.stock-command-center`, `.shop-command`, `.week-ai-bar` and `.*-easy-actions`
either becomes the primary, becomes an icon, or goes into `•••`.

**Content.** Rows. See §5.

### 1.4 Which screens may break it, and how

| screen | exemption | what it may add |
|---|---|---|
| `schedule` (week) | needs a temporal axis | **+44px** for `.week-jump` as slot 4, sticky under the act row. The 7-day rail is the page's index; it is content-adjacent, not chrome. |
| `stock` / `shop` | needs a text filter | search is an **icon** in the act row that expands the row in place. Never its own block. |
| `talk` | conversation surface | **no answer block, no act row.** Header + message list + pinned composer. Chat is the one screen where the newest content is at the bottom and the input is the primary action. |
| kid `games` in play | immersive | **full-bleed, no app bar, no dock.** Only a close affordance. `startChildGame` (app.js:16715) already has the hooks. |
| `admin` | not a phone surface | exempt from the budget. It is a desk page (`desk/index.html`) with a phone fallback; measured `ops-overview` height 2537px says so. Phone `admin` should be a section index that links out, nothing more. |
| `gallery` | media grid | may go edge-to-edge (gutter 0). Already closest to the budget at 96px. |

Everything else — Home, Plan (day/cal), Lager, Liste, Kinder, Taschengeld, Buch,
and all nine kid views — has **no exemption**.

---

## 2. Chrome budget

### 2.1 The right budget

| slot | measured today (staff) | **budget** | on-device (with insets) |
|---|---|---|---|
| app bar | 57 | **48**, → 0 on scroll | 48 + 59 safe-t = 107 resting, 59 scrolled |
| answer block | 147–230 hero + 54–171 stat | **64** | 64 |
| act row | 175–406 command | **44** | 44 |
| filter/segment rails | 45–91 (two rows on Plan) | **0** (44 on `schedule` only) | 0–44 |
| banners | 0–143 | **0 resting**, max **1** at 56px | 0–56 |
| dock | 65 | **56** | 56 + 34 safe-b = 90 |
| **first content at** | **Y=220…892** | **Y ≤ 156** | **Y ≤ 215** |
| **content visible above fold** | **0–606px** | **≥ 496px** | **≥ 403px** |

That gets a carer at least three data rows and usually five before the fold on
every page, on the device, with the insets counted.

### 2.2 What gets sacrificed to get there

In order of how much they cost and how little they earn:

1. **The lede paragraph in every hero. Gone.** `t('stockHeroHint')`,
   `T[lang].shopOverviewHint(n)`, `t('staffTalkIntro')`, `t('kidsHeroHint')`,
   `t('bookHeroHint')`, `t('homeOverview')`, and the `<p>` inside
   `.stock-context`. These explain the feature to someone who has used it 500
   times. They survive in `mode-easy` only (`.easy-only` already exists and is
   the right home for them) and in the `?` help sheet.
2. **The kicker line. Gone.** `LAGER` above `Kalyvia`, `EINKAUFSLISTE` above
   `Kalyvia`, `ARMONIA THASSOS` above `Guten Tag`. 22 `.brand-kicker` + 17
   `.eyebrow` + 2 `.home-start-kicker` uses. The app bar and the `h1` already say
   where you are. Retain the token for *section* kickers inside content, which is
   what an eyebrow is for.
3. **`.ui-mode-row` out of the hero.** `uiModeToggleHtml({compact:true})` is
   rendered inside six page heroes (`viewShop:14226`, `viewKids:18241`,
   `viewTalk:7409`, `viewBook:15989`, `viewHome:22558`, `viewHome:22632`). Easy/Pro
   is an account preference, not page furniture. It belongs in the Mehr sheet.
   `ui-v244.css:217` already hides `#uiModeToggle` in the *header* on phones — the
   in-hero copies were the workaround and should go with it.
4. **The trivia stat row. Replaced, not moved.** The answer block carries the two
   or three numbers that answer the page's question. `Artikelarten 62 /
   Kategorien 5` do not survive; `2 leer · 2 wenig` do.
5. **The second and third nav rows.** §3.
6. **The multi-CTA command block.** One filled primary per page. v245 §3 already
   demoted `.week-ai-photo` on Plan for exactly this reason; the rule generalises.
   `Mit Text füllen`, `Woche importieren`, `Foto → Woche`, `Fehlendes aus Lager`,
   `Foto → Liste`, `stockPhotoRead`, `stockShiftCheckEasyBar` all move behind `•••`.
7. **9px of dock.** 65 → 56. Icons 20px (already), label 11px (already),
   padding 6px. `mobile/mobile.css:198` currently sets `padding: 4px 4px 2px` on
   `nav.dock` and `index.html:592` sets `min-height: var(--nav-h)`; the floor is
   the token, not the content.

### 2.3 The three mechanisms, ranked

**Collapse the header on scroll — do it.** Highest return, lowest risk, and it is
the only one that buys space back on *every* screen including the ones already
inside budget. `header.app-chrome` is `position:sticky; top:0` (index.html:130),
so this is a scroll listener toggling a class plus a transform, not a re-layout.
57px on every page, permanently, for ~20 lines. Pair with `scroll-padding-top` so
the sticky act row doesn't overlap anchors.

**Move the title into the content — do it.** This is not a space saving on its
own (the app bar keeps a context chip either way); it is what makes the answer
block possible. Today the title exists twice and neither instance carries data.
Once the `h1` is in the content it can be *the sentence that answers the question*
— `4 Artikel fehlen.` rather than `Lager`.

**Merge the hero into the first data card — no, do something better.** Merging
hero-into-card keeps the card. The answer block should be **plain content on the
tinted canvas**, not a card: it is the one block on the page that is pure
statement, and a border around a statement adds 26px of padding and 2px of line
for nothing. `mobile/mobile.css:1607–1628` currently *forces* `.stock-overview`,
`.shop-overview`, `.home-start-hero` to card padding + radius; that rule is the
thing to reverse.

---

## 3. Navigation model

### 3.1 What ships today

**Staff dock — 4 destinations + Mehr, not 5.** `index.html:6168–6182` declares 12
`data-tab` buttons; `.dock-secondary` is `display:none` on phones
(index.html:5753). The visible dock is **Home · Plan · Lager · Liste · Mehr**,
which the v245 captures confirm.

**`sheetMobileMore()` (app.js:24854) holds nine more:** gallery, talk, book,
personnel, school, rules, pocket, admin (if admin), chat. So **9 of 13 staff
destinations are two taps and a sheet away**, including Buch — the handover
journal, which Home itself nags about via `showJournalDuty` /
`t('journalDutyHome')` (app.js:22563).

**Then pages add their own rows.** Measured:

| page | row 2 | row 3 | total nav px |
|---|---|---|---|
| `schedule` | `.planner-focus-switch` Tag/Woche/Kal/••• (46px) | `.planner-mobile-house` Alle/Kalyvia/Limenaria (45px) | **91** + a 4th switch (`.week-layout-seg` Agenda/Tabelle) inside `.plan-week-chrome` |
| `kids` | `.kids-pane-tabs` × 7 chips (46px) | — | 46 |
| `pocket` | `.pocket-pane-tabs` (46px) | `.pocket-kids-rail` (618px — see below) | 664 |
| `stock` | `.seg.house-selector#sHouse` (in command block) | `.stock-view-tabs` (46px) | 46 + rail |
| `shop` | `.seg.house-selector#shHouse` | `.shop-panel-seg` Planen/Mitnehmen/Anfragen | both inside `.shop-command` |
| `talk` | `.talk-mobile-switch` (58px) | — | 58 |
| `book` | `.book-panes` (45px) | + `adaptiveChrome()` toolbar | 45+ |
| `admin` | `.admin-section-picker` `<select>` (70px) | `.admin-section-nav` (hidden on phone) | 70 |

So Plan presents **four** levels of navigation simultaneously: dock → view mode →
house → layout. And `.pocket-kids-rail` is not a rail at all: measured **618px**,
because it is `<aside class="pocket-kids-rail">` (app.js:13504) holding one
`.pocket-kid-card` per child — a desktop sidebar rendered as a vertical stack on
the phone, pushing the ledger to Y=767.

### 3.2 Is the IA right?

No, in three specific ways.

**(a) House filtering is per-page state, and there are two of it.** Grepped and
confirmed:

- `state.house` — Lager (`viewStock:10585`), Liste (via `shopHouse()`, app.js:12721),
  Home (`viewHome:22521`), and ~15 stock/shop helpers that temporarily reassign it
  (`insertStockOrderPid:11276`, `sheetStockBoard:12097`).
- `state.houseFilter` — Plan only, read at app.js:8616, 8622, 8848, 8850, 9699,
  9738, 10157, 10168–10169, 10180–10181, 10211.

They never sync. Switch to Limenaria in Lager, go to Plan, and Plan still shows
*Alle*. The house is a property of **where the carer physically is on shift** —
the most global fact in the app — and it is modelled as two independent per-page
filters.

The house *sets* also differ: `planningHouses()` filters `h.planning!==false`
(app.js:3727), `shoppingHouses()` returns all houses (3728), and `viewStock` maps
`DB.houses` directly and adds an "all" button the other two lack. The v245
captures show it plainly: Plan's rail is `Alle · Kalyvia · Limenaria` (3), Lager's
is `Limenaria · Julian groß · Valeria+Lea · A…` (5+, and the active house —
`Kalyvia` per the hero — is not visible in the rail).

**(b) Dock composition doesn't match the shift loop.** Lager and Liste are two
destinations for one workflow: `viewStock` computes `missing` from `DB.listEntries`
and renders `.stock-notice` → "openShopping" (app.js:10782); `viewShop` reads
stock to build `Fehlendes aus Lager`. They share `state.house`, share
`DB.listEntries`, and each links to the other. Meanwhile Buch — which every shift
must write — is behind Mehr.

**(c) In-page rows carry two different kinds of thing.** `.planner-focus-switch`
(Tag/Woche/Kal) changes *what this page shows*. `.planner-mobile-house` changes
*which data the whole app is about*. `.kids-pane-tabs` (Kinder/Anwesenheit/
Hausaufgaben/Material/Verlauf/Stundenplan/Fächer) is neither — it is seven
sibling destinations wearing tabs, and measured tab positions are
`0, 75, 186, 308, 393, 472, 582` at a 393px viewport, so **four of seven start at
or past the right edge**.

### 3.3 Proposed model — three tiers, one house

**Tier 1 — Dock. 5 destinations, no more, no overflow-by-default.**

```
   ⌂ Home      ▤ Plan      ▢ Vorrat      ▦ Buch      ••• Mehr
```

- **Vorrat** = `viewStock` + `viewShop` merged, with `Bestand | Einkauf` as its
  one in-page segment. They already share state and cross-link; the merge frees a
  slot and removes one house rail.
- **Buch** promoted out of Mehr. It is the only shift-*obligation* in the app.
- `Kinder`, `Taschengeld`, `Talk`, `Galerie`, `Personal`, `Schule`, `Regeln`,
  `Admin` stay in Mehr. That is correct — they are per-week, not per-shift.

**Tier 2 — Mehr sheet.** Grouped, not declaration-ordered. Three groups:
*Heute* (Talk, Galerie) · *Verwaltung* (Kinder, Taschengeld, Personal, Schule,
Regeln, Admin) · *Konto & Hinweise* (Mitteilungen ·badge, Zo-Ai, Sprache,
Easy/Pro, Tutorial, Profil & Sicherheit, Feedback). The last group is everything
evicted from the header top-right in §7, plus the two toggles evicted from the
heroes in §2.2.

**Tier 3 — In-page. One row, and only for view mode of the current destination.**
Permitted: `Tag | Woche | Kal` (Plan), `Bestand | Einkauf` (Vorrat),
`Übergabe | Verlauf | Personen` (Buch). Forbidden: a second row, a house row, a
layout row.

- `.planner-mobile-house` (10179–10182) and `#hFilter` (10167–10170) — **deleted**.
  Note Plan currently renders **both**, and `ui-v244.css:300` hides the wrapper
  containing the second one, so the markup ships two house selectors per render.
- `.week-layout-seg` Agenda/Tabelle (8962) — Tabelle is a desktop matrix;
  `viewScheduleWeek` already computes `portraitMobile` and shows
  `.week-rotate-coach` telling the user to rotate. On the phone, drop the segment
  and keep Agenda only.
- `.kids-pane-tabs` (18218) — seven destinations. Becomes a `<select>`-style
  section picker like `.admin-section-picker`, or Kinder becomes a directory whose
  rows open a kid, with Anwesenheit/Hausaufgaben as their own Mehr entries. Decide
  in the per-page plan; the system rule is *one row of ≤4 chips or a picker*.

**House becomes global chrome.** One state key (`state.house`; `houseFilter`
becomes a derived read or is deleted), surfaced once, in the app bar context chip:

```
┌───────────────────────────────────────────────┐
│  Lager · Kalyvia ▾                      •••   │
└───────────────────────────────────────────────┘
        └── tap → house sheet, radio list, one tap to switch
```

The sheet is the right control here rather than a rail: with 5+ houses a rail
overflows at 393px (measured), and `revealActiveRailChips()` (app.js:11357) exists
precisely because the active chip kept ending up off-screen — a sheet has no
off-screen. Houses that don't apply to the current page are filtered by
`planningHouses()` / `shoppingHouses()` *at render*, which is what those functions
should do; they should not each own a state key.

`unsavedChangeParts()` (app.js:11369) already guards house switching, so a global
switcher inherits the existing protection.

---

## 4. Type scale and density at 393px

### 4.1 What renders today (measured computed styles)

| role | Home | Lager | Plan | Kinder | kid Start |
|---|---|---|---|---|---|
| header `h1` | 17 / 19.6 / w700 Outfit | 17 | 17 | 17 | 16.5 |
| page title `h2` | **23.58 / Fraunces** | **28 / Outfit** | — | — | **22 / Outfit** |
| kicker | 13, ls 1.82px (`.home-start-kicker`) | 12, ls 1.68 (`.brand-kicker`) | 12, ls 1.68 | — | 12.75, ls 1.785 (`.eyebrow`) |
| stat value `b` | **20** | **16.8** | **20** | **22** | — |
| stat label | 12 / lh **13.8** | 12 / lh **18** | 12 / lh **18** | 12 / lh **15** | — |
| section head | — | — | — | — | 18 / 27 |
| row title `b` | — | — | — | 16 / 18.4 / w700 | — |
| row meta `small` | — | — | — | 12 / 13.8 | — |
| `.btn` | — | 14 / w800, ls .14 | 14 / w700 | 14 / w700 | 14 / w700 |
| rail chip | — | 12 / w700 | **12 / w650** | 13 / w700 | — |
| dock label | 11 / w700 | 11 / w600 | 11 / w600 | 11 / w600 | **10.5 / w800** |
| `p.muted` | 12 / 17.4 | — | 12 / 16.2 | — | **14.4 / 20.9** |

Five things are wrong here and one is subtle:

1. **The page title renders in two different typefaces.** Fraunces on Home
   (`.home-start-hero h1` inherits `--font-display`), Outfit at 28px on Lager
   (`h2.tide-line`, forced to `--font-ui` by the mobile layer). Same role, two
   families, a 4.4px size gap.
2. **Four different sizes for one stat numeral** (16.8 / 20 / 20 / 22) and three
   different line-heights for its label (13.8 / 15 / 18).
3. **Three kicker tokens** with three tracking values, for one visual role.
4. **`p.muted` is 12px on staff and 14.4px on kid.** The intent (Easy mode reads
   bigger) is right; the mechanism is that one path resolves `--t-body-sm` (.9rem
   = 14.4px) and the other hits a hardcoded `12px` in the mobile layer. It's
   accidental, and 12px muted grey on a card is the smallest readable thing in the
   app.
5. **`w650`.** That is `fitButtonLabels()` (app.js:23471): it stamps
   `.ui-fit-text` on every button not in `BUTTON_FIT_SKIP` (23469), then
   `.ui-fit-tight` when `scrollWidth > clientWidth`, then `.ui-fit-wrap`. The
   result on Plan's house chips is a **variable-font weight of 650 that appears in
   no design token**. The scale is not authored — it is renegotiated on every
   render, per button, depending on string length. This is why `ui-v244.css:26–43`
   had to fix an icon-height bug that was "keeping `fitButtonLabels()` permanently
   in `ui-fit-tight` and shrinking labels to 12px app-wide": a single CSS
   regression silently rescaled the whole product.

Also note `--t-display-xl: clamp(2rem,6vw,2.75rem)` and `--t-display-lg:
clamp(1.75rem,4vw,2.1rem)` are still declared (index.html:3589–3590) but nothing
on the phone renders at 32–44px. The declared scale and the rendered scale are
different documents.

### 4.2 Is it right for one-handed use at arm's length, mid-shift?

**No.** Two failures:

- **Secondary text is too small.** 12px at 1.15–1.35 line-height is the size the
  app uses for the thing you actually need to read — a task's time and assignee, a
  product's state, a kid's attendance. `references/hig/typography.md` puts the
  floor at 11pt (≈15px) for body and 17pt for primary content; 12px is a *caption*
  size being used as a *content* size. In bright island daylight with a phone at
  arm's length it is the first thing to fail.
- **Buttons are smaller than their consequences.** 14px w700 on a filled pine
  button that commits a stock adjustment. Buttons carry the highest-stakes text on
  the screen and are set two steps below the row titles they act on.

Meanwhile the *display* end is too loud: 28px page titles that say `Kalyvia` are
spending the largest type in the system on the least surprising word.

### 4.3 Proposed phone scale

One scale, both modes, with a single `mode-easy` multiplier rather than per-page
overrides. `393px − 2×12px gutter − 2×12px card padding = 345px` of measure;
15px Outfit gives ~46 characters, which is inside the 45–75 target.

| token | family / weight | size / line-height | tracking | where |
|---|---|---|---|---|
| `answer` | Fraunces 700 | **26 / 1.15** | −.02em | the answer-block `h1`. One family, one size, every page. |
| `numeral` | Fraunces 700 | **24 / 1.0** tabular | −.01em | every stat value, every big number |
| `section` | Outfit 700 | **17 / 1.25** | 0 | `.block-h .t` and its 5 aliases |
| `row-title` | Outfit 600 | **16 / 1.3** | 0 | the workhorse — list rows, task titles, product names |
| `body` | Outfit 400 | **15 / 1.45** | 0 | prose, descriptions, message text (was 12–16) |
| `meta` | Outfit 400 | **13 / 1.35** | 0 | times, assignees, states, timestamps (**was 12**) |
| `button` | Outfit 600 | **15 / 1.0** | 0 | all `.btn`, `.page-act` (**was 14**) |
| `label` | Outfit 600 | **12 / 1.2** | 0 | stat labels, form labels |
| `eyebrow` | Outfit 700 | **11 / 1.2** | +.12em | *section* kickers inside content only |
| `dock` | Outfit 600 | **11 / 1.1** | 0 | both docks (**kid was 10.5**) |

Retire: `.brand-kicker`, `.home-start-kicker`, `.talk-eyebrow`, `.tide-line` as a
type role → all become `eyebrow`. Retire `--t-display-xl`, `--t-display-lg`,
`--t-micro` on the phone — nothing should render at 10px or 32px+.

**And retire `fitButtonLabels()` on the phone.** A type scale that is negotiated
at runtime is not a type scale. Replace with: fixed sizes, `min-width:0`,
`overflow-wrap:anywhere` (already added by `ui-v244.css:57–62` for the labels that
needed it), and two-line button labels where the string is long. If a label
doesn't fit at 15px in 44px of height, the label is wrong — shorten the string,
don't shrink the type.

### 4.4 Density

| | staff (`mode-pro`) | kid / `mode-easy` |
|---|---|---|
| min tap target | **48px** (up from the 44 floor) | **56px** |
| list row height | 56px (title + meta) | 64px |
| gutter | **12px** (staff is 10, kid 14 — unify) | 12px |
| card padding | 12px, one level deep only | 14px |
| block gap | 8px (already, `mobile/mobile.css:1761`) | 10px |
| multiplier | 1.0 | body/meta/row-title ×1.1, min target ×1.17 |

44px is the HIG *minimum*, appropriate for a chip in a rail. A row you tap while
walking, holding something, should be 48. `ui-v244.css:266` sets a global
`min-height:44px !important` floor on every `#view` button, which is the right
mechanism — the number should be 48 for rows and stay 44 for rail chips.

---

## 5. Card system

### 5.1 What's happening today

Measured card counts on the first screen: Home 3, Lager 4, Liste 5, Kinder 1,
Buch 4, Admin 4, kid Start 6, kid rate 4.

Measured **left inset of the first ink** — how far from the viewport edge the first
character sits, i.e. the total padding chain:

| page | ink inset |
|---|---|
| gallery | **10px** (= gutter, correct) |
| shop | 23 |
| talk | 25 |
| admin | 26 |
| home | 27 |
| stock | 31 |
| kid views | 31 |
| pocket | **59** |
| kinder | **75** |
| book | **78** |

`mobile/mobile.css:1607–1628` forces `--m-card-pad: 12px` + `1px --line` +
`--m-radius: 14px` onto 13 selectors including every hero. `ui-v245.css:213` had
to add `padding: 0 !important` to `.home-mobile-tasks` because it "nested three
paddings written for a padding-less shell, so its ink sat 42–50px from the edge
while every neighbouring block aligned at 22px." That fix was correct and
page-specific; **Kinder at 75px and Buch at 78px are the same bug, unfixed.**

At 78px inset the content column is 393 − 156 = **237px** — 60% of the device.
The other 40% is border and padding.

The design system is also explicit that this shouldn't be a card system at all:
`design/VISUAL_MOTION_SYSTEM.md` §4 — *"surfaces are translucent layers of light
over the stone gradient, not opaque cards with drop shadows… A 'card' implies
paper on a desk."* And §4's Chrome level: *"Bottom nav dock only. The one place we
go dark."* The dock rule is honoured. The card rule is not: the phone layer turns
everything, including plain headers, into an opaque bordered box.

### 5.2 Proposed rules

**A thing is a CARD only if all three are true:**

1. it groups **≥2 different kinds** of element (not a homogeneous list), **and**
2. it has its own header or title, **and**
3. it can be acted on, dismissed or navigated **as a unit**.

Examples that qualify: `.home-shift-start` (a named, ordered checklist with its
own CTAs), `.kid-note-compose-card` (a form), `.talk-topics` (a titled list with
its own add-field). Examples that do not: every hero, every stat row, every
directory list, `.stock-workspace`.

**Max 3 cards per screen.** If you need a fourth, you are using cards as spacing.

**A thing is a ROW if it is one item in a homogeneous list.** Rows are
hairline-separated siblings in a plain container, full gutter width, no individual
border, no individual radius, no individual background. This covers
`.kid-dir-row`, `.task-list > *`, `.pocket-kid-card`, `.pocket-txn-list > *`,
`.store-row`, `.stock-row`, `.lesson-row`, `.hw-row`, `.mat-mini` — i.e. most of
what the app displays. `index.html:5790–5797` already does exactly this for the
gate's `.profile` list (`border:0; border-bottom:1px solid #d9ded9;
border-radius:0; background:transparent`) and the gate is the best-composed screen
on the phone. Generalise that.

**A thing is PLAIN CONTENT — no surface at all — if it is a statement.** The
answer block, the page title, section headings, empty states, hints. These sit
directly on the canvas.

**Nesting cap: one padded surface deep.** Enforce globally rather than
per-page:

```css
body.shell-m #view :is(.card, .panel, .block, section) :is(.card, .panel, .block, section) {
  padding-inline: 0; border: 0; background: none; border-radius: 0; box-shadow: none;
}
```

Ink inset must never exceed **gutter + 12px = 24px**. That single rule fixes
pocket (59), kinder (75) and book (78), and prevents the next `ui-v245.css:213`.

**Radius:** `14px` for cards, `0` for rows, `12px` for buttons — as shipped. Do
not add a fourth.

**Dark surfaces:** dock only. Lager's dark shelf surface (referenced in the
`CAT_ICON` comment at app.js:10530, *"including the dark Lager surface"*) is a
second inverted region and should be reviewed against §4 of the design system in
the Lager page plan.

---

## 6. Cross-page consistency defects

Each entry: the concept, how many implementations, the pages, and the evidence.

**D1 — Stat rows: 8 implementations, 4 numeral sizes, 3 label line-heights.**
`.stock-context` (Lager, 16.8px, and it contains a 3-line instruction `<p>` inside
the KPI block) · `.shop-overview-stats` (Liste) · `.kids-overview` (Kinder, 22px)
· `.talk-overview-stats` (Talk) · `.plan-week-summary.compact` (Plan, 20px) ·
`.home-mobile-pulse` + `.home-signal`/`.w-stat-val` (Home, 20px) ·
`.home-command-pulse` (Home desktop branch) · `.child-school-kpis` (kid).
`ui-v244.css:169` and `ui-v245.css:242` both had to add odd-count orphan rules for
two of these separately.

**D2 — Hero kickers: 5 class names, 3 rendered sizes, 3 tracking values.**
`.brand-kicker` ×22 (12px/1.68) · `.eyebrow` ×17 (12.75/1.785) ·
`.tide-line` ×6 · `.home-start-kicker` ×2 (13/1.82) · `.talk-eyebrow` ×1.
Pages: all.

**D3 — Page title renders in two typefaces.** Fraunces 23.58px on Home,
Outfit 28px on Lager, Outfit 22px on kid views. Pages: Home vs everything else.

**D4 — House selection: 3 markup shapes, 2 state keys, 3 house sets, 1 duplicate.**
`.planner-mobile-house[data-plan-house]` → `state.houseFilter` (Plan) ·
`.seg.house-selector#sHouse[data-h]` → `state.house` (Lager) ·
`.seg.house-selector#shHouse[data-h]` → `state.house` via `shopHouse()` (Liste).
Plan additionally renders `#hFilter` — a *second* house selector — inside
`.planner-chrome-wrap`, which `ui-v244.css:300` then hides on phones. Sets:
`planningHouses()` (app.js:3727, filtered) vs `shoppingHouses()` (3728, all) vs
`DB.houses` + an "all" chip (Lager only). Pages: Plan, Lager, Liste, Home.

**D5 — Rail treatment: three overlapping selector lists that don't match.**
`mobile/mobile.css:274` (overflow + mask fade) covers 11 selectors ·
`:622` (scroll-snap + peek padding) covers 12 · `:1732` (gutter bleed) covers 9.
`.planner-mobile-house` is in the bleed list but not the mask list.
`.planner-focus-switch`, `.talk-mobile-switch`, `.shop-panel-seg`,
`.week-layout-seg` are in none. `.week-jump` needed its own bespoke rule
(`ui-v244.css:308`). Pages: Plan, Kinder, Taschengeld, Lager, Liste, Buch, Talk.

**D6 — Empty states: 5 implementations, only one offers a way forward.**
`emptyState()` → `.empty-state` (app.js:3840, canonical, takes a CTA, ~19 call
sites) · bare `.empty` ×19 (no CTA, no icon) · `.shop-empty` ×4 ·
`.journal-blank` ×2 · `.mobile-empty-row` ×1 (Home only). Also
`.empty.page-render-fallback`. Pages: all. Since most v245 captures are
near-empty fixtures, **the empty state is the most-seen composition in the
product and the least designed.**

**D7 — Primary CTA: 6 shapes, and "secondary" is the default.**
`.btn.primary` · `.home-primary` · `.plan-hero-cta.page-act.primary` ·
`.btn.req-cta` · `.btn.stock-primary-action` · `.btn.stock-easy-btn` (which ships
both filled *and* `.sec`). Counted usage: 72 × `.btn.sec`, 56 × `.btn.sm.sec`,
27 × `.btn.sm`, 16 × `.btn.sec.sm`. So emphasis is expressed by the *absence* of a
modifier in some places and `.primary` in others. Pages: all.

**D8 — Section headers: 6 shapes.** `.block-h` ×36 · `.kid-panel-h` ×7 ·
`.stock-section-heading` ×4 · `.plan-block-h` ×4 (always doubled with `.block-h`)
· `.pocket-panel-head` ×2 · `.talk-section-head` ×1. Pages: all.

**D9 — Location is stated two or three times per screen.** Staff: header `#title`
+ hero kicker + hero `h2`. Kid: header `h1` (child's name) + header `.who`
(`kidViewTitle(view)`) + `.kid-guide-compact` which renders
`t('kidGuideWhere')` + `kidViewTitle(view)` + `kidViewHint(view)` again
(app.js:17234–17250). Pages: all staff, all kid views except `today`.

**D10 — `p.muted` is 12px on staff and 14.4px on kid, accidentally.** One path
resolves `--t-body-sm` (.9rem), the other a hardcoded `12px` in the mobile layer.
Pages: all.

**D11 — Kinder's 7 pane tabs overflow the viewport with no count.** Measured chip
x-positions at 393px: `0, 75, 186, 308, 393, 472, 582`. Four of seven begin at or
beyond the right edge. The mask fade (`mobile/mobile.css:294`) reads as a soft
edge, not "four more". Pages: Kinder (and Admin's 10 sections, which correctly use
a `<select>` instead).

**D12 — `.pocket-kids-rail` is a desktop sidebar rendered as a 618px vertical
stack.** `<aside class="pocket-kids-rail">` (app.js:13504) holding one
`.pocket-kid-card` per child; `mobile/mobile.css:275` lists it among the
horizontal rails, but the measured height is 618px, so the horizontal treatment
isn't taking. Pushes the ledger to Y=767. Pages: Taschengeld.

**D13 — The type scale is renegotiated at runtime.** `fitButtonLabels()`
(app.js:23471) produces `w650` rail chips on Plan. `ui-v244.css:26–43` documents
how one icon-height regression put the whole app permanently into `.ui-fit-tight`
at 12px. Pages: all.

---

## 7. Interaction and motion

### 7.1 The thumb zone at 393×852

Bands used (right-handed grip, phone held low): `easy` y>560 · `ok` 380–560 ·
`stretch` 200–380 · `hard` y<200, `hard-topright` if also x>260.

Measured tap-target distribution on the first screen:

| screen | hard-top | hard-topright | stretch | ok | easy |
|---|---|---|---|---|---|
| Home | 1 | 3 | 0 | 3 | 9 |
| Lager | 1 | 3 | 0 | 5 | 13 |
| Plan | **6** | **5** | 6 | 3 | 13 |
| Kinder | **4** | **7** | 2 | 3 | 11 |
| kid Start | 1 | 3 | 0 | 4 | 22 |

Content is reachable. **Navigation is not.**

### 7.2 What sits in the hard top-right, and what should move

Measured positions, all 44×44 at y=6–8 — the top edge of the device:

| control | x | what it does | frequency | verdict |
|---|---|---|---|---|
| `#btnUser` (avatar) | **337** | opens *Anmeldung & Sicherheit* | rare | **move.** The single least-reachable pixel on the device, spent on a settings screen. |
| `#btnLang` (`DE`) | 288 | toggles DE/EL | set once | **move.** A preference, not an action. |
| `#btnNotifs` (🔔) | 239 | notification centre, live badge (2 unread in the captures) | frequent | **move, and keep the badge visible.** A frequent action in the worst position. |
| `#btnTour` (`?`) | 190 | tutorial | rare | **move.** |

`ui-v244.css:322–333` is already fighting this cluster — it shrinks `.topbtn` from
44 to 40px and cuts `.topbar-core` gap to 5px purely to buy the ~30px
"Betriebszentrale" needed to stop ellipsising. Emptying the cluster resolves that
instead of trading tap size for title width.

**Where they go:** all four into the *Konto & Hinweise* group at the top of
`sheetMobileMore()` (app.js:24854), which is opened by `#dockMore` — a dock button
in the **easy** band. The unread count moves onto `#dockMore`, which already
renders a `.dock-more-glyph` with room for a badge (`.bell-count` styling exists at
index.html:5413). Net effect: a frequent action moves from y=6,x=239 to y≈800 —
from the hardest band to the easiest — and the app bar is left with a context chip
and one `•••`.

**What should be in the easy band on every page: the page's primary action.**
Today it is wherever the command block landed — Plan's `+ Eintrag` at y≈300
(stretch), Lager's `#stockQuickAdd` at y≈600 (ok/easy by luck), Liste's
`+ Hinzufügen` at y≈650. Proposal: the §1.3 act row is **sticky at the top** of
the scroll region for discoverability, and the single most important action
additionally gets a **48px docked bar immediately above the dock** on pages with a
clear single verb (Lager: add movement · Liste: add product · Plan: add entry ·
Buch: write handover). A bar, not a FAB — v245 removed the FAB for good reason
(`ui-v245.css:30–35`: it was `position:fixed` over the kid calendars' Sunday
column at every scroll offset), and a bar occludes nothing because it reserves
layout.

### 7.3 Gestures

**The swipe the brief refers to does not work.** `[data-week-swipe]` is queried
once in the entire repository — `app.js:23926` — and **emitted by no template.**
`swipeHost` is therefore always `null` and the 21-line
`touchstart`/`touchend` handler at 23929–23949 is dead code. Two supporting
pieces are also orphaned: `weekSwipeHint` — *"Wische oder tippe Mo–So"* /
*"Σύρε ή πάτα Δευ–Κυρ"* (app.js:247, 1506) — is never rendered, and
`.week-swipe-hint` (index.html:1001, plus the three generated shells) styles
nothing. So the app has a translated string telling the user to swipe, CSS to
style the hint, and a working handler, and ships none of them.

The handler's logic is sound and reusable as-is: ±56px horizontal, rejected if
`|dx| < |dy| × 1.2`, then `week[idx±1]` → `setScheduleDate` → `feedback('select')`
→ `render()`.

**Fix and generalise.** Extract `wireHorizontalSwipe(el, {onPrev, onNext})` from
23929–23949, then:

| where | host | gesture |
|---|---|---|
| Plan week | `.week-agenda-board` (`weekAgendaBoardHtml`, app.js:8576, called at 8982) | ±1 day — the original intent |
| Plan week | `.plan-week-chrome` (8988) | ±1 week, mirroring `[data-shift="±7"]` (8940/8945) |
| Plan day | `viewScheduleDay` (8612) | ±1 day |
| Buch | `.paidia-cal-grid` via `wirePaidiaCal` (10026) | ±1 month, mirroring `.paidia-cal-nav` |
| kid `rate` / `pocket` / `notes` / `today` | same four calendars, same `wirePaidiaCal` | ±1 month — one call site covers all four |
| Liste | `.friday-picker` (app.js:14238) | ±7 days, mirroring `[data-friday-shift]` |
| Vorrat | the content region | ← → house, since house is that page's only axis once §3.3 lands |

One helper called from two places covers eight surfaces. Every one of them already
has explicit prev/next buttons, so the gesture is additive and discoverable —
which is the condition for adding a gesture at all.

**Do not add:** swipe-to-delete on rows (destructive, and `logNoDelete` /
`appendOnly` is the app's stated stance on the journal), pull-to-refresh (the app
is local-first with `startSharedSync`), or edge-swipe navigation (it collides with
iOS back).

### 7.4 Motion

`design/VISUAL_MOTION_SYSTEM.md` §5 specifies three motions. Shipped state:

- **Pine settle** — exists as an opt-in class. `.pine-settle` is hand-applied to 8
  elements (`.kid-dir-card`, `#stockQuickAdd`, the 4 `.stock-easy-btn`s, …). It
  should be the **default on `.btn`, `.page-act`, `.chip` and rows**, with the
  class deleted. A confirmation motion that only fires on the buttons someone
  remembered to tag is not a system.
- **Tide-line reveal** — applied to exactly one element (`kid-header kid-hero
  tide-reveal`, app.js:17589) plus `.tide-line` used as a *type* class on 6
  headings, which is a naming collision, not an implementation.
- **Handover ribbon** — `.ribbon-line` / `.ribbon-dot` exist; the stagger is not
  wired to the four vertically-connected lists that should have it (Buch timeline,
  Plan day blocks, Talk stream, kid `today` lessons).

`route-enter` (app.js, `renderChild` + the staff equivalent) runs 520ms on every
route change. That is the one motion that fires reliably, and it fires on
navigation — the moment the user is *least* interested in animation. Cap it at
`motion/base` (220ms) and make it opacity-only, per the system's
`prefers-reduced-motion` clause.

`feedback()` (app.js:3821) vibrates 8ms on tap, 14ms on save, `[18,40,18]` on
error. That's well-calibrated. It is currently also called from the dead swipe
path.

---

## 8. Three system-level plans

### Plan A — Tighten

**The idea in one line:** cap the chrome budget in a new CSS layer, without
touching a single template.

**Concretely** — new `ui-v246.css` loading after `ui-v245.css` (wire in all four
shells + allowlist in `server.py` and `api/index.py`, as v245 did), everything
inside `@media (max-width:899px)` and scoped `body.shell-m`:

1. **De-card the heroes.** Reverse `mobile/mobile.css:1607–1628` for
   `:is(.stock-overview, .shop-overview, .talk-overview, .kids-hero, .book-hero,
   .home-start-hero, .admin-ops-hero, .kid-hero)`: `padding: 4px 2px 8px;
   border: 0; background: none; box-shadow: none; border-radius: 0`.
2. **Hide the lede, keep the Easy hint.**
   `#view :is(.stock-overview, .shop-overview, …) > p:not(.easy-only) { display: none }`
   and `.stock-context > p { display: none }`. Saves 147→~38 (Home), 230→~38
   (Lager), 205→~38 (Liste), 197→~38 (Talk), 171→~52 (`.stock-context`).
3. **Hide the in-hero mode toggles.** `#view .ui-mode-row { display: none }` —
   completes what `ui-v244.css:217` started in the header.
4. **One kicker.** `#view :is(.brand-kicker, .home-start-kicker, .eyebrow,
   .talk-eyebrow) { font: 700 11px/1.2 var(--font-ui); letter-spacing: .12em }`.
5. **One stat row.** Shared rule across the 8 D1 selectors: 3-up grid, 44px,
   value `24px/1 var(--font-display)` with `font-variant-numeric: tabular-nums`,
   label `12px/1.2`.
6. **Cap ink inset.** The one nesting rule from §5.2. Fixes pocket/kinder/book.
7. **Shrink `.plan-week-chrome` 406→~150.** `.plan-week-summary { display: none }`
   (duplicated by `.week-jump` counts), `.week-ai-fill` and the `importWeek`
   button `display: none` (they live in `•••` on desktop already),
   `.week-layout-seg { display: none }` (Tabelle is a desktop matrix; the page
   already tells portrait users to rotate), `.plan-week-range` to one line.
8. **Header 57→48.** `header.app-chrome { min-height: calc(48px + var(--safe-t)) }`
   + `.topbar-row { height: 44px }`; hide `#btnTour` and `#btnLang` on phone.
9. **Dock 65→56.** `nav.dock { min-height: 56px; padding: 3px }`.
10. **Row density.** `#view :is(.kid-dir-row, .task-list > *, .store-row,
    .stock-row, .pocket-txn-list > *) { min-height: 48px }` and drop their
    individual borders/radii to hairline separators.
11. **Type floors.** `--t-body: 15px`, meta 13px, `.btn { font-size: 15px }`,
    `nav.kid-dock button span { font-size: 11px }`.

**Cost:** one file, ~200 lines, one pass. **Risk:** hiding the lede removes the
only in-page explanation for a new carer — mitigated by keeping `.easy-only`
visible, but it means Easy mode and Pro mode now differ in *content*, not just
density, which should be a conscious decision. `fitButtonLabels()` will re-fight
the 15px button floor and may add `.ui-fit-wrap`; needs a check.

**Buys:** staff median in-page chrome **254 → ~110px**; Lager **835 → ~330px**;
first content above Y=260 on 8 of 10 tabs. Plan and Taschengeld stay broken
(608px and 710px are structural, not stylistic).

**Leaves unsolved:** the two/three nav rows, the two house state keys, the Mehr
overflow, the dead swipe, empty states, the answer block (CSS can delete the hero
but cannot write the sentence that replaces it).

```
Plan A — phone
┌───────────────────────────────────────────────┐
│ A  Lager        ?  🔔  DE  ⓐ            48px  │  ← still fixed, still 4 buttons
├───────────────────────────────────────────────┤
│ LAGER                                         │
│ Kalyvia                                  38px │  ← de-carded, lede gone
│ ┌──────┬──────┬──────┐                        │
│ │  62  │  5   │  0   │                   44px │  ← one stat impl, still trivia
│ │ Art. │ Kat. │ Liste│                        │
│ └──────┴──────┴──────┘                        │
│ [Kalyvia][Limenaria][Julian][Val…]       44px │  ← house rail: still per-page
│ [🔍 Produkt suchen…            ] [•••]   44px │
│ [        + Hinzufügen              ]     44px │
│ (0 Achtung) (0 Leer) (62 Regale)         44px │
├───────────────────────────────────────────────┤  ← content at y≈330
│ Milch                    0   leer         ›   │
│ Butter                   1   wenig        ›   │
├───────────────────────────────────────────────┤
│  ⌂    ▤    ▢    ▦    •••                56px  │
└───────────────────────────────────────────────┘
```

---

### Plan B — Restructure  ← **recommended**

**The idea in one line:** make the page grammar a function in `app.js` instead of a
convention, so it cannot drift again.

**Concretely:**

1. **`pageShell()` helper**, placed next to `adaptiveChrome()` (app.js:23310):

   ```js
   pageShell({ title, answer, stats, primary, tools, filter, body })
   // → <div class="pg">
   //     <header class="pg-answer"><h1>…</h1><p class="pg-stats">…</p></header>
   //     <div class="pg-act">…one primary + icon tools + •••…</div>
   //     <div class="pg-filter">…optional, schedule only…</div>
   //     <div class="pg-body">…</div>
   //   </div>
   ```

   Four new classes replace 8 stat-row impls, 5 kicker classes, 6 section-header
   classes and 6 primary-CTA shapes.

2. **Migrate the 10 staff views**, ordered by measured chrome cost:
   `viewStock` (10584) → `viewSchedule` + `viewScheduleWeek` (10145 / 8842) →
   `viewPocket` (13361) → `viewShop` (14210) → `viewTalk` (7397) →
   `viewKids` (18177) → `viewHome` mobile branch (22553–22592) →
   `viewBook` (15956) → `viewAdminOps` (21421) → `viewGallery` (6865).
   Then the nine kid views via `childViewHtml` (23521), which already funnels them
   all through one place — the cheapest migration in the set.

3. **Write the answer for each page.** This is the design work, not the code work.
   Lager: *"4 Artikel fehlen"* from `counts.low + counts.empty` (already computed
   at 10725). Liste: *"9 Produkte für Freitag"* from `open.length` (14215).
   Plan: *"21 Aufgaben, 2 ohne Person"* from `weekEntries.length` /
   `unassignedCount` (8933–8934). Home: *"3 Aufgaben offen, Lagercheck fällig"*
   from `todayOpen` + `shiftStartCard`. Kinder: *"12 Kinder, 0 Hausaufgaben
   offen"* from `openHomework` (18211). Every number already exists; none of them
   is currently the headline.

4. **Global house.** One key. Delete `.planner-mobile-house` (10179–10182) and
   `#hFilter` (10167–10170); switch Plan's ten `state.houseFilter` reads (8616,
   8622, 8848, 8850, 9699, 9738, 10157, 10211) to `state.house`; keep
   `planningHouses()` / `shoppingHouses()` as render-time filters. Add the app-bar
   context chip + house sheet. `unsavedChangeParts()` (11369) already guards the
   switch.

5. **Empty the header top-right.** Move `#btnNotifs`, `#btnLang`, `#btnTour`,
   `#btnUser` into a *Konto & Hinweise* group at the top of `sheetMobileMore()`
   (24854); badge count onto `#dockMore`. Touches the header markup in all four
   shells (index.html:6143–6155 and its three generated copies — regenerate via
   `scripts/build-shell-sites.py`, don't hand-edit).

6. **Dock → Home · Plan · Vorrat · Buch · Mehr.** Merge `viewStock` + `viewShop`
   behind a `Bestand | Einkauf` segment (they share `state.house` and
   `DB.listEntries` and already cross-link at 10782). Promote `book`; demote
   `stock`/`shop`'s separate `data-tab` entries.

7. **One `emptyState()`.** Replace the 19 bare `.empty` uses, 4 `.shop-empty`, 2
   `.journal-blank` and the `.mobile-empty-row` with `emptyState()` (3840), and
   make the `ctaHtml` argument **required** — every dead end gets a way forward.

8. **Wire the swipe.** Extract `wireHorizontalSwipe()` from 23929–23949; emit
   `data-week-swipe` in `weekAgendaBoardHtml`; call from `wirePaidiaCal` (10026).
   Render `weekSwipeHint` (247) once, on first visit only.

9. **Retire `fitButtonLabels()` on `body.shell-m`.** Fixed scale + shortened
   strings + two-line labels where needed.

**Cost:** ~2 weeks. 10 view functions, 1 sheet, 1 helper, the header markup in 4
shells, one new CSS layer. **Risk:** (a) the house-state merge changes what Plan
shows after a Lager house switch — that is the intended behaviour but it is a
behaviour change and needs a note in `CHANGELOG.md`; (b) merging Lager+Liste is
the largest single change and should ship behind the existing `data-tab` routing
so the old tabs still resolve; (c) `pageShell()` migration is 10 independent
diffs — ship them one per pass, not as one commit.

**Gains:** one grammar, enforced by a function. First content ≤156px on every
non-exempt screen. House answered once, globally. Six destinations in the thumb
zone instead of four. The frequent action (notifications) moves from the hardest
band to the easiest.

```
Plan B — phone, the shared grammar
┌───────────────────────────────────────────────┐
│  Lager · Kalyvia ▾                    •••     │  48px  app bar, collapses
├═══════════════════════════════════════════════┤
│                                               │
│  4 Artikel fehlen.                            │  64px  ANSWER — plain content
│  2 leer · 2 wenig · 58 ok                     │        h1 = title, Fraunces 26
│                                               │
├───────────────────────────────────────────────┤
│ ┌───────────────────────┐  ┌────┐  ┌────┐     │  44px  ACT — sticky
│ │    + Hinzufügen       │  │ 🔍 │  │••• │     │        one filled primary
│ └───────────────────────┘  └────┘  └────┘     │
├═══════════════════════════════════════════════┤  ← content at y=156
│  Milch                        0    leer   ›   │  48px rows, hairlines,
│ ───────────────────────────────────────────── │  full gutter width, no
│  Butter                       1    wenig  ›   │  per-row border or radius
│ ───────────────────────────────────────────── │
│  Eier                        12    ok     ›   │
│ ───────────────────────────────────────────── │
│  Tomaten                      4    ok     ›   │
│ ───────────────────────────────────────────── │
│  Reis                         2    ok     ›   │
│ ───────────────────────────────────────────── │
│  Öl                           3    ok     ›   │
│ ───────────────────────────────────────────── │
│  Salz                         1    wenig  ›   │
│ ───────────────────────────────────────────── │
│  Brot                         2    ok     ›   │
│                       ⋮                       │
├───────────────────────────────────────────────┤
│   ⌂       ▤       ▢       ▦      •••     56px │  Home Plan Vorrat Buch Mehr
│  Home    Plan   Vorrat   Buch    Mehr³        │  ³ badge = unread notifs
└───────────────────────────────────────────────┘

Plan B — the one permitted exemption (schedule/week, §1.4)
┌───────────────────────────────────────────────┐
│  Plan · Kalyvia ▾                     •••     │  48px
├═══════════════════════════════════════════════┤
│  21 Aufgaben diese Woche.                     │  64px  ANSWER
│  2 ohne Person · Besprechung Mo 13:30         │
├───────────────────────────────────────────────┤
│ ┌───────────────────────┐  ┌────┐  ┌────┐     │  44px  ACT — sticky
│ │     + Eintrag         │  │ 📷 │  │••• │     │
│ └───────────────────────┘  └────┘  └────┘     │
├───────────────────────────────────────────────┤
│ ‹ MO  DI  MI  DO  FR  SA  SO ›           44px │  SLOT 4 — sticky day rail,
│   7.9  8.9 9.9 10.9 11.9 12.9 13.9            │  the only permitted 4th slot
│    3    3   4    4    5    2    0             │  ← swipe here = ±1 day
├═══════════════════════════════════════════════┤  ← content at y=200
│  MONTAG 7.9.                                  │
│  10:00  Frühstück            Zoi          ›   │
│  15:00  Hausaufgaben         —            ›   │
│  19:00  Abendessen           Angelos      ›   │
│                       ⋮                       │
└───────────────────────────────────────────────┘
```

---

### Plan C — Rethink

**The idea in one line:** the phone is not a small desktop, it is a shift
instrument — so stop shipping 13 destinations to it and ship the shift.

**Premise.** A carer on shift arrives with three questions: *what do I do next*,
*what's missing*, *what does the next shift need to know*. The phone currently
answers those with 13 destinations, four of which are reachable. And the app
already knows the answers — `viewHome` computes `overdue`, `todayOpen`,
`openListCount`, `lowStockCount` and weights them in `pulsePool`
(app.js:22535–22540), then throws all but two away (`.slice(0, 2)`).

**Structure.** Three destinations.

- **Schicht** — one chronological queue of *actionable* cards, drawn from the
  predicates that already exist: `homeShiftStartCardHtml` (7914),
  `shiftStockCheckBannerHtml` (11670), `shiftPresenceBannerHtml` (7886),
  `showJournalDuty`, `todayAssignments`, `overdue`, `pulsePool`, `fridayEntries`.
  Tapping a card opens **the task** — a sheet — not a page.
  `sheetShiftStockCheck` (11735), `sheetEntry` (10206), `sheetStockQuickAdd`
  (11927) and `shiftDiaryCard` already work this way; the pages around them are
  the part that isn't needed on a phone.
- **Suchen** — one field over products, kids, schedule entries and journal.
  Replaces browsing. `stockSearch`, `bookFilter.q`, `pocketQuery` and
  `state.stockQuery` are four separate search implementations today; one is enough.
- **Team** — Talk + Buch, the two communication surfaces, as one destination with
  a segment.

Plus `•••` for the long tail. The full 13-page IA stays on **`desk/index.html`**,
which already exists — so this is a divergence between two shells that are already
separate builds, not a feature deletion.

**What would have to be true:**

1. **The predicates must be trustworthy enough to be the whole UI.** Today
   `pulsePool` is hand-weighted (`weight: overdue.length ? 400 : 40`) and truncated
   to two items, which suggests the team does not yet trust them to rank. That
   ranking has to become real before it can be the navigation.
2. **Staff must actually arrive with a task, not a browse intent.** Unknown —
   §10 Q1. If a carer's real pattern is "open Lager and scan the shelves", a queue
   is the wrong shape and Plan B is the ceiling.
3. **Empty days must not break the phone.** On a quiet shift the queue is empty
   and the device becomes useless — which is why *Suchen* has to be a real
   destination, not a modal.
4. **Kid views stay as they are.** They are already close to budget (§0.1) and a
   child's mental model is "my pages", not "my queue". Plan C is a staff-only
   proposal.

**Cost:** 4–6 weeks and a product decision, not a design one. **What it buys:**
first content at Y≈112 with zero filters, zero heroes and zero segments, because
there is nothing to filter — the queue is already the answer.

```
Plan C — phone
┌───────────────────────────────────────────────┐
│  Schicht · Kalyvia ▾                  •••     │  48px
├═══════════════════════════════════════════════┤
│  Mo 7.9. · Nachmittag · Angelos               │  ← content at y≈112
│ ───────────────────────────────────────────── │
│ ┌───────────────────────────────────────────┐ │
│ │ ⚠  Lagercheck fällig                      │ │  the queue. each card is
│ │    seit Schichtbeginn      [Starten]      │ │  a task, not a page.
│ └───────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────┐ │  ranked by the predicates
│ │ ▤  3 Aufgaben offen                       │ │  that already drive
│ │    15:00 Hausaufgaben · ohne Person   ›   │ │  pulsePool / shiftStartCard
│ └───────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────┐ │
│ │ ▢  4 Artikel fehlen                       │ │
│ │    Milch · Butter · Salz · Brot       ›   │ │
│ └───────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────┐ │
│ │ ▦  Übergabe noch nicht geschrieben        │ │
│ │    Schicht endet 19:00     [Schreiben]    │ │
│ └───────────────────────────────────────────┘ │
│                       ⋮                       │
├───────────────────────────────────────────────┤
│    ◷ Schicht      🔍 Suchen     ▣ Team   •••  │  56px, 3 + Mehr
└───────────────────────────────────────────────┘
```

---

### Recommendation

**Plan B, with Plan A shipped first as its foundation.**

Plan A is not an alternative to Plan B — it is Plan B's first week, expressed
entirely in CSS. Everything in Plan A survives Plan B unchanged, so there is no
throwaway work. Ship A (one file, one pass, measurable: staff median in-page
chrome 254→110px), then migrate views one per pass behind `pageShell()`.

Plan C is the right long-term answer *if* the owner confirms Q1 in §10, and it is
cheap to test without building it: instrument which dock destination staff open
first after login for two weeks. If it is Home >70% of the time, staff already
behave as if Plan C were true and the queue is worth building. If they scatter
across Lager/Plan/Liste, Plan B is the ceiling and Plan C is a trap.

**The single highest-value change, sized to ship today:** the answer block on
Lager. Delete `.stock-pantry-hero`'s kicker + lede + `.stock-context`'s
paragraph, and replace the `h2` `Kalyvia` with `${counts.low + counts.empty}
Artikel fehlen` — using values already computed at `app.js:10725`. That is
~15 lines across `viewStock` and one CSS block, it moves Lager's first shelf from
**Y=892 to Y≈330**, and it turns the app's most-opened staff page from a
description of the feature into an answer to the question.

---

## 9. Prioritised backlog

Severity: **P0** = content is below the fold or unreachable · **P1** = the page
answers the wrong question or the same concept renders differently ·
**P2** = polish. Effort: **S** ≤ 1 pass · **M** ≤ 3 passes · **L** > 3 passes.

| # | change | sev | eff | pages touched | plan | evidence |
|---|---|---|---|---|---|---|
| 1 | **Answer block** replaces hero + stat row + lede | P0 | M | Home, Plan, Lager, Liste, Kinder, Taschengeld, Talk, Buch, Admin, kid ×9 | B | §0.1, §1.2 |
| 2 | **De-card the heroes** (reverse `mobile.css:1607–1628`) | P0 | S | all staff + kid heroes | A | hero 147–230px measured |
| 3 | **Lager: content below the fold** — first shelf at Y=892 | P0 | S | Lager | A | measured |
| 4 | **Plan: 608px of chrome, 4 nav levels** | P0 | M | Plan | A+B | measured |
| 5 | **`.pocket-kids-rail` = 618px vertical sidebar** (D12) | P0 | S | Taschengeld | A | app.js:13504 |
| 6 | **Collapse header on scroll** (57px back on every page) | P0 | S | all | A | index.html:130 sticky |
| 7 | **Global house, one state key** (D4) | P1 | M | Plan, Lager, Liste, Home | B | `state.house` vs `state.houseFilter` |
| 8 | **Empty the header top-right** → Mehr; badge → `#dockMore` | P1 | M | all (4 shells) | B | §7.2 reach data |
| 9 | **One primary CTA per page**; rest behind `•••` (D7) | P1 | M | Plan, Lager, Liste, Home, Kinder | A+B | 6 CTA shapes |
| 10 | **One stat-row implementation** (D1) | P1 | S | 8 pages | A | 4 sizes, 3 line-heights |
| 11 | **One empty-state implementation, CTA required** (D6) | P1 | M | all | B | 5 impls, 26 sites |
| 12 | **Nesting cap / ink-inset ≤24px** (§5.2) | P1 | S | Taschengeld 59, Kinder 75, Buch 78 | A | measured insets |
| 13 | **Type scale: body 15, meta 13, button 15** | P1 | S | all | A | §4.1 |
| 14 | **Retire `fitButtonLabels()` on phone** (D13) | P1 | M | all | B | `w650` measured |
| 15 | **Page title in one typeface** (D3) | P1 | S | Home vs rest | A | Fraunces 23.58 vs Outfit 28 |
| 16 | **One kicker token** (D2) | P1 | S | all | A | 5 classes, 3 sizes |
| 17 | **Wire the swipe + `wireHorizontalSwipe()`** (§7.3) | P1 | M | Plan ×2, Buch, Liste, kid ×4 | B | `data-week-swipe` never emitted |
| 18 | **Dock → Home·Plan·Vorrat·Buch·Mehr**; merge Lager+Liste | P1 | L | Lager, Liste, Buch, dock (4 shells) | B | 9/13 behind Mehr |
| 19 | **Rows, not cards** — hairline-separated lists (§5.2) | P1 | M | Kinder, Taschengeld, Buch, Lager, Liste, Home | B | 3–6 cards/screen |
| 20 | **Banner budget: max 1, dismissible** | P1 | S | Lager (2 stacked), Home, Plan | A | 143px measured |
| 21 | **Kinder: 7 pane tabs, 4 off-screen** (D11) | P1 | S | Kinder | A+B | x=393/472/582 |
| 22 | **`.ui-mode-row` out of 6 page heroes** → Mehr | P1 | S | Liste, Kinder, Talk, Buch, Home ×2 | A | §2.2 |
| 23 | **One section-header class** (D8) | P2 | M | all | B | 6 shapes, 55 sites |
| 24 | **Unify rail treatment lists** (D5) | P2 | S | Plan, Kinder, Taschengeld, Lager, Liste, Buch, Talk | A | 3 mismatched lists |
| 25 | **Location stated once, not 2–3×** (D9) | P2 | S | all staff, kid ×8 | B | §6 D9 |
| 26 | **`p.muted` size unified + `mode-easy` multiplier** (D10) | P2 | S | all | A | 12 vs 14.4px |
| 27 | **Dock 65→56, gutter unify 12px, rows 48px** | P2 | S | all | A | §4.4 |
| 28 | **`pine-settle` default on `.btn`; drop the class** | P2 | S | all | B | 8 hand-tagged |
| 29 | **`route-enter` 520→220ms, opacity-only** | P2 | S | all | A | design system §5 |
| 30 | **Handover-ribbon stagger on the 4 sequential lists** | P2 | M | Buch, Plan day, Talk, kid today | B | `.ribbon-line` unused |
| 31 | **Fix the chrome tokens** — `--nav-h`/`--header-h` describe nothing | P2 | S | all (4 shells + mobile.css) | A | 4 values, 2 heights, 0 correct |
| 32 | **Admin: phone becomes a section index** (§1.4) | P2 | M | Admin | B | `ops-overview` 2537px |
| 33 | **Sticky act row + docked primary bar in the easy band** | P2 | M | Lager, Liste, Plan, Buch | B | §7.2 |
| 34 | **Verify: Lager's active house chip is off-screen** in the v245 capture despite `revealActiveRailChips()` (app.js:11357) | P2 | S | Lager | — | hero reads `Kalyvia`, rail starts at `Limenaria`; mechanism unconfirmed |

---

## 10. Open questions for the owner

These are product decisions. They change which plan is correct, so they should be
answered before the per-page plans commit.

1. **Does a carer arrive with a task or a browse intent?** Plan C stands or falls
   on this, and it is cheap to measure: log the first dock destination after login
   for two weeks. Do not guess.
2. **Is the house a property of the shift or of the task?** §3.3 asserts it is the
   shift — one global value. If a carer routinely works across two houses in one
   shift and switches per task, the global chip is wrong and the per-page rails
   should stay (but should still share one state key).
3. **Should Lager and Liste be one destination?** They share state and cross-link,
   which argues yes. But if the shopping trip is done by a different person than
   the stock check, they are two jobs and merging them puts each person through the
   other's segment.
4. **Which is the more common state — near-empty or loaded?** Every v245 capture
   is a near-empty fixture (0 messages, 0 list items, 0 grades, 12 kids with no
   data). If that is representative of daily reality, the empty state is the
   primary composition and item 11 outranks item 1. If it is a fixture artefact,
   the row density in §4.4 matters more.
5. **Does Easy mode differ in density or in content?** Plan A keeps the hero ledes
   only in `.easy-only`, which makes Easy the mode that *explains* and Pro the mode
   that *doesn't*. That is defensible but it is a change of definition — today Easy
   is framed as a density toggle.
6. **What is Buch's real cadence?** Item 18 promotes it to the dock on the
   assumption that every shift writes a handover (`showJournalDuty` implies it). If
   it is written once a day by one person, it belongs in Mehr and the fifth dock
   slot should go to Kinder or Talk.
7. **Is the phone the only staff surface on shift, or do carers also use the PC?**
   If the desk shell is genuinely used mid-shift, Plan C's divergence is free. If
   the phone is the only device, removing 10 destinations from it is not a
   divergence, it is a deletion, and Plan B is the ceiling.
8. **What are the 4 remaining unread notifications for?** The captures show a
   persistent badge of 2. If notifications are mostly noise, moving them to Mehr
   (item 8) is a straight win; if they are time-critical, they need a dock badge
   *and* an in-content surface, not just a sheet row.
