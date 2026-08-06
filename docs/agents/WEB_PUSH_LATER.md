# Phase E — Web Push & notification automations (deferred)

Not in the current ship. Tracked so agents do not re-invent half-built push.

## Planned work

- VAPID keys; `PushManager.subscribe`; store subscriptions in Postgres via `db.py`
- `POST /api/push/subscribe` + admin `POST /api/notify/push`
- Wire existing `sw.js` `push` listener to real payloads
- Automations in Admin: shift start → push, low stock → push, broadcast → email+push

## Current state

- `/api/health` reports `notifications.webPush: false`
- Local Notification API + email broadcast work while the PWA/tab can run
- Kids get local event banners when enabled (same limitation: app open-ish)

Do not implement VAPID unless this phase is explicitly activated.
