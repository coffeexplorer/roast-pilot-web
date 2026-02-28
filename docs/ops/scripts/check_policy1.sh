#!/usr/bin/env bash
set -euo pipefail

echo "== nginx upstream must be 3001 =="
sudo nginx -T 2>/dev/null | grep -q 'set $roast_pilot_upstream http://127.0.0.1:3001' && echo "OK upstream=3001" || (echo "FAIL upstream not 3001" && exit 2)

echo "== green must run from releases/<sha> =="
GREEN_CWD="$(pm2 show roast-pilot-web-green 2>/dev/null | awk -F'│' '/exec cwd/ {gsub(/^[ \t]+|[ \t]+$/,"",$3); print $3}')"
echo "GREEN_CWD=$GREEN_CWD"
echo "$GREEN_CWD" | grep -q '/releases/[0-9a-f]\{40\}$' && echo "OK green cwd is release" || (echo "FAIL green cwd not release" && exit 2)

echo "== endpoints =="
curl -fsS http://127.0.0.1:3001/ >/dev/null && echo "OK local green" || (echo "FAIL local green" && exit 2)
curl -fsS http://127.0.0.1:8000/health >/dev/null && echo "OK local api" || (echo "FAIL local api" && exit 2)
curl -fsS https://roast-pilot.com/api/healthz >/dev/null && echo "OK public healthz" || (echo "FAIL public healthz" && exit 2)

echo "[OK] policy1 healthy"
