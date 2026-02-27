import Container from "@/components/Container";
import CTAButton from "@/components/CTAButton";

export default function DownloadPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">다운로드</h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          macOS를 지원합니다. 다음 사용 방법 설정으로 앱에 로그인하세요.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 p-6">
            <div className="font-medium">macOS</div>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
              다음 파일 링크에서 다운로드합니다. 버전·문의 방식은 문의로 안내해 드립니다.
            </p>
            <div className="mt-4">
              <CTAButton href="/contact" label="문의하기" />
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 p-6">
            <div className="font-medium">Windows</div>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
              다음 파일 링크에서 다운로드합니다. 문의를 시작하면 이메일로 답변드립니다.
            </p>
            <div className="mt-4">
              <CTAButton href="/contact" label="문의하기" variant="secondary" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
