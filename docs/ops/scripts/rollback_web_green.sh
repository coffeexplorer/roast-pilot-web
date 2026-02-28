#!/usr/bin/env bash
set -euo pipefail

ROOT="${ROOT:-$HOME/roast-pilot-web}"
RELEASES="${RELEASES:-$ROOT/releases}"
PROC="${PROC:-roast-pilot-web-green}"
PORT="${PORT:-3001}"

echo "== releases (latest 10) =="
ls -1dt "$RELEASES"/* 2>/dev/null | head -n 10 || true
echo

TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage:"
  echo "  $0 <full_sha_dirname>"
  echo "Example:"
  echo "  $0 0123abcd... (40 chars)"
  exit 2
fi

DIR="$RELEASES/$TARGET"
if [[ ! -d "$DIR" ]]; then
  echo "[ERR] release not found: $DIR"
  exit 1
fi

echo "[1] switch green to $DIR"
pm2 delete "$PROC" || true
cd "$DIR"
pm2 start node_modules/next/dist/bin/next --name "$PROC" -- start -H 127.0.0.1 -p "$PORT"
pm2 save

echo "[2] checks"
sleep 0.6
curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null && echo " - green(${PORT}): OK" || (echo " - green(${PORT}): FAIL" && exit 1)
curl -fsS https://roast-pilot.com/api/healthz >/dev/null && echo " - public /api/healthz: OK" || (echo " - public /api/healthz: FAIL" && exit 1)

echo "[DONE] rollback to $(basename "$DIR")"
