# TOKEN_REDUCE

For coding agents working on Armonia v2:

1. Read `knowledge/KNOWLEDGE_MAP.md` first — never dump `app.js` / `server.py`.
2. Prefer OpenAPI at `http://127.0.0.1:8000/docs` for live contracts.
3. Domain notes: AUTH, SCHEDULE, STOCK, BOOK, NOTIFY, KIDS, zoai/*.
4. UI tokens: `design/armonia.platform.tokens.json` → `apps/web/src/app/globals.css`.
5. Legacy behavior oracle only: root PWA / `LEGACY.md` — do not extend it.
6. Cap context: one domain module file at a time under `apps/api/armonia/domains/`.
