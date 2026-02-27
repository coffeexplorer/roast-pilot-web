"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type UsageResp = {
  period: { tz: string; start: string; end: string };
  plan: string;
  uploads_count: number;
  uploads_limit: number;
  points_sum: number;
  points_limit: number;
  usage_ratio: { uploads: number; points: number };
  upgrade_required: boolean;
  warnings: any[];
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <div className="text-sm text-neutral-600">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function UsageCards() {
  const [data, setData] = useState<UsageResp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const u = await apiFetch<UsageResp>("/usage/me", { method: "GET" });
        setData(u);
      } catch (e: any) {
        setErr(e?.message ?? "usage fetch failed");
      }
    })();
  }, []);

  if (err) return <div className="text-sm text-red-600">{err}</div>;
  if (!data) return <div className="text-sm text-neutral-500">불러오는 중...</div>;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Card title="플랜">
        <div className="text-xl font-semibold">{data.plan}</div>
        {data.upgrade_required ? (
          <div className="mt-1 text-sm text-red-600">업그레이드가 필요합니다.</div>
        ) : null}
      </Card>

      <Card title="업로드">
        <div className="text-xl font-semibold">
          {data.uploads_count} / {data.uploads_limit}
        </div>
        <div className="mt-1 text-sm text-neutral-600">
          사용률 {(data.usage_ratio.uploads * 100).toFixed(1)}%
        </div>
      </Card>

      <Card title="포인트">
        <div className="text-xl font-semibold">
          {data.points_sum} / {data.points_limit}
        </div>
        <div className="mt-1 text-sm text-neutral-600">
          사용률 {(data.usage_ratio.points * 100).toFixed(1)}%
        </div>
      </Card>

      <Card title="기간">
        <div className="text-sm text-neutral-700">{data.period.start}</div>
        <div className="text-sm text-neutral-700">{data.period.end}</div>
        <div className="mt-1 text-xs text-neutral-500">{data.period.tz}</div>
      </Card>
    </div>
  );
}
