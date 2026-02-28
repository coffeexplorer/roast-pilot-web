#!/usr/bin/env bash
set -euo pipefail

ROOT="${ROOT:-$HOME/roast-pilot-web}"
WORKTREE="${WORKTREE:-$ROOT/roast-pilot-web}"
RELEASES="${RELEASES:-$ROOT/releases}"
BRANCH="${BRANCH:-main}"
PROC="${PROC:-roast-pilot-web-green}"
PORT="${PORT:-3001}"

mkdir -p "$RELEASES"

echo "[1] update worktree -> origin/$BRANCH"
cd "$WORKTREE"
git fetch origin
git checkout "$BRANCH"
git stash push -m "release_web_green" || true
git pull --rebase origin "$BRANCH" || git pull origin "$BRANCH"
SHA="$(git rev-parse HEAD)"
SHORT="$(git rev-parse --short HEAD)"
echo " - SHA=$SHORT"

TARGET="$RELEASES/$SHA"
if [[ -d "$TARGET" ]]; then
  echo "[2] release exists: $TARGET"
else
  echo "[2] create release: $TARGET"
  mkdir -p "$TARGET"
  git clone --depth 1 --branch "$BRANCH" "$(git remote get-url origin)" "$TARGET"
  cd "$TARGET"
  git rev-parse --short HEAD
fi

echo "[3] build in release dir"
cd "$TARGET"
npm ci
npm run build

echo "[4] switch pm2 $PROC cwd to release dir"
pm2 delete "$PROC" || true
cd "$TARGET"
pm2 start node_modules/next/dist/bin/next --name "$PROC" -- start -H 127.0.0.1 -p "$PORT"
pm2 save

echo "[5] checks"
sleep 0.6
curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null && echo " - green(${PORT}): OK" || (echo " - green(${PORT}): FAIL" && exit 1)
curl -fsS http://127.0.0.1:8000/health >/dev/null && echo " - api(8000): OK" || (echo " - api(8000): FAIL" && exit 1)
curl -fsS https://roast-pilot.com/api/healthz >/dev/null && echo " - public /api/healthz: OK" || (echo " - public /api/healthz: FAIL" && exit 1)

echo "[DONE] released $SHORT"
