# Next.js 15 보안 업그레이드 플랜 (CVE 대응)

## 현재 상태

- **next@15.0.0** 사용 중.
- 빌드 시 경고: `npm warn deprecated next@15.0.0: This version has a security vulnerability.`  
  (참고: [CVE-2025-66478](https://nextjs.org/blog/CVE-2025-66478) 등 패치 권장.)

## 조치 계획 (실행 전 체크리스트)

1. **패치 버전 확인**  
   - [ ] https://github.com/vercel/next.js/releases 또는 `npm view next versions` 로 15.0.x 최신 패치 확인.
2. **로컬에서 업그레이드**  
   - [ ] `package.json` 의 `next` 를 패치 버전(예: 15.0.x)으로 변경.
   - [ ] `npm install` / `npm ci` 후 `npm run build` 성공 확인.
3. **배포**  
   - [ ] `~/ops/deploy` (또는 CI) 로 배포 후 사이트 동작 확인.
4. **롤백 준비**  
   - [ ] 문제 시 `~/ops/rollback_web_green.sh <이전_40자리SHA>` 로 즉시 롤백 가능함을 확인.

- **완료 (2025):** 서버는 15.5.12로 빌드 성공, 레포도 15.5.12로 고정 완료.

## 주의

- **지금 당장 업그레이드하지 말 것.** 이 문서는 “계획·체크리스트”만 반영.
- 패치 적용 시 lockfile 갱신 후 빌드/배포 검증 필수.
