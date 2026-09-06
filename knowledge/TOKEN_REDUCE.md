---
tags: [agent, policy]
aliases: [TOKEN_REDUCE]
---

# TOKEN_REDUCE

Full rules: `docs/agents/TOKEN_REDUCE.md` (canonical).

## Always
1. Never fully load `app.js` / `server.py`
2. Start: [[AGENT_START]] → this note → [[MEMORY]] → topic note / `map.json`
3. Cap parallel file reads (≈3–5)
4. Zo-Ai runtime knowledge = `docs/zoai/` only (not this vault into `/api/chat`)

## Ship checklist (client)
`build.json` · `CHANGELOG.md` · `APP_BUILD` in `gate.js`+`app.js` · `?v=` · `sw.js` `paidia-vN`

## Keyword workflow
```
ask → map.json / topics/* → files[] + snippet → rg → edit range → bump if UI
```
