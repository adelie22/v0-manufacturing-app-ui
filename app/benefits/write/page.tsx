"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const CATEGORIES = ["지원금", "교육", "보험", "세금", "기타"]

export default function BenefitWritePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    source: "",
    sourceUrl: "",
    category: "지원금",
  })

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!session) {
    router.replace("/auth/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("제목과 내용을 입력해주세요.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/benefits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "등록에 실패했습니다.")
        return
      }

      const post = await res.json()
      toast.success("혜택 정보가 등록되었습니다!")
      router.push(`/benefits/${post.id}`)
    } catch {
      toast.error("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">뒤로</span>
          </button>
          <span className="text-lg font-bold text-gray-900">혜택 정보 등록</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base">카테고리</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger id="category" className="w-full sm:w-48 h-14">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              제목 <span className="text-red-600">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="예: 2024년 중소기업 고용지원금 신청 방법"
              maxLength={100}
              className="h-14"
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-base">
              한줄 요약 <span className="text-gray-500 text-sm">(선택)</span>
            </Label>
            <Input
              id="summary"
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              placeholder="카드에 표시될 짧은 설명"
              maxLength={150}
              className="h-14"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base">
              내용 <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="혜택 내용, 신청 방법, 대상 등 자세한 내용을 입력해주세요."
              className="min-h-[280px] resize-y"
            />
          </div>

          {/* Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source" className="text-base">
                출처 <span className="text-gray-500 text-sm">(선택)</span>
              </Label>
              <Input
                id="source"
                value={form.source}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                placeholder="예: 고용노동부, 중소벤처기업부"
                maxLength={50}
                className="h-14"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceUrl" className="text-base">
                원문 링크 <span className="text-gray-500 text-sm">(선택)</span>
              </Label>
              <Input
                id="sourceUrl"
                type="url"
                value={form.sourceUrl}
                onChange={(e) => setForm((f) => ({ ...f, sourceUrl: e.target.value }))}
                placeholder="https://..."
                className="h-14"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 sm:flex-none sm:w-24 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 border-0 font-semibold"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none sm:w-36 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white gap-2 text-base font-semibold"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              등록하기
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
