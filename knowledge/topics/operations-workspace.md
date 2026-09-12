---
tags: [topic, paidia, token-saver]
id: operations-workspace
---

# operations-workspace

> [!abstract] Snippet
> Atomic POST /api/operations (apply_operation + update_json_atomic); client PaidiaWorkspace reconcile/status; Admin ADMIN_SECTIONS panes; pushShared uses durable commits.

## Keywords
`operations`, `PaidiaWorkspace`, `state.commit`, `pushShared`, `update_json_atomic`, `adminPane`, `workspace.js`, `/api/operations`

## Open these files (only)
- `operations.py`
- `shared/workspace.js`
- `shared/workspace.css`
- `db.py`
- `server.py`
- `api/index.py`
- `app.js`
- `tests/test_operations.py`

## Agent workflow
1. `rg` for a function name from the snippet
2. Read a **line range**, never whole `app.js` / `server.py`
3. Small diff; bump build if client UI changes

## Related topics
- [[topics/tour]] (shared: app.js, server.py)
- [[topics/page-tips]] (shared: app.js)
- [[topics/zoai-tips]] (shared: app.js)
- [[topics/nav-menu]] (shared: app.js)
- [[topics/feedback]] (shared: app.js, server.py)
- [[topics/auth]] (shared: app.js, server.py)
- [[topics/gate]] (shared: app.js)
- [[topics/book]] (shared: app.js)

## Hub
- [[Home]] · [[AGENT_START]] · [[MEMORY]] · [[SITE]]
