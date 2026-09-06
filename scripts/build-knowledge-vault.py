#!/usr/bin/env python3
"""Build the Obsidian knowledge vault from agent maps (token-saver for Cursor).

Reads:
  docs/agents/map.json
  docs/agents/MEMORY_MAP.md
  docs/agents/KNOWLEDGE_MAP.md
  docs/agents/SUMMARY.md

Writes under knowledge/:
  Home.md, AGENT_START.md, SITE.md, MEMORY.md, TOKEN_REDUCE.md
  topics/<id>.md  (one atomic note per map topic)
  graph/agent-map.json  (lightweight keyword→files graph for MCP / scripts)
  .obsidian/* minimal vault config

Run: python3 scripts/build-knowledge-vault.py
Open knowledge/ as an Obsidian vault.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAP_PATH = ROOT / "docs" / "agents" / "map.json"
VAULT = ROOT / "knowledge"
TOPICS_DIR = VAULT / "topics"
GRAPH_DIR = VAULT / "graph"
OBSIDIAN = VAULT / ".obsidian"

# Staff / kid routes as used in the PWA (hash tabs).
SITE_ROUTES = [
    ("#home", "Home", "viewHome", "staff"),
    ("#schedule", "Plan / Wochenplan", "viewSchedule", "staff"),
    ("#stock", "Lager", "viewStock", "staff"),
    ("#shop", "Liste / Einkauf", "viewShop", "staff"),
    ("#book", "Buch / Übergabe", "viewBook", "staff"),
    ("#gallery", "Momente", "viewGallery", "staff"),
    ("#talk", "Talk", "viewTalk", "staff"),
    ("#kids", "Kinder & Schule", "viewKids", "staff"),
    ("#pocket", "Taschengeld", "viewPocket", "staff"),
    ("#admin", "Admin Ops", "viewAdminOps", "admin"),
    ("child today", "Kid Start", "childStartView", "child"),
    ("child plan", "Kid Stundenplan", "childStundenplanView", "child"),
    ("child aufgaben", "Kid Aufgaben", "childAufgabenView", "child"),
    ("child rate", "Kid Bewertungen", "childBewertungenView", "child"),
    ("child pocket", "Kid Taschengeld", "childPocketView", "child"),
    ("child games", "Kid Spiele", "childGamesView", "child"),
    ("gate", "Login gate", "renderEntrance / renderPin", "public"),
]


def wiki(name: str) -> str:
    return f"[[{name}]]"


def topic_note_name(topic_id: str) -> str:
    return f"topics/{topic_id}"


def write(path: Path, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(body.rstrip() + "\n", encoding="utf-8")


def build_topic_notes(topics: list[dict]) -> None:
    for t in topics:
        tid = t["id"]
        keys = ", ".join(f"`{k}`" for k in t.get("keys", [])[:12])
        files = "\n".join(f"- `{f}`" for f in t.get("files", []))
        related = []
        for other in topics:
            if other["id"] == tid:
                continue
            shared = set(t.get("files", [])) & set(other.get("files", []))
            if shared:
                related.append(f"- {wiki(topic_note_name(other['id']))} (shared: {', '.join(sorted(shared)[:3])})")
        related_md = "\n".join(related[:8]) or "- (none)"
        body = f"""---
tags: [topic, paidia, token-saver]
id: {tid}
---

# {tid}

> [!abstract] Snippet
> {t.get('snippet', '')}

## Keywords
{keys}

## Open these files (only)
{files}

## Agent workflow
1. `rg` for a function name from the snippet
2. Read a **line range**, never whole `app.js` / `server.py`
3. Small diff; bump build if client UI changes

## Related topics
{related_md}

## Hub
- {wiki('Home')} · {wiki('AGENT_START')} · {wiki('MEMORY')} · {wiki('SITE')}
"""
        write(TOPICS_DIR / f"{tid}.md", body)


def build_home(topics: list[dict]) -> None:
    links = "\n".join(f"- {wiki(topic_note_name(t['id']))} — {t.get('snippet','')[:90]}" for t in topics)
    body = f"""---
tags: [moc, hub]
---

# Armonia Thassos — Knowledge Hub

Obsidian vault for **humans + coding agents**. Goal: answer “where is X?” in **<1k tokens**, not by loading `app.js`.

## Start (AI — read in order)
1. {wiki('AGENT_START')}
2. {wiki('TOKEN_REDUCE')}
3. {wiki('MEMORY')}
4. {wiki('SITE')}
5. Keyword → topic note under `topics/`

