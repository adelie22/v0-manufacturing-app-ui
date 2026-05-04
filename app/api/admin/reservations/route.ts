import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const ADMIN_EMAIL = "fredhwan2@gmail.com"

export async function GET() {
  const session = await auth()
  if (session?.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 })
  }

  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(reservations)
}
