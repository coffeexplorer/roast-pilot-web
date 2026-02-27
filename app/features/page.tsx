import Container from "@/components/Container";
import FeatureCard from "@/components/FeatureCard";

export default function FeaturesPage() {
  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-semibold tracking-tight">湲곕뒫</h1>
        <p className="mt-4 text-neutral-600 max-w-3xl leading-relaxed">
          湲곕줉???섏뼱, ?꾩옣?먯꽌 諛붾줈 ?곕뒗 ?덉쭏 愿由??꾧뎄瑜?吏?ν빀?덈떎.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <FeatureCard title="濡쒓퉭" desc="BT/ET 湲곕컲 ??꾨씪???뺥빀, ?낅줈???덉젙??" />
          <FeatureCard title="由ъ뒪??遺꾩꽍" desc="?먯닔? ?먯씤 ?꾨낫瑜??④퍡 ?쒖떆." />
          <FeatureCard title="諛곗튂 鍮꾧탳" desc="湲곗? ?꾨줈?뚯씪 ?鍮??몄감瑜?鍮좊Ⅴ寃??뺤씤." />
          <FeatureCard title="?섍꼍 蹂댁젙" desc="?⑤룄/?듬룄 李⑥씠瑜?洹쇨굅濡??댁꽍." />
          <FeatureCard title="?꾩쟻 遺꾩꽍" desc="?붽컙 ?⑦꽩??異붿쟻?섍퀬 ?ы쁽?깆쓣 ?믪엫(?쇰? 湲곕뒫? ?덉젙)." />
          <FeatureCard title="?곗씠???대낫?닿린" desc="CSV/由ы룷?몃뒗 ?댁쁺 ?④퀎??留욎떠 ?뺤옣 媛??" />
        </div>
      </div>
    </Container>
  );
}
