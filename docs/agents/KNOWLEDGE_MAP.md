# Coding-agent knowledge map

Short pointers only. Read [TOKEN_REDUCE.md](TOKEN_REDUCE.md) before large searches.

| Topic | Primary files | Entry points |
|-------|---------------|--------------|
| Gate / login | `gate.js`, `app.js` (`renderEntrance`, PIN/passkey) | Profile picker, biometrics, reset |
| Build / version | `build.json`, `CHANGELOG.md`, `gate.js` | Login version chip |
| Home / staff dashboard | `app.js` `viewHome` | Shift-start card, journal duty, bento |
| Plan / schedule | `app.js` schedule views, matrix | Day/week/events |
| Stock | `app.js` `viewStock`, shift stock check | Houses h1/h2, drafts |
| Shop / Friday list | `app.js` `viewShop` | Store mode, import |
| Book / Schichtbuch | `app.js` `viewBook`, `shiftDiaryCard`, filters | Journal pages, log, people |
| Calendar ICS | `app.js` `sheetCalendar`, `buildIcs` | Apple/Google/Outlook |
| Presence | `app.js` `sheetShiftPresence`, `activeShiftPresence` | Ich bin da / late |
| Talk / Team | `app.js` `viewTalk`, `/api/talk` | Staff-only |
| Gallery | `app.js` gallery + `/api/gallery` | Momente |
| Child portal | `app.js` `renderChild` | today/events/week/gallery/games |
| Notifications | `app.js` `enableAppNotifications`, `runNotificationSweep` | Local OS; no Web Push yet |
| Email / broadcast | `server.py` `email_shell`, `/api/notify/broadcast` | Admin Center |
| Zo-Ai | `server.py` `/api/chat`, `docs/zoai/` | Structured `paidia-action` |
| LLM provider | `llm_completion`, OmniRoute → Groq fallback | Vercel usually Groq; local Omni when reachable |
| Auth / WebAuthn | `server.py` passkey routes, `PAIDIA_WEBAUTHN_*` | Face ID / fingerprint |
| Durable DB | `db.py`, ops keys in `server.py` | Postgres on Vercel |
| PWA | `sw.js`, `manifest.webmanifest` | Cache `paidia-v*` |

Zo-Ai product knowledge (injected at runtime): `docs/zoai/KNOWLEDGE_MAP.md`.
