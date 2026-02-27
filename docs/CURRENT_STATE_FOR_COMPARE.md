# RoastPilot Web — 비교 기능 v1 기준 현재 상태

**이 문서는 비교 기능 v1 기반 구축 후 상태를 반영합니다.**

---

## 구현 완료된 항목 (v1)

| 항목 | 상태 | 비고 |
|------|------|------|
| **GET /roasts/{id}** | ✅ 구현됨 | RoastDetail + TimeseriesPayload(gzip 디코드 후 JSON) 반환, 소유자만 접근 |
| **웹 타입** | ✅ 구현됨 | RoastSummary, RoastDetail, TimeseriesPayload, RoastDetailResponse (`lib/types.ts`) |
| **API 함수** | ✅ 구현됨 | getRoasts(), getRoast(id) (`lib/api.ts`) |
| **로스트 목록** | ✅ 구현됨 | `/app/roasts` — GET /roasts 목록, 열기/비교 담기(로컬 2개 제한) |
| **로스트 상세** | ✅ 구현됨 | `/app/roasts/[roastId]` — 메타+timeseries, BT 차트, JSON 다운로드 |
| **비교 페이지** | ✅ 구현됨 | `/app/compare` — localStorage 2개 id, BT 오버레이, 비우기/하나 제거 |
| **차트** | ✅ 구현됨 | Recharts, RoastCurveChart (time + series[], 단일/다중 라인, tooltip/legend) |

---

## 1. 로스팅 상세 페이지 관련

### 파일 경로
- **로스팅 상세 페이지 구현됨.**  
  `app/app/roasts/[roastId]/page.tsx` — 동적 라우트 `/app/roasts/:roastId`.
- 목록: `app/app/roasts/page.tsx` (`/app/roasts`), 비교: `app/app/compare/page.tsx` (`/app/compare`).

### 차트 컴포넌트
- **Recharts 사용.**  
  `components/RoastCurveChart.tsx` — 입력: `time[]`, `series[]` (key, label, values, roastLabel).  
  단일/다중 라인, 오버레이 시 roastLabel로 구분, 축 자동 스케일·tooltip·legend.

### 차트 데이터 구조 (API 스키마 기준)
- 업로드 시 서버가 기대하는 타임시리즈 형식만 존재 (`roast-pilot-api`):

```ts
// TimeseriesPayload (업로드용)
{
  time_unit: "seconds",
  time: number[],           // 시계열 t
  channels: { [name: string]: number[] }  // 예: bt, et, ror
}
```

- 채널 이름은 클라이언트/업로더가 정함. 일반적으로 `bt`, `et`, `ror` 등.

### 서버 API 엔드포인트 (로스트 관련)
| 메서드 | 경로 | 용도 |
|--------|------|------|
| GET | `/roasts` | 목록 (RoastSummary[], limit/offset) |
| GET | `/roasts/{id}` | **단건 상세** — { roast: RoastDetail, timeseries: TimeseriesPayload } (gzip 디코드 후 반환) |
| POST | `/roasts` | 생성 (RoastCreateRequest) |
| GET | `/risk/{roast_id}` | 리스크 점수·원인 (상세 곡선 데이터 아님) |

### 데이터 타입 (웹 `lib/types.ts`)
- 로스트 관련: `TimeseriesPayload`, `RoastSummary`, `RoastDetail`, `RoastDetailResponse` 정의됨.  
  기존: `AuthTokenResponse`, `MeResponse`, `UsageResponse`, `UsageWarning`.

---

## 2. "비교" 관련 코드

| 항목 | 상태 | 비고 |
|------|------|------|
| compare 페이지 | **구현됨** | `/app/compare` — 쿼리 `?ids=a,b` 또는 localStorage에서 roast_id 2개 읽어 getRoast 각각 호출, BT 오버레이 |
| "비교 담기" 버튼 | **구현됨** | 목록 각 row에 버튼, `roast_compare_ids` 키로 최대 2개 저장 |
| localStorage | **사용** | `COMPARE_STORAGE_KEY = "roast_compare_ids"`, 배열 문자열 JSON |
| roast_id 배열 | **구현됨** | getCompareIds() / setCompareIds(); 비우기·하나 제거 시 **URL 동기화**: `history.replaceState`로 `?ids=...` 갱신하여 URL이 단일 소스가 되도록 함 |
| 비우기·하나 제거 | **구현됨** | 비교 페이지에서 "비우기", "하나 제거 (id)" — 클릭 시 state·localStorage·URL 동시 갱신 |

- **공유 링크 / 엣지케이스:**  
  - `?ids=a,b` 및 `?ids=a&ids=b` 지원. `parseCompareIds()`로 comma/repeat 결합 후 Set으로 중복 제거, trim, 최대 2개 사용·초과 시 "최대 2개만 비교 가능" 안내.  
  - 로스트 fetch는 `Promise.allSettled` 사용; 일부만 성공해도 성공한 건 표시하고, 실패한 id는 "다음 로스트를 불러오지 못했습니다: …" 메시지로 표시.

