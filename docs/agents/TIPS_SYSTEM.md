# Contextual page tips

Lightweight, dismissible **page help popups** with a **spotlight hole + arrow** over a live `data-tour` target.
**Not** the mandatory spotlight tour (tour). Zo-Ai capability nags belong to the FAB sibling (`zoai-tips.js`).

## Rules

| Rule | Behaviour |
|------|-----------|
| Daily first | First open of a page **each calendar day** → **Hilfe!! / Βοήθεια!!** sooner (~6–18s) |
| Random later | Mid-session random delay **25–90s**; up to **2 tips per page per browser session** |
| Persist | Dismissed tip ids: `localStorage` `paidia.tipsDismissed`. Daily page keys: `paidia.helpDaily` `{day, pages[]}` |
| Easy | Fewer tips — `proOnly` skipped |
| Pro | Random among remaining undismissed tips for the page |
| Skip | PIN gate (`gate.on` / `auth-pending`), tour active, sheet open, chat open |
| Spotlight | Catalog `target` → `[data-tour="…"]`; `#tipHole` + `#tipArrow`; card anchored near target. Missing target → bottom card (legacy). Screenshots only when no target. |
| Language | Follows `state.lang` with fallback to `document.documentElement.lang` / `paidia.lang`. `PaidiaPageTips.refreshLang()` on `setLang`. |
| Motion | `prefers-reduced-motion`: no slide/fade |
| Zo-Ai stagger | Shared `window.__paidiaLastCoachAt` + `paidiaMarkCoachShown()`; min gap **28s**. Also skips if `#zoaiTipRoot` visible / `body.zoai-tip-open` / `paidiaZoAiTipVisible()` |

## Copy voice

Plain spoken DE/EL for care-home staff and kids. One clear action per tip. No unexplained English slang (`Confirm` → Bestätigen / Επιβεβαίωση). EL must not leave German nouns that are not on-screen labels. Humanization QA (jargon / telegraphic / title==body / length) runs before each tip ship.

## Screenshots

Optional static PNGs under `help/` when a tip has **no** `target`. Prefer spotlight when a target exists.

## Entry / hooks

| Hook | Function |
|------|----------|
| After staff/kids `render` | `tipNotifyPageChange` → `PaidiaPageTips.notifyPageChange` |
| Tour start / gate open | `tipCancelSchedule` + `tipHide` |
| Language switch | `setLang` → `PaidiaPageTips.refreshLang` / `PaidiaZoAiTips.refreshLang` |
| Show | marks coach clock via `paidiaMarkCoachShown` |

Engine: **`page-tips.js`** (`window.PaidiaPageTips`). Thin binders in `app.js`. Host `#tipRoot`.

## Sibling contract (Zo-Ai FAB tips — `zoai-tips.js` / `PaidiaZoAiTips`)

```js
// Before showing a Zo-Ai capability tip:
if (window.paidiaPageTipVisible?.()) { /* wait / reschedule */ }
window.paidiaMarkCoachShown?.();

// Optional markers page tips already respect:
// body.zoai-tip-open  |  #zoaiTipRoot (not hidden) | window.paidiaZoAiTipVisible()
```

Zo-Ai tips spotlight `#dockZoAi` / `[data-tour="nav-zoai"]` with the same hole/arrow pattern.

## Pages covered (1–3 tips each)

**Staff:** `home`, `schedule`, `stock`, `shop`, `talk`, `kids`, `gallery`, `book`, `pocket`  
**Kids:** `today`, `games`, `rate`, `bonus`, `notes`, `pocket`

No Zo-Ai “ask me about…” tips here — page chrome only.

## CSS

`index.html`: `.tip-root`, `.tip-hole`, `.tip-arrow`, `.tip-card`, `.tip-anchored`, `.tip-target-live`, `.tip-on`. z-index **8600** (below tour 12000). Zo-Ai: `.zoai-tip-*` z-index **8700**.
