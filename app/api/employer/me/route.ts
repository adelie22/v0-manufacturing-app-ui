import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/employer/me - 사장님 기본 정보 (공고 프리필용)
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      businessName: true,
      businessVerified: true,
      // 최근 공고에서 위치 프리필
      jobPostings: {
        select: { location: true, companyName: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  return NextResponse.json({
    businessName: user?.businessName ?? null,
    businessVerified: user?.businessVerified ?? false,
    lastLocation: user?.jobPostings[0]?.location ?? null,
    lastCompanyName: user?.jobPostings[0]?.companyName ?? null,
  })
}
