import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 로그인 없이 접근 가능한 경로
const publicPaths = ["/auth/login", "/auth/error", "/api/auth"]

export default auth(async function middleware(req: NextRequest & { auth: { user?: { isProfileComplete?: boolean } } | null }) {
  const { pathname } = req.nextUrl
  const session = req.auth

  // 공개 경로는 통과
  if (publicPaths.some((p) => pathname.startsWith(p))) {
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

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*|.*\\.png$|.*\\.svg$).*)",
  ],
}
