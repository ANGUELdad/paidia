# Deploy wiring — GitHub, Vercel, and how the live site works

**For:** Claude Code, Cursor, and other coding agents working on PAIDIA / Armonia Thassos.

This repo ships **two related stacks**. The **production care PWA** (what caregivers use daily) is the **repo root**. The **`apps/` monorepo** is a separate Next.js + FastAPI platform experiment — do not confuse the two when debugging “the live site”.

---

## 1. Production surfaces (URLs)

| URL | Stack | What it is |
|-----|--------|------------|
| **https://armonia-thassos.vercel.app** | Root PWA + Flask (`api/index.py`) | **Primary production app** — `index.html`, `gate.js`, `app.js`, PIN login, Zo-Ai, ops sync |
| **https://paidia-platform.vercel.app** | `apps/web` (Next.js) + `apps/api` (FastAPI) | **Platform v2** — separate Vercel project; health reports `"platform": "armonia-v2"` |
| `http://localhost:5173` | `python3 server.py` | Local dev — same API routes as Vercel, SQLite by default |

If a user says “the website” or “Armonia app”, assume **armonia-thassos** unless they name the Next platform explicitly.

**Do not open `index.html` via `file://`.** AI and auth routes require the Python server.

---

## 2. GitHub remotes (critical for agents)

This machine often has **multiple remotes**. Pushing to the wrong one causes 403 or deploys the wrong fork.

| Remote | URL | Use |
|--------|-----|-----|
| **`upstream`** | `https://github.com/ANGUELdad/paidia.git` | **Canonical repo — push here to deploy production** |
| `origin` | `anguel0z/paidia-armonia` (may vary) | Often misconfigured as default; **403 if you push as anguel0z** |
| `fork` | `anguel0z/paidia` | Personal fork — open PR into `ANGUELdad/paidia` if you cannot switch auth |

### Push protocol (Cloud Agents / Cursor / Claude Code)

```bash
gh auth switch --user ANGUELdad
git push upstream HEAD:main
# optional: gh auth switch --user anguel0z
```

See [PUSH_ORIGIN.md](PUSH_ORIGIN.md). **Never** push to `ANGUELdad/paidia` with the `anguel0z` GitHub account.

Vercel is connected to **`ANGUELdad/paidia`** on branch **`main`**. A successful push triggers an automatic production deploy (watch for `vercel[bot]` on GitHub Deployments).

---

## 3. How the root PWA is wired on Vercel

### 3.1 File map

```
paidia/                          ← Vercel project root (production PWA)
├── index.html                   ← SPA shell + design-system CSS
├── gate.js                      ← Login gate (loads before app.js)
├── app.js                       ← All UI logic (~13k lines)
├── sw.js                        ← Service worker (cache name paidia-vN)
├── build.json                   ← Version + DE/EL “what changed” (login banner)
├── server.py                    ← Shared Python logic (auth, AI, ops, DB)
├── db.py                        ← SQLite locally / Postgres on Vercel
├── pyproject.toml               ← Vercel Python deps + entrypoint
├── vercel.json                  ← Static rewrites
└── api/
    ├── index.py                 ← Flask app (Vercel entry)
    └── [...path].py             ← Catch-all re-export for /api/*
```

**Single source of truth for business logic:** `server.py`.  
**Vercel adapter:** `api/index.py` imports `server as paidia` and exposes Flask routes. Auth handlers reuse `paidia.Handler` via `_FlaskHandlerBridge` — any new keyword args on `Handler` methods must be mirrored on the bridge (see v81.1 login hotfix).

### 3.2 Python entry (Vercel)

From `pyproject.toml`:

```toml
[tool.vercel]
entrypoint = "api.index:app"
```

Dependencies are read from **`pyproject.toml`**, not `requirements.txt` (that file is a local mirror only).

