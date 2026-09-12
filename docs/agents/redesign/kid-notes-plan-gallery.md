# Kid Notizen · Plan · Momente — redesign

Surfaces reviewed (v245-true harness, trust these):
`.qa-screens/v245-true/phone-kid-{notes,plan,gallery}.png`,
`.qa-screens/v245-true/pc-kid-{notes,plan,gallery}.png`.

Shared chrome (all three): `renderChild()` wraps every view with
`kidBackHtml()` + `kidGuideHtml()` (`app.js:19638–19644`). Guide is
`display:none` on phone (`ui-v110.css:6315–6317`); on PC it is the "DU BIST
HIER" card. Plan + gallery live under dock **Mehr**
(`kidDockActiveView` → `'more'`, `app.js:17182–17186`); Notizen is a primary
dock tab (`kidPrimaryNavItems`, `17257`).

---

# Page 1 — Kid Notizen (`childView === 'notes'`)

Code: `childNotizenView()` `app.js:19310–19359`, `kidNotesCalHtml()`
`18966–18989`, `bindKidExtras` notes branch `19383–19464`,
`kidOwnsNoteRow()` `3145–3149`. Staff mirror: `viewKidProfile` notes card
`18264–18266` + `18320–18326`. Strings: `kidNotesKicker` / `kidNotesAsk` /
`kidNotesEmptyHint` `892–900`. CSS: moods/compose `index.html:4945–4971`,
empty-cal hide phone-only `ui-v245.css:90–92`, hero compact
`ui-v245.css:61–80` + `index.html:4264–4268`, pine-tint hero override
`ui-v110.css:7397–7400`.

---

## 1. What this page is for

A child opens Notizen to answer one question: **how do I feel, and what do I
want to keep for myself today?** The data model matches that — mood chip + short
text, stored as `{kidId, by:kidId, mood, text, ts}` (`19454`, `19458`).

The page currently also answers a second, adult question — "which calendar day
had notes?" — via `kidNotesCalHtml` + `state.notesCalDay`. And the copy fights
itself: the kicker says *Nur für dich* while the empty hint (correctly) says
carers can read them. The job the child hires is private diary; the product as
shipped is a shared care-journal the child authors.

---

## 2. Read of the current design

### Phone (order the eye receives)

1. App header: Simon · Notizen + utility cluster.
2. Compact hero (`.kid-hero.kid-hero-compact`): eyebrow
   `ARMONIA · NUR FÜR DICH`, title **Notizen**, prompt **Wie war dein Tag?**
3. Compose card: three mood pills (Gut on), textarea, full-width
   **Notiz speichern**.
4. Empty list card: icon, **Noch keine Notizen…**, honest line
   **Nur du und deine Betreuer sehen deine Notizen.**, CTA **Notiz schreiben**.

The month calendar is in the DOM (`19350`) but **hidden** when no day has
`.cal-cell.has` (`ui-v245.css:90–92`, max-width 899px). So on an empty fixture
phone is accidentally correct: write first. Measured first-content ~124px
(`DEVICE-phone.md` notes row).

### PC (order the eye receives)

1. Sidebar + desk header (Einfach/Pro on).
2. Guide card **DU BIST HIER / Notizen / Schreib auf…** + **So geht's**.
3. Same hero as phone (title repeated a third time after header + guide).
4. Full **September 2026** month grid — empty, today ring on the 8th — owning
   the viewport.
5. Compose + list are below the fold. FAB sparkle bottom-right.

PC never got the empty-cal collapse (`ui-v245` rule is phone media only), so
desktop still leads with a blank calendar.

### Hierarchy implied vs. hierarchy needed

| Layout says | Task needs |
|---|---|
| Brand privacy claim → title → calendar → compose → history | Mood → write → save → then history |
| "Only for you" as the loudest text signal | Honest audience: you + Betreuer |
| Day-grid as primary nav | Chronological list; day filter only when volume warrants it |

### Density — what earns its space

**Earns it:** mood pills (large, three-way, tinted `.kid-mood.in|warn|out`),
textarea with kid-scale placeholder, primary save, empty-state honesty line.

**Does not:** hero repeating the dock label; PC guide card repeating the hero
hint; empty month grid (~345px historically, still present on PC); empty CTA
**Notiz schreiben** that only `scrollIntoView`s the compose already on screen
(`19400–19409`); tour copy claiming notes stay "auf diesem Gerät"
(`app.js:4925`) while `/api/kid-ops` syncs them.

