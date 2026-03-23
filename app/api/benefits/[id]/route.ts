import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = await prisma.benefitPost.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: "없는 게시물입니다." }, { status: 404 })
  return NextResponse.json(post)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
  }

  const { id } = await params
  const post = await prisma.benefitPost.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: "없는 게시물입니다." }, { status: 404 })
  if (post.authorId !== session.user.id) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
  }

  await prisma.benefitPost.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
