import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET /api/employer/applications/[id] - 지원자 상세 조회
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }

  const { id } = await params

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      worker: {
        select: {
          id: true,
          name: true,
          image: true,
          phone: true,
          createdAt: true,
          workerProfile: true,
        },
      },
      job: true,
    },
  })

  if (!application) {
    return NextResponse.json({ error: "존재하지 않는 지원서입니다" }, { status: 404 })
  }

  if (application.job.employerId !== session.user.id) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 })
  }

  return NextResponse.json(application)
}

// PATCH /api/employer/applications/[id] - 수락/거절
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }

  const { id } = await params
  const { status } = await req.json()

  if (!["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "잘못된 상태값입니다" }, { status: 400 })
  }

  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  })

  if (!application) {
    return NextResponse.json({ error: "존재하지 않는 지원서입니다" }, { status: 404 })
  }

  if (application.job.employerId !== session.user.id) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 })
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status },
  })

  // 구직자에게 결과 알림
  await prisma.notification.create({
    data: {
      userId: application.workerId,
      type: status === "accepted" ? "application_accepted" : "application_rejected",
      title: status === "accepted" ? "지원이 수락되었습니다" : "지원이 거절되었습니다",
      body:
        status === "accepted"
          ? `[${application.job.companyName}] 공고에 합격하셨습니다. 연락을 기다려주세요.`
          : `[${application.job.companyName}] 공고에 아쉽게도 선발되지 않았습니다.`,
      metadata: { jobId: application.jobId, applicationId: id },
    },
  })

  return NextResponse.json(updated)
}
