# Token-reduce rules (all LLMs / APIs / agents)

Hard rules so coding models do not burn context on this repo.

## Always

1. **Never** paste or fully load `app.js` (~12k+ lines) or `server.py` (~4k+ lines).
2. Start: [SUMMARY.md](SUMMARY.md) → this file → [KNOWLEDGE_MAP.md](KNOWLEDGE_MAP.md) → [map.json](map.json) keyword.
3. Open **only** the listed files; prefer `rg` for a function name, then read a **line range**.
4. Cap parallel reads (≈3–5). Summarize before expanding.
5. Prefer function names from the map (`viewBook`, `sheetBroadcastEmail`, `email_shell`, `llm_completion`).
6. Zo-Ai **runtime** knowledge = `docs/zoai/` only — do not inject coding-agent maps into `/api/chat`.
7. Specs (`docs/complete_system_specification.md`, SRS, STATUS) are background; maps win for edits.
8. Small diffs; match vanilla JS + Flask style.
9. Secrets stay in `.env` / Vercel — never commit PINs, tokens, live phones.
10. Phase E Web Push is deferred — see [WEB_PUSH_LATER.md](WEB_PUSH_LATER.md).

## Ship checklist (client)

Every visible client change bumps **all** of:

- `build.json` (`version`, `label`, `changed.de` / `changed.el`)
- `CHANGELOG.md` entry
- `gate.js` + `app.js` inlined `APP_BUILD`
- `index.html` `gate.js?v=N`
- `app.js` `sw.js?v=N` register
- `sw.js` `CACHE = 'paidia-vN'`

Login must show **version + what changed** (DE/EL) after every ship.

## Keyword workflow

```
user ask → map.json keys → files[] + snippet → rg function → edit small range → bump build if UI
```

## Anti-patterns

- “Read all of app.js to understand the app”
- Dumping `server.py` into a chat system prompt
- Re-implementing WebAuthn / ops sync without reading [BIOMETRICS.md](BIOMETRICS.md) / MEMORY_MAP
- Inventing new card-heavy UI when fixing auth or maps
