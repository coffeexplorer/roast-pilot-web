"use client";

import Container from "@/components/Container";
import Input from "@/components/Input";
import Alert from "@/components/Alert";
import { useState } from "react";

export default function ContactPage() {
  const [roastery, setRoastery] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [batches, setBatches] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState<string | null>(null);

  return (
    <Container>
      <div className="py-12 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">문의</h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          Roast Pilot에 대한 도입 문의, 기능 질문, 협업 제안을 남겨주세요.
        </p>

        <div className="mt-6 space-y-4">
          {done ? <Alert kind="success" message={done} /> : null}

          <Input
            label="로스터리 이름"
            value={roastery}
            onChange={setRoastery}
            placeholder="예: Roast Pilot Roasters"
          />

          <Input
            label="이름"
            value={name}
            onChange={setName}
            placeholder="홍길동"
          />

          <Input
            label="이메일"
            value={email}
            onChange={setEmail}
            placeholder="name@domain.com"
          />

          <Input
            label="월 배치 수"
            value={batches}
            onChange={setBatches}
            placeholder="예: 200"
          />

          <label className="block">
            <div className="text-sm text-neutral-700">문의 내용</div>
            <textarea
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
              rows={6}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="도입 규모, 현재 사용 장비, 궁금한 점을 자유롭게 작성해주세요."
            />
          </label>

          <button
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
            onClick={() => {
              setDone("문의가 접수되었습니다. 빠르게 연락드리겠습니다.");
            }}
          >
            문의 보내기
          </button>
        </div>
      </div>
    </Container>
  );
}
