# Token-reduce rules for coding agents

1. **Never** load or paste entire `app.js` or `server.py` into context. Use `rg` + this map.
2. Start from [KNOWLEDGE_MAP.md](KNOWLEDGE_MAP.md) → [map.json](map.json) keywords → open only listed files / line ranges.
3. Prefer function names from the map (`viewBook`, `sheetCalendar`, `email_shell`) over whole-file reads.
4. Cap parallel file reads; summarize before expanding.
5. Zo-Ai runtime: use `docs/zoai/` only — do not dump agent maps into chat prompts.
6. **Cache bust every client ship:** `build.json` version + `CHANGELOG.md` entry + `gate.js` `app.js?v=` + `index.html` `gate.js?v=` + `sw.js` `CACHE` + `app.js` SW register `?v=`.
7. Secrets stay in `.env` / Vercel — never commit PINs, tokens, or live phones.
8. Small diffs; match vanilla JS + Flask style.
9. Phase E Web Push is deferred — do not invent VAPID unless that phase is active.
