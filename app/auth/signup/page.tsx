"use client";

import Container from "@/components/Container";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import Checkbox from "@/components/Checkbox";
import Alert from "@/components/Alert";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { AuthTokenResponse } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <div className="py-12 max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight">회원가입</h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          웹에서 가입한 계정으로 앱에 로그인할 수 있습니다.
        </p>

        <div className="mt-6 space-y-4">
          {err ? <Alert kind="error" message={err} /> : null}
          <Input
            label="이메일"
            value={email}
            onChange={setEmail}
            placeholder="name@domain.com"
            required
          />
          <PasswordInput
            label="비밀번호"
            value={pw}
            onChange={setPw}
            placeholder="6자 이상"
            required
          />
          <Checkbox
            label="이용약관 및 개인정보처리방침에 동의합니다."
            checked={agree}
            onChange={setAgree}
          />

          <button
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
            disabled={!agree || loading}
            onClick={async () => {
              setErr(null);
              if (pw.length < 6) {
                setErr("비밀번호는 6자 이상이어야 합니다.");
                return;
              }
              setLoading(true);
              try {
                const res = await apiFetch<AuthTokenResponse>("/auth/register", {
                  method: "POST",
                  body: JSON.stringify({ email, password: pw }),
                });
                setToken(res.access_token);
                r.push("/app");
              } catch (e: any) {
                setErr(e?.message ?? "가입에 실패했습니다.");
              } finally {
                setLoading(false);
              }
            }}
          >
            가입하기
          </button>

          <div className="text-sm text-neutral-600">
            이미 계정이 있나요?{" "}
            <a className="underline" href="/auth/login">
              로그인
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
