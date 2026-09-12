# Staff Admin + Momente — redesign

Surfaces reviewed: PC 1440×900 and phone 393×852 from
`.qa-screens/v245-true/pc-staff-admin.png`, `phone-staff-admin.png`,
`pc-staff-gallery.png`, `phone-staff-gallery.png` (build v245).

Companion device notes: Admin measured **4.60 screenfuls** on desktop
(`DEVICE-pc.md`); phone Admin chrome-before-content **175px** with
`ops-overview` alone ~2537px (`DEVICE-phone.md`). Momente is one of three
desktop pages that fill **~1.01 screenfuls** while wasting width (centred
520px column).

---

# Staff Admin (`data-tab="admin"`)

Code: `viewAdminOps()` `app.js:21421–21514`, `operationsOverviewHtml()`
`21180–21232`, `adminSectionHtml()` `21382–21419`, `ADMIN_SECTIONS`
`21355`, `wireAdminOpsView()` `21516–21636`, hash routing
`8241` / `8277` / `8290`, gate `isAdminUser()` `4139–4143`. Access /
destructive sheets: `sheetAdminAccessHub` `21695`, `sheetAdminSetPin`
`21758` (+ `askPin`…`requirePin:true`), `sheetBroadcastEmail` `21840`
(PIN on send `21977`), `sheetSecurityAudit` `25002`, `sheetAdminStaff`
`21981`. Legacy Home embed: `adminTeamPanel()` `21640` (still rendered from
Home `22609`).

CSS: `.admin-section-nav` / `.admin-section-picker` `shared/workspace.css:21–48`
+ desk override `desk/desk.css:1391–1403`; `.ops-overview` /
`.admin-ops-desk-stats` / `.ops-metrics` `ui-v213.css:277–320` +
`ui-v110.css:7350+`; `.admin-ops-desktop` `ui-v110.css:7530` /
`desk/desk.css:812` / `mobile/mobile.css:531`.

---

## 1. What this page is for

An admin opens Admin to answer: **what needs a decision across the house
right now, and where do I go to act?** Secondary jobs, once that question
is answered: manage a team member (record), change access (security), or
investigate what happened (audit).

Today the default pane (`state.adminPane='ops'`) answers a different
question — "here is every dashboard widget we ever built" — and then
scrolls into charts, a Lego filter, a week rail, and house cards. The
nine other panes in `ADMIN_SECTIONS` are real and hash-routed
(`#admin/<id>`), but most are thin link-lists into other tabs. The page
is hired as a cockpit; it ships as a warehouse of settings.

---

## 2. Read of the current design

### Pane model — used, but wrong grain

`ADMIN_SECTIONS` (`app.js:21355`) is ten peers:

| id | DE label | What it actually is |
|---|---|---|
| `ops` | Übersicht | Full ops dump (overview + charts + Lego + schedule) |
| `team` | Team | Roster → worker detail (records UI) |
| `supplies` | Häuser & Vorräte | Per-house stock summary → jump to Lager |
| `school` | Kinder & Schule | Five deep-links into `#kids/…` |
| `review` | Prüfung | Feedback / shop requests / homework links |
| `finance` | Finanzen | Per-child pocket balances → `#pocket/…` |
| `audit` | Aktivität | Searchable `DB.log` list |
| `communications` | Mitteilungen | PINs hub, broadcast, Talk link |
| `automations` | Automationen | Device-local notif rules |
| `system` | Systemstatus | Online / sync / revision |

**Panes are used.** PC shows them as `.admin-section-nav` pills
(`desk/desk.css:1391` forces flex); phone hides the nav and shows
`.admin-section-picker` `<select id="adminSectionSelect">`
(`shared/workspace.css:40–41`, wired `21518`). Hash `#admin/team` etc.
works (`8241`).

**The grain is wrong.** Ten flat peers mix three task types that want
different layouts:

1. **Triage / board** — `ops` (should be short)
2. **Records** — `team`, and the link-out panes that belong on Kinder /
   Lager / Taschengeld (`school`, `supplies`, `finance`)
3. **Investigation / config / security** — `audit`, `review`,
   `communications`, `automations`, `system`

`ops` is not a pane among peers; it is a landing that currently *contains*
what should be other destinations. That is why Übersicht alone is 4.6
desktop screens (`DEVICE-pc.md`).

### PC, eye order (Übersicht) — screenshot `pc-staff-admin.png`

