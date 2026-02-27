"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";

type Feature = { title: string; desc: string };

function FeatureCard({ title, desc }: Feature) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-6">
      <div className="font-medium">{title}</div>
      <div className="mt-2 text-sm text-neutral-600 leading-relaxed">{desc}</div>
    </div>
  );
}

export default function HomePage() {
  const features: Feature[] = [
    {
      title: "프로파일 편차 감지",
      desc: "같은 레시피라도 결과가 달라지는 원인을 수치로 분석합니다.",
    },
    {
      title: "환경 보정",
      desc: "기압·온습도 변화가 로스팅에 미치는 영향을 반영합니다.",
    },
    {
      title: "배치 일관성 관리",
      desc: "반복 재현성을 데이터로 추적합니다.",
    },
  ];

  return (
    <>
      {/* 1. HERO — 다크 섹션 */}
      <section className="bg-neutral-950 text-white py-28">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold leading-tight">
              같은 프로파일인데
              <br />
              왜 결과는 달라질까요?
            </h1>
            <p className="text-neutral-400 text-lg mt-6">
              로스팅 편차는 감이 아니라 데이터 문제입니다.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-3 font-medium hover:bg-neutral-200 transition"
              >
                무료 분석 시작하기
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-600 text-neutral-300 px-6 py-3 font-medium hover:bg-neutral-800 transition"
              >
                실제 분석 화면 보기
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Hero 아래 그라데이션 분리선 */}
      <div className="h-24 bg-gradient-to-b from-neutral-950 to-neutral-50" />

      <Container>
        {/* 2. 분석 증거 — 다크 카드 */}
        <section id="demo" className="scroll-mt-8 py-12">
          <div className="text-sm font-medium tracking-wide text-neutral-500">
            실제 분석 화면
          </div>
          <div className="mt-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 shadow-2xl overflow-hidden">
            <Image
              src="/analysis-screen.png"
              alt="실시간 BT·ET·ROR 추적과 리스크 스코어 분석 화면"
              width={1200}
              height={680}
              className="w-full h-auto rounded-lg"
              unoptimized
            />
            <p className="text-neutral-400 text-sm mt-4 text-center">
              실시간 BT·ET·ROR 추적과 리스크 스코어 분석
            </p>
          </div>
        </section>

        {/* 3. 핵심 가치 */}
        <section className="py-12">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} title={f.title} desc={f.desc} />
            ))}
          </div>
        </section>

        {/* 4. KPI — 임팩트 강화 */}
        <section className="py-12">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            <div className="rounded-2xl bg-white p-8 text-center shadow-md hover:shadow-xl transition">
              <div className="text-sm text-neutral-600">평균 배치 편차 감소</div>
              <div className="mt-2 text-5xl font-bold text-green-500">18% ↓</div>
            </div>
            <div className="rounded-2xl bg-white p-8 text-center shadow-md hover:shadow-xl transition">
              <div className="text-sm text-neutral-600">리스크 자동 감지</div>
              <div className="mt-2 text-5xl font-bold text-red-500">실시간 경고</div>
            </div>
            <div className="rounded-2xl bg-white p-8 text-center shadow-md hover:shadow-xl transition">
              <div className="text-sm text-neutral-600">데이터 기반 의사결정</div>
              <div className="mt-2 text-5xl font-bold text-blue-500">배치 비교 리포트</div>
            </div>
          </div>
        </section>

        {/* 5. 플랜 — 대비 */}
        <section className="py-12 bg-neutral-100 -mx-4 px-4 md:-mx-6 md:px-6 rounded-2xl">
          <div className="text-center">
            <div className="text-sm text-neutral-500 tracking-wide">요금제</div>
            <div className="mt-4">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                플랜 보기
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
