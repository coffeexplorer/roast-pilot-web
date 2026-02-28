#!/usr/bin/env bash
set -e

URL="${URL:-https://roast-pilot.com/api/healthz}"

if ! curl -fsS --max-time 10 "$URL" >/dev/null; then
  echo "[ALERT] healthz failed at $(date -Is)"
  pm2 restart roast-pilot-web-green || true
fi
