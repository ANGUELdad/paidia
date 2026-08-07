# AGENTS.md

## Cursor Cloud specific instructions

### What this codebase is
Single product: **Armonia Thassos** (internally "PAIDIA"), a bilingual (German/Greek) mobile-first child-care PWA. It is one runnable service:

- Backend: `server.py`, a Python 3 stdlib `http.server` (no Flask/FastAPI, no build step) that serves the frontend and all `/api/*` endpoints (auth, Groq AI proxy, email, WhatsApp, passkeys).
- Frontend: a single vanilla-JS PWA in `index.html` (plus `sw.js`, `manifest.webmanifest`). Client data lives in the browser's `localStorage`.
- `apothiki-demo.jsx` and `paidia-preview.html` are standalone reference artifacts, not wired into the running app. The Next.js/Postgres stack in `docs/` and `STATUS.md` is spec-only and not implemented.

There is **no lint config, no automated test suite, and no build step** in this repo. Standard run instructions live in `README.md` (Greek/German) and `.env.example`.

### Running the app
The update script creates a `.venv` and installs `requirements.txt` (only `webauthn`). Start the server with the venv interpreter:

```
.venv/bin/python server.py
```

- Serves on `http://localhost:5173` (`PAIDIA_HOST` / `PAIDIA_PORT`). Open it in a browser via `http://localhost:5173` — do NOT open `index.html` from `file://`.
- Health checks: `curl http://localhost:5173/api/health` and `curl http://localhost:5173/api/auth/health`.
- The server loads `.env` at startup; shell env vars take precedence over `.env` values. It runs fine with no `.env` (AI/email/WhatsApp just report "not configured"), but **login will not work until you seed a profile** (see below).

### Login gotcha (important, non-obvious)
Login is gated by `PAIDIA_AUTH_USERS_JSON` (a JSON map of profile id -> `{mode,email,pin_hash}`), normally kept in `.env`. It is empty `{}` by default, so **no profile can log in until you seed one**. `.env` is gitignored, so it is not committed and a fresh VM may not have it.

`auth_admin.py set-pin <id>` only edits profiles that already exist in `AUTH_USERS`, so it cannot bootstrap the very first profile. To seed from scratch, generate a `pin_hash` with `server.hash_pin` and put it in `.env`. Example that seeds admin staff profiles `e4` (Angelos) and `e8` (Zoi) with PIN `123456`:

```
cp .env.example .env   # only if .env is missing
.venv/bin/python -c "import server,json; u={'e4':{'mode':'staff','email':'angelos@example.com','pin_hash':server.hash_pin('123456')},'e8':{'mode':'staff','email':'zoi@example.com','pin_hash':server.hash_pin('123456')}}; print('PAIDIA_AUTH_USERS_JSON='+json.dumps(u,separators=(',',':')))"
```

Put the printed `PAIDIA_AUTH_USERS_JSON=...` line into `.env` (replacing the existing empty one), then restart `server.py`. Profile ids: `e1`–`e8` are staff, `k1`–`k12` are children; admin profiles default to `e3,e4,e8`. Log in via the Staff portal, pick the profile name (e.g. Angelos), enter the PIN. A first-login onboarding tutorial must be completed once per profile.

### Optional integrations
Groq (`GROQ_API_KEY`), SMTP/Resend email, and WhatsApp Cloud API are all optional and the app runs fully without them; configure via `.env` (see `.env.example`) only when testing those specific flows.
