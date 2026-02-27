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
        <h1 className="text-3xl font-semibold tracking-tight">臾몄쓽</h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          ?곕え/?꾩엯/諛고룷 臾몄쓽瑜??④꺼二쇱꽭?? V1?먯꽌?????쒖텧留?諛쏄퀬, ?ㅼ젣 ?꾩넚? 異뷀썑 ?곌껐?????덉뒿?덈떎.
        </p>

        <div className="mt-6 space-y-4">
          {done ? <Alert kind="success" message={done} /> : null}
          <Input label="濡쒖뒪?곕━紐? value={roastery} onChange={setRoastery} placeholder="?? Roast Pilot Roasters" />
          <Input label="?대떦?먮챸" value={name} onChange={setName} placeholder="?? ?띻만?? />
          <Input label="?대찓?? value={email} onChange={setEmail} placeholder="name@domain.com" />
          <Input label="??諛곗튂 ???좏깮)" value={batches} onChange={setBatches} placeholder="?? 200" />
          <label className="block">
            <div className="text-sm text-neutral-700">臾몄쓽 ?댁슜</div>
            <textarea
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
              rows={6}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="愿??湲곕뒫/?꾩옱 ?댁쁺 諛⑹떇/?먰븯???곕え ?뺥깭 ?깆쓣 ?곸뼱二쇱꽭??"
            />
          </label>

          <button
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-800"
            onClick={() => {
              setDone("?묒닔 ?꾨즺. 怨??곕씫?쒕━寃좎뒿?덈떎.");
            }}
          >
            ?쒖텧?섍린
          </button>
        </div>
      </div>
    </Container>
  );
}