## Canonical coding maps (also in repo)
- `docs/agents/SUMMARY.md`
- `docs/agents/map.json` (machine index this vault mirrors)
- `docs/agents/KNOWLEDGE_MAP.md`
- `docs/agents/MEMORY_MAP.md`

## Topics
{links}

## Zo-Ai runtime (in-app chat — not coding maps)
- {wiki('zoai/overview')}
- `docs/zoai/`

## Graphify / MCP
- Graph output: `graphify-out/` (query via MCP `query_graph` / `get_neighbors`)
- Lightweight map graph: `knowledge/graph/agent-map.json`
- Setup: {wiki('MCP_SETUP')}

## How to refresh
```bash
python3 scripts/build-knowledge-vault.py
graphify update docs knowledge --no-cluster   # AST-only, no LLM
# or full: graphify update . --no-cluster
```
"""
    write(VAULT / "Home.md", body)


def build_agent_start() -> None:
    body = """---
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
"""
    write(VAULT / "AGENT_START.md", body)


def build_token_reduce() -> None:
    body = """---
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
"""
    write(VAULT / "TOKEN_REDUCE.md", body)


def build_memory() -> None:
    # Keep a short Obsidian-friendly mirror; point to canonical MEMORY_MAP.md
    mem = (ROOT / "docs" / "agents" / "MEMORY_MAP.md").read_text(encoding="utf-8")
    # Strip first H1 if present to avoid double titles
    mem_body = re.sub(r"^# .+\n+", "", mem, count=1)
    body = f"""---
tags: [memory, persistence]
aliases: [MEMORY_MAP]
---

# MEMORY

Canonical detail: `docs/agents/MEMORY_MAP.md`.

{mem_body}

## Related
- [[SITE]] · [[AGENT_START]] · [[topics/db]] · [[topics/auth]] · [[topics/admin-ops]]
"""
    write(VAULT / "MEMORY.md", body)
    # Keep legacy filename for old links
    write(VAULT / "MEMORY_MAP.md", "# → [[MEMORY]]\n\nRedirect. Use [[MEMORY]].\n")


def build_site() -> None:
    rows = "\n".join(
        f"| `{route}` | {title} | `{fn}` | {role} |"
        for route, title, fn, role in SITE_ROUTES
    )
    body = f"""---
tags: [site, routes, layout]
---

# SITE — PWA layout map

Mobile-first bilingual (DE/EL) care-ops PWA. **No bundler:** `index.html` + `app.js` + `gate.js` + `sw.js` + Python API.

## Architecture (one screen)
```
gate.js (login) → app shell
  header.app-chrome (title · Easy/Pro · bell · lang · avatar)
  #view (staffViewHtml / renderChild)
  nav.dock (staff) / kid-dock (child)
  Zo-Ai FAB / Mehr sheet
```

## Routes / tabs
| Route | Screen | Entry | Role |
|-------|--------|-------|------|
{rows}

## File roles (edit size)
| File | Role | Edit size |
|------|------|-----------|
| `index.html` | Shell + CSS | snippets |
| `ui-v110.css` | Layout / desktop | rules |
| `app.js` | Almost all UI | **function only** |
| `gate.js` | Cold login | PIN / Face ID |
| `sw.js` | Cache + notif click | CACHE name |
| `server.py` | Local API helpers | named `def` |
| `api/index.py` | Vercel adapter | thin |
| `db.py` | Durable KV | KEY_* |

## Design
- Tokens / motion: `design/VISUAL_MOTION_SYSTEM.md`
- Living style guide: `design/system-preview.html`

