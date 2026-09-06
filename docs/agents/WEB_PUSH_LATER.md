# Phase E — Web Push & notification automations

## Done

- Local Web Notifications + SW `showNotification` with platform-honest permission UX
- Capability matrix: [NOTIFICATIONS_MATRIX.md](NOTIFICATIONS_MATRIX.md)
- Optional VAPID: if `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` (or `PAIDIA_VAPID_*`) are set:
  - `GET /api/push/vapid` returns the public key (+ `sendReady` when `pywebpush` is installed)
  - Client `PaidiaNotify.subscribePush()` after enable
  - `POST /api/push/subscribe` stores the subscription in durable KV
  - `/api/health` → `notifications.webPush` / `webPushSend`
- **Send:** admin `POST /api/notify/push` (`title`, `body`/`message`, optional `audience` / `profileIds`, `url`, `tag`) via `pywebpush`
- **Cron:** `GET|POST /api/notify/tick` — Vercel hourly cron (`vercel.json`) or `PAIDIA_CRON_SECRET` / admin session; reminds for ops `events` starting within ~90 minutes (once per event)
- PWA install sheet: iOS A2HS steps + Android `beforeinstallprompt` (honest Safari-tab block via `notifNeedInstall`)

## Optional later

- Richer automations (shift / stock / broadcast → push fan-out)
- Per-preference quiet hours on the server side

## Without VAPID

- Local Notification API + in-app center while the PWA/tab (or SW) can run
- Kids local event/activity/chore/rating reminders when prefs allow
- Admin Automationen = local sweeps only

Do not invent a second push stack — extend the VAPID path above.
