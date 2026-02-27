import Container from "./Container";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 mt-16">
      <Container>
        <div className="py-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="text-sm text-neutral-600">
            Roast Pilot — 로스터리를 위한 AI 기반 운영 시스템
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/legal/terms" className="text-neutral-700 hover:text-neutral-900">
              이용약관
            </Link>
            <Link href="/legal/privacy" className="text-neutral-700 hover:text-neutral-900">
              개인정보처리방침
            </Link>
            <Link href="/contact" className="text-neutral-700 hover:text-neutral-900">
              문의
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
