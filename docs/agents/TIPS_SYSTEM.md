# Contextual page tips

Lightweight, dismissible **page help popups** — **not** the spotlight tour (`data-tour`).
Zo-Ai capability nags belong to the always-on FAB sibling; this catalog stays **page-UI only**.

## Rules

| Rule | Behaviour |
|------|-----------|
| When | After navigation to a page, random delay **45–120s** |
| Frequency | **Once per page per browser session** |
| Persist | Dismissed tip ids in `localStorage` key `paidia.tipsDismissed` |
| Easy | Fewer tips — `proOnly` skipped; first matching tip preferred |
| Pro | Random among remaining undismissed tips for the page |
| Skip | PIN gate (`gate.on` / `auth-pending`), tour active, sheet open, chat open |
| Motion | `prefers-reduced-motion`: no slide/fade |
| Zo-Ai stagger | Shared `window.__paidiaLastCoachAt` + `paidiaMarkCoachShown()`; min gap **28s**. Also skips if `#zoaiTipRoot` visible / `body.zoai-tip-open` / `paidiaZoAiTipVisible()` |

## Entry / hooks

| Hook | Function |
|------|----------|
| After staff/kids `render` | `tipNotifyPageChange` → `PaidiaPageTips.notifyPageChange` |
| Tour start / gate open | `tipCancelSchedule` + `tipHide` |
| Show | marks coach clock via `paidiaMarkCoachShown` |

Engine: **`page-tips.js`** (`window.PaidiaPageTips`). Thin binders in `app.js`. Host `#tipRoot`.

## Sibling contract (Zo-Ai FAB tips — `zoai-tips.js` / `PaidiaZoAiTips`)

```js
// Before showing a Zo-Ai capability tip:
if (window.paidiaPageTipVisible?.()) { /* wait / reschedule */ }
window.paidiaMarkCoachShown?.();

// Optional markers page tips already respect:
// body.zoai-tip-open  |  #zoaiTipRoot (not hidden)  |  window.paidiaZoAiTipVisible()
```

## Pages covered (1–3 tips each)

**Staff:** `home`, `schedule`, `stock`, `shop`, `talk`, `kids`, `gallery`, `book`  
**Kids:** `today`, `games`, `rate`, `bonus`, `notes`

No Zo-Ai “ask me about…” tips here — page chrome only (filters, ±, dock, Easy/Pro, etc.).

## CSS

`index.html`: `.tip-root`, `.tip-card`, `.tip-on`. z-index **8600** (below tour 12000).


## Zo-Ai FAB tips (`zoai-tips.js` / `PaidiaZoAiTips`)

| Rule | Behaviour |
|------|-----------|
| When | After login / render, first tip ~45–90s, then every **2–5 min** |
| Persist | Dismissed ids in `localStorage` key `paidia.zoaiTipsDismissed` |
| Skip | Gate, tour, sheet, chat open, or page tip visible |
| Stagger | `paidiaMarkCoachShown()`; min gap **28s** with page tips |
| Markers | `#zoaiTipRoot`, `body.zoai-tip-open`, `paidiaZoAiTipVisible()` |
| Hooks | `zoaiTipNotifySession` after staff/kids render; hide on chat open; `zoaiTipStopAll` on gate |

Thin binders in `app.js`. CSS: `.zoai-tip-*` in `index.html` (z-index **8700**).
