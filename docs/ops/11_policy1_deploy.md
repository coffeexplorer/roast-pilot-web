# 정책 1 운영 절차 (표준)

- **nginx upstream:** 항상 green(3001)만 사용.
- **green:** `releases/<full_sha>` (immutable).
- **blue:** 워킹트리(개발/예비), 배포 플로우에서 건드리지 않음.

## 서버 명령 (표준 엔트리포인트)

| 목적 | 명령 |
|------|------|
| **배포** | `~/ops/deploy` |
| **롤백** | `~/ops/rollback_web_green.sh <40자리SHA>` |
| **점검** | `~/ops/check_policy1.sh` |
| **릴리즈 정리** | `KEEP=7 ~/ops/cleanup_releases.sh` |

- `~/ops/deploy` 는 `~/ops/release_web_green.sh` 의 심볼릭 링크.

## 롤백 사용 예

```bash
# 최근 릴리즈 목록 확인
ls -1dt ~/roast-pilot-web/releases/* | head -10

# 이전 SHA로 전환 (40자리 전체 해시 디렉터리명)
~/ops/rollback_web_green.sh c95f8635b08f58ab6e8a5c9be23ae3985141b0ff
```

## 릴리즈 정리

오래된 릴리즈 디렉터리 삭제(디스크 절약). 최근 N개만 유지.

```bash
KEEP=7 ~/ops/cleanup_releases.sh
```

## 스크립트 위치 (레포 복사본)

- `docs/ops/scripts/release_web_green.sh`
- `docs/ops/scripts/rollback_web_green.sh`
- `docs/ops/scripts/cleanup_releases.sh`
- `docs/ops/scripts/check_policy1.sh`

서버 `~/ops/` 와 동기화해 두면 재현/복구 시 참고용.

## GitHub Actions (자동 배포, 옵션 B)

- **main** push 시 `.github/workflows/deploy_web.yml` 이 서버에 SSH 접속해 **`/home/ubuntu/ops/deploy`** 실행.
- **필요 Secrets:** `LIGHTSAIL_HOST`, `LIGHTSAIL_USER`, `LIGHTSAIL_SSH_KEY` (프라이빗 키 전체).

### 서버 사전 확인 체크리스트

- [ ] 배포용 SSH 키 쌍 생성 후 **공개키**를 서버 `~/.ssh/authorized_keys` 에 추가.
- [ ] GitHub repo → Settings → Secrets에 위 3개 저장.
- [ ] `ssh -i <개인키> <USER>@<HOST>` 로 로그인 가능한지 확인.
- [ ] 서버에 `~/ops/deploy` (→ release_web_green.sh) 및 `~/ops/rollback_web_green.sh` 등 스크립트 배치·실행 권한 확인.
