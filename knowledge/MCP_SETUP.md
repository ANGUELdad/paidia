---
tags: [mcp, graphify, setup]
---

# MCP_SETUP — Graphify + memory (cut Cursor tokens)

## Why
Reading raw `app.js` burns context. A **queryable graph** + this vault answers most “where/how” questions in ~1–2k tokens.

## 1) Obsidian
1. Install [Obsidian](https://obsidian.md)
2. Open folder: `paidia/knowledge` as vault
3. Graph view → browse wikilinks
4. After map edits: `python3 scripts/build-knowledge-vault.py`

## 2) Graphify (AST graph, local)
```bash
# already: uv tool install "graphifyy[mcp]"
cd /path/to/paidia
graphify update docs knowledge scripts --no-cluster
# optional deeper (slower): graphify update . --no-cluster
```
Outputs: `graphify-out/graph.json`, `graphify-out/GRAPH_REPORT.md`, optional Obsidian export.

Query without MCP:
```bash
graphify explain "viewStock" --graph graphify-out/graph.json
graphify path "viewShop" "send_ops_alert_email" --graph graphify-out/graph.json
```

## 3) Cursor MCP (`~/.cursor/mcp.json` or project `.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "graphify": {
      "command": "graphify-mcp",
      "args": ["--graph", "graphify-out/graph.json"]
    }
  }
}
```
Restart Cursor. Prefer tools: `query_graph`, `get_node`, `get_neighbors`, `shortest_path`.

## 4) Also keep enabled
- **claude-mem** `smart_search` — folded AST views with token counts
- **user-memory** — entities/relations you want across chats
- Project rule `.cursor/rules/knowledge-vault.mdc` — forces vault-first

## 5) Session start for agents
Open [[AGENT_START]] (or say: “use knowledge vault”). Do **not** preload whole specs.