1. Ten section pills (full-width wrap) — navigation cost before content.
2. Hero: `ARMONIA · ADMIN` / **Betriebszentrale** / lede
   (`admin-ops-hero`, `21474–21478`).
3. Six `.admin-ops-stat-tile` zeros (Bewegungen, Lagerchecks, …).
4. Four `.ops-metric` jump cards (9 / 2 / 12 / 8) — the only numbers that
   matter in the fixture.
5. **"Was braucht Aufmerksamkeit?"** with four action buttons — the actual
   answer block, mid-fold.
6. Live feed (real log rows).
7. Below the fold (not in the capture, but in the template): house grid,
   then `.admin-ops-desktop` charts + Lego chips + week schedule rail
   (`21480–21512`).

Implied hierarchy: *nav → brand essay → empty vitals → real vitals →
actions → feed → more*. Task needs: *actions with counts → live exceptions
→ jump to records*. The hero and the six zero tiles earn nothing when the
four jump metrics already carry the signal.

### Phone, eye order — screenshot `phone-staff-admin.png`

1. App header "Betriebszentrale".
2. **Bereich** dropdown (Übersicht) — 70px chrome (`DEVICE-phone.md`).
3. Same hero card + lede.
4. Two-column tile grid of the same stats/metrics; attention block and
   feed are further down; charts/Lego still render (mobile only collapses
   `.admin-ops-desktop` to one column — `mobile/mobile.css:531`, does not
   hide it).

Phone Admin is reached via **Mehr** (`sheetMobileMore`, admin only if
`isAdminUser()`). Standing in a corridor, an admin cannot productively
use Lego filters, pie charts, or ten named settings areas. The phone
surface currently pretends Admin is a full twin of desktop.

### Density at realistic volume

- **Low-data fixture (screenshots):** six zeros dominate; the page looks
  calm and incomplete. Common for a quiet morning.
- **Busy day:** live feed + house attention + open Liste + plan issues
  are useful — but still buried under hero + zero tiles + charts that
  restate Lager/Liste/Pocket. Lego filter capped at 40 rows
  (`adminOpsFilterRows().slice(0,40)`, `21469`) will not scale as an
  investigation tool next to `audit`'s searchable log.
- **Team at 8 people:** roster cards are fine. At 20+, needs denser rows
  on PC (archetype already named in `DEVICE-pc.md`).

### Security / destructive presentation (current)

| Action | Gate | Extra confirm |
|---|---|---|
| Open Admin tab | `isAdminUser()` (`4139`, also `23517` / `23550`) | none |
| Set PIN / email / send access mail | admin + `askPin(…, {requirePin:true})` (`21776`, `21799`, `21827`) | form validation |
| Broadcast email | admin + `askPin` on send (`21977`) | audience preview count |
| Open audit sheet | `isAdminUser()` | none |
| Worker → Access / Audit | from team detail buttons | sheets |
| Gallery delete (related) | any staff can delete any post | `confirm()` only |

**Good:** PIN-gated mutations for access and broadcast; admin badge in
chrome; Mitteilungen isolates PINs behind a deliberate pane + sheet.
**Weak:** destructive weight is not visible on the Overview (no "security"
affordance until you know to open Mitteilungen); `KNOWN_ADMIN_IDS`
hardcode (`4138`) is a product landmine; non-admin hitting `#admin`
silently falls back to Home (`23517`) with no explanation on deep link.

### What to leave alone

- Hash panes + `admin-section-nav` pattern — correct mechanism, wrong
  taxonomy.
- `"Was braucht Aufmerksamkeit?"` + jump metrics — right job, wrong
  position (should be first).
- Team roster → detail with range chips — right records pattern.
- PIN re-auth on access mutations — keep and extend, do not soften.

---

## 3. Three plans

### Plan A — Tighten

**Idea:** Keep ten panes; make Übersicht fit one screen on PC and a short
scroll on phone by CSS + small template cuts only.

**Concrete changes**

- Collapse / hide below-fold ops chrome on phone:
  `body.shell-m .admin-ops-desktop { display:none }` (extend
  `mobile/mobile.css:531`), and hide `.ops-house-grid` on phone until
  `supplies` pane.
- On PC, put `.ops-priority` first visually via
  `#view .ops-overview { display:grid; … }` reorder (template move of
  the priority block above desk-stats in `operationsOverviewHtml`
  `21225–21230` — near-CSS if you accept a 5-line HTML reorder).
