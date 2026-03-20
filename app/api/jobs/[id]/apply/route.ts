import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// POST /api/jobs/[id]/apply - 구직자 지원
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }
  if (session.user.role !== "worker") {
    return NextResponse.json({ error: "구직자만 지원할 수 있습니다" }, { status: 403 })
  }

  const { id: jobId } = await params

  const job = await prisma.jobPosting.findUnique({ where: { id: jobId } })
  if (!job || job.status !== "active") {
    return NextResponse.json({ error: "존재하지 않거나 마감된 공고입니다" }, { status: 404 })
  }

  const existing = await prisma.application.findUnique({
    where: { workerId_jobId: { workerId: session.user.id, jobId } },
  })
  if (existing) {
    return NextResponse.json({ error: "이미 지원한 공고입니다" }, { status: 409 })
  }

  const application = await prisma.application.create({
    data: { workerId: session.user.id, jobId },
  })

  return NextResponse.json(application, { status: 201 })
}
