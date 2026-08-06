# PAIDIA / Armonia Thassos — Claude Code guide

Mobile-first bilingual (DE/EL) care-ops PWA. No bundler: static frontend + Python API.

## Run locally

```bash
cp .env.example .env   # set GROQ_API_KEY
python3 server.py      # http://localhost:5173
```

Do not open `index.html` via `file://` — AI routes need the server.

## Architecture

| Area | Files |
|------|--------|
| UI / client DB | `index.html`, `app.js`, `gate.js` |
| Local API | `server.py` |
| Vercel | `api/index.py` (imports paidia helpers) |
| Durable store | `db.py` (SQLite / Postgres) |
| Zo-Ai knowledge | `docs/zoai/` (injected into chat prompts) |
| Coding-agent maps | `docs/agents/` + root `AGENTS.md` (token savers) |

## Agent maps (read first)

See **[AGENTS.md](AGENTS.md)** → `docs/agents/SUMMARY.md`, `TOKEN_REDUCE.md`, `KNOWLEDGE_MAP.md`, `MEMORY_MAP.md`, `map.json`.

## Zo-Ai (in-app assistant)

- Named **Zo-Ai**; role prompts: child / staff / admin
- Mutates **app data only** via confirmable `paidia-action` JSON (stock, list, schedule; admin template)
- Never rewrite source, change PINs/secrets, or auto-apply without Confirm (+ PIN for schedule)
- Knowledge map: `docs/zoai/KNOWLEDGE_MAP.md`

## Claude Code tooling on this machine

See `docs/claude-code-setup.md` and `scripts/setup-claude-code.sh`.

Expected user-global tools: Claude Code Setup plugin, Claude Mem, OmniRoute, Headroom, Task Observer skill.

### Task Observer

Skill lives at `.claude/skills/task-observer/` (and `~/.claude/skills/task-observer/`). Load it in coding sessions; ask “Any observations logged?” when ending a session.

## Safety for coding agents

- Never commit `.env`, PINs, WhatsApp tokens, or live caregiver phone numbers
- Prefer small diffs; match existing vanilla JS + Flask style
- Cache bust: bump `build.json` + `CHANGELOG.md` + `?v=` in `gate.js` / `index.html` / `sw.js` when shipping client changes
- Never paste entire `app.js` / `server.py` — use `docs/agents/` maps
