import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/employer/applications - 내 공고의 전체 지원자 목록
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }

  const applications = await prisma.application.findMany({
    where: { job: { employerId: session.user.id } },
    include: {
      worker: {
        select: {
          id: true,
          name: true,
          image: true,
          phone: true,
          workerProfile: true,
        },
      },
      job: { select: { id: true, companyName: true, category: true, dates: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(applications)
}
