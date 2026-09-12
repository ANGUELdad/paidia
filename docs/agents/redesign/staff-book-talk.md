# Staff Buch & Talk — redesign

Surfaces reviewed: PC 1440×900
(`.qa-screens/v245-true/pc-staff-book.png`, `pc-staff-talk.png`) and phone
393×852 (`.qa-screens/v245-true/phone-staff-book.png`, `phone-staff-talk.png`),
build v245.

**Buch code:** `viewBook()` `app.js:15956–16008`, `shiftDiaryCard()`
`app.js:15753–15896`, `openBookJournal()` `app.js:15621–15639`,
`handoffFlowHtml()` `app.js:15735–15751`, `bookCalendarHtml()` /
`bookDayStripHtml()` `app.js:15666–15733`, `handoffPageCardHtml()` /
`ackShiftHandoff()` / `unackedHandoffsFor()` `app.js:15458–15550`,
`writeShiftJournalPage()` `app.js:15552+`.

**Talk code:** `viewTalk()` `app.js:7397–7453`, `mountStaffTalkChat()`
`app.js:22971–23156`, `talkSuggestTopics()` `app.js:7369–7393`,
`talkApi()` `app.js:6529–6543`, server `/api/talk` `server.py:1293–1365`
(`TALK_MESSAGE_LIMIT=200`, `TALK_TOPIC_LIMIT=120`).

**Inbox / notifs:** `staffInboxItems()` `app.js:22119–22233` (empty journal
`22177–22182`, unacked handoffs `22183–22192`), `paintNotifBadge()`
`app.js:22490–22499`, push deliver for unacked `app.js:26971–26981`.

**CSS:** Talk workspace `ui-v110.css:4520–4796`; book/journal cleanup
`ui-v110.css:1758–1800`; day strip `ui-v110.css:7277+`; handoff/cal base
in `index.html` / `school/index.html` (`.handoff-flow`, `.book-cal`,
`.journal-duty`). Correctness layers: `ui-v244.css`, `ui-v245.css` (no Buch/Talk
selector fixes left — do not re-audit contrast/tap floors). Known leftover:
PC Talk `text-truncated` on `#talkTopicsList.talk-topics-list`
(`.qa-screens/v245-true/NOTES.md`).

---

# A. Staff Buch & Schicht (`data-tab="book"`)

## 1. What this page is for

A carer opening or closing a shift arrives with one question: **what must I
read and acknowledge before I work, and what must I leave for the next
shift?** Secondary: can I find a past day's page when something is disputed.

The page currently answers a different question — "how does Übergabe work in
general, and which calendar day am I looking at?" The write → read → confirm
cycle exists in data (`acks` on `DB.shiftNotes`, `handoffNeedsAck`,
`unackedHandoffsFor`) and already feeds Home via `staffInboxItems()`, but on
Buch itself the cycle is taught as a one-time explainer card
(`handoffFlowHtml`, dismissed to `paidia.handoffFlowSeen`) rather than shown
as live state ("2 handovers awaiting your acknowledgement").

## 2. Read of the current design

### Phone, in the order the eye receives it

1. **Pane tabs** (`.book-panes`): Übergabe / Verlauf / Personen — phone
   screenshot shows all three; Verlauf + Personen are `pro-only`
   (`app.js:15996–15997`).
2. **Onboarding card** (`.handoff-flow`): "SO LÄUFT DIE ÜBERGABE" with
   Schreiben / Lesen & bestätigen + full-width **Verstanden**. Owns the fold
   until dismissed. Template `app.js:15735–15751`.
3. **Week strip** (`.book-day-strip`): MO–SO chips; DI 8 selected.
4. **Full month calendar** (`.book-cal.cal-shell`): "TAG WÄHLEN", September
   2026, five-dot legend (Einträge / Ungelesen / Plan / Event / Wichtig).
5. Below the fold (not in the capture): `dayOpsSummaryHtml`, the mislabeled
   "Kalender / Archiv" toggle, `.journal-duty`, `.handoff-incoming`,
   `.journal-spread`, `.journal-write`, day archive.

App header bell shows **2** — that is `staffInboxItems().length`
(`paintNotifBadge`), not a Buch-local counter. Phone hides `.book-hero`
(`ui-v110.css:2490`).

