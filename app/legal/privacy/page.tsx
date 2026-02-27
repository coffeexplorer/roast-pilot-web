"use client";
import Container from "@/components/Container";

export default function PrivacyPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">개인정보처리방침</h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          V1 기준입니다. 수집 항목/보관 기간/처리 방침/이용 내용은 추후 수정됩니다.
        </p>
        <div className="mt-8 space-y-3 text-sm text-neutral-700 leading-relaxed">
          <p>수집 항목: 이메일, 비밀번호(해시), 서비스 이용 기록</p>
          <p>이용 목적: 계정 관리, 서비스 제공, 고객 지원</p>
          <p>보관 기간: 계정 유지 기간 보관 및 법령 준수</p>
          <p>이용/접근: 조회/수정/삭제/처리 요청 가능</p>
        </div>
      </div>
    </Container>
  );
}
