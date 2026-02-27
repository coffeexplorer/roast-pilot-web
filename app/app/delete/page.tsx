"use client";

import Container from "@/components/Container";
import PasswordInput from "@/components/PasswordInput";
import Alert from "@/components/Alert";
import { apiFetch } from "@/lib/api";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccountPage() {
  const r = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <div className="py-12 max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight">?덊눜</h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          ?덊눜 ??怨꾩젙 ?묎렐??以묐떒?⑸땲?? ?곗씠??泥섎━ ?뺤콉? ?댁쁺 ?뺤콉???곕쫭?덈떎.
        </p>

        <div className="mt-6 space-y-4">
          {err ? <Alert kind="error" message={err} /> : null}
          {ok ? <Alert kind="success" message={ok} /> : null}

          <PasswordInput label="鍮꾨?踰덊샇 ?뺤씤" value={pw} onChange={setPw} required />

          <button
            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-60"
            disabled={loading}
            onClick={async () => {
              setErr(null);
              setOk(null);
              setLoading(true);
              try {
                await apiFetch<any>("/auth/delete", {
                  method: "POST",
                  body: JSON.stringify({ password: pw })
                });
                logout();
                setOk("?덊눜媛 ?꾨즺?섏뿀?듬땲??");
                setTimeout(() => r.push("/"), 800);
              } catch (e: any) {
                setErr(
                  e?.message ??
                    "?덊눜 ?붿껌???ㅽ뙣?덉뒿?덈떎. ?쒕쾭???덊눜 ?붾뱶?ъ씤?멸? ?놁쓣 ???덉뒿?덈떎."
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            ?덊눜?섍린
          </button>
        </div>
      </div>
    </Container>
  );
}
