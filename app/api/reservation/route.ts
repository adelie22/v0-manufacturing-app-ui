import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { name, phone, role } = await req.json()

  if (!phone || !role) {
    return NextResponse.json({ error: "전화번호와 역할을 입력해주세요" }, { status: 400 })
  }

  const phoneClean = phone.replace(/[^0-9]/g, "")
  if (phoneClean.length < 10) {
    return NextResponse.json({ error: "올바른 전화번호를 입력해주세요" }, { status: 400 })
  }

  const existing = await prisma.reservation.findFirst({
    where: { phone: phoneClean },
  })
  if (existing) {
    return NextResponse.json({ error: "이미 사전예약하셨습니다" }, { status: 409 })
  }

  await prisma.reservation.create({
    data: { name: name || null, phone: phoneClean, role },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
