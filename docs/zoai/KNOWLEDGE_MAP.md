# Zo-Ai knowledge map

Index of curated help for the in-app assistant **Zo-Ai**. Runtime uses `map.json` + markdown packs with **keyword routing** so each reply only injects matching topic snippets (token saver).

| Topic | Child | Staff | Admin | Source |
|-------|:-----:|:-----:|:-----:|--------|
| App overview | x | x | x | [overview.md](overview.md) (short) |
| Topic snippets | x | x | x | [map.json](map.json) keywords → compact lines |
| Child portal | x | | | [child.md](child.md) |
| Structured actions | | x | x | [actions.md](actions.md) |
| Admin extras | | | x | [admin.md](admin.md) |
| Safety | x | x | x | [safety.md](safety.md) |

## Injection rules (server)

1. Always: truncated overview + safety.
2. Match last user message against `map.json` topic keys → up to 5 snippets.
3. Staff/admin: actions schema (capped).
4. Admin: short admin.md.
5. Child: child.md; never action fence.
6. Hard cap ~`PAIDIA_ZOAI_KNOWLEDGE_CHARS` (default 5500).

## Product vs coding agents

- **Zo-Ai** (runtime): these files via `server.py` / OmniRoute or Groq.
- **Claude Code** (developers): root `CLAUDE.md` + `docs/claude-code-setup.md`.
- **OmniRoute**: local OpenAI gateway (`OMNIROUTE_BASE_URL`, default `http://127.0.0.1:20128`). `PAIDIA_LLM_PROVIDER=auto` prefers Omni when reachable, else Groq.
