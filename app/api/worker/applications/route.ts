import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/worker/applications - 내 지원 현황
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }
  if (session.user.role !== "worker") {
    return NextResponse.json({ error: "구직자만 이용할 수 있습니다" }, { status: 403 })
  }

  const applications = await prisma.application.findMany({
    where: { workerId: session.user.id },
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          category: true,
          location: true,
          dates: true,
          startTime: true,
          endTime: true,
          payType: true,
          payAmount: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(applications)
}
