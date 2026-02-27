import Container from "@/components/Container";

const faqs = [
  {
    q: "Roast Pilot은 무엇인가요?",
    a: "로스팅 데이터를 기록하고, 배치 리스크를 분석해 주는 도구입니다.",
  },
  {
    q: "무료 플랜에서도 사용할 수 있나요?",
    a: "네, 월 사용량 한도 내에서 사용할 수 있습니다.",
  },
  {
    q: "어떤 데이터를 업로드하나요?",
    a: "기본적으로 시간축과 BT(필수)를 업로드하며, 확장 채널을 추가할 수 있습니다.",
  },
  {
    q: "리스크 점수는 무엇을 의미하나요?",
    a: "목표 프로파일과의 차이, 급격한 변화, 일관성 저하 등을 종합한 지표입니다.",
  },
  {
    q: "데이터는 안전하게 보관되나요?",
    a: "전송은 HTTPS로 보호되며 서버에 저장됩니다(세부는 개인정보처리방침 참고).",
  },
  {
    q: "문의는 어디로 하면 되나요?",
    a: "/contact 페이지에서 메시지를 남겨주세요.",
  },
];

export default function FAQPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">FAQ</h1>
        <div className="mt-8 space-y-4">
          {faqs.map((x) => (
            <div key={x.q} className="rounded-2xl border border-neutral-200 p-6">
              <div className="font-medium">{x.q}</div>
              <div className="mt-2 text-sm text-neutral-600 leading-relaxed">{x.a}</div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
