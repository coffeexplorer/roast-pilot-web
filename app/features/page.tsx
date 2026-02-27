import Container from "@/components/Container";
import FeatureCard from "@/components/FeatureCard";

export default function FeaturesPage() {
  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">기능</h1>
        <p className="mt-4 text-neutral-600 max-w-3xl leading-relaxed">
          로스팅 기록과 리스크 분석을 한 화면에서 관리하세요.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <FeatureCard
            title="로스팅 데이터 기록"
            desc="배치별 BT·ET 등 주요 데이터를 저장하고 비교합니다."
          />
          <FeatureCard
            title="리스크 점수 분석"
            desc="프로파일 이탈, 변동성, 급격한 변화 등을 점수화합니다."
          />
          <FeatureCard
            title="사용량/플랜 관리"
            desc="업로드·포인트 사용량과 업그레이드 안내를 제공합니다."
          />
        </div>
      </div>
    </Container>
  );
}
