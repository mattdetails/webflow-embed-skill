#!/usr/bin/env bash
# Start a new learning from the template.  Usage: ./tools/new-learning.sh short-slug
set -euo pipefail
[ $# -eq 1 ] || { echo "usage: $0 <short-kebab-slug>"; exit 1; }
cd "$(dirname "$0")/.."
slug="$1"
file="learnings/pending/$(date +%F)-${slug}.md"
[ -e "$file" ] && { echo "exists: $file"; exit 1; }
sed -e "s|^date:.*|date: $(date +%F)|" -e "s|^slug:.*|slug: ${slug}|" learnings/TEMPLATE.md > "$file"
echo "$file"
