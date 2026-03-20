import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET /api/jobs - 공고 목록 조회 (공개)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const region = searchParams.get("region")

  const jobs = await prisma.jobPosting.findMany({
    where: {
      status: "active",
      ...(region ? { location: { contains: region } } : {}),
    },
    include: {
      employer: { select: { name: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(jobs)
}

// POST /api/jobs - 공고 등록 (사장님만)
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }
  if (session.user.role !== "employer") {
    return NextResponse.json({ error: "사장님만 공고를 등록할 수 있습니다" }, { status: 403 })
  }

  const body = await req.json()
  const { category, companyName, location, date, startTime, endTime,
    headcount, payType, payAmount, instantPay, pickup, description, selectedTasks } = body

  if (!category || !companyName || !location || !date || !payAmount) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요" }, { status: 400 })
  }

  const job = await prisma.jobPosting.create({
    data: {
      employerId: session.user.id,
      category,
      companyName,
      location,
      date,
      startTime,
      endTime,
      headcount: Number(headcount),
      payType,
      payAmount: Number(payAmount),
      instantPay: Boolean(instantPay),
      pickup: Boolean(pickup),
      description: description || null,
      tasks: selectedTasks ?? [],
    },
  })

  return NextResponse.json(job, { status: 201 })
}
