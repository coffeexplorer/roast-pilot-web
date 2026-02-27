import Container from "@/components/Container";
import CTAButton from "@/components/CTAButton";

export default function DownloadPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">?ㅼ슫濡쒕뱶</h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          macOS瑜??곗꽑 吏?먰빀?덈떎. ?ㅼ튂 ???뱀뿉??媛?낇븳 怨꾩젙?쇰줈 ?깆뿉 濡쒓렇?명븯?몄슂.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 p-6">
            <div className="font-medium">macOS</div>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
              ?ㅼ튂 ?뚯씪 留곹겕??以鍮?以묒엯?덈떎. 踰좏? 諛고룷 諛⑹떇??留욎떠 ?곌껐?섏꽭??
            </p>
            <div className="mt-4">
              <CTAButton href="/contact" label="諛고룷 ?붿껌" />
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 p-6">
            <div className="font-medium">Windows</div>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
              ?ㅼ튂 ?뚯씪 留곹겕??以鍮?以묒엯?덈떎. 諛고룷媛 ?쒖옉?섎㈃ ???섏씠吏?먯꽌 ?덈궡?⑸땲??
            </p>
            <div className="mt-4">
              <CTAButton href="/contact" label="諛고룷 ?붿껌" variant="secondary" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
