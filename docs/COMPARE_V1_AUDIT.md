# 비교 기능 v1 고도화(A/B/C) 현 구현 여부 — 사실 확인 보고

## 현 구현 여부 요약

- **A 채널 선택:** **구현됨.** compare에서 `selectedChannel` state·`availableChannels()`·`defaultChannel()`·드롭다운(`<select>`)으로 BT/ET/ROR 등 동적 선택. 한쪽 로스트에만 채널 있으면 해당 로스트만 1개 시리즈로 그림, 다른 쪽은 nearest 매핑 시 null(MAX_DT_SEC 초과)로 끊김.  
  근거: `app/app/compare/page.tsx` 17–18행(CHANNEL_ORDER), 46–61행(availableChannels, defaultChannel, channelLabel), 70행(selectedChannel), 131–132행(series는 ch=selectedChannel 기준), 261–272행(채널 드롭다운 UI).

- **B 다운샘플:** **구현됨.** 차트에만 최대 2000포인트 stride 다운샘플 적용. compare는 `downsampleForChart()`, 상세는 `downsampleTimeseries()`. JSON 다운로드는 원본 `data.timeseries` 사용.  
  근거: `lib/downsample.ts` 전부(2000 기본, stride); `app/app/compare/page.tsx` 166–174행(downsampleForChart 사용); `app/app/roasts/[roastId]/page.tsx` 8행(import), 104–110행(차트에만 downsample, downloadJson은 data 원본).

- **C 공유 링크:** **구현됨.** `/app/compare`에서 `searchParams.get("ids")`로 쿼리 읽고, `ids=a,b` 포맷만 파싱. 쿼리 2개 이상이면 우선 적용 후 localStorage 동기화. "공유 링크 복사" 버튼 있음.  
  근거: `app/app/compare/page.tsx` 66행(useSearchParams), 73–86행(idsFromUrl·우선·동기화), 206–214행(공유 링크 복사 버튼).

---

## 관련 파일 목록

- `app/app/compare/page.tsx`
- `app/app/roasts/[roastId]/page.tsx`
- `lib/downsample.ts`
- `components/RoastCurveChart.tsx`

---

## C) compare 공유 링크(쿼리 ids) — 상세

| 확인 항목 | 여부 | 근거 |
|-----------|------|------|
| 1) searchParams(ids=...) 읽는 로직 | 있음 | `app/app/compare/page.tsx` 74행: `searchParams.get("ids") ?? ""` |
| 2) 지원 포맷 | | |
| → ids=a,b (comma) | 지원 | 76행: `idsFromUrl.split(",").map((s) => s.trim()).filter(Boolean).slice(0, MAX_COMPARE)` |
| → ids=a&ids=b (repeat) | 미지원 | `searchParams.get("ids")`는 첫 번째 값만 반환. `getAll("ids")` 미사용. |
| → 공백/잘못된 값/중복 | 부분 처리 | 공백 trim·빈 문자열 filter. 잘못된 값(비 UUID 등)은 API 404 시 전체 실패. 중복은 Set 미적용 → 배열 그대로 앞 2개 사용. |
| 3) query ids가 localStorage보다 우선 | 예 | 77–81행: `fromUrl.length >= MAX_COMPARE`이면 `setIds(fromUrl)` 후 `setCompareIds(fromUrl)`; else `setIds(getCompareIds())` |
| 4) query ids를 localStorage에 동기화 | 예 | 78행: `setCompareIds(fromUrl)` |
| 5) "링크 복사" 버튼 | 있음 | 206–214행: "공유 링크 복사" 버튼, 클릭 시 `?ids=${ids.join(",")}` URL 복사 후 alert |
| 6) 에러/빈 상태 UX | | |
| → ids 1개 이하 | 처리됨 | 76행에서 2개 미만이면 localStorage 사용. 236–244행에서 "비교하려면… 담아주세요" 안내. |
| → ids 3개 이상 | 처리됨 | 76행: `.slice(0, MAX_COMPARE)`로 2개만 사용. |
| → 존재하지 않는 id | 부분 | `getRoast(id)` 404 시 catch에서 `setErr(message)`, `setResults([])`. Promise.all이라 하나라도 실패하면 전체 실패, "로스트를 불러오지 못했습니다."만 표시. |
| → 권한 없는 id(404) | 동일 | 동일 catch로 처리. 어떤 id에서 실패했는지 구분 없음. |

---

## A) 비교 채널 선택(BT/ET/ROR) — 상세

