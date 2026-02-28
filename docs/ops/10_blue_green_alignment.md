# blue/green 정합성 규칙

같은 서비스(웹)를 blue(3000)와 green(3001) 두 프로세스로 나누어 운영할 때, **서로 다른 커밋/빌드를 돌리지 않도록** 하는 정책이다.

## 원칙

- blue와 green은 **동일한 커밋(또는 동일한 빌드 디렉터리)** 을 바라보는 것이 좋다.
- nginx upstream이 3001(green)을 가리킬 때, 실제 트래픽은 green만 받는다. 이때 blue는 대기/롤백용이므로, 두 프로세스가 다른 코드를 실행하면 롤백·전환 시 동작이 달라질 수 있다.

## 점검 스크립트

- **서버:** `~/ops/check_blue_green.sh`  
  (`chmod +x` 필요)

```bash
~/ops/check_blue_green.sh || true
```

- **동작:** pm2의 blue/green `script path`, `exec cwd`를 출력하고, 가능하면 각 cwd에서 `git rev-parse --short HEAD`로 커밋 해시를 비교한다.
- **cwd 또는 SHA가 다르면** `[WARN] blue/green mismatch` 후 **exit 2**.
- **같으면** `[OK] blue/green aligned`.

pm2 출력 형식에 따라 CWD/SHA를 못 읽으면 `(unknown)`으로 나올 수 있다. 그 경우 `pm2 show roast-pilot-web-blue`, `pm2 show roast-pilot-web-green`으로 **exec cwd**를 수동 확인하는 것을 권장한다.

## 정합성 맞추기

- **배포 스크립트**에서 green만 갱신할 때: green의 cwd를 “최신 빌드가 있는 디렉터리”로 두고, blue는 그와 같은 소스/빌드를 쓰도록 배포 플로우를 설계한다.
- **blue/green README** (`docs/ops/bluegreen/README.md` 등)에 “동일 코드 정책”을 명시해 두었다.