- Shrink `.admin-ops-hero` padding; drop lede on phone
  (`ui-v213.css` / new layer). Hide zero-valued `.admin-ops-stat-tile`
  with `:has()` or filter in `operationsOverviewHtml` when `n===0`.
- Cap live feed height with `overflow:auto; max-height:…` on
  `.admin-live-feed`.

**ASCII — phone**

```
┌ header Betriebszentrale ┐
│ Bereich [Übersicht ▾]   │
│ Aufmerksamkeit          │
│  [Einkauf ·9] [Plan ·2] │
│  [Feedback] [Team]      │
│ 9 · 2 · 12 · 8 metrics  │
│ Live (scroll, ~4 rows)  │
└ dock Mehr ──────────────┘
```

**ASCII — PC** (structurally same, metrics in one row)

**Cost:** low; one CSS pass + tiny HTML reorder. Risk: charts/Lego
disappear on phone without a link (acceptable if documented).  
**Gains:** Übersicht stops being 4.6 screens; attention rises.  
**Leaves unsolved:** ten-pane IA, phone-as-full-Admin, duplicate link
panes, security discoverability.

### Plan B — Restructure (recommended)

**Idea:** Collapse Admin into **four top-level groups** that match the
jobs; Übersicht becomes a one-screen board; records and security get
their own layouts.

**Proposed IA (replace flat `ADMIN_SECTIONS` peers)**

| Group | Pane ids (keep hashes) | Layout |
|---|---|---|
| **Lage** | `ops` | Board: attention + metrics + live only |
| **Team** | `team` | Master/detail roster (already) |
| **Kontrolle** | `review` + `audit` (tabs or stacked) | Investigation: queue + searchable log |
| **Zugang** | `communications` + `system` + `automations` | Config list; PIN actions visually marked |

**Demote to deep-links (not top-level Admin peers):** `supplies` → Lager,
`school` → Kinder, `finance` → Taschengeld. Keep `#admin/supplies` as
redirects for bookmarks.

**Concrete changes**

- Shrink `ADMIN_SECTIONS` (or introduce `ADMIN_NAV_GROUPS` mapped to the
  same hash ids) in `app.js:21355`; update `viewAdminOps` seg builder
  `21425`.
- Split `viewAdminOps` ops branch: render only `operationsOverviewHtml()`
  attention + metrics + live; move charts/Lego/schedule into Pro-only
  `<details>` or a sub-hash `#admin/ops/analyse` (template cut at
  `21480–21512`).
- Phone (`body.shell-m`): default `#admin` to a **section index** — four
  large rows (Lage / Team / Kontrolle / Zugang), each linking to a
  single-purpose screen; no charts. Matches `DEVICE-phone.md` exemption.
- Team stays; add sticky detail on PC (`adminWorkerDetailHtml` beside
  roster — `desk/desk.css` two-column).
- Zugang: lead with "PINs & Zugänge" as destructive styling (not a neutral
  `admin-record`); keep `askPin` gates.

**ASCII — phone (index)**

```
┌ Admin                    ┐
│ Was braucht dich?        │
│  Einkauf 9 · Plan 2      │
│                          │
│ ┌ Lage              › ┐  │
│ ┌ Team              › ┐  │
│ ┌ Kontrolle         › ┐  │
│ ┌ Zugang · PIN      › ┐  │  ← visual weight
└ dock ────────────────────┘
```

**ASCII — PC Lage**

```
┌ pills: Lage | Team | Kontrolle | Zugang ─────────────┐
│ Aufmerksamkeit (actions)     │ Live feed (sticky)    │
│ Metrics 9·2·12·8             │                       │
│ (charts behind "Analyse")    │                       │
└──────────────────────────────────────────────────────┘
```

**Cost:** medium (template + nav + CSS); hash compatibility careful.
Risk: tour `data-tour="admin-nav"` / bookmarks to removed peers.  
**Gains:** Admin matches the three real jobs; phone becomes usable;
4.6 → ~1 screen for Lage.

### Plan C — Rethink

**Idea:** Delete Admin as a tab. Spread its jobs: Home gets the attention
board (it already embeds `adminTeamPanel` and could absorb
`ops-priority`); Personal owns team; Account / security sheet owns PINs;
Aktivität becomes a sheet from the bell; Automationen stay device-local
under notifications.

**Would have to be true**

