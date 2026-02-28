# SSH 자동배포 키 제한 (authorized_keys)

GitHub Actions가 사용하는 SSH 공개키로 **배포만** 실행되도록 제한한다.  
이 키로 접속해도 셸이 열리지 않고 `~/ops/deploy`만 실행되거나 즉시 종료된다.

## 적용 방법 (서버에서)

1. **백업**
   ```bash
   cp ~/.ssh/authorized_keys ~/.ssh/authorized_keys.bak.$(date +%Y%m%d)
   ```

2. **편집**
   ```bash
   nano ~/.ssh/authorized_keys
   ```
   GitHub Actions용 **공개키가 있는 한 줄**을 아래처럼 **맨 앞에** 옵션을 붙인다.

   **변경 전 (예):**
   ```
   ssh-rsa AAAA... deploy-key
   ```

   **변경 후:**
   ```
   command="/home/ubuntu/ops/deploy",no-agent-forwarding,no-port-forwarding,no-X11-forwarding,no-pty ssh-rsa AAAA... deploy-key
   ```

   - `command="..."` → 이 키로 로그인 시 셸 대신 해당 명령만 실행.
   - `no-agent-forwarding,no-port-forwarding,no-X11-forwarding,no-pty` → 포워딩·PTY 차단.

3. **테스트**
   - 제한된 키로: `ssh -i <개인키> ubuntu@<서버>`  
     → 셸이 안 열리고 deploy만 실행되거나 곧바로 종료되는 것이 정상.
   - 일반 로그인용 키는 **옵션 없이** 그대로 두면 셸 접속 가능.

## 주의

- `command=` 경로는 **절대 경로** 권장: `/home/ubuntu/ops/deploy`.
- 실수로 모든 키에 적용하면 로그인이 막힐 수 있으므로, **Actions 전용 키 한 줄만** 수정.
