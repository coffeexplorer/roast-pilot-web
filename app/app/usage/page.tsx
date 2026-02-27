"use client";

import Container from "@/components/Container";

export default function UsagePage() {
  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">사용량</h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          데모 화면입니다. 추후 실제 사용량 데이터로 연결됩니다.
        </p>

        <div className="mt-8 grid gap-4">
          <div className="rounded-xl border border-neutral-200 p-5">
            <div className="text-sm text-neutral-700">이번 달 배치</div>
            <div className="mt-2 text-2xl font-semibold">0</div>
          </div>

          <div className="rounded-xl border border-neutral-200 p-5">
            <div className="text-sm text-neutral-700">API 호출</div>
            <div className="mt-2 text-2xl font-semibold">0</div>
          </div>
        </div>
      </div>
    </Container>
  );
}
