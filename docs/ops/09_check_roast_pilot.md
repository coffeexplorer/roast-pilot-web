# check_roast_pilot.sh — 운영 점검 스크립트

pm2, nginx 라우팅, 로컬/공개 엔드포인트를 한 번에 확인한다.

## 위치

- **서버:** `~/ops/check_roast_pilot.sh`  
  (`chmod +x` 필요)

## 사용법

```bash
~/ops/check_roast_pilot.sh
```

## 출력 요약

| 섹션 | 내용 |
|------|------|
| **pm2** | `pm2 ls` — 프로세스 목록·상태 |
| **nginx routes** | `nginx -T` 출력 중 `server_name`, `/api/healthz`, `/api/openapi.json`, `^~ /api/`, `proxy_pass`, `roast_pilot_upstream`, 3001, 8000 관련 라인 |
| **local endpoints** | `curl -i` 3001 `/api/healthz`, 8000 `/health` |
| **public endpoints** | `curl -i` https://roast-pilot.com/api/healthz, /api/openapi.json (앞부분) |

정상이면 3001·8000·공개 healthz/openapi 가 200으로 응답한다.
