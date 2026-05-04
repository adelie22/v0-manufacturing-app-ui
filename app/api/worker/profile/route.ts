import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET /api/worker/profile - 내 이력서 조회
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }

  const profile = await prisma.workerProfile.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(profile ?? null)
}

// PUT /api/worker/profile - 이력서 저장 (생성 or 수정)
export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }

  const { bio, workHistory, skills } = await req.json()

  const profile = await prisma.workerProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      bio: bio ?? "",
      workHistory: workHistory ?? [],
      skills: skills ?? [],
    },
    update: {
      bio: bio ?? "",
      workHistory: workHistory ?? [],
      skills: skills ?? [],
    },
  })

  return NextResponse.json(profile)
}
