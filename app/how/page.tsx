"use client";

import Container from "@/components/Container";
import Link from "next/link";

export default function HowPage() {
  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">사용 방법</h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          현재 버전 준비 중입니다. 기능과 정책은 조정 중입니다.
        </p>

        <div className="mt-8 rounded-2xl border border-neutral-200 p-6">
          <ol className="list-decimal pl-5 space-y-2 text-sm text-neutral-800">
            <li>회원가입 후 로그인합니다.</li>
            <li>앱에서 배치를 업로드하거나 로스팅을 기록합니다.</li>
            <li>사용량/편차/리스크 분석 결과를 확인합니다.</li>
          </ol>

          <div className="mt-6 flex gap-3 text-sm">
            <Link className="underline" href="/app">앱으로 이동</Link>
            <Link className="underline" href="/">홈으로</Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
