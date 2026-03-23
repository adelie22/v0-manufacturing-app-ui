"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Gift,
  Search,
  PlusCircle,
  ChevronRight,
  ExternalLink,
  Tag,
  Calendar,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const CATEGORIES = ["전체", "지원금", "교육", "보험", "세금", "기타"]

interface BenefitPost {
  id: string
  title: string
  summary: string | null
  source: string | null
  category: string
  createdAt: string
}

export default function BenefitsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<BenefitPost[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("전체")
  const [search, setSearch] = useState("")

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (category !== "전체") params.set("category", category)
      const res = await fetch(`/api/benefits?${params}`)
      const data = await res.json()
      setPosts(data.posts)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }, [page, category])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const filtered = search.trim()
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.summary ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : posts

  const totalPages = Math.ceil(total / 12)

  const categoryColors: Record<string, string> = {
    지원금: "bg-emerald-100 text-emerald-700",
    교육: "bg-blue-100 text-blue-700",
    보험: "bg-purple-100 text-purple-700",
    세금: "bg-orange-100 text-orange-700",
    기타: "bg-gray-100 text-gray-600",
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Gift className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">중소기업 지원혜택 모아보기</span>
          </div>
          {session && (
            <div className="ml-auto">
              <Button
                size="sm"
                onClick={() => router.push("/benefits/write")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                글쓰기
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <Gift className="h-4 w-4" />
            중소기업 사장님을 위한 혜택 정보
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            각종 지원혜택 모아보기
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            정부 지원금, 고용보험, 세금 혜택 등 중소기업 사장님께 필요한 정보를 한곳에서 확인하세요.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="혜택 정보 검색..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat)
                setPage(1)
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-white text-muted-foreground border border-border hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">아직 등록된 혜택 정보가 없어요</p>
            <p className="text-muted-foreground text-sm mb-6">
              유용한 중소기업 지원혜택 정보를 공유해보세요!
            </p>
            {session && (
              <Button
                onClick={() => router.push("/benefits/write")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                첫 번째 정보 올리기
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((post) => (
              <Link key={post.id} href={`/benefits/${post.id}`}>
                <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-border/60 group">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          categoryColors[post.category] ?? categoryColors["기타"]
                        }`}
                      >
                        {post.category}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>
                    {post.summary && (
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 flex-1">
                        {post.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                      {post.source && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {post.source}
                        </span>
                      )}
                      <span className="flex items-center gap-1 ml-auto">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              이전
            </Button>
            <span className="flex items-center text-sm text-muted-foreground px-3">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
