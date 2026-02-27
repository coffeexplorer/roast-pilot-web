"use client";
import Container from "@/components/Container";

export default function WhyPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Why Roast Pilot</h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          濡쒖뒪?낆? ?숇젴?댁?留? ?덉쭏 愿由щ뒗 諛섎났怨?湲곕줉 ?꾩뿉 ?쒖빞 ?⑸땲??
          Roast Pilot? 諛곗튂 ?몄감? ?섍꼍 蹂?붾? 蹂댁씠寃?留뚮뱾?? ?ㅼ쓬 諛곗튂???먮떒???⑤떒?섍쾶 ?뺤뒿?덈떎.
        </p>

        <div className="mt-10 grid gap-4">
          <div className="rounded-xl border border-neutral-200 p-5">
            <div className="font-medium">諛곗튂 ?몄감瑜??섏튂??/div>
            <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
              媛숈? ?꾨줈?뚯씪?몃뜲 ?ㅻⅨ 留? ?댁쑀瑜?醫곹옄 ???덉뼱???⑸땲??
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-5">
            <div className="font-medium">?섍꼍 李⑥씠瑜?諛섏쁺</div>
            <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
              怨꾩젅 蹂?붿? ?듬룄 李⑥씠媛 寃곌낵??誘몄튂???곹뼢??鍮꾧탳?⑸땲??
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 p-5">
            <div className="font-medium">?곗씠?곌? ?먯궛????/div>
            <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
              ?꾩쟻???볦씪?섎줉, ?먮떒? ??鍮좊Ⅴ怨??뺥솗?댁쭛?덈떎.
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
