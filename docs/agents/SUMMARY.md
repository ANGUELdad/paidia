# Armonia Thassos / PAIDIA — one-page summary

Mobile-first bilingual (DE/EL) care-ops PWA for Armonia Villas (Thassos): staff schedules, stock, shopping, shift journal, events, gallery, child portal, Zo-Ai assistant.

**Stack:** static `index.html` + `app.js` + `gate.js` + SW; Python `server.py` (local) / `api/index.py` (Vercel); durable `db.py` (SQLite/Postgres).

**Roles:** staff, admin (Zoi/Angelos/Dimitris), child — separate PIN / Face ID profiles.

## Agent token savers (read in order)

1. [TOKEN_REDUCE.md](TOKEN_REDUCE.md)  
2. [KNOWLEDGE_MAP.md](KNOWLEDGE_MAP.md)  
3. [MEMORY_MAP.md](MEMORY_MAP.md)  
4. [map.json](map.json)  
5. [BIOMETRICS.md](BIOMETRICS.md) when touching login / WebAuthn  

Root entry: [AGENTS.md](../../AGENTS.md). Zo-Ai runtime: `docs/zoai/`.

**LLM:** OmniRoute locally when reachable; Vercel typically Groq. Chat, learn, quiz, captions → `llm_completion`.

**Login:** every entrance shows `build.json` version + DE/EL “what changed”.

**Ship checklist:** bump `build.json` + `CHANGELOG.md` + cache `?v=` in `gate.js` / `index.html` / `sw.js` / `app.js` register.
