# UFW + watchdog + 크론 (서버 방어·자동 복구·정리)

## 1) UFW 최소 방어

Next는 127.0.0.1만 바인딩하므로 3000/3001은 외부에서 접근되면 안 된다.

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3000
sudo ufw deny 3001
sudo ufw enable
sudo ufw status
```

- **열어둘 것:** 22(SSH), 80, 443  
- **닫을 것:** 3000, 3001 (이미 로컬만 쓰면 사실상 외부 미노출, deny로 명시)

## 2) health watchdog (장애 자동 감지)

- **스크립트:** `~/ops/watchdog.sh`  
  - `https://roast-pilot.com/api/healthz` 호출 실패 시 `pm2 restart roast-pilot-web-green` 실행.

**크론 (5분마다):**
```bash
crontab -e
```
추가:
```
*/5 * * * * /home/ubuntu/ops/watchdog.sh >> /home/ubuntu/ops/watchdog.log 2>&1
```

## 3) 릴리즈 자동 정리

**크론 (매주 일요일 04:00):**
```
0 4 * * 0 KEEP=7 /home/ubuntu/ops/cleanup_releases.sh >> /home/ubuntu/ops/cleanup.log 2>&1
```

## 4) 최종 점검

```bash
~/ops/check_policy1.sh
~/ops/check_blue_green.sh || true
pm2 ls
sudo nginx -t
```