- Admins already live on Home / Personal for daily work.
- No stakeholder needs a single "Betriebszentrale" URL.
- Willing to migrate `#admin/*` and the Mehr entry.

**Cost:** high (routing, Home rewrite, docs, tour). Risk: loss of a
named admin surface for the owner. Worth it only if Admin usage is
almost entirely "check the four numbers then leave."

**ASCII — phone:** no Admin tab; Home attention block + Mehr → Zugang.

---

## 4. Recommendation

**Plan B.** The pane machinery already exists and is the right idea; the
failure is taxonomy and the ops dump. Plan A is a good *first commit*
inside B: reorder attention to the top and hide `.admin-ops-desktop` on
phone today.

**Ship today (highest value, one pass):** In `operationsOverviewHtml`,
move `.ops-priority` above desk-stats/metrics, and add
`body.shell-m .admin-ops-desktop, body.shell-m .ops-house-grid { display:none }`
in the next CSS layer. Übersicht becomes triage; charts wait for desktop
or a later "Analyse" fold.

---

## 5. Open questions for the owner

1. Who opens Admin on a phone during a shift, and for what — triage only,
   or PIN resets in the field?
2. Are `supplies` / `school` / `finance` Admin panes used, or always
   abandoned for Lager / Kinder / Taschengeld?
3. Should Lego + charts stay at all, or is Zo-Ai + audit enough for
   "what happened with X on day Y"?
4. Is `KNOWN_ADMIN_IDS` (`e3`,`e4`,`e8`) still required, or should admin
   be session/`user.admin` only?
5. Real team size and how often PINs are reset — drives whether Zugang
   is a daily or rare surface.

---

# Staff Momente / Gallery (`data-tab="gallery"`)

Code: `viewGallery()` `app.js:6865–6918`, `refreshGallery` `6632`,
`bindGallery` / `#galRefresh` `6972–6975`, `galleryPostCard` `6763`,
`galleryOrgBarHtml` `6725`, `galleryPeopleHtml` `6820`,
`galleryComposePageHtml` `6839`, `childGalleryView()` `6920–6922`
(= same view), `canDeleteGalleryPost` `6645`, `filterGalleryPosts` /
`groupGalleryPosts` `6672–6723`. Server: `mutate_gallery` `server.py:1658`,
`GALLERY_POST_LIMIT = 80` (`273`), shared staff+child gallery, caption
safety gate, flag/report, any staff may delete.

CSS: `.gal-feed` / `.gal-org-bar` **`max-width:520px; margin:0 auto`**
(`index.html:1463`, `1510`); `.section-shell*` `ui-v213.css:781–825`;
`.gal-shell-nested` `827+`. Desktop shell gives Moments a 200+950 layout
then the feed refuses to use the 950.

---

## 1. What this page is for

Staff open Momente to **share a moment from the shift, or find a photo
of a child / outing later**. Three distinct jobs: **upload**, **browse
(contact sheet)**, **find** ("Julian, summer trip"). Kids open the same
surface to see and react to the camp gallery.

The page currently answers "Instagram-style empty feed with a lot of
chrome." At realistic volume (≈2000 photos / 2 years) the product cannot
even hold the archive (`GALLERY_POST_LIMIT = 80` keeps only the newest).
So the UI problem and the data model problem are the same: it was built
as a short social feed, not a house photo library.

---

## 2. Read of the current design

### PC — screenshot `pc-staff-gallery.png`

Eye order:

1. App chrome (sidebar + header) — Momente selected.
2. `section-shell-hero`: eyebrow + **Große Momente**.
3. Left rail: Feed / People / Neu (`section-shell-nav`, 200px).
4. Full-width **Neu** bar + Pro refresh.
5. Empty-state card centred in the remaining column.

Hierarchy implied: *title → subnav → compose CTA → content*. For a
gallery the photo plane should be first; chrome should nearly vanish.
Instead content is capped at **520px** inside a ~950px body — the
centred-column waste called out in `DEVICE-pc.md`. Empty state is fine
copy; the layout would still waste width with a full feed because every
`.gal-post` is a single-column card, not a grid.

### Phone — screenshot `phone-staff-gallery.png`

Eye order:

1. Header "Momente".
2. Eyebrow + **Große Momente** hero (~70px — `DEVICE-phone` notes gallery
   is closest to budget at 96px chrome-before-content, still heavy).
