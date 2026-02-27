import Container from "@/components/Container";

function PlanCard({ name, items }: { name: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-6">
      <div className="text-lg font-semibold">{name}</div>
      <ul className="mt-4 space-y-2 text-sm text-neutral-700">
        {items.map((x) => (
          <li key={x} className="flex gap-2">
            <span className="text-neutral-400">-</span>
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">플랜</h1>
        <p className="mt-4 text-neutral-600 max-w-3xl leading-relaxed">
          현재 버전 준비 중입니다. 기능과 정책은 조정 중입니다.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <PlanCard
            name="Starter"
            items={["월 업로드 한도(베타)", "기본 리스크 분석", "데이터 보관 제한"]}
          />
          <PlanCard
            name="Roaster"
            items={["업로드 한도 확대", "비교/편차 분석 강화", "데이터 보관 기간 확대"]}
          />
          <PlanCard
            name="Pro"
            items={["팀 기능", "고급 분석", "확장 리포트(예정)"]}
          />
        </div>
      </div>
    </Container>
  );
}
