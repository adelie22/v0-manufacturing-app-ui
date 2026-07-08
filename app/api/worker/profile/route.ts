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

  const { bio, workHistory, skills, desiredRegions, desiredCategories, experienceLevel } = await req.json()

  const data = {
    bio: bio ?? "",
    workHistory: workHistory ?? [],
    skills: skills ?? [],
    desiredRegions: desiredRegions ?? [],
    desiredCategories: desiredCategories ?? [],
    experienceLevel: experienceLevel ?? null,
  }

  const profile = await prisma.workerProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...data },
    update: data,
  })

  return NextResponse.json(profile)
}