3. Pill row Feed / People / Neu.
4. **Duplicate** `.section-shell-picker` dropdown also set to Feed
   (`sectionShellHtml` emits both; `ui-v213.css:819–824` shows picker on
   ≤899px **without** hiding the pill nav). Double chrome for one choice.
5. Neu + refresh.
6. Empty state + third CTA ("Moment teilen").

Above-the-fold is almost entirely chrome. Photos would start ~40% down
the viewport.

### Jobs vs. controls that exist

| Job | What exists | Gap |
|---|---|---|
| Upload | Compose pane + Neu FAB + empty CTA | Three entry points; kids use a sheet (`6928`) |
| Browse | Chronological cards; lightbox | No contact-sheet / multi-column grid |
| Find | Org bar: group by day/week/month/category/author; People pane = **authors**, not kids in photos | No kid tags, no house, no full-text, no album/"Ausflug" collection beyond category chip |
| Moderate | Report flag; staff delete | Delete = any staff + `confirm()`; flagged only shown to staff in meta |

### Privacy / consent — not legible

- Gallery is **one shared stream for staff and children**
  (`mutate_gallery` docstring; `gallery_snapshot` for any authenticated
  profile). No audience field, no "staff only", no per-child visibility.
- Compose collects **category + caption only** — no "who is in this
  photo?", no consent checkbox, no house.
- Safety classifier on captions (`_gallery_safety_gate`) — good, invisible.
- Report → `flagged` — staff see a flag glyph; no moderation queue in Admin.
- Kids and staff share `viewGallery()` (`childGalleryView` alias). Kids
  get the same chrome density and the same posts.

At a care home, "photos of children" without a visible audience model is
a product risk, not a polish issue.

### Realistic volume

- Hard cap **80 posts** server-side. "2000 over two years" is impossible
  without pagination / albums / Drive browse — Drive upload exists, but
  the list is still truncated to 80.
- Org filters operate on the in-memory 80. Finding "Julian summer trip"
  requires kid identity in the data model; it does not exist.
- Empty fixture hides the scroll cost of 80 full-width cards with
  comments forms under each.

### Consistency with kids

Same template, same limit, same lack of audience. Kids compose via
sheet (lighter); staff get a full pane. Visual language matches Armonia;
information architecture does not distinguish "child viewing peers"
from "staff archiving evidence of the day."

### What to leave alone

- Lightbox + double-tap like (`6999–7049`) — good photo-first gesture.
- Category vocabulary (`GALLERY_CATEGORIES`) — useful once browse is a grid.
- Empty-state tone ("Sei der Erste!") — warm, on-brand.
- `section-shell` as a pattern — fix gallery-specific width, don't invent
  a third shell.

---

## 3. Three plans

### Plan A — Tighten

**Idea:** Chrome nearly vanishes; photos use the width; no behaviour
change.

**Concrete changes**

- Remove `max-width:520px` from `.gal-feed` and `.gal-org-bar`
  (`index.html:1463`, `1510` — prefer override in next CSS layer so shells
  stay in sync): e.g.
  `body.layout-desktop .gal-feed { max-width:none; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); }`
  with `.gal-post` becoming a tile (photo dominant, caption under).
- Phone: hide duplicate picker when pills exist —
  `body.shell-m .gal-shell-nested ~` / better: in `sectionShellHtml` or CSS
  `body.shell-m [data-tour="gallery-main"] .section-shell-picker { display:none }`
  and keep pills only (or the reverse).
- Collapse `.section-shell-hero` on gallery tab (eyebrow only, or hide h2
  when Feed) — gallery exemption already argued in `DEVICE-phone.md`.
- One compose CTA: keep `#galShare`; hide empty-state duplicate button
  when bar is visible (template tweak `6903`).

**ASCII — phone**

```
┌ Momente          [+]     ┐  ← + = compose, no hero essay
│ Feed · People            │
│ ┌──┐┌──┐┌──┐┌──┐        │  ← 2-col grid when posts exist
│ └──┘└──┘└──┘└──┘        │
└ dock ────────────────────┘
```

**ASCII — PC**

```
│ Feed│  [tile][tile][tile][tile][tile]     │
│ Peop│  [tile][tile][tile][tile][tile]     │
│ Neu │  full width of stage, not 520px     │
```

**Cost:** low CSS. Risk: long captions/comments in a dense grid need a
detail route (already `#gallery/post`).  
**Gains:** Momente stops wasting desktop width; phone loses double nav.  
**Leaves unsolved:** 80-cap, find-Julian, consent, kids consistency.

