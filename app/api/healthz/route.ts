import { NextResponse } from "next/server";

/**
 * 배포·헬스체크용. 로그인/미들웨어/캐시 영향 없이 항상 200 반환.
 */
export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
