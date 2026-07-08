import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 로그인 없이 접근 가능한 경로 (prefix 매칭)
const publicPaths = [
  "/auth/login",
  "/auth/error",
  "/api/auth",
  "/api/jobs", // 공고 목록/상세 조회는 공개 (지원 POST는 라우트에서 검증)
  "/api/reservation", // 사전예약
  "/jobs",
  "/lp",
  "/benefits",
  "/api/benefits",
]

export default auth(async function middleware(
  req: NextRequest & { auth: { user?: { isProfileComplete?: boolean; role?: string } } | null }
) {
  const { pathname } = req.nextUrl
  const session = req.auth

  // 공개 경로는 통과 (루트는 정확히 일치할 때만)
  if (pathname === "/" || publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // 로그인 안 된 경우 → 로그인 페이지로
  if (!session) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 프로필 미완성 사용자 → 회원가입 완성 페이지로
  if (!session.user?.isProfileComplete && pathname !== "/auth/signup") {
    return NextResponse.redirect(new URL("/auth/signup", req.url))
  }

  // 역할 가드: 구직자가 사장님 페이지 접근 (또는 반대) 시 자기 홈으로
  const role = session.user?.role
  if (role === "worker" && pathname.startsWith("/employer")) {
    return NextResponse.redirect(new URL("/worker", req.url))
  }
  if (role === "employer" && pathname.startsWith("/worker")) {
    return NextResponse.redirect(new URL("/employer", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*|.*\\.png$|.*\\.svg$).*)",
  ],
}
