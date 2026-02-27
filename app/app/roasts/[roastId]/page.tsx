"use client";

import Container from "@/components/Container";
import Alert from "@/components/Alert";
import RoastCurveChart from "@/components/RoastCurveChart";
import { getRoast } from "@/lib/api";
import type { RoastDetailResponse, TimeseriesPayload } from "@/lib/types";
import { downsampleTimeseries } from "@/lib/downsample";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function downloadJson(roast: RoastDetailResponse["roast"], timeseries: TimeseriesPayload) {
  const blob = new Blob([JSON.stringify({ roast, timeseries }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const base = (roast.batch_name ?? roast.id).replace(/[/\\?%*:|"]/g, "_").slice(0, 80);
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  a.download = `roast_${base}_${ymd}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RoastDetailPage() {
  const params = useParams();
  const roastId = typeof params?.roastId === "string" ? params.roastId : "";
  const [data, setData] = useState<RoastDetailResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!roastId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getRoast(roastId);
        if (!cancelled) {
          setData(res);
          setErr(null);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : "로스트를 불러오지 못했습니다.");
          setData(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roastId]);

  if (!roastId) {
    return (
      <Container>
        <div className="py-12">
          <Alert kind="error" message="로스트 ID가 없습니다." />
          <Link className="mt-4 inline-block text-sm underline" href="/app/roasts">
            목록으로
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12">
        <Link className="text-sm underline text-neutral-600" href="/app/roasts">
          ← 목록
        </Link>

        {err && (
          <div className="mt-6">
            <Alert kind="error" message={err} />
            <Link className="mt-4 inline-block text-sm underline" href="/app/roasts">
              목록으로
            </Link>
          </div>
        )}

        {data && (
          <>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">
              {data.roast.batch_name ?? data.roast.id.slice(0, 8)}
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              시작: {data.roast.started_at ?? "-"} / 종료: {data.roast.ended_at ?? "-"} · 포인트:{" "}
              {data.roast.points_count}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                onClick={() => downloadJson(data.roast, data.timeseries)}
              >
                JSON 다운로드
              </button>
            </div>

            {data.timeseries?.channels?.bt ? (
              <div className="mt-8">
                <h2 className="text-lg font-medium text-neutral-800">BT 곡선</h2>
                <div className="mt-3 rounded-lg border border-neutral-200 p-4">
                  {(() => {
                    const { time, channels } = downsampleTimeseries(data.timeseries.time, data.timeseries.channels);
                    return (
                      <RoastCurveChart
                        time={time}
                        series={[{ key: "bt", label: "BT", values: channels.bt }]}
                        timeUnit={data.timeseries.time_unit}
                      />
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                BT 채널 데이터가 없어 차트를 표시할 수 없습니다.
                {data.roast.channels?.length ? (
                  <span className="mt-2 block">사용 가능한 채널: {data.roast.channels.join(", ")}</span>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