---

## 3. Roast 데이터 구조 상세 (백엔드 기준)

### Roast 1개 객체 (DB 모델 / API 노출)
- **목록 응답 (RoastSummary):**  
  `id`, `client_uuid`, `batch_name`, `started_at`, `ended_at`, `points_count`, `channels`
- **DB(Roast) 필드 예시:**  
  `id`, `user_id`, `machine_id`, `client_uuid`, `started_at`, `ended_at`, `created_at`,  
  `batch_name`, `charge_weight_g`, `drop_weight_g`, `weight_loss_pct`,  
  `yellow_time_s`, `first_crack_time_s`, `dev_time_s`, `dev_ratio`,  
  `drop_bt`, `drop_et`, `notes`, `tags`,  
  `ambient_temp_c`, `ambient_rh`, `abs_humidity_g_m3`, `bean_temp_c`,  
  `baseline_ref_id`, `baseline_scope`, `guide_wl_delta`,  
  관계: `timeseries`, `points`

### points / 타임시리즈
- **RoastPoint (DB):**  
  `id`, `roast_id`, `t_ms`, `channel`, `data` (JSON), `created_at`  
  - `channel`: 예) `"curve"`, `"env"`, `"profile_env"`, `"manual_env"`  
  - `data`: 예) `{ "bt": 100, "et": 150 }` 등 채널별 키/값
- **RoastTimeseries (DB):**  
  곡선 전체를 하나로 저장.  
  `roast_id`, `content_encoding` (예: `gzip+json`), `payload` (bytes), `points_count`, `channels` (JSON 배열).  
  payload 내용 형식은 업로드와 동일: `{ time_unit, time: number[], channels: { [name]: number[] } }`.

### 이벤트 (yellow, fc, drop)
- 컬럼으로만 존재:  
  `yellow_time_s`, `first_crack_time_s`, `dev_time_s`, `dev_ratio`, `drop_bt`, `drop_et`.  
  타임라인 “이벤트 마커”용 별도 API나 프론트 구조 없음.

### risk / score
- **GET `/risk/{roast_id}`** 로 제공.  
  응답 예:  
  `roast_id`, `status`, `computed_at_ms`, `version`,  
  `unified` (score, level, guidance_weight),  
  `base` (status, score, level, confidence, signals),  
  `env` (status, source, score, level, current_env, profile_env, delta),  
  `reasons` (배열).  
  곡선 원시 데이터는 포함되지 않음.

---

## 4. 차트 구현 방식

- **현재:**  
  웹에 차트 라이브러리 없음, 로스트 곡선용 컴포넌트 없음.
- **비교 기능 시:**  
  라이브러리 선정 필요 (예: Recharts, Chart.js, custom SVG/Canvas).  
  다중 로스트 곡선(BT/ET/ROR 등)을 겹쳐 그리려면 “다중 라인” 지원이 필요하고,  
  축 범위는 time / value 기준으로 자동 계산하는 방식이면 됨.

---

## 5. 현재 웹에서 가능한 기능 요약

| 기능 | 상태 | 비고 |
|------|------|------|
| 로스트 목록 | **구현됨** | `/app/roasts`, GET /roasts, 열기·비교 담기 |
| 로스트 상세 | **구현됨** | `/app/roasts/[roastId]`, GET /roasts/{id}, BT 차트, JSON 다운로드 |
| 비교 (v1) | **구현됨** | `/app/compare`, 2개 BT 오버레이, 비우기/하나 제거 |
| 검색/필터/정렬 | **미구현** | 목록은 limit/offset만 지원 |
| 공유 | **구현됨** | 비교 페이지 "공유 링크 복사"로 `?ids=a,b` URL 복사; URL 동기화로 비우기/제거 시 링크도 갱신됨 |
| 마이페이지·사용량 | **구현됨** | `app/app/page.tsx`, 로스트 목록 링크 포함 |
| 인증 | **구현됨** | 로그인/회원가입, `lib/auth.ts`, `lib/api.ts` |

---

## 6. 서버 변경 필요 여부 (비교 기능 기준)

| 필요 사항 | 여부 | 설명 |
|-----------|------|------|
| **GET /roasts/:id (상세)** | **필요** | 단건 메타 + 타임시리즈(또는 points) 반환. 상세·비교 화면의 기본 데이터. |
| **목록 API 확장** | 선택 | 현재 `GET /roasts`로 목록·페이징 가능. 검색/필터는 필요 시 쿼리 파라미터 추가. |
| **비교 전용 API** | 선택 | 여러 `roast_id`를 받아 한 번에 N개 로스트 메타+곡선을 내려주는 엔드포인트 있으면 편함. 없으면 클라이언트에서 GET /roasts/:id를 N번 호출해도 됨. |

- **결론:**  
  비교 기능을 위해 **최소한 GET `/roasts/{id}` (상세: 메타 + 곡선 데이터)** 가 필요함.  
  현재는 목록과 리스크만 있으므로, “로스트 상세 + 차트”를 먼저 구현할 때 위 상세 API를 추가하는 것이 자연스러움.

