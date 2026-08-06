# Memory map — what persists where

| Store | What | Notes |
|-------|------|--------|
| Postgres / SQLite (`db.py`) | Auth users, PIN overrides, passkeys, ops blob, talk, onboarding, security | `DATABASE_URL` required on Vercel |
| Ops state (`OPS_STATE`) | stock, listEntries, weeks/overrides, events, log, shiftNotes, shiftCheckins, stockChecks, profilePrefs, … | Synced via `/api/ops` pull/push |
| Passkeys | WebAuthn credentials per profile | File or DB; origin must match HTTPS prod |
| `localStorage` | `paidia.lang`, `paidia.notif`, onboarding flags, some UI prefs | Device-local |
| Session cookie | Logged-in profile | `PAIDIA_SESSION_SECRET` |
| Service worker cache | Shell assets `paidia-vN` | Bust on every client ship |
| `build.json` | App version + changelog line | Shown on login |
| Ephemeral | Zo-Ai chat transcript in memory, sheet UI, drafts | Lost on reload unless saved |

**Child vs staff:** child mode never writes stock/shifts; shift presence/checkins are staff-only. Gallery/events may involve both with role filters.
