#!/usr/bin/env bash
set -euo pipefail

ROOT="${ROOT:-$HOME/roast-pilot-web}"
RELEASES="${RELEASES:-$ROOT/releases}"
KEEP="${KEEP:-5}"

echo "== keeping last $KEEP releases =="

mapfile -t dirs < <(ls -1dt "$RELEASES"/* 2>/dev/null || true)
total="${#dirs[@]}"

if [[ "$total" -le "$KEEP" ]]; then
  echo "nothing to delete (total=$total)"
  exit 0
fi

for ((i=KEEP; i<total; i++)); do
  echo "delete: ${dirs[$i]}"
  rm -rf "${dirs[$i]}"
done

echo "[DONE]"