---

## 요약 (보고용)

### 파일 구조
- **웹:**  
  `app/` — 랜딩, `auth/`, `app/`(마이페이지·사용량·삭제·**로스트 목록/상세/비교**), `api/healthz`.  
  `lib/` — `api.ts`(getRoasts, getRoast), `auth.ts`, `types.ts`(RoastSummary, RoastDetail, TimeseriesPayload 등).  
  `components/` — 공통 UI + **RoastCurveChart**.
- **로스트:**  
  `app/app/roasts/page.tsx`, `app/app/roasts/[roastId]/page.tsx`, `app/app/compare/page.tsx`.

### 데이터 구조
- **로스트:**  
  백엔드에 Roast + RoastTimeseries(압축 payload) + RoastPoint(channel별 `t_ms`, `data`).  
  웹 타입 정의 없음.  
  웹 타입: `TimeseriesPayload`, `RoastSummary`, `RoastDetail`, `RoastDetailResponse`.  
  업로드 형식: `TimeseriesPayload` = `time` 배열 + `channels: { [name]: number[] }`.
- **이벤트:**  
  yellow/fc/drop 등은 Roast 메타 필드로만 존재.
- **리스크:**  
  `GET /risk/{roast_id}` 로 unified/base/env 점수·이유 제공.

### 차트 구조
- Recharts + RoastCurveChart.  
  time[], series[] (key, label, values, roastLabel), 다중 라인·축 자동·tooltip·legend.

### 비교 관련 코드 여부
- **구현됨.** compare 페이지, 비교 담기 버튼, `roast_compare_ids` localStorage, 비우기/하나 제거.  

### 기능 가능 범위
- 가능: 인증, 마이페이지, 사용량, **로스트 목록/상세/JSON 다운로드/비교(v1)**.  
- 불가: 목록 검색/필터/정렬, 공유.

### 서버 변경 필요 여부
- **GET `/roasts/{id}`** 구현 완료.  
- 선택: 목록 검색/필터, “비교용 N건 한 번에” API.

---

## 부록: 백엔드 스키마 발췌

```python
# app/schemas/roast.py (요약)
class TimeseriesPayload(BaseModel):
    time_unit: str = "seconds"
    time: List[float]
    channels: Dict[str, List[float]]  # e.g. {"bt": [...], "et": [...], "ror": [...]}

class RoastSummary(BaseModel):  # GET /roasts 응답 항목
    id: str
    client_uuid: str
    batch_name: Optional[str] = None
    started_at: Optional[str] = None
    ended_at: Optional[str] = None
    points_count: int
    channels: List[str]

# app/models/roast.py — RoastPoint (curve 데이터 저장 단위)
# id, roast_id, t_ms: int, channel: str, data: dict (JSON)
# channel 예: "curve" -> data에 bt, et, ror 등
```

```python
# app/routers/roasts.py — 노출 엔드포인트
# POST "" -> create_roast (RoastCreateRequest -> RoastCreateResponse)
# GET  "" -> list_roasts (limit, offset -> list[RoastSummary])
# GET  /{id} -> 없음 (추가 필요)
```

---

*이 문서는 비교 기능 v1 기반 구축 후 상태를 반영한 요약입니다. 검증: /app/roasts 목록, 상세 BT 차트, 2개 비교 담기 후 /app/compare BT 오버레이, JSON 다운로드.*

---

## 개선 적용 (위험/개선 포인트 대응)

| 항목 | 적용 내용 |
|------|-----------|
| **1) nearest 허용오차** | compare에서 두 번째 로스트 time 매핑 시 `MAX_DT_SEC = 0.6` 초 초과면 `null` 반환 → 그래프 끊김으로 “없는 데이터 억지 보간” 방지. |
| **2) Client 컴포넌트** | `/app/roasts`, `/app/compare`, `/app/roasts/[roastId]` 모두 상단 `"use client"` 사용 확인됨. |
| **3) channels/points_count** | GET /roasts/{id} 응답의 `roast`에 이미 `channels`, `points_count` 포함. 프론트에서 BT 없을 때 “사용 가능한 채널: …” 안내 추가. |
| **6) JSON 다운로드 파일명** | `roast_<batchName or id>_YYYYMMDD.json` 형식으로 저장 (특수문자 치환). |
| **7) compare 선택 UX** | 비교 중인 2개 로스트의 배치명·시작일을 상단 "비교 중" 블록에 크게 표시. |

### 추천 3개 (v1.1)

| 항목 | 적용 내용 |
|------|-----------|
| **1) 비교 채널 선택** | BT/ET/ROR 드롭다운. 기본 BT, 없으면 ET, 없으면 첫 채널. |
| **2) 프론트 다운샘플** | `lib/downsample.ts` 차트만 최대 2000pt. JSON은 원본. |
| **3) compare 쿼리·공유** | `?ids=id1,id2` 진입 가능. 공유 링크 복사 버튼. | “비교 중” 블록에 크게 표시. |
