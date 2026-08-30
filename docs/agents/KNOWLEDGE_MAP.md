# Coding-agent knowledge map

**Read [TOKEN_REDUCE.md](TOKEN_REDUCE.md) first.** Never open whole `app.js` / `server.py` — jump via this table + [map.json](map.json).

## Product surface → code

| Topic | Primary files | Entry points / search |
|-------|---------------|------------------------|
| Gate / login | `gate.js`, `app.js` | `renderEntrance`, `renderPin` / `renderGatePin`, PIN + WebAuthn |
| Build / version | `build.json`, `CHANGELOG.md`, `gate.js`, `app.js` | Login `gate-build` chip; bump with every client ship |
| Biometrics | `gate.js`, `app.js`, `server.py`, [BIOMETRICS.md](BIOMETRICS.md) | Face ID / Fingerabdruck / Hello; `PAIDIA_WEBAUTHN_*` |
| Home / staff | `app.js` | `viewHome`, shift-start, journal duty, bento |
| Plan / schedule | `app.js` | day/week/events matrix, overrides, template |
| Stock | `app.js` | `viewStock` pantry ± / quick-add, shift stock Kalyvia |
| Shop / Friday | `app.js` | `viewShop`, store confirm, OCR import |
| Book / journal | `app.js` | `viewBook`, `writeShiftJournalPage`, filters |
| Calendar ICS | `app.js` | `sheetCalendar`, `buildIcs`, Google/Outlook URLs |
| Presence | `app.js`, `sw.js` | `sheetShiftPresence`, notif actions `?presence=1` |
| Talk / Team | `app.js`, `server.py` | `viewTalk`, `/api/talk` (staff) |
| Gallery | `app.js`, `server.py`, `drive_gallery.py` | `/api/gallery`, Moments |
| Child portal | `app.js`, `docs/zoai/child.md`, `docs/agents/QA_REPORT_KIDS_UI.md` | `renderChild` + `mountKidDock` + `childStartView` kid-home; desktop rail |
| Notifications | `app.js`, `sw.js` | `enableAppNotifications`, `runNotificationSweep` (local OS) |
| Email / broadcast | `server.py`, `app.js`, `email-preview.html` | `email_shell`, `/api/notify/broadcast` |
| Admin center | `app.js` | admin panel, `sheetBroadcastEmail`, staff sheets |
| Zo-Ai | `server.py`, `docs/zoai/`, `app.js` | `/api/chat`, `paidia-action`, confirm + PIN |
| LLM provider | `server.py`, `api/index.py` | `llm_completion` Omni→Groq; learn/quiz/caption same |
| Auth API | `server.py`, `api/index.py`, `auth_admin.py` | `/api/auth/*`, sessions, reset |
| Durable DB | `db.py`, `server.py` | keys, ops blob, `DATABASE_URL` |
| Ops sync | `app.js`, `server.py` | `/api/ops`, `SHARED_KEYS`, `pushShared`/`pullShared` |
| PWA / SW | `sw.js`, `manifest.webmanifest`, `index.html` | cache `paidia-vN`, `?v=` bust |
| Deploy | `vercel.json`, `api/index.py`, `api/[...path].py`, `pyproject.toml` | Vercel Flask adapter — see [DEPLOY_WIRING.md](DEPLOY_WIRING.md) |
| Design tokens | `design/armonia.tokens.json`, `index.html` CSS | mineral palette, fonts |
| Specs (read-only) | `docs/complete_system_specification.md`, `STATUS.md` | historical; prefer maps over full specs |

## File index (all main codes)

| File | Role | Typical edit size |
|------|------|-------------------|
| `index.html` | Shell, CSS, gate DOM, script tags | CSS / markup snippets |
| `app.js` | Almost all UI + client logic | **function-scoped** only |
| `gate.js` | Cold-boot login before/with app | PIN, passkey, version chip |
| `sw.js` | Cache + notification click | CACHE name + handlers |
| `server.py` | Local API + shared helpers | named `def` / route |
| `api/index.py` | Vercel HTTP adapter → paidia | thin wrappers |
| `db.py` | Durable key/value | KEY_* constants |
| `auth_admin.py` | Admin auth helpers | rare |
| `drive_gallery.py` | Google Drive gallery | optional |
| `build.json` | Version + login “what changed” | every ship |
| `CHANGELOG.md` | Human release notes | every ship |
| `AGENTS.md` | Agent entry | pointers only |
| `docs/agents/*` | Token-saver maps | keep short |
| `docs/zoai/*` | Runtime Zo-Ai knowledge | keyword inject |

Zo-Ai product knowledge (chat injection): `docs/zoai/KNOWLEDGE_MAP.md` — separate from coding-agent maps.
