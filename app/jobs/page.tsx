"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { MapPin, Clock, Calendar, ChevronDown, Wallet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const REGIONS = ["전체", "서울", "경기", "인천", "부산", "대구", "대전", "광주", "충북", "충남", "경북", "경남", "전북", "전남"]

interface Job {
  id: string
  category: string
  companyName: string
  location: string
  date: string
  startTime: string
  endTime: string
  headcount: number
  payType: string
  payAmount: number
  instantPay: boolean
  pickup: boolean
  tasks: string[]
  createdAt: string
  _count: { applications: number }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return "방금 전"
  if (min < 60) return `${min}분 전`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전`
  return `${Math.floor(hr / 24)}일 전`
}

export default function JobsPage() {
  const { data: session } = useSession()
  const [region, setRegion] = useState("전체")
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLoading(true)
    const params = region !== "전체" ? `?region=${region}` : ""
    fetch(`/api/jobs${params}`)
      .then(r => r.json())
      .then(data => { setJobs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [region])

  const handleApply = async (jobId: string) => {
    if (!session) {
      window.location.href = `/auth/login?callbackUrl=/jobs`
      return
    }
    setApplying(jobId)
    const res = await fetch(`/api/jobs/${jobId}/apply`, { method: "POST" })
    if (res.ok) {
      setAppliedIds(prev => new Set([...prev, jobId]))
    } else {
      const data = await res.json()
      alert(data.error ?? "오류가 발생했습니다")
    }
    setApplying(null)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="일손매칭" width={28} height={28} className="rounded-lg object-cover" />
            <span className="font-bold text-gray-900">일손매칭</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">근무를 원하는 지역을 선택해보세요</h1>

        {/* 지역 필터 */}
        <div className="relative mb-6">
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* 공고 없음 */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium mb-2">등록된 공고가 없습니다</p>
            <p className="text-sm">다른 지역을 선택하거나 나중에 다시 확인해보세요</p>
          </div>
        )}

        {/* 공고 목록 */}
        <div className="grid sm:grid-cols-2 gap-3">
          {jobs.map(job => {
            const applied = appliedIds.has(job.id)
            const isWorker = session?.user?.role === "worker"
            return (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                {/* 상단 */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">일손</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{job.category}</p>
                      <p className="font-semibold text-gray-900 text-sm">{job.companyName}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-400">{timeAgo(job.createdAt)}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location.split(" ").slice(-1)[0]}</span>
                    </div>
                  </div>
                </div>

                {/* 날짜/시간/급여 */}
                <div className="space-y-1.5 mt-3 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    <span>{job.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    <span>{job.startTime} ~ {job.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Wallet className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-blue-600">
                      {job.payType === "daily" ? "일급" : "시급"} {job.payAmount.toLocaleString()}원
                    </span>
                    {job.instantPay && (
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                        당일지급보장
                      </span>
                    )}
                  </div>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {job.tasks.map(tag => (
                    <span key={tag} className="text-sm bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{tag}</span>
                  ))}
                  {job.pickup && (
                    <span className="text-sm bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">픽업제공</span>
                  )}
                </div>

                {/* 지원 버튼 (구직자만) */}
                {isWorker && (
                  <Button
                    onClick={() => handleApply(job.id)}
                    disabled={applied || applying === job.id}
                    className={`w-full h-11 rounded-2xl text-sm font-semibold ${applied ? "bg-gray-100 text-gray-400" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
                  >
                    {applying === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : applied ? "지원완료" : "지원하기"}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* 사장님 플로팅 CTA */}
      {session?.user?.role !== "employer" && (
        <div className="fixed bottom-6 right-4 z-40">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-4 py-3">
            <p className="text-sm text-gray-500">사장님이신가요?</p>
            <Link href="/employer/post" className="text-sm font-bold text-blue-600 flex items-center gap-1">
              무료로 채용 시작하기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
