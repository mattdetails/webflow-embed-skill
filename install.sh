#!/usr/bin/env bash
# Symlink both skills into ~/.claude/skills so this repo stays the single source of
# truth. Edit here, push here, and every session picks the change up.
set -euo pipefail
cd "$(dirname "$0")"
REPO="$(pwd)"
DEST="${HOME}/.claude/skills"
mkdir -p "$DEST"
for s in webflow-embed embed-retro; do
  if [ -e "$DEST/$s" ] && [ ! -L "$DEST/$s" ]; then
    echo "skip $s — a real directory already exists at $DEST/$s"
    continue
  fi
  ln -sfn "$REPO/skills/$s" "$DEST/$s"
  echo "linked $DEST/$s -> $REPO/skills/$s"
done
echo
echo "Start a new session, then: /webflow-embed"
