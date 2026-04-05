import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET /api/jobs/available-dates - 공고 있는 날짜 목록 (달력 dot 표시용)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const region = searchParams.get("region")

  const jobs = await prisma.jobPosting.findMany({
    where: {
      status: "active",
      ...(region ? { location: { contains: region } } : {}),
    },
    select: { dates: true },
  })

  const dates = [...new Set(jobs.flatMap((j) => j.dates))].sort()

  return NextResponse.json({ dates })
}
