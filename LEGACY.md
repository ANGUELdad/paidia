# Legacy PWA (v69) — freeze note

The root `index.html` / `app.js` / `gate.js` / `server.py` stack is the **behavior oracle** for Armonia Thassos.

**Do not grow the monolith for new features.** New work ships in:

- `apps/web` — Next.js PWA
- `apps/api` — FastAPI domain modules
- `packages/shared` — shared contracts
- `knowledge/` — Obsidian + agent maps

After production parity (`docs/PLATFORM_PARITY.md`) is green:

1. Move root PWA entrypoints into `legacy/` (read-only reference).
2. Point Vercel production to `apps/web` + API worker.
3. Keep `scripts/migrate_ops_to_prisma.py` for one-shot ops import.

Until then, dual-run is allowed; platform is the default for new UI.
