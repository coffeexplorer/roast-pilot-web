import Container from "@/components/Container";

export default function TermsPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">이용약관</h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          V1 초안입니다. 지원 안내 방식으로 문의를 확인하세요.
        </p>
        <div className="mt-8 space-y-3 text-sm text-neutral-700 leading-relaxed">
          <p>1. 목적: 서비스 이용 조건 안내, 약관/정책 앱을 규정합니다.</p>
          <p>2. 설정: 이용자는 정책과 약관을 준수해야 합니다.</p>
          <p>3. 앱의 로그인·앱의 처리 범위 및 방법 안내는 방법을 준수합니다.</p>
          <p>4. 문의: 서비스 이용, 앱 관련 등 범위 지원 안내로 연결됩니다.</p>
        </div>
      </div>
    </Container>
  );
}