### Empty vs. realistic volume

Empty is the common case for a new child (fixture). With a few notes/week the
list is the right default; the calendar only starts earning space once many
days have markers. Day-filter toggle (`state.notesCalDay`) is fine as Pro
detail, not as the page.

### Deliberate good decisions — leave alone

- Mood as first-class field (not buried in text).
- `kidOwnsNoteRow` hides staff-authored rows from the child's compose list
  (`3145–3149`, comment at `19301–19303`).
- Phone empty-cal hide in v245.
- Empty hint already states shared visibility (`kidNotesEmptyHint`).

### Notizen vs. Bewertung

They are **not** the same job, despite adjacent "how was …" copy:

| | Notizen | Bewertung (`childBewertungenView` `19233`) |
|---|---|---|
| Question | How was *my* day / what do I want to remember | How did the *team* rate my week (1–6) |
| Agency | Child writes | Child reads only (`kidRateLead`) |
| Grain | Day + mood | Week + subjects |
| Dock | Primary tab | Primary tab |

Overlapping prompts (`kidNotesAsk` "Wie war dein Tag?" vs `kidRateKicker`
"Wie lief die Woche?") create false kinship. Keep two surfaces; align the
language so Notizen is *feeling / remembering* and Bewertung is *grades /
team*.

---

## 3. Three plans

### Plan A — Tighten (CSS + copy)

**Idea:** Make the honest page readable without changing behaviour.

Concrete changes:

- Rewrite `kidNotesKicker` DE/EL (`892`, `2144`) to match
  `kidNotesEmptyHint` — e.g. *Für dich & deine Betreuer* / drop the false
  "only you". Fix tour string at `4925` the same way.
- Extend empty-cal hide to desktop:
  `body.mode-child #view .kid-tab-cal-wrap:not(:has(.cal-cell.has)){display:none}`
  outside the phone media query (promote `ui-v245.css:90–92`).
- On notes only, demote hero: hide `.kid-hero .eyebrow` or drop the hero when
  title == dock label (`childNotizenView` `19343–19348`) — one-line template
  trim.
- Bump `.kid-hero .eyebrow` / `.kid-hello` contrast on pine-tint surfaces
  (ui-v110 `#view .kid-hero` ink path) so the kicker is legible once honest.
- Soft-hide empty CTA when `#kidNoteCompose` is already in view (CSS
  `:has(#kidNoteCompose)` sibling trick, or drop `emptyCta` when `!day`).

**Cost:** half day, low risk. **Leaves unsolved:** staff profile still dumps
child rows without attribution; calendar-as-nav when data exists; duplicate
"how was my day" with Bewertung.

```
PHONE A                         PC A
┌─────────────────────┐         ┌────┬──────────────────────┐
│ header              │         │nav │ guide (optional thin)│
├─────────────────────┤         │    ├──────────────────────┤
│ [Gut][Geht][Schwer] │         │    │ moods + textarea     │
│ ┌ textarea ┐        │         │    │ [Speichern]          │
│ [ Speichern ]       │         │    │ list / empty         │
│ list / empty+honest │         │    │ (cal only if .has)   │
│ dock · Notizen on   │         └────┴──────────────────────┘
└─────────────────────┘
```

### Plan B — Restructure (recommended shape)

**Idea:** Write-first diary; history as a feed; calendar demoted to "Tage mit
Notizen" disclosure.

Concrete changes in `childNotizenView` (`19310–19359`):

1. Drop compact hero (header already names the view) or reduce to one prompt
   line: privacy sentence + `kidNotesAsk`.
2. Compose first (already is on phone once cal is hidden).
3. Move `kidNotesCalHtml` behind `<details class="kid-notes-days">` labelled
   with count of marked days; only render when `markers.size > 0`.
4. List as reverse-chron feed; day filter chips ("Heute / Diese Woche / Alle")
   instead of month grid for typical volume.
5. Empty state: keep honest hint; remove redundant **Notiz schreiben** or make
   it focus `#kidNoteText` only when compose is off-screen.
6. Staff side (paired, small): in `viewKidProfile` `18264`, split or badge
   `by===k.id` vs staff (`18320–18326`) — child rows labeled *vom Kind* + mood.

**Cost:** 2–3 days, medium risk (cal day-filter state, tour `kid-notes`).
**Gains:** child always sees who can read; write path unblocked on both
surfaces; calendar stops impersonating the product.

