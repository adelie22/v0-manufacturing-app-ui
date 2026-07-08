import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { verifyBusinessNumber, normalizeBusinessNumber } from "@/lib/business"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 })
  }

  const { role, name, phone, businessNumber, businessName } = await req.json()

  if (!role || !["employer", "worker"].includes(role)) {
    return NextResponse.json({ error: "올바른 역할을 선택해주세요" }, { status: 400 })
  }

  if (!name?.trim()) {
    return NextResponse.json({ error: "이름을 입력해주세요" }, { status: 400 })
  }

  if (!phone?.trim()) {
    return NextResponse.json({ error: "전화번호를 입력해주세요" }, { status: 400 })
  }

  // 사장님은 사업자등록번호 인증 필수 (서버에서 재검증)
  let businessData = {}
  if (role === "employer") {
    if (!businessNumber?.trim()) {
      return NextResponse.json({ error: "사업자등록번호를 입력해주세요" }, { status: 400 })
    }
    if (!businessName?.trim()) {
      return NextResponse.json({ error: "상호명을 입력해주세요" }, { status: 400 })
    }

    const result = await verifyBusinessNumber(businessNumber)
    if (!result.valid) {
      return NextResponse.json({ error: result.message }, { status: 422 })
    }

    businessData = {
      businessNumber: normalizeBusinessNumber(businessNumber),
      businessName: businessName.trim(),
      businessVerified: true,
      businessVerifiedAt: new Date(),
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      phone: phone.trim(),
      role,
      isProfileComplete: true,
      ...businessData,
    },
  })

  return NextResponse.json({ success: true })
}
