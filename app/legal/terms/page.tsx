import Container from "@/components/Container";

export default function TermsPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">이용 약관</h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          본 약관은 Roast Pilot(이하 “서비스”)의 이용과 관련하여
          이용자와 운영자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
        <div className="mt-8 space-y-3 text-sm text-neutral-700 leading-relaxed">
          <p><strong>1. 목적</strong><br />
          본 약관은 서비스 이용 조건과 절차, 이용자의 권리 및 의무,
          운영자의 책임 범위를 규정합니다.</p>
          <p><strong>2. 계정</strong><br />
          이용자는 정확하고 최신의 정보를 제공해야 하며,
          계정 관리 책임은 이용자에게 있습니다.</p>
          <p><strong>3. 데이터 및 업로드</strong><br />
          이용자가 업로드한 데이터는 서비스 제공 목적 범위 내에서 처리됩니다.
          데이터의 보관 기간 및 처리 방식은 별도의 개인정보처리방침에 따릅니다.</p>
          <p><strong>4. 책임의 제한</strong><br />
          운영자는 서비스의 중단, 데이터 손실, 예측 결과의 오차 등으로 발생한
          간접적 손해에 대해 법령이 허용하는 범위 내에서 책임을 제한할 수 있습니다.</p>
          <p><strong>5. 약관의 변경</strong><br />
          운영자는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있으며,
          변경 시 웹사이트에 공지합니다.</p>
          <p><strong>6. 문의</strong><br />
          본 약관과 관련된 문의는 Contact 페이지를 통해 접수할 수 있습니다.</p>
        </div>
      </div>
    </Container>
  );
}