### 3.3 Routing (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/api/_asset/$1" }
  ]
}
```

Everything **except** paths starting with `api/` is rewritten to the Flask handler as a static asset fetch:

| Browser requests | Flask sees | Handler |
|----------------|------------|---------|
| `/` | `/_asset/` → `index.html` | `_serve_static` |
| `/gate.js?v=83` | `/_asset/gate.js` | `_serve_static` (allowlisted) |
| `/app.js?v=83` | `/_asset/app.js` | `_serve_static` |
| `/api/auth/login` | `/api/auth/login` | `_auth_login` → `Handler.handle_auth_login` |
| `/api/ops` | `/api/ops` | ops sync |
| `/api/chat` | `/api/chat` | Zo-Ai |

Static allowlist is **strict** (`api/index.py` → `_STATIC_EXACT`, `icons/*`) — `.env`, source trees, and DB files are never served.

### 3.4 Request flow (diagram)

```mermaid
flowchart LR
  subgraph browser
    HTML[index.html]
    Gate[gate.js]
    App[app.js]
  end
  subgraph vercel [Vercel edge]
    RW[vercel.json rewrite]
  end
  subgraph python [Flask api/index.py]
    Static[_serve_static]
    Auth[/api/auth/*]
    API[/api/ops chat ...]
  end
  subgraph core [server.py + db.py]
    Handler[Handler + helpers]
    Store[(SQLite / Postgres)]
  end
  HTML --> Gate
  Gate -->|PIN ok| App
  App -->|fetch| RW
  RW -->|non-api| Static
  RW -->|/api/*| Auth
  RW --> API
  Auth --> Handler
  API --> Handler
  Handler --> Store
```

### 3.5 Local vs Vercel runtime

| Concern | Local (`server.py`) | Vercel (`api/index.py`) |
|---------|---------------------|-------------------------|
| HTTP server | `ThreadingHTTPServer` | Flask on Vercel Functions |
| Session secret | Dev fallback if unset | **`PAIDIA_SESSION_SECRET` required** |
| Database | `.paidia.db` (SQLite) | `DATABASE_URL` (Postgres pooler — **IPv4**, not direct `:5432`) |
| Cookie `Secure` | off unless env set | on when `VERCEL=1` |
| CORS / trust proxy | conservative | trusts `X-Forwarded-For` on Vercel |

Run locally:

```bash
cp .env.example .env   # GROQ_API_KEY, PAIDIA_AUTH_USERS_JSON, etc.
python3 server.py      # http://127.0.0.1:5173
```

---

## 4. Environment variables (Vercel dashboard)

Template: [`.env.example`](../../.env.example). **Never commit** `.env`, PINs, tokens, or live phone numbers.

### Required for production login + AI

| Variable | Purpose |
|----------|---------|
| `PAIDIA_SESSION_SECRET` | Signs session cookies — missing → login 503 `auth_config` |
| `PAIDIA_AUTH_USERS_JSON` | Profile seeds (PIN **hashes**, not plaintext) |
| `GROQ_API_KEY` | Zo-Ai, OCR, learn/quiz on Vercel |
| `PAIDIA_PUBLIC_URL` | Must be `https://armonia-thassos.vercel.app` (PIN-reset links, email) |
| `PAIDIA_WEBAUTHN_ORIGIN` / `PAIDIA_WEBAUTHN_RP_ID` | Face ID / fingerprint — must match live hostname |

### Durable storage (team data survives deploys)

**Switching provider or project (free tiers):** `db.py` accepts Neon *and*
Supabase poolers, so moving is a `DATABASE_URL` swap with no code change.
Validate a candidate URL before touching Vercel:

```bash
.venv/bin/python scripts/use-database.py "<pooled-url>" --seed
```

It rejects direct/IPv6 hosts, connects, creates the schema, optionally seeds from
`.paidia-ops.json`, and tells you what to paste into Vercel.


| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres **pooler** URL (Supabase transaction pooler or Neon `-pooler` host). Direct IPv6 hosts fail on Vercel. |

After setting `DATABASE_URL`: redeploy → log in → confirm health shows durable storage → save once to seed.

### Email (PIN reset)

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` + `RESEND_FROM` | Preferred on Vercel (SMTP often blocked) |

Without email configured, forgot-PIN shows “not available” (`resetUnavailable`) — that is expected, not a login bug.

### Admin profiles

| Variable | Purpose |
|----------|---------|
| `PAIDIA_ADMIN_PROFILE_IDS` | e.g. `e3,e4,e8` (Dimitris, Angelos, Zoi) |

Full list and comments: `.env.example`.

---

## 5. Shipping a client change (cache + deploy)

Every **user-visible** frontend change must bump version markers or installed PWAs keep stale JS.

1. **`build.json`** — `version`, `label`, `changed.de`, `changed.el`
2. **`gate.js`** — `APP_BUILD` fallback (first paint before fetch)
3. **`app.js`** — `APP_BUILD` + `navigator.serviceWorker.register('./sw.js?v=N')`
4. **`index.html`** — `<script src="gate.js?v=N">`
5. **`gate.js` `loadApp()`** — `app.js?v=` uses `APP_BUILD.version`
6. **`sw.js`** — `const CACHE = 'paidia-vN'` (v83+ also avoids caching app/gate JS)
7. **`CHANGELOG.md`** — release note
8. CSS-only: `python3 scripts/build-style-guide.py` → regenerates `design/system-preview.html` (gitignored output; source is `design/system-preview.src.html`)

Then:

```bash
gh auth switch --user ANGUELdad
git add …
git commit -m "…"
git push upstream HEAD:main
```

Wait ~1–2 min, then verify:

```bash
curl -sS https://armonia-thassos.vercel.app/build.json
curl -sS https://armonia-thassos.vercel.app/api/auth/health
```

Login screen should show the new **vN** label. Users with an old home-screen PWA may need one refresh after a cache-bust release (v83+ purges stale SW caches automatically).

Detail: [CURSOR_HANDOFF.md §6 Ship checklist](CURSOR_HANDOFF.md).

---

## 6. The `apps/` monorepo (separate deploy)

Not the same Vercel project as the root PWA.

```
apps/web/     Next.js App Router  →  paidia-platform.vercel.app
apps/api/     FastAPI (armonia-v2) →  bundled with web or separate function
packages/shared/
```

Root `package.json` workspaces: `apps/web`, `packages/shared`.  
Dev: `npm run dev:web`, `npm run dev:api` (see root `package.json`).

**Do not** edit `apps/*` when fixing production issues on `armonia-thassos` unless the task explicitly targets platform v2.

---

## 7. Auth API quick reference (root PWA)

| Method | Path | Role |
|--------|------|------|
| GET | `/api/auth/health` | Profiles count, email/passkey/DB status |
| GET | `/api/auth/session` | Restore session / sliding refresh |
| POST | `/api/auth/login` | PIN `{ mode, profileId, pin, remember? }` |
| POST | `/api/auth/logout` | Clear cookie |
| POST | `/api/auth/passkey/login/*` | WebAuthn |
| GET | `/api/ops` | Durable ops blob sync |

Gate profiles (`gate.js` `STAFF` / `CHILDREN`) are **client-side labels**; PIN validation uses `PAIDIA_AUTH_USERS_JSON` (+ DB overrides) on the server.

---

## 8. Common agent failures

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `git push` 403 to origin | Wrong GitHub user | `gh auth switch --user ANGUELdad`, push `upstream` |
| Login “Anmeldung nicht möglich” after correct PIN | API 500 (non-JSON) | Check Vercel logs; bridge kwargs vs `Handler` |
| Login 503 `auth_config` | Missing `PAIDIA_SESSION_SECRET` on Vercel | Set env, redeploy |
| Old UI after deploy | Stale PWA / SW cache | Bump version; v83+ auto-purge; hard refresh |
| DB errors / quota | Postgres pooler or Neon transfer limit | Fix `DATABASE_URL`; check `/api/auth/health` → `database` |
| Biometrics unavailable | `PAIDIA_WEBAUTHN_*` still localhost | Set to production origin + RP ID |
| AI/Zo-Ai down | Missing `GROQ_API_KEY` | Vercel env |
| Wrong site entirely | Confused with `paidia-platform` | Use armonia-thassos for root PWA |

---

## 9. Related docs

| Doc | Contents |
|-----|----------|
| [PUSH_ORIGIN.md](PUSH_ORIGIN.md) | GitHub auth switch |
| [CURSOR_HANDOFF.md](CURSOR_HANDOFF.md) | Design system + ship checklist |
| [KNOWLEDGE_MAP.md](KNOWLEDGE_MAP.md) | Code file index |
| [BIOMETRICS.md](BIOMETRICS.md) | WebAuthn env vars |
| [CLAUDE.md](../../CLAUDE.md) | Claude Code entry |
| [.env.example](../../.env.example) | Full env template |

---

## 10. One-line summary for Claude

**Push `main` to `ANGUELdad/paidia` as user `ANGUELdad` → Vercel builds Flask `api/index.py` + static PWA → live at `armonia-thassos.vercel.app`; bump `build.json` / `paidia-vN` on every client ship.**
