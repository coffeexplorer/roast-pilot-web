# API 스키마 확인 (LoginRequest 등)

프론트가 보내는 JSON 바디가 백엔드 스키마와 맞지 않으면 `422 Unprocessable Entity`가 난다.  
payload 키를 바꿀 때는 반드시 백엔드 OpenAPI 스키마를 먼저 확인한다.

## LoginRequest 스키마 확인

서버 또는 로컬에서:

```bash
curl -s https://roast-pilot.com/api/openapi.json | python3 -c "
import json, sys
doc = json.load(sys.stdin)
schema = doc.get('components', {}).get('schemas', {}).get('LoginRequest')
print(json.dumps(schema, indent=2, ensure_ascii=False))
"
```

출력의 `required`와 `properties`를 보면 백엔드가 기대하는 필드명을 알 수 있다.

- 예: `required: ["email", "password"]`, `properties: { "email": ..., "password": ... }` → 프론트는 `{ email, password }` 전송.
- 예: `required: ["username", "password"]` → 프론트는 `login(email, password)` 시그니처는 유지하고, body만 `{ username: email, password }` 로 매핑.

## 로그인 검증 (422 해결 확인)

스키마에서 사용하는 키(예: `email`)로:

```bash
curl -i -X POST https://roast-pilot.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nope@example.com","password":"wrong"}'
```

- **422** → 아직 body 스키마 불일치.
- **401** 또는 **200** → body는 정상; 401은 인증 실패, 200은 성공.
