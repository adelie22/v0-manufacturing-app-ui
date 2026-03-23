import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 12

  const where = category && category !== "전체" ? { category } : {}

  const [posts, total] = await Promise.all([
    prisma.benefitPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.benefitPost.count({ where }),
  ])

  return NextResponse.json({ posts, total, page, limit })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
  }

  const body = await req.json()
  const { title, content, summary, source, sourceUrl, imageUrl, category } = body

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 })
  }

  const post = await prisma.benefitPost.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      summary: summary?.trim() || null,
      source: source?.trim() || null,
      sourceUrl: sourceUrl?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      category: category || "기타",
      authorId: session.user.id,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