```
PHONE B                         PC B
┌─────────────────────┐         ┌────┬──────────────────────┐
│ header              │         │nav │ Notizen              │
├─────────────────────┤         │    │ „Betreuer können…“   │
│ Betreuer können mit-│         │    ├──────────────────────┤
│ lesen. Wie war…?    │         │    │ compose (left)       │
│ [Gut][Geht][Schwer] │         │    │ feed (right)         │
│ textarea            │         │    │ details: Kalender    │
│ [Speichern]         │         └────┴──────────────────────┘
│ ── Deine Notizen ── │
│ cards… / empty      │
└─────────────────────┘
```

### Plan C — Rethink

**Idea:** Notizen becomes the child's *day check-in* on Start; the dock tab
becomes a private journal only if product chooses true privacy — or merges
mood into Bewertung as "my voice" beside team grades.

Would require: owner decision on privacy (see §5); either (a) encrypt / never
surface child `by:kidId` rows to staff, or (b) rename + redesign as shared
care journal everywhere; Start absorbs one-tap mood; Bewertung grows a "dein
Beitrag" strip. High cost, touches Start + rate + staff profile + sync.

Only worth it if notes volume is near-zero *and* carers rely on the staff
card as the real consumer.

```
PHONE C (check-in on Start)     or C' (true private journal)
┌─────────────────────┐         ┌─────────────────────┐
│ Start               │         │ Notizen (device-local│
│ Wie fühlst du dich? │         │  or PIN-gated)      │
│ [😊][😐][😔]        │         │ no staff mirror     │
│ optional one line   │         └─────────────────────┘
│ → full journal link │
└─────────────────────┘
```

---

## 4. Recommendation

**Plan B**, with Plan A's copy + empty-cal desktop fix shipping today.

**Ship today (highest value):** change `kidNotesKicker` (and tour `4925`) so
the first words the child reads match `kidNotesEmptyHint`. One string pair,
zero layout risk, stops the product lying above the fold.

---

## 5. Open questions for the owner

1. **Who may read child-authored notes?** Today: staff profile lists all
   `kidId` rows with no `by` attribution (`18264`), while the child UI
   promises shared visibility only in the empty hint and promises privacy in
   the kicker. Pick one product: (A) shared care journal — honest copy +
   attributed staff card; (B) child-private — exclude `by===kidId` from staff
   UI and sync policy; (C) opt-in share per note. Design must not paper over
   this.
2. Typical volume: few notes/week, or daily diary?
3. Should mood without text be allowed (check-in only)?
4. Keep Notizen on the primary dock, or demote under Mehr once honesty is
   fixed?

---

# Page 2 — Kid Plan (`childView === 'plan'`)

