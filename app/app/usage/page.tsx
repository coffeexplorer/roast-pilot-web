"use client";

import Container from "@/components/Container";
import Alert from "@/components/Alert";
import UsageCards from "@/components/UsageCards";
import { apiFetch } from "@/lib/api";
import { UsageResponse } from "@/lib/types";
import { useEffect, useState } from "react";

export default function UsagePage() {
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const u = await apiFetch<UsageResponse>("/usage/me");
        setUsage(u);
      } catch (e: any) {
        setErr(e?.message ?? "?곗씠?곕? 遺덈윭?ㅼ? 紐삵뻽?듬땲??");
      }
    })();
  }, []);

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">?ъ슜??/h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          ?뱀썡 湲곌컙怨??낅줈???ъ씤???ъ슜?됱쓣 ?뺤씤?⑸땲??
        </p>

        <div className="mt-6">
          {err ? <Alert kind="error" message={err} /> : null}
        </div>

        {usage ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-neutral-200 p-6">
              <div className="text-sm text-neutral-600">湲곌컙</div>
              <div className="mt-2 text-sm text-neutral-800">
                {usage.period.start} ~ {usage.period.end} ({usage.period.tz})
              </div>
            </div>
            <UsageCards usage={usage} />
          </div>
        ) : null}
      </div>
    </Container>
  );
}
