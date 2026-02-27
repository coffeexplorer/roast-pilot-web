"use client";

import Container from "@/components/Container";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import Alert from "@/components/Alert";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { AuthTokenResponse } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <div className="py-12 max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight">濡쒓렇??/h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          濡쒓렇?????ъ슜?됯낵 怨꾩젙 ?뺣낫瑜??뺤씤?????덉뒿?덈떎.
        </p>

        <div className="mt-6 space-y-4">
          {err ? <Alert kind="error" message={err} /> : null}
          <Input label="?대찓?? value={email} onChange={setEmail} placeholder="name@domain.com" required />
          <PasswordInput label="鍮꾨?踰덊샇" value={pw} onChange={setPw} required />

          <button
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
            disabled={loading}
            onClick={async () => {
              setErr(null);
              setLoading(true);
              try {
                const res = await apiFetch<AuthTokenResponse>("/auth/login", {
                  method: "POST",
                  body: JSON.stringify({ email, password: pw })
                });
                setToken(res.access_token);
                r.push("/app");
              } catch (e: any) {
                setErr(e?.message ?? "濡쒓렇?몄뿉 ?ㅽ뙣?덉뒿?덈떎.");
              } finally {
                setLoading(false);
              }
            }}
          >
            濡쒓렇??          </button>

          <div className="text-sm text-neutral-600">
            怨꾩젙???녿굹??{" "}
            <a className="underline" href="/auth/signup">
              ?뚯썝媛??            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
