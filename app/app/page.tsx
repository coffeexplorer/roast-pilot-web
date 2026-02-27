"use client";

import Container from "@/components/Container";
import Alert from "@/components/Alert";
import UsageCards from "@/components/UsageCards";
import { apiFetch } from "@/lib/api";
import { MeResponse, UsageResponse } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AppHomePage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const m = await apiFetch<MeResponse>("/auth/me");
        setMe(m);
        const u = await apiFetch<UsageResponse>("/usage/me");
        setUsage(u);
      } catch (e: any) {
        setErr(e?.message ?? "데이터를 불러오지 못했습니다.");
      }
    })();
  }, []);

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">
          마이페이지
        </h1>

        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          계정 정보를 한눈에 확인하세요.
        </p>

        <div className="mt-6">
          {err ? <Alert kind="error" message={err} /> : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 p-6 md:col-span-1">
            <div className="text-sm text-neutral-600">계정</div>
            <div className="mt-2 font-medium">{me?.email ?? "-"}</div>

            <div className="mt-4 text-sm text-neutral-600">플랜</div>
            <div className="mt-1 font-medium">
              {usage?.plan ?? me?.plan ?? "-"}
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm">
              <Link className="underline" href="/app/usage">
                사용량 자세히 보기
              </Link>
              <Link className="underline" href="/app/delete">
                계정 삭제
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            {usage ? <UsageCards usage={usage} /> : null}

            {usage?.upgrade_required ? (
              <div className="mt-4">
                <Alert
                  kind="info"
                  message="업그레이드가 필요합니다. 플랜 페이지를 확인하세요."
                />
              </div>
            ) : null}

            {usage?.warnings?.length ? (
              <div className="mt-4 rounded-2xl border border-neutral-200 p-6">
                <div className="font-medium">알림</div>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  {usage.warnings.map((w) => (
                    <li
                      key={`${w.type}-${w.current}-${w.limit}`}
                      className="flex gap-2"
                    >
                      <span className="text-neutral-400">-</span>
                      <span>{w.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Container>
  );
}