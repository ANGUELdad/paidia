# Claude Code setup (paidia + this Mac)

Installs and configures tools for **Claude Code** (coding agents). Separate from in-app **Zo-Ai** (Groq).

## Prerequisites

- Claude Code CLI on PATH (`~/.local/bin`):

```bash
curl -fsSL https://claude.ai/install.sh | bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
claude --version
# First run may require: claude  (login / Anthropic account)
```

## The five tools

| Tool | What it is | Install |
|------|------------|---------|
| [Claude Code Setup](https://claude.com/plugins/claude-code-setup) | Official recommender for hooks/skills/MCP | `claude plugin install claude-code-setup@claude-plugins-official --scope user` |
| [Claude Mem](https://github.com/thedotmack/claude-mem) | Persistent session memory | `npx claude-mem install` **or** marketplace `thedotmack/claude-mem` |
| [OmniRoute](https://github.com/diegosouzapw/OmniRoute) | Multi-provider AI gateway (npm CLI, not a Claude marketplace plugin) | `npm install -g omniroute` + optional MCP URL |
| [Headroom](https://github.com/headroomlabs-ai/headroom) | Token compression / wrap | `pipx install --python python3.13 "headroom-ai[all]"` then `headroom wrap claude` or plugin marketplace |
| [Task Observer](https://github.com/rebelytics/one-skill-to-rule-them-all) | Meta-skill for skill improvement | `.claude/skills/task-observer/` + `~/.claude/skills/task-observer/` |

One-shot (non-interactive parts):

```bash
./scripts/setup-claude-code.sh
```

## Verify

```bash
export PATH="$HOME/.local/bin:$PATH"
claude --version
which omniroute && omniroute --version
which headroom && headroom --help | head -5
test -f ~/.claude/skills/task-observer/SKILL.md && echo task-observer ok
claude plugin list 2>/dev/null || true
```

### OmniRoute MCP (optional)

```bash
# After: omniroute  (or start daemon per upstream docs)
claude mcp add-server omniroute --type http --url http://localhost:20128/api/mcp/stream
```

Do **not** route Cursor or in-app Zo-Ai through OmniRoute unless you intend to.

### Headroom wrap (optional)

```bash
headroom wrap claude          # durable wrap
headroom unwrap claude        # undo
# or: headroom init claude
```

### Claude Mem

After `npx claude-mem install`, restart Claude Code. Memory injects on new sessions. Settings: `~/.claude-mem/settings.json`.

### Claude Code Setup plugin

In a Claude Code session: ask “recommend automations for this project” or “help me set up Claude Code”.

### Task Observer

Referenced from root `CLAUDE.md`. End sessions with “Any observations logged?”

## Auth you may need interactively

1. Claude Code / Anthropic login
2. Optional OmniRoute provider keys
3. First Claude Mem worker start

## Relation to Zo-Ai

| | Zo-Ai | Claude Code |
|--|-------|-------------|
| Audience | Caregivers in the app | Developers |
| Model | Groq (`GROQ_API_KEY`) | Anthropic (+ optional OmniRoute) |
| Knowledge | `docs/zoai/` | `CLAUDE.md` + this doc |
| Mutations | Confirmable app DB actions | Repo code edits |