### Plan B — Restructure (recommended)

**Idea:** Treat Momente as archetype 4 two-pane (`DEVICE-pc.md`): left =
albums/filters (time, category, people), right = contact sheet; compose
is a sheet/pane; default view is **grid**, not full post cards.

**Concrete changes**

- `viewGallery()` feed branch (`6886–6908`): render a
  `.gal-grid` of photo buttons → existing post detail / lightbox; move
  comments/reactions to detail (`pane==='post'`).
- Repurpose People: today `galleryPeopleHtml` lists **authors**. Add a
  second mode or rename — "Betreuer" vs future "Kinder" once tagged.
- Org bar (`6725`): sticky left rail on PC (reuse `section-shell-nav`
  column for group/category; drop redundant top bar width cap).
- Phone: hero off; pills; edge-to-edge grid (`gutter 0` per device brief);
  compose stays `#gallery/compose` or sheet.
- Align kids: `childGalleryView()` wraps the same grid but hides staff
  delete/report affordances already partially gated — tighten
  `canDeleteGalleryPost` so kids never see staff tools; consider
  Easy-mode denser targets.
- Admin hook: flagged posts surface under Admin · Kontrolle (Plan B
  Admin) via filter on `post.flagged`.

**ASCII — phone**

```
┌ Momente            📷    ┐
│ Alle · Ausflug · …       │  ← horizontal filter chips only
│ ■■ ■■ ■■ ■■             │
│ ■■ ■■ ■■ ■■             │
└──────────────────────────┘
```

**ASCII — PC**

```
│ Albums / filters │  contact sheet (5–6 cols)              │
│  2026 Sommer     │  ■ ■ ■ ■ ■ ■                           │
│  Ausflug         │  ■ ■ ■ ■ ■ ■                           │
│  Nach Betreuer   │  click → detail + comments             │
```

**Cost:** medium (template + CSS; lightbox/detail already exist).  
**Gains:** browse job works; chrome recedes; matches desktop archetype.  
**Still needs product data for true "find Julian."**

### Plan C — Rethink

**Idea:** Split **Capture** from **Archive**. Capture = camera sheet from
Home / dock (one tap, category, optional kid tags). Archive = Momente as
a real library: paginated Drive-backed albums by year/trip/house, search,
audience (`staff` | `house` | `named kids`), consent logged at upload.
Kids see only audience-allowed posts in a simpler grid; staff moderate
in Admin.

**Would have to be true**

- Willingness to raise / remove `GALLERY_POST_LIMIT` and add server query
  APIs (by kid, by range, cursor).
- Legal/consent process for child photos exists and must be reflected in UI.
- Owner accepts Momente leaving the "social feed" metaphor.

**Cost:** high (API + model + two UIs). Worth it if the house will
actually store years of photos in-product rather than WhatsApp / Drive
folders outside the app.

---

## 4. Recommendation

**Plan B**, with Plan A as the first day of work (kill 520px cap, kill
duplicate phone picker, hero shrink, CSS grid). Do not ship a prettier
feed of 80 full cards.

**Ship today:** CSS override — desktop `.gal-feed` multi-column, no
max-width; phone hide `.section-shell-picker` under
`[data-tour="gallery-main"]`. Instantly fixes the empty-width scandal
and the double Feed control.

Parallel product spike (not UI-only): kid tags + audience on create, and
a plan for limit > 80 — without those, "find Julian from the summer trip"
cannot be designed honestly.

---

## 5. Open questions for the owner

1. Is the system of record for photos this app, or Google Drive / WhatsApp
   with Momente as a highlight reel? (Decides Plan B vs C and the 80 cap.)
2. Who may see a given photo — all kids, only tagged kids, staff only?
3. Must caregivers log parental consent before upload, and where is that
   recorded today?
4. Should "People" mean authors (current) or children appearing in photos?
5. Do kids and staff need the same reactions (like/star/clap), or should
   kids get a simpler surface?
6. Expected real volume per month, and whether flagged posts should appear
   in Admin · Kontrolle?

---

# Cross-page note

Admin and Momente fail for opposite reasons: Admin **refuses the
horizontal axis and runs long**; Momente **takes the horizontal axis and
then refuses to fill it**. Same desktop stage (~1164px). Fix Admin by
splitting jobs and shortening Lage; fix Momente by making photos the
layout. Phone: Admin becomes an index; Momente becomes a grid with almost
no hero.