### PC, same order plus chrome

PC adds `.book-hero` ("Übergabe" + "Schreiben · Lesen · Bestätigen — Kalender
für jeden Tag"), Easy/Pro in the hero, and `adaptiveChrome` toolbar (Heute /
7 Tage / 30 Tage / Korrektur). Measured height ~2.6 screens
(`DEVICE-pc.md`: Buch 2339px / 2.60). Single column end-to-end — no use of the
horizontal axis for "incoming | write".

### Hierarchy the layout implies vs. the task needs

Layout says: *tutorial → pick a day (twice) → day ops → maybe duty → maybe
incoming → my page → write form*.

Task needs: *N unacked for me (blockers) → my write/duty for today → recent
pages → calendar only when browsing*.

Concrete ordering bug in `shiftDiaryCard()` (`app.js:15832–15895`):

```
handoffFlowHtml
bookDayStripHtml
bookCalendarHtml          ← always on, above the fold
dayOpsSummaryHtml
bookSecondaryToggle       ← label says "Kalender", toggles house+archive only
journal-duty              ← "Heute — deine Übergabe · …"
handoff-incoming          ← the actual ack work
journal-spread + write
journal-archive
```

So the legally significant state (incoming `.needs-ack` cards with
`data-handoff-ack`) sits *under* a month grid and an ops summary. The red
"Ungelesen" legend advertises unread, but unread is not a page-level answer —
it is a 5px dot on a day cell (`bookJournalMarkersForMonth` unread count at
`app.js:15650`).

### Density — what earns its space

**Does not earn it**

- `.handoff-flow` after first visit: one-shot onboarding parked as permanent
  chrome until dismiss; on a fixture that never dismissed, it eats the fold
  every time.
- Full `.book-cal` as primary nav on a phone: carers almost always want
  *today / yesterday / the last few entries*, not month browsing. The week
  strip already does day pick. Calendar also paints Plan/Event/Important —
  Plan's job — so Buch becomes a second Plan calendar.
- Hero copy that restates the product ("Kalender für jeden Tag") instead of
  today's obligation count.
- Toggle `#bookSecondaryToggle` labelled `bookShowCal` / `bookHideCal`
  (`app.js:155–156`, `15837`) while the calendar is outside `.book-secondary`
  — the control does not do what it says.

**Does earn it**

- Structured handoff sections (Dringend / Kinder / Lager / Aufgaben /
  Sonstiges) via `handoffSectionsHtml` — the right write grammar.
- Incoming sort that prioritises unacked (`app.js:15770–15772`).
- Ack CTA on the card (`data-handoff-ack`) — correct interaction once you
  reach it.
- Append-only Verlauf / Korrektur panes for dispute — correct Pro secondary
  job (`DEVICE-pc.md` §2.3: "Read the archive, write today, correct").

### Empty / realistic volume

**Fixture (screenshots):** near-empty journal; calendar days tinted from Plan
markers; no visible `.handoff-incoming`; fold = tutorial + calendar.

**Realistic (6 months × ~1–3 handovers/day ≈ 180–500 `shiftNotes` pages):**

- Month grid becomes a green field of "has" cells; unread dots compete with
  Plan/Event/Important — the five-legend decode fails at a glance.
- Pro archive already slices to 40 (`app.js:15809`) — fine — but it is
  *hidden* behind the secondary toggle and still below the calendar.
- Day strip stays usable; the missing piece is a **chronological "last N
  handovers"** list as the default scroll, not a month picker.
- `.journal-duty` and incoming scale linearly with open acks (usually 0–3 per
  `unackedHandoffsFor(..., {days:2})`) — that volume is small and should own
  the fold.

Common case for a carer on shift: **today + 0–2 unacked from the previous
shift**, not "browse September".

### Deliberate good decisions — leave alone

- Separate Easy write path (compact sections + "more") vs Pro house filter /
  archive / Verlauf / Personen.
- Ack as explicit button, not auto-read-on-view.
- Home + push already know about unacked (`staffInboxItems` +
  `deliverOnce` handoff-read) — do not invent a second notification system;
  *surface the same queue on Buch*.

