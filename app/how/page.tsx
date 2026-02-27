"use client";

import Container from "@/components/Container";
import Link from "next/link";
import StepCard from "@/components/StepCard";

export default function HowPage() {
  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">사용 방법</h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          현재 버전 준비 중입니다. 기능과 정책은 조정 중입니다.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StepCard step="Step 1" title="회원가입" desc="이메일과 비밀번호로 설정 후 가입하세요." />
          <StepCard step="Step 2" title="다운로드" desc="macOS/Windows 앱을 다운받으세요." />
          <StepCard step="Step 3" title="로그인" desc="로스팅 앱에서 생성한 계정으로 로그인합니다." />
          <StepCard step="Step 4" title="분석" desc="로스팅 데이터, 사용량을 분석하세요." />
        </div>

        <div className="mt-6 flex gap-3 text-sm">
          <Link className="underline" href="/app">앱으로 이동</Link>
          <Link className="underline" href="/">홈으로</Link>
        </div>
      </div>
    </Container>
  );
}
