# Notifications matrix — OS × browser × what works

**Scope:** Root PWA (`notifications.js`, `app.js` sweep, `sw.js`).  
**Last updated:** 2026-08-30 (v149).

## Delivery modes

| Mode | When it fires | Needs |
|------|----------------|-------|
| **Local Web Notification** via `ServiceWorkerRegistration.showNotification` | While the app tab/PWA is open **or** the SW is still alive after a sweep | `Notification` permission + secure context |
| **Page `new Notification()` fallback** | Same, when no SW registration | Desktop browsers mainly |
| **In-app badge / Mitteilungen center** | Always while logged in | No OS permission |
| **Web Push (VAPID)** | Background, even if app closed | `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` on server; client `PushManager.subscribe` → `POST /api/push/subscribe` |
| **Email / WhatsApp** | Separate channels | Resend/SMTP / WhatsApp Cloud API |

Without VAPID keys, `/api/health` reports `notifications.webPush: false`. Local scheduled sweeps still run every ~60s / 15m while the session is active (`runNotificationSweep`).

## Capability detection (client)

`PaidiaNotify.capabilities()` / `notifCapabilities()` returns:

| `reason` | Meaning | UI |
|----------|---------|-----|
| `ok` / `default` | Can prompt | Enable button |
| `granted` | Permission already on | Prefs + test |
| `denied` | OS/browser blocked | Honest DE/EL denial copy |
| `ios-install` | iPhone/iPad Safari **not** installed to Home Screen | Install instructions; enable disabled |
| `unsupported` | No Notification API | Unsupported copy |
| `insecure` | `file://` or non-HTTPS | Secure-context copy |

## OS × browser

| Platform | Browser | Local OS toast | SW `showNotification` | Background Web Push | Notes |
|----------|---------|----------------|----------------------|---------------------|-------|
| **iOS 16.4+** | Safari **PWA** (Add to Home Screen) | Yes | Yes | Yes *if* VAPID + PushManager | Must be standalone; Safari tab alone → `ios-install` |
| **iOS** | Safari (tab) | No (honest block) | No | No | Prompt users to install; do not fake “enabled” |
| **iOS** | Chrome / Firefox (iOS) | Same as Safari (WebKit) | Same | Same | All browsers use WebKit on iOS |
| **Android** | Chrome | Yes | Yes | Yes *if* VAPID | Best supported path |
| **Android** | Firefox | Yes | Yes | Yes *if* VAPID | |
| **Android** | Samsung Internet | Yes (usually) | Yes | Often | Treat like Chromium |
| **desktop macOS** | Safari 16+ | Yes | Yes | Limited / evolving | Prefer SW path; actions may vary |
| **desktop** | Chrome | Yes | Yes | Yes *if* VAPID | |
| **desktop** | Firefox | Yes | Yes | Yes *if* VAPID | |
| **desktop** | Edge | Yes | Yes | Yes *if* VAPID | Chromium |
| **any** | `file://` | No | No | No | Use `python3 server.py` / HTTPS |

\* “Yes *if* VAPID” = keys set in env, subscribe succeeded, and a future server sender uses the stored subscription. **Subscribe is wired; broadcast send is still Phase E** (see [WEB_PUSH_LATER.md](WEB_PUSH_LATER.md)).

## Category toggles → what fires

Prefs in `paidia.notif` (settings UI). Sweep in `runNotificationSweep` / `PaidiaNotify.syncFromContext`.

| Pref key | Staff | Child | Trigger (local, when enabled + permission) |
|----------|-------|-------|---------------------------------------------|
| `shifts` | ✓ | — | Shift start / late presence |
| `handover` | ✓ | — | Near shift end without handoff |
| `activities` | ✓ | ✓ | Plan entries in lead window |
| `events` | ✓ | ✓ | Published events in lead window |
| `shopping` | ✓ | — | Friday list + open list requests |
| `stock` | ✓ | — | Low stock (automation flag) |
| `journal` | ✓ | — | Open shift journal midday+ |
| `ratings` | ✓ | ✓ | Kid rating / important-things reminders |
| `chores` | — | ✓ | Open daily chores (afternoon+) |
| `reminders` | ✓ | ✓ | Sibling “important things” nudges |
| `sound` / `vibrate` | ✓ | ✓ | Payload `silent` / `vibrate` |
| Quiet hours | ✓ | ✓ | Blocks non-`force` delivery |

Automations panel (`paidia.notifAuto`) can further gate shift/stock/late/friday/activities/handover/ratings sweeps.

## API surface

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /api/push/vapid` | No | Public key if configured |
| `POST /api/push/subscribe` | Yes (session) | Store PushSubscription in durable KV |
| `GET /api/health` → `notifications` | No | `{ local: true, webPush: bool }` |

## Honest UX rules

1. Never mark Mitteilungen “an” unless permission is `granted` **and** a test `showNotification` succeeds.
2. On iOS Safari tab, show install copy — do not call `requestPermission` as if it will work.
3. Calendar / Profil surfaces use the same capability matrix (DE/EL).

## Related

- [WEB_PUSH_LATER.md](WEB_PUSH_LATER.md) — remaining server push send / cron
- `notifications.js` — `PaidiaNotify`
- `sw.js` — `notificationclick` + `push` listener (payload ready)
