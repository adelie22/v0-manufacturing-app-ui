"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  ArrowLeft,
  ExternalLink,
  Tag,
  Calendar,
  Loader2,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface BenefitPost {
  id: string
  title: string
  content: string
  summary: string | null
  source: string | null
  sourceUrl: string | null
  category: string
  authorId: string | null
  createdAt: string
}

const categoryColors: Record<string, string> = {
  지원금: "bg-emerald-100 text-emerald-700",
  교육: "bg-blue-100 text-blue-700",
  보험: "bg-purple-100 text-purple-700",
  세금: "bg-orange-100 text-orange-700",
  기타: "bg-gray-100 text-gray-600",
}

export default function BenefitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: session } = useSession()
  const router = useRouter()
  const [post, setPost] = useState<BenefitPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/benefits/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(setPost)
      .catch(() => router.replace("/benefits"))
      .finally(() => setLoading(false))
  }, [id, router])

  const handleDelete = async () => {
    if (!confirm("이 게시물을 삭제하시겠습니까?")) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/benefits/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("삭제되었습니다.")
        router.push("/benefits")
      } else {
        const data = await res.json()
        toast.error(data.error || "삭제에 실패했습니다.")
      }
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!post) return null

  const isAuthor = session?.user?.id === post.authorId

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-base font-semibold text-foreground line-clamp-1 flex-1">
            {post.title}
          </span>
          {isAuthor && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleting}
              className="text-muted-foreground hover:text-destructive"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Meta */}
        <div className="mb-6">
          <span
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 ${
              categoryColors[post.category] ?? categoryColors["기타"]
            }`}
          >
            {post.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-snug">
            {post.title}
          </h1>
          {post.summary && (
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              {post.summary}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.source && (
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                {post.source}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <hr className="border-border/50 mb-8" />

        {/* Content */}
        <div className="prose prose-slate max-w-none text-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
          {post.content}
        </div>

        {/* Source Link */}
        {post.sourceUrl && (
          <div className="mt-10 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-700 mb-0.5">원문 보기</p>
              <p className="text-xs text-emerald-600 truncate">{post.sourceUrl}</p>
            </div>
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5 flex-shrink-0"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                이동
              </Button>
            </a>
          </div>
        )}

        {/* Back */}
        <div className="mt-10">
          <Button
            variant="outline"
            onClick={() => router.push("/benefits")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로 돌아가기
          </Button>
        </div>
      </main>
    </div>
  )
}
