# Armonia Platform (v2)

Monorepo redesign — see `LEGACY.md` for the frozen v69 PWA oracle.

## Quick start

```bash
# API
python3 -m venv .venv && .venv/bin/pip install -r apps/api/requirements.txt
npm run dev:api

# Web (proxies /api → :8000)
npm install
npm run dev:web
```

Open http://localhost:3000 — seed PINs: Zoi `888888`, Dora `111111`, kids `121212`.

## Layout

| Path | Role |
|------|------|
| `apps/web` | Next.js App Router PWA |
| `apps/api` | FastAPI domain modules |
| `packages/shared` | Zod contracts / BUILD |
| `knowledge/` | Obsidian + Zo-Ai maps |
| `design/` | Figma token export |
| `docs/PLATFORM_PARITY.md` | Cutover checklist |

## Tests

```bash
npm run test:api
```
