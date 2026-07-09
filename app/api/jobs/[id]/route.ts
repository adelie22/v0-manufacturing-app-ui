import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET /api/jobs/[id] - 공고 상세 조회 (공개)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const job = await prisma.jobPosting.findUnique({
    where: { id },
    include: {
      employer: { select: { name: true, businessVerified: true } },
      _count: { select: { applications: true } },
    },
  })
  if (!job || job.status !== "active") {
    return NextResponse.json({ error: "존재하지 않거나 마감된 공고입니다" }, { status: 404 })
  }

  // 로그인한 구직자면 지원 여부 포함
  let alreadyApplied = false
  const session = await auth()
  if (session?.user?.id) {
    const existing = await prisma.application.findUnique({
      where: { workerId_jobId: { workerId: session.user.id, jobId: id } },
    })
    alreadyApplied = !!existing
  }

  return NextResponse.json({ ...job, alreadyApplied })
}
