# In-app feedback system (`feedbackReports`)

Staff + kids can report **bugs**, **change requests**, and **addition requests**. Staff triage in Pro.

## UX entry

| Who | Where |
|-----|--------|
| Staff | Help center card · Profil/Security sheet · Dock **Mehr** |
| Staff Pro | Feedback inbox (Profil + hub) — status triage |
| Kids | **Mehr** sheet row (dock/rail unchanged) |

Form fields: type · title · description · auto **page/context** (`context` + `contextKey`) · optional screenshot note · severity (bugs only: low/medium/high).

## Data model

Ops list key: **`feedbackReports`** (in `OPS_KEYS`, `SHARED_KEYS`, `MUTABLE`, kid-ops).

```js
{
  id, type: 'bug'|'change'|'addition',
  title, description,           // title≤120, desc≤2000
  context, contextKey,          // human label + route key e.g. staff:stock
  screenshotNote,               // optional ≤240
  severity: 'low'|'medium'|'high'|null,  // bugs only
  status: 'open'|'triaged'|'done'|'wontfix',
  authorType: 'staff'|'child', authorId, authorName,
  kidId, by, createdAt, updatedAt,
  triageNote, triagedBy, triagedAt
}
```

Cap: `OPS_LIST_CAPS["feedbackReports"] = 2000`.

## Persistence

- Staff: `save()` → `/api/ops` like other shared lists.
- Kids: `pushKidOps` sends only **own open** rows; server `_merge_kid_feedback_reports` stamps session `kidId` and **locks** non-open (staff-triaged) rows.

Do not invent a parallel store — reuse ops/DB.

## Client anchors (`app.js`)

- `ensureFeedbackReports` / `createFeedbackReport` / `triageFeedbackReport`
- `sheetFeedbackHub` · `sheetFeedbackCompose` · `sheetFeedbackInbox`
- Context helpers: `feedbackContextKey` · `feedbackContextLabel`

## Guardrails

- Do **not** regress kids dock v142, Zo-Ai title v143, Lager/Plan.
- Easy hides Pro inbox controls (`.pro-only` / `.mode-pro-block`).
- No PIN dumps in reports; no secrets in `screenshotNote`.

## Ship

Bump `build.json` + cache `?v=` / `paidia-vN` when shipping client changes (see `TOKEN_REDUCE.md`).
