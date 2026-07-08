import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { verifyBusinessNumber, normalizeBusinessNumber } from "@/lib/business"

// POST /api/auth/verify-business - 사업자등록번호 인증
// save: true + businessName 전달 시 로그인 사용자에게 인증 정보 저장 (기존 가입 사장님용)
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 })
  }

  const { businessNumber, businessName, save } = await req.json()
  if (!businessNumber || typeof businessNumber !== "string") {
    return NextResponse.json({ error: "사업자등록번호를 입력해주세요" }, { status: 400 })
  }

  const result = await verifyBusinessNumber(businessNumber)

  if (!result.valid) {
    return NextResponse.json({ error: result.message }, { status: 422 })
  }

  if (save) {
    if (!businessName?.trim()) {
      return NextResponse.json({ error: "상호명을 입력해주세요" }, { status: 400 })
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        businessNumber: normalizeBusinessNumber(businessNumber),
        businessName: businessName.trim(),
        businessVerified: true,
        businessVerifiedAt: new Date(),
      },
    })
  }

  return NextResponse.json({
    valid: true,
    businessNumber: normalizeBusinessNumber(businessNumber),
    statusLabel: result.statusLabel,
    taxType: result.taxType,
    source: result.source,
    message: result.message,
  })
}
