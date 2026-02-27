"use client";

import Container from "@/components/Container";
import Alert from "@/components/Alert";
import { getRoasts } from "@/lib/api";
import type { RoastSummary } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const COMPARE_STORAGE_KEY = "roast_compare_ids";
const MAX_COMPARE = 2;

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

function addToCompare(id: string): void {
  const ids = getCompareIds();
  if (ids.includes(id)) return;
  const next = [...ids, id].slice(-MAX_COMPARE);
  localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("storage"));
}

export default function RoastsListPage() {
  const [list, setList] = useState<RoastSummary[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRoasts({ limit: 100 });
        setList(data);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "목록을 불러오지 못했습니다.");
      }
    })();
  }, []);

  useEffect(() => {
    setCompareIds(getCompareIds());
    const handler = () => setCompareIds(getCompareIds());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleCompareAdd = (id: string) => {
    addToCompare(id);
    setCompareIds(getCompareIds());
  };

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">로스트 목록</h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          로스트를 선택해 상세를 보거나 비교에 담을 수 있습니다.
        </p>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <Link className="underline" href="/app">
            마이페이지
          </Link>
          {compareIds.length > 0 && (
            <Link className="underline font-medium" href="/app/compare">
              비교하기 ({compareIds.length}/{MAX_COMPARE})
            </Link>
          )}
        </div>

        {err && (
          <div className="mt-6">
            <Alert kind="error" message={err} />
          </div>
        )}

        {!err && list.length === 0 && (
          <div className="mt-8 rounded-xl border border-neutral-200 p-8 text-center text-sm text-neutral-500">
            등록된 로스트가 없습니다.
          </div>
        )}

        {!err && list.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="border-b border-neutral-200 px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    배치명
                  </th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    시작 / 종료
                  </th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    포인트
                  </th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-right text-sm font-medium text-neutral-700">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3 text-sm">{r.batch_name ?? r.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {r.started_at ?? "-"} / {r.ended_at ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{r.points_count}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        className="mr-3 text-sm underline text-neutral-700"
                        href={`/app/roasts/${r.id}`}
                      >
                        열기
                      </Link>
                      <button
                        type="button"
                        className="text-sm underline text-blue-600 disabled:text-neutral-400"
                        onClick={() => handleCompareAdd(r.id)}
                        disabled={compareIds.includes(r.id) || (compareIds.length >= MAX_COMPARE && !compareIds.includes(r.id))}
                      >
                        비교 담기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}