## 3. Three plans

### Plan A — Tighten (CSS / light template)

**Idea:** Stop burning the fold on tutorial + month grid; promote duty and
incoming without changing behaviour.

**Concrete changes**

- Default-hide or collapse `.book-cal` behind a disclosure; keep
  `.book-day-strip`. Move `bookCalendarHtml()` output into `.book-secondary`
  so `#bookSecondaryToggle` finally matches `bookShowCal`/`bookHideCal`
  (`shiftDiaryCard` `app.js:15832–15841`).
- Once `handoffFlowSeen()`, ensure `.handoff-flow` never renders (already
  true) — for first-run, shrink to a one-line tip, not a dual-step card
  (`handoffFlowHtml`).
- Sticky or top-pin `.journal-duty` + `.handoff-incoming` via CSS
  (`body[data-tab="book"] .journal-duty`, `.handoff-incoming`) so after strip
  the obligation is visible.
- PC: drop redundant hero lede; keep title. Align with device note to retire
  page heroes (`DEVICE-pc.md` §7 / phone § heroes).
- Fix Talk is out of scope here; for Buch only: ensure `.cal-legend` wraps
  without clipping (already mostly fine).

**Wireframe — phone**

```
┌─────────────────────────┐
│ Buch          🔔(2)  DE │
│ Übergabe · Verlauf · …  │
├─────────────────────────┤
│ [MO][DI][MI]… week strip│
│ ⚠ 2 ungelesen · Lesen   │  ← incoming summary (CSS reorder / sticky)
│ Heute — deine Übergabe !│
│ [write fields…]         │
│ [Übergabe speichern]    │
│ ── Frühere (list) ──    │
│ ▸ Kalender / Archiv     │  ← collapsed
└─────────────────────────┘
```

**PC:** same stack in the content column; optional right rail for incoming
cards if space allows (CSS grid on `.journal-book` only — still "tighten").

**Cost:** low; risk: carers who relied on month dots lose a glance (mitigate:
unread count in duty banner). **Gains:** ack work reachable without scroll;
calendar label honesty.

**Leaves unsolved:** page still not "state-first"; no dedicated unacked
banner wired to `unackedHandoffsFor`; still one long column on PC.

### Plan B — Restructure (recommended if you have a week)

**Idea:** Make Buch a **duty queue + today editor**; calendar becomes a
picker, not the home screen.

**Concrete changes**

1. **Top answer block** in `shiftDiaryCard()` before strip/calendar:
   - `const incoming = unackedHandoffsFor(state.user.id,{days:2})`
   - Render a banner: `Neue Übergabe zum Lesen` × N (reuse
     `t('handoffUnreadTitle')`) with jump-scroll to `.handoff-incoming`.
   - If none and today unwritten: show `t('journalMustWrite')` as the
     primary banner (already in `.journal-duty` — lift it up).
2. **Reorder** (`app.js:15832+`): duty → incoming → write/spread → day
   pages → day strip → calendar (collapsed) → dayOps → Pro archive.
3. **Default body:** "Letzte Übergaben" feed — reuse Pro archive query
   without requiring `bookShowSecondary`, limit 10–15, each row opens that
   `bookDate` (same as `data-book-cal-date` on archive cards).
4. **PC two-pane** (matches `DEVICE-pc.md` archetype for Buch):
   - Left ~360px: incoming + recent list.
   - Right: selected day's read/write (`journal-spread` + `journal-write`).
   - Selectors: new `.book-shift-layout` on the shell from `viewBook` /
     `shiftDiaryCard`; desktop rules beside existing Talk grid
     `ui-v110.css:4570–4578`.
5. **Strip Plan/Event/Important from Buch calendar markers** (or hide those
   legend items) — `bookJournalMarkersForMonth` `app.js:15641–15663` should
   emphasise `pages` + `unread` only; Plan stays on Plan.
6. **Toolbar:** Heute stays; 7/30 Tage apply to the recent feed / Verlauf,
   not as fake "calendar range" on the shift pane.

**Wireframe — phone**

