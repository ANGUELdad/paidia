# Notification automations

Enabled kinds:
- shift_start
- presence_late
- low_stock
- friday_list
- journal_due
- event_publish
- meeting_notes_due
- broadcast
- child_event

Channels: `local`, `push` (VAPID when configured).
Evaluator: `GET|POST /api/notify/evaluate` (dedupe keys on due items).
Admin: `GET/PATCH /api/notify/rules`, broadcast, Web Push subscribe.
SW: `apps/web/public/sw.js`.
