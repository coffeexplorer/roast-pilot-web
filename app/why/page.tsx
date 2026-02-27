"use client";
import Container from "@/components/Container";

export default function WhyPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Why Roast Pilot</h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          데스크톱과 함께 로스팅을 관리하는 도구입니다.
          Roast Pilot은 배치 이미지·프로필 설정을 만들어 다음 배치·데이터를 비교합니다.
        </p>

        <div className="mt-10 grid gap-4">
          <div className="rounded-xl border border-neutral-200 p-5">
            <div className="font-medium">배치 인사이트 제공</div>
            <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
              어떤 로트 파일이라도 한 번에 인사이트를 제공합니다.
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-5">
            <div className="font-medium">프로필 모드 제공</div>
            <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
              설정에 따라 다크 모드가 결과·인사이트를 지원합니다.
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-5">
            <div className="font-medium">데이터 자산화</div>
            <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
              클라우드·로스트 데이터, 데이터를 동기화하고 정책을 지원합니다.
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
