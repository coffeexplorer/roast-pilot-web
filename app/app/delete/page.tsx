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
        <h1 className="text-3xl font-semibold tracking-tight">탈퇴</h1>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
          탈퇴 시 계정 설정 데이터는 삭제됩니다. 앱의 처리 안내는 지원 안내로 연결됩니다.
        </p>

        <div className="mt-6 space-y-4">
          {err ? <Alert kind="error" message={err} /> : null}
          {ok ? <Alert kind="success" message={ok} /> : null}

          <PasswordInput label="비밀번호 확인" value={pw} onChange={setPw} required />

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
                setOk("탈퇴가 완료되었습니다.");
                setTimeout(() => r.push("/"), 800);
              } catch (e: any) {
                setErr(
                  e?.message ??
                    "탈퇴 요청이 실패했습니다. 비밀번호를 확인한 뒤 다시 시도해 주세요."
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </Container>
  );
}