```
┌─────────────────────────┐
│ 2 Übergaben ungelesen   │ ← primary
│ [Gelesen] cards…        │
│ ─────────────────────── │
│ Heute schreiben         │
│ [Dringend…][…][Save]    │
│ ─────────────────────── │
│ Letzte 10 Übergaben     │
│  · Dora · gestern       │
│  · Angelos · Mo         │
│ Woche [strip]           │
│ ▸ Monatskalender        │
└─────────────────────────┘
```

**Wireframe — PC**

```
┌──────────────┬────────────────────────────┐
│ Ungelesen (2) │  Dienstag 8. Sept          │
│ cards…       │  [sections read/write]     │
│              │  [Speichern]               │
│ Letzte…      │                            │
│ list         │                            │
└──────────────┴────────────────────────────┘
```

**Cost:** medium template + CSS; risk: tour anchors `book-cal` / `book-write`
(`app.js` tour mk ~4979) need retargeting; Easy/Pro density must keep
Verlauf/Personen. **Gains:** cycle visible as state; calendar demoted;
matches real volume.

### Plan C — Rethink

**Idea:** Buch is not a "tab you visit" — it is the **shift open / shift
close ritual**, linked from Home and presence end-of-shift.

**What would have to be true**

- Almost all handoff traffic is at shift boundaries (supported by
  `shiftEnd*` + `openBookJournal({focusWrite:true})` at `app.js:22450`,
  `23755+`).
- Mid-shift browsing of old pages is rare and can live under Verlauf only.
- Owner accepts removing Buch from the primary sidebar / Mehr prominence in
  favour of Home inbox jumps (`jump:'book'` already in `staffInboxItems`).

**Shape:** Home "Schicht starten" → forced read-ack sheet → work. Home
"Schicht beenden" → forced write. Buch tab becomes archive+correction only
(Pro). Merge superficial "team notes" out of Talk's handover-shaped
placeholder.

**Cost:** high product change; risk: carers lose a browsable book when
covering for someone. Worth it only if usage analytics show Buch opens cluster
at shift edges.

## 4. Recommendation

**Plan B.** The data model and inbox already understand the cycle; the page
layout does not. Highest-value change that could ship today: **reorder
`shiftDiaryCard()` so `.handoff-incoming` + `.journal-duty` render above
`bookCalendarHtml`, and move the month calendar into `.book-secondary`** so
the existing toggle becomes truthful. That alone fixes the fold without a
full two-pane.

## 5. Open questions for the owner

- Is acknowledgment **required before starting work**, or advisory? (Affects
  whether Home should block / sheet vs. badge only.)
- Real volume: handovers per day per house? Multi-house acks — is
  `bookHouse` filter enough?
- Should Plan/Event dots stay on Buch's calendar, or is that noise?
- Who uses Verlauf / Personen in production — admin only?

---

# B. Staff Talk (`data-tab="talk"`)

## 1. What this page is for

Staff open Talk to **coordinate in the moment**: short messages, voice, a
shared Jitsi room, and a checklist of **Besprechung** topics for today.
The question is: **what are we discussing / who said what just now?**

The page currently answers "here is a product brochure for Team-Gespräch"
(`.talk-overview` intro + three stat tiles) more loudly than it answers
that question — especially with **0 Nachrichten**. Topics work; chat is an
empty stage. Topics are also **not** threaded ("replies"): they are
checkbox rows (`paintTopics` `app.js:23000–23019`) with no discussion
attached — discussion is supposed to happen in Nachrichten or live.

## 2. Read of the current design

### Phone

1. **Overview card** (`.talk-overview`): kicker, title, long intro, privacy
   line, stats 0 / 2 / 0. (~197px per `DEVICE-phone.md`; Easy may hide in
   some breakpoints — capture shows it.)
2. **Segment** (`.talk-mobile-switch`): Nachrichten | Besprechung (badge 2).
3. **Chat shell:** empty state "Noch keine Nachrichten…"; composer with mic +
   Senden.
4. Besprechung pane (not shown): `#talkTopicsList` + add row + Pro suggest/
   clear.

Dock: Talk lives under **Mehr**, not the five primary destinations — correct
for a secondary channel, wrong if the product still sells it as a peer of
Buch in the desktop sidebar.

### PC

