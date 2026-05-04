import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET /api/employer/jobs/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }

  const { id } = await params

  const job = await prisma.jobPosting.findUnique({
    where: { id },
    include: {
      _count: { select: { applications: true } },
      applications: {
        include: {
          worker: {
            select: { id: true, name: true, image: true, workerProfile: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!job) return NextResponse.json({ error: "공고를 찾을 수 없습니다" }, { status: 404 })
  if (job.employerId !== session.user.id) return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 })

  return NextResponse.json(job)
}

// DELETE /api/employer/jobs/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }

  const { id } = await params

  const job = await prisma.jobPosting.findUnique({ where: { id } })
  if (!job) return NextResponse.json({ error: "공고를 찾을 수 없습니다" }, { status: 404 })
  if (job.employerId !== session.user.id) return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 })

  await prisma.jobPosting.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
