"use client";

import Container from "@/components/Container";
import Alert from "@/components/Alert";
import RoastCurveChart from "@/components/RoastCurveChart";
import type { RoastCurveSeriesItem } from "@/components/RoastCurveChart";
import { getRoast } from "@/lib/api";
import type { RoastDetailResponse } from "@/lib/types";
import { downsampleForChart } from "@/lib/downsample";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const COMPARE_STORAGE_KEY = "roast_compare_ids";
const MAX_COMPARE = 2;
/** 허용 오차(초). nearest가 이 값보다 크면 null로 두어 그래프가 끊기게 함. */
const MAX_DT_SEC = 0.6;
/** 채널 선택 우선순위: BT → ET → ROR → 그 외 첫 채널 */
const CHANNEL_ORDER = ["bt", "et", "ror"];

type SearchParamsLike = {
  get: (k: string) => string | null;
  getAll?: (k: string) => string[];
};

/** ids 파라미터 파싱: ids=a,b 및 ids=a&ids=b 지원, 중복 제거, trim, 최대 2개. */
function parseCompareIds(searchParams: SearchParamsLike): { ids: string[]; trimmed: boolean } {
  const repeated =
    typeof searchParams.getAll === "function" ? searchParams.getAll("ids") ?? [] : [];
  const single = searchParams.get("ids") ?? "";
  const fromComma = single ? single.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const combined = [...repeated, ...fromComma];
  const uniq = [...new Set(combined)];
  const trimmed = uniq.length > MAX_COMPARE;
  const ids = uniq.slice(0, MAX_COMPARE);
  return { ids, trimmed };
}

/** URL의 ids 쿼리를 갱신. 2개면 ?ids=a,b, 0개면 파라미터 제거. */
function setCompareIdsInUrl(ids: string[], pathname: string): void {
  if (typeof window === "undefined") return;
  const base = window.location.origin + pathname;
  const url = ids.length >= MAX_COMPARE ? `${base}?ids=${ids.slice(0, MAX_COMPARE).join(",")}` : base;
  window.history.replaceState(null, "", url);
}

function getCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function setCompareIds(ids: string[]): void {
  const next = ids.slice(0, MAX_COMPARE);
  localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("storage"));
}

/** 두 로스트에서 사용 가능한 채널 목록 (합집합), CHANNEL_ORDER 우선 */
function availableChannels(results: RoastDetailResponse[]): string[] {
  const set = new Set<string>();
  results.forEach((r) => (r.roast.channels ?? []).forEach((c) => set.add(c)));
  const ordered = CHANNEL_ORDER.filter((c) => set.has(c));
  const rest = [...set].filter((c) => !CHANNEL_ORDER.includes(c)).sort();
  return [...ordered, ...rest];
}

/** 기본 채널: BT → ET → ROR → 첫 채널 */
function defaultChannel(channels: string[]): string {
  return CHANNEL_ORDER.find((c) => channels.includes(c)) ?? channels[0] ?? "bt";
}

function channelLabel(key: string): string {
  return key === "bt" ? "BT" : key === "et" ? "ET" : key === "ror" ? "ROR" : key.toUpperCase();
}

function ComparePageContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "/app/compare";
  const [ids, setIds] = useState<string[]>([]);
  const [results, setResults] = useState<RoastDetailResponse[]>([]);
  const [failedIds, setFailedIds] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [trimmedMessage, setTrimmedMessage] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>("bt");

  // 쿼리 ids 우선 파싱(comma/repeat/Set/trim), 2개 초과 시 안내용
  const parsed = parseCompareIds(searchParams);
  useEffect(() => {
    if (parsed.ids.length >= MAX_COMPARE) {
      setIds(parsed.ids);
      setCompareIds(parsed.ids);
      setTrimmedMessage(parsed.trimmed);
    } else {
      setIds(getCompareIds());
      setTrimmedMessage(false);
    }
    const handler = () => setIds(getCompareIds());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [searchParams.toString(), parsed.ids.join(","), parsed.trimmed]);

  // 비우기 / 하나 제거 시 URL·localStorage·state 동기화
  const handleClear = () => {
    setIds([]);
    setCompareIds([]);
    setCompareIdsInUrl([], pathname);
  };
  const handleRemove = (id: string) => {
    const next = ids.filter((x) => x !== id).slice(0, MAX_COMPARE);
    setIds(next);
    setCompareIds(next);
    setCompareIdsInUrl(next, pathname);
  };

  useEffect(() => {
    if (ids.length < MAX_COMPARE) {
      setResults([]);
      setFailedIds([]);
      setErr(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setErr(null);
    setFailedIds([]);
    (async () => {
      const outcomes = await Promise.allSettled(
        ids.slice(0, MAX_COMPARE).map((id) => getRoast(id))
      );
      if (cancelled) return;
      const fulfilled: RoastDetailResponse[] = [];
      const rejected: string[] = [];
      ids.slice(0, MAX_COMPARE).forEach((id, i) => {
        const o = outcomes[i];
        if (o?.status === "fulfilled") fulfilled.push(o.value);
        else rejected.push(id);
      });
      setResults(fulfilled);
      setFailedIds(rejected);
      setErr(fulfilled.length === 0 ? "로스트를 불러오지 못했습니다." : null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [ids.join(",")]);

  // 결과 로드 후 기본 채널: BT 없으면 ET, 그것도 없으면 첫 채널
  const available = availableChannels(results);
  useEffect(() => {
    if (available.length > 0 && !available.includes(selectedChannel)) {
      setSelectedChannel(defaultChannel(available));
    }
  }, [available.join(",")]);

  // Align to first roast's time; sample second roast at those times (nearest) if lengths differ
  const timeSeconds: number[] =
    results.length >= 1 && results[0].timeseries?.time ? results[0].timeseries.time : [];
  const series: RoastCurveSeriesItem[] = [];
  const ch = selectedChannel;
  if (results.length >= 1 && results[0].timeseries?.channels?.[ch]) {
    series.push({
      key: ch,
      label: channelLabel(ch),
      values: results[0].timeseries.channels[ch],
      roastLabel: results[0].roast.batch_name ?? results[0].roast.id.slice(0, 8),
    });
  }
  if (results.length >= 2 && results[1].timeseries?.channels?.[ch] && results[1].timeseries?.time) {
    const t1 = results[1].timeseries.time;
    const v1 = results[1].timeseries.channels[ch];
    const valuesAtT0: (number | null)[] =
      t1.length === timeSeconds.length
        ? v1
        : timeSeconds.map((t) => {
            let best: number | null = v1[0];
            let bestDist = Infinity;
            for (let i = 0; i < t1.length; i++) {
              const d = Math.abs(t1[i] - t);
              if (d < bestDist) {
                bestDist = d;
                best = v1[i];
              }
            }
            return bestDist <= MAX_DT_SEC ? best : null;
          });
    series.push({
      key: ch,
      label: channelLabel(ch),
      values: valuesAtT0,
      roastLabel: results[1].roast.batch_name ?? results[1].roast.id.slice(0, 8),
    });
  }

  // 차트용 다운샘플 (원본은 유지)
  const chartData = series.length > 0 && timeSeconds.length > 0
    ? downsampleForChart(timeSeconds, series.map((s) => s.values))
    : { time: [] as number[], seriesValues: [] as (number | null)[][] };
  const seriesForChart: RoastCurveSeriesItem[] = chartData.seriesValues.length > 0
    ? series.map((s, i) => ({ ...s, values: chartData.seriesValues[i] ?? [] }))
    : series;
  const timeForChart = chartData.time.length > 0 ? chartData.time : timeSeconds;

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">로스트 비교</h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          비교 담기한 두 로스트의 BT 곡선을 함께 볼 수 있습니다.
        </p>

        {results.length >= 1 && (
          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4">
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">비교 중</div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-lg font-medium text-neutral-800">
              {results.slice(0, MAX_COMPARE).map((r) => (
                <span key={r.roast.id}>
                  {r.roast.batch_name ?? r.roast.id.slice(0, 8)}
                  <span className="ml-2 text-sm font-normal text-neutral-600">
                    {r.roast.started_at ?? r.roast.ended_at ?? ""}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <Link className="underline" href="/app/roasts">
            로스트 목록
          </Link>
          {ids.length >= MAX_COMPARE && (
            <>
              <button
                type="button"
                className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-neutral-700 hover:bg-neutral-50"
                onClick={() => {
                  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/app/compare?ids=${ids.slice(0, MAX_COMPARE).join(",")}`;
                  navigator.clipboard?.writeText(url).then(() => alert("공유 링크가 복사되었습니다.")).catch(() => {});
                }}
              >
                공유 링크 복사
              </button>
              <button
                type="button"
                className="underline text-neutral-600"
                onClick={handleClear}
              >
                비우기
              </button>
              {ids.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="underline text-neutral-600"
                  onClick={() => handleRemove(id)}
                >
                  하나 제거 ({id.slice(0, 8)})
                </button>
              ))}
            </>
          )}
        </div>

        {trimmedMessage && (
          <div className="mt-4">
            <Alert kind="info" message="최대 2개만 비교 가능합니다. 앞 2개만 사용합니다." />
          </div>
        )}

        {ids.length < MAX_COMPARE && (
          <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-600">
            비교하려면 로스트 목록에서 &quot;비교 담기&quot;로 최대 2개를 담아주세요.
            <br />
            <Link className="mt-4 inline-block font-medium underline" href="/app/roasts">
              로스트 목록으로 이동
            </Link>
          </div>
        )}

        {ids.length >= MAX_COMPARE && err && results.length === 0 && (
          <div className="mt-6">
            <Alert kind="error" message={err} />
          </div>
        )}

        {ids.length >= MAX_COMPARE && failedIds.length > 0 && (
          <div className="mt-4">
            <Alert
              kind="info"
              message={`다음 로스트를 불러오지 못했습니다: ${failedIds.map((id) => id.slice(0, 8)).join(", ")}`}
            />
          </div>
        )}

        {ids.length >= MAX_COMPARE && loading && (
          <div className="mt-8 text-center text-sm text-neutral-500">불러오는 중...</div>
        )}

        {ids.length >= MAX_COMPARE && !loading && !err && series.length > 0 && (
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-lg font-medium text-neutral-800">채널 오버레이</h2>
              {available.length > 1 && (
                <select
                  className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800"
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                >
                  {available.map((c) => (
                    <option key={c} value={c}>
                      {channelLabel(c)}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="mt-3 rounded-lg border border-neutral-200 p-4">
              <RoastCurveChart
                time={timeForChart}
                series={seriesForChart}
                timeUnit="seconds"
              />
            </div>
          </div>
        )}

        {ids.length >= MAX_COMPARE && !loading && !err && series.length === 0 && (
          <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
            두 로스트 모두 선택한 채널({channelLabel(selectedChannel)})이 없어 차트를 표시할 수 없습니다.
            {results.length >= 1 && (results[0].roast.channels?.length || results[1]?.roast.channels?.length) ? (
              <span className="mt-2 block">
                로스트별 채널:{" "}
                {results.map((r, i) => `${r.roast.batch_name ?? r.roast.id.slice(0, 8)} (${(r.roast.channels ?? []).join(", ") || "없음"})`).join(" / ")}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </Container>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <Container>
        <div className="py-12 text-center text-neutral-500">불러오는 중...</div>
      </Container>
    }>
      <ComparePageContent />
    </Suspense>
  );
}