Code: `childStundenplanView()` `app.js:17650–17691`, data via
`childEntriesFor()` `16033–16037` (same `entriesFor` schedule as staff, filtered
to this child's `childIds`). Nav: `kidMoreNavItems` plan row `17265`, hint
`kidGuideHintPlan` `438` / `17214`. Related "next up" already lives on Start:
`childStartView` `17548–17578`. CSS: `.kid-header` dark hero
`index.html:3997–4008` + mode-child unify `4248–4294`; `.stundenplan` /
`.sp-week` / `.sp-day` / `.sp-block` `4090–4114`; phone densify
`ui-v213.css:351–352`.

Known defect (fixing separately): `.kid-header .eyebrow` / mode-child eyebrow
at ~1.16:1 on the dark gradient — note and move on.

---

## 1. What this page is for

The child arrives asking: **what am I doing next, and when?** Secondary: what
does the rest of today / this week look like for *me*.

The page currently answers: **pick a day in this week, then see that day's
blocks** — a shrunk staff day browser. Data filtering is correct
(`childEntriesFor`); the reading task is still adult (week strip → empty day
card) rather than child (next event → today list → peek at other days).

---

## 2. Read of the current design

### Phone

1. Zurück (Mehr-only back bar — correct after v245).
2. Dark gradient `.kid-header`: nearly invisible **ARMONIA**, loud white
   **Stundenplan** (~116px hero; first content ~192px per DEVICE-phone).
3. Seven `.sp-day` chips MO–SO; DI 8 selected.
4. Empty state: **Heute ist nichts eingetragen**.
5. Dock: Mehr active.

No month calendar here — week strip only. Good habit break vs Notizen/Start.

### PC

Same stack plus guide card (**DU BIST HIER / tippe einen Tag an**) and FAB.
Hero + guide + week strip push the empty state mid-viewport. Title appears
four times (sidebar Mehr, header subtitle, guide, hero).

### Hierarchy implied vs. needed

| Layout says | Task needs |
|---|---|
| Brand banner → pick a weekday → maybe content | **Now / next** → rest of today → other days |
| Empty day is a dead end | Empty today should offer tomorrow / week peek / back to Start games |
| Same visual language as staff week jump | Larger day targets, plain language ("Dienstag"), time as the spine |

### Density

**Earns:** week strip (genuine nav for a schedule); `.sp-block` with `now`
line when data exists (`17670–17675`).

**Does not:** full-bleed dark hero that only repeats the title; guide card on
PC; Easy-mode hint paragraph under the title (`17686`); showing seven equal
days when the question is "what's next".

### Empty vs. realistic volume

Fixture empty is common if the child's `childIds` aren't on today's entries.
With a real Thassos week the rail fills; the *now* marker and time column
then matter. Start already computes `next` / `lessons` (`17543–17578`) —
Plan does not reuse that "next up" card.

### Is this an adult plan painted for a child?

**Half.** Data path is child-scoped (good). UX path is staff day-picker without
assignees/houses (also good — those are stripped). Missing: next-up as default,
plain-day language, forgiveness when today is empty, and any link to Aufgaben
for the same day. It does **not** render the staff matrix; it still *thinks*
like a miniature planner.

### Deliberate good — leave alone

- Filter via `childEntriesFor` (never show other kids' full roster).
- `isNow` progress line on the current block.
- Week strip instead of month grid.
- Plan under Mehr (advanced), Start carrying today's lessons.

---

## 3. Three plans

### Plan A — Tighten

**Idea:** Kill chrome; keep week strip + day list.

- Drop or radically shrink `.kid-header` on plan (title is in app chrome);
  leave eyebrow fix to the parallel contrast patch.
- Hide `kidGuideHtml` for plan on desktop too, or collapse to one line
  (`kidGuideHtml` `17234–17248`).
- Enlarge `.sp-day` tap floors on phone (undo over-shrink in
  `ui-v213.css:351–352`; aim ≥44px — `index.html:4492` already sets
  `min-height:48px` in one breakpoint; verify cascade).
- Empty state: add secondary chip "Morgen ansehen" / `data-date` tomorrow and
  link `data-child-view="today"`.

**Cost:** <1 day. **Leaves:** still day-first, not next-first.

```
PHONE A
┌─────────────────────┐
│ ← Zurück            │
│ [MO][DI]…[SO]       │
│ empty / blocks      │
│ [Morgen] [Start]    │
└─────────────────────┘
```

### Plan B — Restructure (recommend)

**Idea:** Child agenda — **next up**, then today, then week peek.

Rewrite `childStundenplanView` (`17650–17691`):

1. Reuse Start's next-up pattern (`17559–17578`) at top when `state.date ===
   today`.
2. Today list as large `.sp-block` rows (time | activity | optional mates from
   `childEntryCard` `16039–16053` — currently unused by Plan!).
3. Week strip sticky under next-up; label days `DI 8` → `Dienstag` on phone
   width if space, else keep short + `aria-label`.
4. Empty today: show next day that has `childEntriesFor` length > 0 within the
   week, with copy "Als nächstes: Donnerstag".
5. Optional Pro: house/caregiver line from `childEntryCard` meta.

**Cost:** 2–4 days. **Gains:** answers the real question; reuses existing
helpers; still one schedule source of truth.

```
PHONE B                         PC B
┌─────────────────────┐         ┌────┬──────────────────────┐
│ NÄCHSTES            │         │nav │ Nächstes · 14:00     │
│ 14:00  Schwimmen    │         │    │ Fußball              │
├─────────────────────┤         │    ├──────────────────────┤
│ Heute               │         │    │ Heute (rail) │ Woche │
│ 09:00 …             │         │    │            │ strip  │
│ 14:00 … ← now       │         │    │            │ + list │
├─────────────────────┤         └────┴──────────────────────┘
│ MO DI MI …          │
└─────────────────────┘
```

### Plan C — Rethink

**Idea:** Delete Plan as a page; Start's today lessons + next-up *are* the
child schedule. Week overview becomes a sheet from Start ("Woche").

Worth it if Plan analytics stay near-zero and Mehr is already overloaded.
Cost: redirect `childView==='plan'` → today focus; migrate
`kidGuideHintPlan`; update Mehr list. Risk: carers who taught kids "open
Stundenplan" lose a named destination.

```
PHONE C
┌─────────────────────┐
│ Start               │
│ Next-up + lessons   │
│ [Woche ansehen] →   │
│   sheet: 7 days     │
└─────────────────────┘
```

---

## 4. Recommendation

**Plan B.** The data is already filtered; the missing design is a child reading
order.

**Ship today:** on empty day, compute the next dated day in `week` with
entries and offer one button — replaces a dead-end empty state without a hero
rewrite. Pair with whatever eyebrow contrast fix is already in flight.

---

## 5. Open questions for the owner

1. Is Plan primarily school blocks, leisure, or both on this house's schedule?
2. Should children see caregiver names / house on a block (`childEntryCard`
   already supports it)?
3. Keep a named Stundenplan destination, or fold into Start?
4. Real empty rate: are kids often unassigned on `childIds`, or is the fixture
   lying?

---

# Page 3 — Kid Momente / Gallery (`childView === 'gallery'`)

Code: `childGalleryView()` `app.js:6920–6921` → **`return viewGallery()`**
(`6865–6917`). Feed cards `galleryPostCard` `6763–6817`, org bar
`6725–6754`, compose sheet for kids `bindGallery` `6926–6928` →
`sheetGalleryCompose`. Nav: Mehr, **Pro-only** (`kidMoreNavItems` `17271`).
Shell: `sectionShellHtml` `21358–21380` (Feed / People / Neu + mobile picker).
No month calendar (correct).

---

## 1. What this page is for

A child opens Momente to answer: **show me our photos — especially ones with
me — and let me enjoy them.** Secondary: share a new moment if allowed.

Today the page answers the staff question: **organise and moderate the house
gallery** (Feed / People / Neu, refresh, category chips, report, Drive). The
kid branch is a function alias, not a product.

---

## 2. Read of the current design

### Phone

1. Zurück.
2. `section-shell-hero`: low-contrast eyebrow `ARMONIA THASSOS · MOMENTS`,
   **Große Momente**.
3. Triple chrome for the same nav: pill links Feed/People/Neu **and** a
   full-width `<select>` picker (`sectionShellHtml` `21365–21368`,
   `ui-v213.css:805–821`).
4. **Neu** camera bar + refresh (Pro).
5. Empty: **Noch keine Momente. Sei der Erste!** + **Moment teilen**.
6. Dock Mehr on.

First content ~96px — best chrome budget of the three pages
(`DEVICE-phone.md`), then wasted on duplicate nav.

### PC

Guide card (**Weitere Seiten: Plan, Lernen, Sterne.**) + same gallery shell
with vertical Feed/People/Neu rail + Neu bar + empty. FAB. Feels like Admin
Momente with a kid header glued on.

### Hierarchy implied vs. needed

| Layout says | Task needs |
|---|---|
| Manage panes → compose → maybe photos | Photos edge-to-edge → light react → optional share |
| "Be the first" social network | "Here are your moments" house album |
| People / categories / Drive | Almost never for 6–14 |

### Density / chrome

Nearly everything above the empty card is adult. Emoji reactions in
`galleryPostCard` footer (`6796–6804`) conflict with the design system's
anti-emoji-icon rule — leave the reaction *behaviour*, restyle glyphs later.

### Empty vs. realistic volume

Empty fixture. With posts, `gal-feed` + lightbox are strong; `galleryOrgBarHtml`
appears only when `hasFeed` (`6894`) — good. Kids still get People pane and
compose as a full `section-shell` page rather than the sheet they already use
on phone (`6928`).

### Privacy / visibility

`filterGalleryPosts` only applies category/author UI filters (`6672–6677`) —
no "photos of this child" filter. A child sees the **whole house feed** (and
can open People). Whether that is intended is an owner decision; delight
surfaces usually want "me + friends tagged" or "approved for kids".

### Deliberate good — leave alone

- Kid compose opens a sheet on phone (`6928`), not a nested pane.
- Safety/report hooks exist for staff moderation.
- Lightbox for immersion (`6905–6908`).
- Gallery not on primary dock (Pro / Mehr) — right weight if chrome is fixed.

---

## 3. Three plans

### Plan A — Tighten

**Idea:** Same `viewGallery`, hide staff chrome in `mode-child`.

CSS / small template guards:

- `body.mode-child .section-shell-nav`,
  `.section-shell-picker`, `.gal-refresh`, `.gal-org-bar` → `display:none`.
- Soften or remove `.section-shell-hero` when `mode-child` (title already in
  header).
- Empty copy: replace "Sei der Erste!" with house-warmth
  (`galleryEmpty` / `galleryEmptyHint` child variants).
- Keep one **Neu** / **Moment teilen** path.

**Cost:** hours. **Leaves:** still shared staff template; People reachable via
hash; no me-filter.

```
PHONE A
┌─────────────────────┐
│ ← Zurück            │
│ Große Momente       │
│ [ + Moment ]        │
│ empty / photo grid  │
└─────────────────────┘
```

### Plan B — Restructure (recommend)

**Idea:** Real `childGalleryView()` — photo-first album.

1. Stop aliasing; new template: masonry / large cards, caption under photo,
   one react control, double-tap like kept (`galleryTapLike`).
2. Default filter: posts from last N weeks; optional chip **Mit mir** if
   tagging exists (or by caption/people metadata when available).
3. Share: one FAB → existing `sheetGalleryCompose` (already kid path).
4. Hide People, org bar, Drive, delete, report behind staff-only
   (`state.mode==='staff'` already gates some delete/flag UI).
5. Drop `sectionShellHtml` for child; simple `kid-page` + feed.
6. PC: two-column photo grid, no left Feed/People rail.

**Cost:** 3–5 days. **Gains:** delight surface; chrome vanishes; staff gallery
untouched.

```
PHONE B                         PC B
┌─────────────────────┐         ┌────┬──────────────────────┐
│ photo               │         │nav │ ██ ██ ██             │
│ photo               │         │    │ ██ ██ ██             │
│ caption · ♥         │         │    │ lightbox on click    │
│ ○ FAB share         │         │    │ ○ share              │
└─────────────────────┘         └────┴──────────────────────┘
```

### Plan C — Rethink

**Idea:** Momente is a strip on Start + fullscreen viewer; no gallery page.
Share is staff-only or Zo-Ai mediated.

Worth it if children mostly consume and carers post. Cost: Start strip
(`homeMomentsStripHtml` already exists for staff home `22235`), kid
fullscreen route, remove Mehr entry. Product shift: kids cannot post.

```
PHONE C
┌─────────────────────┐
│ Start               │
│ Momente  → → →      │
│ (tap → fullscreen)  │
└─────────────────────┘
```

---

## 4. Recommendation

**Plan B**, with Plan A's CSS hide as the same-day unblock so kids stop seeing
Feed/People/Neu chrome.

**Ship today:** in `viewGallery` / CSS, when `state.mode==='child'`, suppress
`.section-shell-nav`, `.section-shell-picker`, and `.gal-refresh`. One mode
branch; staff unchanged.

---

## 5. Open questions for the owner

1. May children post, or only view?
2. Which photos should a child see — all house posts, posts they authored,
   posts they're tagged in, staff-approved-only?
3. Favourite / download / share-outside-app — any of these needed, or in-app
   react enough?
4. Stay Pro-only under Mehr, or promote once the kid UI is photo-first?

---

# How the three relate

**Shared disease:** each page was grown from a staff primitive (notes store +
`paidiaCalHtml`, schedule `entriesFor`, `viewGallery`) and wrapped in kid
chrome (hero / guide / Mehr). v245 fixed measurable chrome height; it did not
change the *question* each page answers.

**Calendar habit:** Notizen inherited a month grid it rarely needs (hidden on
phone when empty; still wrong on PC). Plan correctly uses a **week** strip —
keep that pattern, don't add a month. Gallery has no calendar — do not add
one; grouping by day/week in `galleryOrgBarHtml` is staff tooling.

**Privacy spine:** Notizen is the ethics flashpoint (child author → staff
card, conflicting copy). Gallery is the visibility flashpoint (whole-house
feed). Plan is clean on privacy (own entries only). Any redesign that
"feels cozy" without settling Notizen audience and gallery audience will make
the honesty gap worse.

**Dock grammar:** Notizen sits beside Bewertung as two different "how was…"
stories — keep both, separate the language. Plan + Momente are Mehr/Pro
overflow — fine, but then they must earn the extra tap with child-native UX,
not staff clones.

**Suggested build order across the trio**

1. Notizen kicker/tour honesty + desktop empty-cal hide (today).
2. Gallery child chrome suppress (today).
3. Plan next-up / empty-next-day (this week).
4. Notizen Plan B feed + staff attribution (after owner answers privacy).
5. Real `childGalleryView` photo album (after owner answers who-sees-what).
