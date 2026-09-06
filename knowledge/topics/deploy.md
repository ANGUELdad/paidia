---
tags: [topic, paidia, token-saver]
id: deploy
---

# deploy

> [!abstract] Snippet
> Push upstream ANGUELdad/paidia → Vercel → armonia-thassos.vercel.app. Read DEPLOY_WIRING.md first.

## Keywords
`vercel`, `deploy`, `api`, `flask`, `github`, `upstream`, `armonia-thassos`

## Open these files (only)
- `docs/agents/DEPLOY_WIRING.md`
- `docs/agents/PUSH_ORIGIN.md`
- `vercel.json`
- `api/index.py`
- `pyproject.toml`
- `server.py`

## Agent workflow
1. `rg` for a function name from the snippet
2. Read a **line range**, never whole `app.js` / `server.py`
3. Small diff; bump build if client UI changes

## Related topics
- [[topics/tour]] (shared: server.py)
- [[topics/feedback]] (shared: server.py)
- [[topics/auth]] (shared: server.py)
- [[topics/shop]] (shared: server.py)
- [[topics/admin-ops]] (shared: server.py)
- [[topics/email]] (shared: api/index.py, server.py)
- [[topics/zoai]] (shared: api/index.py, server.py)
- [[topics/talk]] (shared: server.py)

## Hub
- [[Home]] · [[AGENT_START]] · [[MEMORY]] · [[SITE]]
