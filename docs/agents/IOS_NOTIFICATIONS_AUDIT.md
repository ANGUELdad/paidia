# iOS notifications audit (2026-09-07)

## Live health

| Check | Result |
|-------|--------|
| `GET /api/health` → `notifications.local` | `true` |
| `notifications.webPush` | **`false`** |
| `notifications.webPushSend` | **`false`** |
| `GET /api/push/vapid` → `configured` | **`false`** (empty `publicKey`) |
| `manifest.webmanifest` `display` | `standalone` (+ override) |

Without VAPID keys on Vercel, **background Web Push cannot work** on iOS, Android, or desktop. Local OS toasts still work while the PWA/tab (or SW) is alive.

## Platform rules (Apple / WebKit)

- iOS/iPadOS **16.4+** only
- Site must be **Add to Home Screen**, then opened from the **home-screen icon** (standalone)
- Safari / Chrome / Firefox **tabs** on iOS: Notification + Push APIs are **not** exposed → client reason `ios-install`
- Permission must be requested from a **user gesture** inside the installed PWA
- `pywebpush` is already in `requirements.txt`; server path exists (`/api/push/subscribe`, `/api/notify/push`, SW `push` listener)

## Simulator pass (this machine)

- Device: **iPhone 17 Pro**, iOS **26.5**, Booted
- `simctl openurl` → `https://armonia-thassos.vercel.app` OK
- Simulator can exercise in-app Mitteilungen UI and install-copy paths
- **Cannot** reliably prove A2HS install or Web Push delivery — use a **physical iPhone** after VAPID is configured

## Enable Web Push (ops)

```bash
npx web-push generate-vapid-keys
# Set on Vercel (Production + Preview):
#   VAPID_PUBLIC_KEY
#   VAPID_PRIVATE_KEY
#   VAPID_CONTACT=mailto:ops@example.com
# Redeploy; confirm /api/health notifications.webPush + webPushSend true
```

Then on a physical iPhone: A2HS → open icon → Mitteilungen → Allow → test toast → optional admin push.

## Client honesty (already implemented)

See `notifications.js` → `capabilities()` / `showNotification` / `subscribePush`.  
Never mark Mitteilungen “an” unless permission is granted **and** a test toast delivers.  
Matrix: [NOTIFICATIONS_MATRIX.md](NOTIFICATIONS_MATRIX.md) · backlog: [WEB_PUSH_LATER.md](WEB_PUSH_LATER.md).
