# deploy_web_green.sh — 원클릭 웹(green) 배포

서버에서 웹(Next.js) green(3001)을 최신 main 기준으로 한 번에 갱신할 때 사용한다.

## 위치

- **서버:** `~/ops/deploy_web_green.sh`  
  (최초 생성: `mkdir -p ~/ops` 후 스크립트 내용 배치, `chmod +x`)

## 사용법

```bash
~/ops/deploy_web_green.sh
```

환경변수로 경로/브랜치/프로세스명을 바꿀 수 있다.

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `APP_DIR` | `$HOME/roast-pilot-web` | 앱 디렉터리 |
| `BRANCH` | `main` | 배포할 브랜치 |
| `PROC` | `roast-pilot-web-green` | pm2 프로세스 이름 |

예:

```bash
BRANCH=develop ~/ops/deploy_web_green.sh
APP_DIR=/var/www/roast-pilot-web ~/ops/deploy_web_green.sh
```

## 동작 순서

1. `cd $APP_DIR`
2. `git fetch origin` → `git checkout $BRANCH` → `git pull --rebase origin $BRANCH`
3. `npm ci`
4. `npm run build`
5. `pm2 reload $PROC` (실패 시 `pm2 restart $PROC`)
6. 간단 검사: 현재 커밋, green(3001), api(8000), 공개 `/api/healthz`

## 주의

- **unstaged 변경이 있으면** `git pull --rebase`에서 실패할 수 있다. 배포 전 `git status`로 확인하거나, 필요 시 `git stash` 후 실행.
- green의 **exec cwd**가 `$APP_DIR`이 아니면(예: releases/ 해시 디렉터리), 이 스크립트로 빌드한 결과가 그대로 green에 반영되지 않을 수 있다. 그 경우 배포 플로우에서 “빌드 결과를 green이 바라보는 디렉터리로 복사/전환”하는 단계가 필요하다.