Two-pane under a full-width overview: topics ~344px + chat ~684px inside a
**1040px-capped** `.talk-page` (`ui-v110.css:4521–4525`) — good shape, wrong
width (`DEVICE-pc.md` §1.3 / §7.1). Height ~1.03 screens: sparse. Topics show
"Besprechung: Mo 13:30" (Angelos) and "Fingerspiel · 15:00–19:00" (Dora) —
the first is the hard-coded suggest string `t('besprechung')`
(`app.js:286`, pushed in `talkSuggestTopics` `7391`).

**P1 leftover:** `text-truncated` on `#talkTopicsList` (scrollW 315 > 312) —
topic titles ellipsis in the narrow column (NOTES). Not a redesign blocker;
fix when touching `.talk-topic-copy`.

### Hierarchy vs. task

Layout: *explain Talk → count messages → pick chat vs agenda → empty chat*.

Task: *open topics that need checking off / latest messages / type next
line*. Stats duplicate the Besprechung badge. Intro paragraph restates
`staffTalkHint` already available elsewhere.

### Density / volume

**Fixture:** 0 messages, 2 open topics — chat pane is a large void; overview
stats advertise emptiness.

**Realistic:** up to 200 messages retained (`TALK_MESSAGE_LIMIT`), 120 topics
(`TALK_TOPIC_LIMIT`). `paintTopics` keeps today's + undoned open topics
(`app.js:23004`) — 30 open topics would scroll inside
`.talk-topics-list { max-height:292px }` on PC (`ui-v110.css:4601`) — usable
but cramped; phone topics pane is full height (`4743`). Chat with months of
traffic needs day separators (already in `paint()` `23032–23034`) and scroll-
to-bottom — fine. **"30 topics with replies"** is not a current product
shape: there are no per-topic reply threads. Modelling that would be new
behaviour, not a layout tweak.

### Overlap with Buch (design smell)

- Placeholder `staffTalkTopicPh`: "z.B. Handover Limenaria…"
  (`app.js:574`) — invites putting handovers in Talk.
- Topics can be meeting schedule leftovers, not "things to discuss".
- Neither open topics nor unread messages enter `staffInboxItems()` — Talk
  never drives the bell. The screenshot bell **2** is Home/Buch duties, not
  the Talk "2 Offen".

### Deliberate good decisions — leave alone

- Desktop topics + chat grid (sticky topics `ui-v110.css:4591–4595`).
- Mobile pane switch instead of cramming both.
- Server-authoritative `/api/talk` with poll (`2500ms`) — right for multi-
  device staff.
- Topics as checkable agenda separate from append-only Buch acks.

## 3. Three plans

### Plan A — Tighten

**Idea:** Kill the brochure; fix truncation; make empty chat smaller.

**Concrete**

- Hide or drastically shrink `.talk-overview` on both surfaces when
  `cachedMessages + cachedOpen` is the real header (badge on switch already
  carries open count). CSS: extend the mobile hide
  (`ui-v110.css:4794`) to desktop Easy, or template-gate the `<p>` intro.
- Remove width cap `max-width:1040px` on `.talk-page` so the pane uses the
  1164px stage (`DEVICE-pc.md` §7.1).
- `.talk-topic-copy b { overflow-wrap:anywhere; white-space:normal }` (or
  allow 2-line clamp) — fixes P1 text-truncated.
- Empty chat: shorter emptyState, pull composer up
  (`.talk-chat-fast` min-height in `ui-v110.css:4658+` / mobile `4731`).

**Wireframe — phone**

```
┌─────────────────────────┐
│ Talk                    │
│ [Nachrichten][Bespr. 2] │
│ empty (compact)         │
│ [Nachricht…][mic][Send] │
└─────────────────────────┘
```

**Cost:** low. **Leaves unsolved:** job clarity vs Buch; topics still look
like mini-Plan.

### Plan B — Restructure

**Idea:** Talk = **Besprechung checklist + optional chat**, with chat not
claiming to be the handover channel.

**Concrete**

1. Default mobile pane to **Besprechung** when `cachedOpen > 0 && messages
   === 0` (`viewTalk` `data-talk-pane` + `mountStaffTalkChat` switch wiring).
