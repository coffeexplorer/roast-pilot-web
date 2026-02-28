"use client";

import Container from "@/components/Container";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import Alert from "@/components/Alert";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErr(null);
    if (!email.trim()) {
      setErr("이메일을 입력하세요.");
      return;
    }
    if (!pw) {
      setErr("비밀번호를 입력하세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await login(email.trim(), pw);
      setToken(res.access_token);
      router.push("/app");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "로그인에 실패했습니다.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="py-12 max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight">로그인</h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          이메일과 비밀번호로 로그인하세요.
        </p>

        <div className="mt-6 space-y-4">
          {err ? <Alert kind="error" message={err} /> : null}

          <Input
            label="이메일"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="name@domain.com"
          />
          <PasswordInput
            label="비밀번호"
            value={pw}
            onChange={setPw}
            placeholder="••••••••"
          />

          <button
            className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "처리 중..." : "로그인"}
          </button>

          <div className="text-sm text-neutral-600">
            계정이 없으신가요?{" "}
            <a className="underline" href="/auth/signup">
              회원가입
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