| 확인 항목 | 여부 | 근거 |
|-----------|------|------|
| 1) BT만 고정 vs 동적 series | 동적 | 131행: `const ch = selectedChannel`; 132–164행: `results[].timeseries?.channels?.[ch]`로 series 구성. |
| 2) RoastCurveChart가 여러 키(bt/et/ror) 수용 | 가능 | Chart는 `series[]`(key/label/values)만 받음. key가 bt/et/ror 등 무엇이든 동일 렌더. |
| 3) 채널 선택 UI | 있음 | 261–272행: `available.length > 1`일 때 `<select value={selectedChannel} onChange=...>` 드롭다운. |
| 4) 한쪽 로스트에만 채널 있을 때 | 1개 시리즈 + 끊김 | 첫 로스트만 ch 있으면 series에 1개만 push(132–138행). 두 번째는 ch 없으면 push 안 함. 두 번째만 있으면 140행 조건 불만족으로 1개만 push. nearest 매핑 시 MAX_DT_SEC 초과면 null로 끊김(156행). "한쪽에만 이 채널이 있습니다" 같은 전용 안내 문구는 없음. |

---

## B) 프론트 다운샘플(성능) — 상세

| 확인 항목 | 여부 | 근거 |
|-----------|------|------|
| 1) 차트 포인트 수 제한 | 있음 | `lib/downsample.ts`: `DEFAULT_MAX_POINTS = 2000`, stride로 축소. compare 167–174행, 상세 104–110행에서 차트에만 적용. |
| 2) downsample/stride (MAX_DT_SEC 외) | 있음 | `downsampleTimeseries`, `downsampleForChart`: `stride = ceil(len/maxPoints)`, indices stride 샘플링. MAX_DT_SEC는 compare의 nearest 매핑용 별도. |
| 3) JSON 다운로드 원본 유지 | 예 | 상세: `downloadJson(data.roast, data.timeseries)` — state 원본 그대로. compare에는 JSON 다운로드 없음. |
| 4) 큰 payload 시 성능/메모리 로그 | 없음 | 다운샘플 로직만 있고, 측정/로그 없음. |

---

## 추가 구현이 필요한 최소 작업

- **A:** (선택) 한쪽 로스트에만 선택 채널이 있을 때 "다른 로스트에는 이 채널이 없습니다" 등 짧은 안내 문구 추가.

- **B:** (선택) 매우 큰 payload(예: 5만 점 이상)에서 다운샘플 전/후 포인트 수를 개발 환경에서만 console.log로 남기거나, 성능 이슈 재현 시 로그 추가.

- **C:**  
  - **ids=a&ids=b (repeat) 지원:** `searchParams.get("ids")` 대신 `searchParams.getAll("ids")` 사용 후, 없으면 `get("ids")?.split(",")` fallback.  
  - **중복 제거:** 파싱 후 `[...new Set(fromUrl)].slice(0, MAX_COMPARE)`.  
  - **에러 UX:** Promise.all 대신 개별 fetch 후 성공한 것만 표시하거나, 실패 시 "어떤 id가 404/권한 없음" 메시지 표시(예: "로스트 B를 불러올 수 없습니다.").

---

## 구현 시 주의할 함정 3가지

1. **쿼리 ids와 localStorage 동기화 타이밍**  
   URL에 `?ids=a,b`가 있으면 effect에서 `setCompareIds(fromUrl)`로 localStorage를 덮어씀. 같은 탭에서 "비우기" 후 뒤로가기하면 URL이 여전히 `?ids=a,b`라 effect가 다시 돌아 localStorage가 다시 채워질 수 있음. URL을 바꾸지 않고 localStorage만 비우는 경우, 다음 마운트에서 `idsFromUrl`이 그대로라 다시 2개로 복원됨. "비우기" 시 `replaceState`로 쿼리 제거할지, 아니면 "비우기 = localStorage만 비우고 URL은 유지"로 할지 정책 정리 필요.

2. **ids=a&ids=b 형식 미지원**  
   현재는 `get("ids")`만 사용하므로 `?ids=a&ids=b`는 `a`만 인식. `getAll("ids")`를 쓰면 repeat 형식 지원 가능하지만, Next.js(React)의 `useSearchParams()`가 반환하는 객체의 `getAll` 존재 여부/동작을 확인해야 함.

3. **한쪽만 채널 있을 때 1개 라인만 그려짐**  
   compare에서 두 로스트 중 한쪽만 선택 채널을 가지면 series가 1개라서 "비교" 느낌이 약해짐. 레이블(roastLabel)로 구분되므로 1개라도 어떤 로스트인지는 보이지만, "다른 로스트에는 이 채널이 없습니다" 문구가 있으면 UX가 명확해짐.
