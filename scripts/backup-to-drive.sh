#!/usr/bin/env bash
# Back up this project to Google Drive WITHOUT secrets.
#
#   ./scripts/backup-to-drive.sh
#
# Why not just sync the folder with the Drive app:
#   Drive sync ignores .gitignore. Pointing it at this project would upload
#   .env, .env.local (live Neon DB credentials), .env.bak-*, the PIN-hash
#   backup and the local SQLite DB. PAIDIA_SESSION_SECRET alone is enough to
#   forge a session for any profile.
#
# How this stays safe: it uses `git archive`, which exports ONLY git-tracked
# files. Every secret here is gitignored and therefore untracked, so it is
# excluded by construction — not by an exclude list someone has to maintain.
# Extra untracked folders you actually want (design exports, photos) are
# opt-in via EXTRA below.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

PROJECT="$(basename "$PWD")"
STAMP="$(date +%Y-%m-%d_%H%M)"

# Opt-in extras: untracked dirs worth backing up. Never add .env* or .paidia*.
EXTRA=( "design" "docs" )

# ── locate Drive ───────────────────────────────────────────────────────────
DRIVE=""
for c in "$HOME/Library/CloudStorage"/GoogleDrive-*/My\ Drive "$HOME/Google Drive/My Drive"; do
  [ -d "$c" ] && DRIVE="$c" && break
done
if [ -z "$DRIVE" ]; then
  echo "ERROR: Google Drive not found."
  echo "  Install it:  brew install --cask google-drive"
  echo "  Then open Google Drive.app and sign in once."
  exit 1
fi

DEST="$DRIVE/Armonia Backups"
mkdir -p "$DEST" || { echo "ERROR: cannot write to $DEST"; exit 1; }

# ── safety check: refuse if any secret is somehow tracked ──────────────────
# .env.example is the tracked template (all values empty) — not a leak.
LEAKS="$(git ls-files | grep -E '(^|/)\.env' | grep -v '\.env\.example$' || true)"
LEAKS="$LEAKS$(git ls-files | grep -E '\.paidia-|\.paidia\.db' || true)"
if [ -n "$LEAKS" ]; then
  echo "ABORT: these secret files are git-tracked and would be included:"
  printf '  %s\n' $LEAKS
  echo "Untrack them first:  git rm --cached <file>"
  exit 2
fi

OUT="$DEST/${PROJECT}_${STAMP}.tar.gz"
echo "==> Archiving tracked files only…"
git archive --format=tar HEAD > /tmp/_bk.$$.tar || { echo "ERROR: git archive failed"; exit 3; }

for d in "${EXTRA[@]}"; do
  if [ -d "$d" ]; then
    tar --append --file=/tmp/_bk.$$.tar "$d" 2>/dev/null && echo "    + $d"
  fi
done

gzip -c /tmp/_bk.$$.tar > "$OUT"
rm -f /tmp/_bk.$$.tar

echo "==> Verifying no secrets slipped in…"
BAD="$(tar -tzf "$OUT" | grep -E '(^|/)\.env|\.paidia-|\.paidia\.db' | grep -v '\.env\.example$' || true)"
if [ -n "$BAD" ]; then
  echo "ABORT: secrets found in the archive — deleting it."
  printf '  %s\n' $BAD
  rm -f "$OUT"
  exit 4
fi

SIZE="$(du -h "$OUT" | cut -f1)"
COUNT="$(tar -tzf "$OUT" | wc -l | tr -d ' ')"
echo
echo "✓ Backed up to Google Drive"
echo "    $OUT"
echo "    $COUNT files, $SIZE, zero secrets"
echo
echo "Keeping the 10 most recent backups…"
ls -1t "$DEST"/${PROJECT}_*.tar.gz 2>/dev/null | tail -n +11 | while read -r old; do
  rm -f "$old" && echo "    pruned $(basename "$old")"
done
