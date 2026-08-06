# Armonia Thassos / PAIDIA — one-page summary

Mobile-first bilingual (DE/EL) care-ops PWA for Armonia Villas (Thassos): staff schedules, stock, shopping, shift journal, events, gallery, child portal, Zo-Ai assistant.

**Stack:** static `index.html` + `app.js` + `gate.js` + SW; Python `server.py` (local) / `api/index.py` (Vercel); durable `db.py` (SQLite/Postgres).

**Roles:** staff, admin (Zoi/Angelos/Dimitris), child — separate PIN/passkey profiles.

**Do not:** paste full `app.js`/`server.py` into LLM context. Use [KNOWLEDGE_MAP.md](KNOWLEDGE_MAP.md), [MEMORY_MAP.md](MEMORY_MAP.md), [TOKEN_REDUCE.md](TOKEN_REDUCE.md), [map.json](map.json). Zo-Ai runtime knowledge lives in `docs/zoai/`.

**LLM:** Prefer OmniRoute locally when reachable; production on Vercel typically uses Groq. Chat, learn, quiz, and gallery captions share `llm_completion`.

**Ship checklist:** bump `build.json` + `CHANGELOG.md` + cache `?v=` in `gate.js` / `index.html` / `sw.js` / `app.js` register.
