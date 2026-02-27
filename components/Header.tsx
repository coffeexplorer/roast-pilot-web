"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Container from "./Container";
import { isAuthed, logout } from "@/lib/auth";

function NavLink({ href, label }: { href: string; label: string }) {
  const p = usePathname();
  const active = p === href;
  return (
    <Link
      href={href}
      className={
        "text-sm px-2 py-1 rounded-md " +
        (active ? "bg-neutral-100" : "hover:bg-neutral-50")
      }
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const authed = mounted && isAuthed();

  return (
    <header className="border-b border-neutral-200">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="font-semibold tracking-tight">
            Roast Pilot
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/features" label="기능" />
            <NavLink href="/how" label="사용 방법" />
            <NavLink href="/pricing" label="플랜" />
            <NavLink href="/download" label="다운로드" />
            <NavLink href="/faq" label="FAQ" />
            <NavLink href="/contact" label="문의" />
          </nav>

          <div className="flex items-center gap-2">
            {!authed ? (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm px-3 py-2 rounded-md hover:bg-neutral-50"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm px-3 py-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800"
                >
                  무료로 시작
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/app"
                  className="text-sm px-3 py-2 rounded-md hover:bg-neutral-50"
                >
                  마이페이지
                </Link>
                <button
                  className="text-sm px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