## Related
- [[Home]] · [[MEMORY]] · [[topics/gate]] · [[topics/child]] · [[topics/tokens]]
"""
    write(VAULT / "SITE.md", body)


def build_mcp_setup() -> None:
    body = """---
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
"""
    write(VAULT / "MCP_SETUP.md", body)


def build_agent_map_graph(topics: list[dict]) -> None:
    nodes = []
    edges = []
    for t in topics:
        nid = f"topic:{t['id']}"
        nodes.append({
            "id": nid,
            "type": "topic",
            "label": t["id"],
            "keys": t.get("keys", []),
            "snippet": t.get("snippet", ""),
        })
        for f in t.get("files", []):
            fid = f"file:{f}"
            if not any(n["id"] == fid for n in nodes):
                nodes.append({"id": fid, "type": "file", "label": f})
            edges.append({"from": nid, "to": fid, "rel": "opens"})
    # Cross-link topics that share files
    for i, a in enumerate(topics):
        for b in topics[i + 1:]:
            shared = set(a.get("files", [])) & set(b.get("files", []))
            if shared:
                edges.append({
                    "from": f"topic:{a['id']}",
                    "to": f"topic:{b['id']}",
                    "rel": "shares_files",
                    "files": sorted(shared)[:5],
                })
    payload = {
        "version": 1,
        "source": "docs/agents/map.json",
        "nodes": nodes,
        "edges": edges,
        "usage": "Prefer topics over opening files. Match user keywords to topic.keys.",
    }
    write(GRAPH_DIR / "agent-map.json", json.dumps(payload, ensure_ascii=False, indent=2))


def build_obsidian_config() -> None:
    write(OBSIDIAN / "app.json", json.dumps({
        "name": "Armonia Thassos Knowledge",
        "promptDelete": False,
        "alwaysUpdateLinks": True,
        "newFileLocation": "folder",
        "newFileFolderPath": "topics",
        "attachmentFolderPath": "attachments",
    }, indent=2))
    write(OBSIDIAN / "appearance.json", "{}\n")
    write(OBSIDIAN / "core-plugins.json", json.dumps({
        "file-explorer": True,
        "global-search": True,
        "graph": True,
        "backlink": True,
        "outgoing-link": True,
        "tag-pane": True,
        "page-preview": True,
        "note-composer": True,
        "command-palette": True,
        "editor-status": True,
        "outline": True,
        "word-count": True,
    }, indent=2))
    write(OBSIDIAN / "graph.json", json.dumps({
        "collapse-filter": False,
        "search": "",
        "showTags": True,
        "showAttachments": False,
        "hideUnresolved": True,
        "showOrphans": False,
        "colorGroups": [
            {"query": "tag:#topic", "color": {"a": 1, "rgb": 4283211}},
            {"query": "tag:#agent", "color": {"a": 1, "rgb": 11478722}},
            {"query": "tag:#memory", "color": {"a": 1, "rgb": 14725458}},
        ],
    }, indent=2))


def sync_legacy_domain_stubs(topics: list[dict]) -> None:
    """Keep old top-level AUTH.md etc. as redirects so old links work."""
    legacy = {
        "AUTH.md": "auth",
        "STOCK.md": "stock",
        "SCHEDULE.md": "schedule",
        "BOOK.md": "book",
        "CALENDAR.md": "calendar",
        "KIDS.md": "child",
        "BIOMETRICS.md": "auth",
        "NOTIFY_AUTOMATIONS.md": "notif",
        "KNOWLEDGE_MAP.md": None,
    }
    for fname, tid in legacy.items():
        if tid:
            write(VAULT / fname, f"# → [[{topic_note_name(tid)}]]\n\nRedirect from legacy note. Prefer the topic note.\n")
        else:
            write(VAULT / fname, "# → [[Home]]\n\nUse the hub + `topics/` notes. Canonical coding map: `docs/agents/KNOWLEDGE_MAP.md`.\n")


def main() -> None:
    data = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    topics = data.get("topics") or []
    TOPICS_DIR.mkdir(parents=True, exist_ok=True)
    GRAPH_DIR.mkdir(parents=True, exist_ok=True)
    build_obsidian_config()
    build_topic_notes(topics)
    build_home(topics)
    build_agent_start()
    build_token_reduce()
    build_memory()
    build_site()
    build_mcp_setup()
    build_agent_map_graph(topics)
    sync_legacy_domain_stubs(topics)
    # Preserve zoai/ folder — do not wipe; ensure overview exists
    zoai = VAULT / "zoai" / "overview.md"
    if not zoai.exists():
        write(zoai, "# Zo-Ai overview\n\nCanonical: `docs/zoai/KNOWLEDGE_MAP.md`.\n\n- [[zoai/staff]] · [[zoai/admin]] · [[zoai/child]] · [[zoai/actions]]\n")
    print(f"Vault ready: {VAULT}")
    print(f"  topics: {len(topics)}")
    print(f"  graph: {GRAPH_DIR / 'agent-map.json'}")
    print("Open in Obsidian: File → Open folder as vault → knowledge/")


if __name__ == "__main__":
    main()
