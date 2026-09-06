---
tags: [agent, token-saver]
---

# AGENT_START

**Hard cap:** never paste full `app.js` or `server.py`.

## 30-second protocol
1. Read this note + [[TOKEN_REDUCE]]
2. Match user words → `docs/agents/map.json` **or** a `topics/*` note
3. Open **only** listed files; `rg` function name; read **±80 lines**
4. Prefer Graphify MCP / `smart_search` over dumping files
5. Edit small range; if UI ships → bump `build.json` + `?v=` + `paidia-vN`

## Prefer these tools
| Tool | Use |
|------|-----|
| Obsidian vault `knowledge/` | Navigation + wikilinks |
| `docs/agents/map.json` | Keyword → files + snippet |
| Graphify MCP | `query_graph`, `get_neighbors`, `shortest_path` |
| claude-mem `smart_search` | AST folded views (token-counted) |
| `user-memory` MCP | Persistent entities across sessions |

## Anti-patterns
- “Read all of app.js”
- Rebuilding auth/ops without [[MEMORY]]
- Loading Zo-Ai `docs/zoai/` into coding context unless editing Zo-Ai
