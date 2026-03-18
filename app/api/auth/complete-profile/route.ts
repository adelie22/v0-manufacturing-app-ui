import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 })
  }

  const { role, name, phone } = await req.json()

  if (!role || !["employer", "worker"].includes(role)) {
    return NextResponse.json({ error: "올바른 역할을 선택해주세요" }, { status: 400 })
  }

  if (!name?.trim()) {
    return NextResponse.json({ error: "이름을 입력해주세요" }, { status: 400 })
  }

  if (!phone?.trim()) {
    return NextResponse.json({ error: "전화번호를 입력해주세요" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      phone: phone.trim(),
      role,
      isProfileComplete: true,
    },
  })

  return NextResponse.json({ success: true })
}
