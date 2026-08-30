# Phase E — Web Push & notification automations (partial)

## Done (v149)

- Local Web Notifications + SW `showNotification` with platform-honest permission UX
- Capability matrix: [NOTIFICATIONS_MATRIX.md](NOTIFICATIONS_MATRIX.md)
- Optional VAPID: if `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` (or `PAIDIA_VAPID_*`) are set:
  - `GET /api/push/vapid` returns the public key
  - Client `PaidiaNotify.subscribePush()` after enable
  - `POST /api/push/subscribe` stores the subscription in durable KV
  - `/api/health` → `notifications.webPush: true`

## Still deferred

- Server-side **send** (`webpush` / pywebpush) and admin `POST /api/notify/push`
- Vercel Cron → `/api/notify/tick` for closed-app reminders
- Automations that fan out to push (shift / stock / broadcast)

## Current without VAPID

- Local Notification API + in-app center while the PWA/tab (or SW) can run
- Kids local event/activity/chore/rating reminders when prefs allow
- Admin Automationen = local sweeps only

Do not invent a second push stack — extend the VAPID subscribe path above when activating sends.
