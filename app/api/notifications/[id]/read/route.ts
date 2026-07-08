import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// PATCH /api/notifications/[id]/read - 알림 개별 읽음 처리
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
  }

  const { id } = await params

  const result = await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { isRead: true },
  })

  if (result.count === 0) {
    return NextResponse.json({ error: "존재하지 않는 알림입니다" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
