"use client";

import Container from "@/components/Container";
import Input from "@/components/Input";
import Alert from "@/components/Alert";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <div className="py-12 max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight">로그인</h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          데모 화면입니다.
        </p>

        <div className="mt-6 space-y-4">
          {msg ? <Alert kind="info" message={msg} /> : null}

          <Input label="이메일" value={email} onChange={setEmail} placeholder="name@domain.com" />
          <Input label="비밀번호" value={pw} onChange={setPw} placeholder="••••••••" />

          <button
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setMsg("현재는 데모 페이지입니다.");
              }, 400);
            }}
          >
            {loading ? "처리 중..." : "로그인"}
          </button>
        </div>
      </div>
    </Container>
  );
}
