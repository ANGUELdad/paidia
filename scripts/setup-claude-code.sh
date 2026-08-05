#!/usr/bin/env bash
# Non-interactive installer for Claude Code + companion tools (paidia).
# Safe to re-run. Interactive login steps are printed at the end.
set -euo pipefail

export PATH="${HOME}/.local/bin:${PATH}:/opt/homebrew/bin"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "==> paidia Claude Code setup (root: $ROOT)"

ensure_path_zshrc() {
  if ! grep -q '\.local/bin' "${HOME}/.zshrc" 2>/dev/null; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "${HOME}/.zshrc"
    echo "Added ~/.local/bin to ~/.zshrc"
  fi
}

install_claude() {
  if command -v claude >/dev/null 2>&1; then
    echo "Claude Code: $(claude --version)"
    return
  fi
  echo "Installing Claude Code…"
  curl -fsSL https://claude.ai/install.sh | bash
  ensure_path_zshrc
  export PATH="${HOME}/.local/bin:${PATH}"
  claude --version
}

install_omniroute() {
  if command -v omniroute >/dev/null 2>&1; then
    echo "OmniRoute: $(omniroute --version 2>/dev/null | head -1)"
    return
  fi
  echo "Installing OmniRoute…"
  npm install -g omniroute
  omniroute --version | head -1
}

install_headroom() {
  if command -v headroom >/dev/null 2>&1; then
    echo "Headroom: $(command -v headroom)"
    return
  fi
  if ! command -v pipx >/dev/null 2>&1; then
    brew install pipx
    pipx ensurepath || true
  fi
  echo "Installing Headroom (pipx)…"
  if command -v python3.13 >/dev/null 2>&1; then
    pipx install --python python3.13 "headroom-ai[all]" || pipx upgrade headroom-ai || true
  else
    pipx install "headroom-ai[all]" || pipx upgrade headroom-ai || true
  fi
  export PATH="${HOME}/.local/bin:${PATH}"
  command -v headroom && headroom --help | head -3 || echo "WARN: headroom not on PATH yet — open a new shell"
}

install_task_observer() {
  local dest_proj="${ROOT}/.claude/skills/task-observer"
  local dest_user="${HOME}/.claude/skills/task-observer"
  mkdir -p "${dest_proj}" "${dest_user}"
  if [[ ! -f "${dest_proj}/SKILL.md" ]]; then
    local tmp
    tmp="$(mktemp -d)"
    git clone --depth 1 https://github.com/rebelytics/one-skill-to-rule-them-all.git "${tmp}/src"
    cp "${tmp}/src/SKILL.md" "${dest_proj}/"
    cp -R "${tmp}/src/references" "${dest_proj}/"
    rm -rf "${tmp}"
  fi
  cp -R "${dest_proj}/." "${dest_user}/"
  echo "Task Observer: ${dest_proj} + ${dest_user}"
}

install_plugins() {
  if ! command -v claude >/dev/null 2>&1; then
    echo "WARN: claude missing — skip plugins"
    return
  fi
  claude plugin marketplace add anthropics/claude-plugins-official 2>/dev/null || true
  claude plugin install claude-code-setup@claude-plugins-official --scope user || true

  claude plugin marketplace add thedotmack/claude-mem 2>/dev/null || true
  claude plugin install claude-mem@thedotmack --scope user 2>/dev/null \
    || claude plugin install claude-mem --scope user 2>/dev/null \
    || true

  claude plugin marketplace add chopratejas/headroom 2>/dev/null || true
  claude plugin install headroom@headroom-marketplace --scope user 2>/dev/null || true

  # OmniRoute is an npm gateway, not a Claude marketplace plugin.
  claude mcp add omniroute --transport http http://localhost:20128/api/mcp/stream 2>/dev/null || true
}

install_claude_mem_npx() {
  echo "Claude Mem via npx…"
  npx --yes claude-mem install || echo "WARN: claude-mem install needs retry / Claude Code restart"
  npx --yes claude-mem start || true
}

configure_headroom_claude() {
  if command -v headroom >/dev/null 2>&1 && command -v claude >/dev/null 2>&1; then
    echo "Configuring Headroom for Claude…"
    headroom init -g claude 2>/dev/null \
      || headroom init claude 2>/dev/null \
      || echo "WARN: run manually: headroom init -g claude"
  fi
}

main() {
  ensure_path_zshrc
  install_claude
  install_omniroute
  install_headroom
  install_task_observer
  install_plugins
  install_claude_mem_npx
  configure_headroom_claude

  echo ""
  echo "==> Done (non-interactive)."
  echo "Manual / interactive next steps:"
  echo "  1. source ~/.zshrc   # or open a new terminal"
  echo "  2. claude            # complete Anthropic login if prompted"
  echo "  3. Restart Claude Code so Claude Mem + plugins load"
  echo "  4. Optional: omniroute  then:"
  echo "       claude mcp add-server omniroute --type http --url http://localhost:20128/api/mcp/stream"
  echo "  5. Docs: ${ROOT}/docs/claude-code-setup.md"
}

main "$@"
