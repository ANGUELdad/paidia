# Memory map — what persists where

Use this instead of grepping the whole repo for “where is X stored?”.

## Durable (survives deploy when Postgres is set)

| Store | What | Access |
|-------|------|--------|
| Postgres / SQLite (`db.py`) | Auth users, PIN overrides, passkeys, ops blob, talk, onboarding, security events | `DATABASE_URL` on Vercel; local SQLite/file fallback |
| Ops state (`OPS_STATE` / `/api/ops`) | stock, listEntries, shoppingTrips, weeks, overrides, template, events, log, shiftNotes, shiftCheckins, stockChecks, profilePrefs, custom*, taskCompletions, aiImports | Staff push; all pull |
| Passkeys | WebAuthn public credentials per profile | DB or `.paidia-passkeys.json`; HTTPS + matching origin |
| Profile contacts | Email / phone for reset + broadcast | `/api/auth/profile/email` |
| Gallery posts | Moments metadata (+ Drive if configured) | `/api/gallery` |

## Session / device

| Store | What | Notes |
|-------|------|--------|
| Session cookie | Logged-in profile id/mode | `PAIDIA_SESSION_SECRET`; Secure on prod |
| `localStorage` | `paidia.lang`, `paidia.notif` (prefs + seen keys), shared revision hints, some UI | Device-local |
| `sessionStorage` | One-shot hints (e.g. bio setup prompt) | Cleared per tab |
| Service worker cache | Shell assets `paidia-vN` | Must bump on client ship |
| Platform authenticator | Face ID / fingerprint private key | **Never** leaves the phone |

## Ephemeral (OK to lose)

| Store | What |
|-------|------|
| In-memory JS | Zo-Ai transcript, open sheets, drafts, pin buffer |
| Rate maps in process | Login failures, broadcast cooldown (also soft-persist where coded) |
| `build.json` fetch | Login line refreshed; constants also inlined in `gate.js` / `app.js` |

## Role boundaries

- **Child:** no stock/shifts/presence writes; event notifs only; Zo-Ai read-only.
- **Staff:** ops push, inventory, schedule with Confirm/PIN where required.
- **Admin:** broadcast, template, Admin Center; still no auto-apply Zo-Ai without Confirm.

## Version / changelog memory

| Artifact | Purpose |
|----------|---------|
| `build.json` | `{version,label,changed:{de,el}}` shown on **every** login screen |
| `CHANGELOG.md` | Reverse-chronological human notes; keep in sync with `build.json` |
| Cache `?v=` / `paidia-vN` | Forces clients to drop stale JS/CSS |
