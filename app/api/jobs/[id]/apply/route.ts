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

  // 근무 가능 날짜 (공고 날짜의 부분집합만 허용)
  let selectedDates: string[] = []
  try {
    const body = await req.json()
    if (Array.isArray(body?.selectedDates)) {
      selectedDates = body.selectedDates.filter(
        (d: unknown): d is string => typeof d === "string" && job.dates.includes(d)
      )
    }
  } catch {
    // body 없이 지원하는 경우 허용 (전체 날짜 근무 가능으로 간주)
  }

  const application = await prisma.application.create({
    data: { workerId: session.user.id, jobId, selectedDates },
  })

  // 사장님에게 알림 생성
  const worker = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  })
  const workerName = worker?.name || "알 수 없는 사용자"

  await prisma.notification.create({
    data: {
      userId: job.employerId,
      type: "new_application",
      title: "새 지원자가 있어요",
      body: `${workerName}님이 [${job.companyName}] 공고에 지원했습니다`,
      metadata: { jobId, applicationId: application.id, workerName },
    },
  })

  return NextResponse.json(application, { status: 201 })
}