2. Rename / rewrite copy: drop "Handover" from `staffTalkTopicPh`; intro one
   line: Absprachen & Besprechung — Übergabe bleibt im Buch.
3. `talkSuggestTopics()`: stop pushing raw `t('besprechung')` every time
   (`app.js:7391`); suggest from open plan tasks / events only; **never**
   from `shiftNotes`.
4. PC: overview becomes a single toolbar row (title + Raum öffnen + Zo-Ai);
   topics list grows (`max-height` → `calc(100dvh - …)`).
5. Optional: surface `staffTalkOpenTopics(n)` on Home as a soft info row —
   only if owner wants Talk in the inbox (today it is absent).

**Wireframe — PC**

```
┌─ Darüber sprechen (2) ─┬─ Nachrichten ──────────┐
│ ☑ topics…              │  bubbles / empty       │
│ [Thema merken]         │  [composer]            │
│ Vorschläge · clear     │  Raum öffnen           │
└────────────────────────┴────────────────────────┘
```

**Cost:** medium copy + template. **Gains:** clearer job; less false twin of
Buch.

### Plan C — Rethink

**Idea:** Split or merge away the weak half.

**Options (pick one premise)**

- **C1 — Chat only in WhatsApp/Jitsi:** keep Besprechung topics as a block
  on Home or Plan ("Heute sprechen"); delete Nachrichten tab; Jitsi stays.
- **C2 — Merge topics into Plan day:** Talk tab removed; `/api/talk` messages
  remain as a sheet from Home.
- **C3 — One "Team" tab:** Buch + Talk as panes (see final section) — only if
  owner insists on one nav item; still two jobs inside.

Worth it if message volume stays ~0 in production and topics are the only
used half — the screenshots suggest that pattern.

## 4. Recommendation

**Plan B** for Talk, with Plan A's width + truncation fixes first (ship
today). Default the phone to Besprechung when chat is empty and topics are
open — matches the only live data in the fixture.

## 5. Open questions for the owner

- Is staff actually using Nachrichten, or only topics + Jitsi?
- Should open topics appear in the Home bell / `staffInboxItems`?
- Do you want per-topic discussion threads, or is chat-global enough?
- Keep Talk in the desktop sidebar next to Buch, or Mehr-only like phone?

---

# C. Should Buch and Talk be one page?

**No — not as one undifferentiated surface.** They are different jobs:

| | Buch | Talk |
|---|---|---|
| Job | Legal/ops **record** of a shift | Ephemeral **coordination** |
| Lifecycle | Write → read → **ack** (durable `acks`) | Message / check topic (no ack) |
| Time model | Day pages, archive, correction | Today’s agenda + recent chat |
| Authority | `DB.shiftNotes` + audit log | `.paidia-talk.json` / db talk key |
| Inbox | Yes — empty page + unacked | No |
| Failure mode if missed | Next shift uninformed; 10-min rule / duty | Meeting runs without agenda |

**They feel alike** because both say "team communication" in the nav and
Talk's copy/placeholders borrow handover language. That is a **labelling and
hierarchy** problem, not proof they should merge.

**Argue against merge**

- Merging would bury ack obligations inside a chat scroll — the exact failure
  mode Buch must avoid.
- Verlauf/Korrektur and Jitsi/mic do not share a page grammar.
- Home inbox already treats Buch as duty and ignores Talk — a merge would
  force a confused badge.

**Argue for a lighter coupling (do this instead of one page)**

1. Nav: keep two entries, but **visual sibling discipline** — Buch as
   "Übergabe", Talk as "Besprechung" (avoid both reading as "chat").
2. Copy firewall: no "Handover" in Talk placeholders; Buch never offers
   free-form team chat.
3. Optional deep link: from an unacked handoff card, "Thema für Besprechung"
   → `talkApi('add_topic')` with a citation — still two stores.
4. If Talk chat stays empty in real use, **demote Nachrichten** (Plan C1)
   rather than folding Buch into Talk.

**Verdict:** Keep two pages. Redesign Buch to be state-first about acks
(Plan B). Redesign Talk to be agenda-first and stop impersonating the
handover book (Plan B + copy). Revisit a single "Team" nav item only after
usage shows one of the two is unused — and even then, prefer demoting Talk,
not diluting Buch.
