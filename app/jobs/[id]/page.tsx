"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Wallet,
  Users,
  Loader2,
  BadgeCheck,
  Car,
  CheckCircle2,
  Backpack,
  Dumbbell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import { toast } from "sonner"

interface JobDetail {
  id: string
  category: string
  companyName: string
  location: string
  dates: string[]
  startTime: string
  endTime: string
  headcount: number
  payType: string
  payAmount: number
  instantPay: boolean
  pickup: boolean
  description?: string | null
  tasks: string[]
  requirements?: {
    skills?: string[]
    items?: string[]
    physical?: string[]
    ageRange?: string
    customSkills?: string[]
    customItems?: string[]
  } | null
  createdAt: string
  employer: { name: string | null; businessVerified: boolean }
  _count: { applications: number }
  alreadyApplied: boolean
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

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [applyDates, setApplyDates] = useState<Set<string>>(new Set())
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(r => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((data: JobDetail) => {
        setJob(data)
        setApplied(data.alreadyApplied)
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [id])

  const openApplyDrawer = () => {
    if (!session) {
      window.location.href = `/auth/login?callbackUrl=/jobs/${id}`
      return
    }
    if (!job) return
    setApplyDates(new Set(job.dates))
    setDrawerOpen(true)
  }

  const toggleApplyDate = (date: string) => {
    setApplyDates(prev => {
      const next = new Set(prev)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })
  }

  const handleApply = async () => {
    if (!job) return
    setApplying(true)
    const res = await fetch(`/api/jobs/${job.id}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedDates: [...applyDates].sort() }),
    })
    if (res.ok) {
      setApplied(true)
      setDrawerOpen(false)
      toast.success("지원 완료!", {
        description: "사장님이 확인하면 알림으로 알려드릴게요",
      })
    } else {
      const data = await res.json()
      toast.error(data.error ?? "오류가 발생했습니다")
    }
    setApplying(false)
  }

  const isEmployer = session?.user?.role === "employer"

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg font-medium text-gray-600">존재하지 않거나 마감된 공고입니다</p>
        <Button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-500 text-white h-11 rounded-2xl px-6 text-sm font-semibold"
        >
          공고 목록으로
        </Button>
      </div>
    )
  }

  const requirements = job.requirements
  const preferredSkills = requirements?.skills?.filter(s => s !== "초보 가능") ?? []
  const beginnerOk = requirements?.skills?.includes("초보 가능")

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="-ml-1 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <span className="font-bold text-gray-900">공고 상세</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32 space-y-4">
        {/* 회사 정보 */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">일손</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">{job.category}</p>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-bold text-gray-900">{job.companyName}</h1>
                  {job.employer.businessVerified && (
                    <BadgeCheck className="h-4.5 w-4.5 text-blue-500" aria-label="사업자 인증" />
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 flex-shrink-0">{timeAgo(job.createdAt)}</p>
          </div>

          <div className="flex items-center gap-3 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {job.headcount}명 모집 · 지원 {job._count.applications}명
            </span>
          </div>

          {(job.instantPay || job.pickup) && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.instantPay && (
                <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                  당일지급보장
                </span>
              )}
              {job.pickup && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  <Car className="h-3.5 w-3.5" />
                  픽업제공
                </span>
              )}
            </div>
          )}
        </section>

        {/* 근무 조건 */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">근무 조건</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Wallet className="h-4 w-4 text-gray-400" />
                급여
              </span>
              <span className="text-base font-bold text-blue-600">
                {job.payType === "daily" ? "일급" : "시급"} {job.payAmount.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4 text-gray-400" />
                근무시간
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {job.startTime} ~ {job.endTime}
              </span>
            </div>
            <div>
              <span className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <CheckCircle2 className="h-4 w-4 text-gray-400" />
                근무날짜 <span className="text-gray-400">({job.dates.length}일)</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[...job.dates].sort().map(date => (
                  <span
                    key={date}
                    className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg"
                  >
                    {format(parseISO(date), "M/d (EEE)", { locale: ko })}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 하는 일 */}
        {job.tasks.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-900 mb-3">하는 일</h2>
            <div className="flex flex-wrap gap-1.5">
              {job.tasks.map(task => (
                <span key={task} className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium">
                  {task}
                </span>
              ))}
            </div>
            {job.description && (
              <p className="text-sm text-gray-600 leading-relaxed mt-4 whitespace-pre-wrap">
                {job.description}
              </p>
            )}
          </section>
        )}

        {/* 지원 자격 · 준비물 */}
        {requirements && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">지원 자격 · 준비물</h2>
            <div className="space-y-3">
              {beginnerOk && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-emerald-700">초보자도 지원 가능해요</span>
                </div>
              )}
              {preferredSkills.length > 0 && (
                <div className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">우대사항</span> · {preferredSkills.join(", ")}
                  </div>
                </div>
              )}
              {requirements.items && requirements.items.length > 0 && (
                <div className="flex items-start gap-2">
                  <Backpack className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">준비물</span> · {requirements.items.join(", ")}
                  </div>
                </div>
              )}
              {requirements.physical && requirements.physical.length > 0 && (
                <div className="flex items-start gap-2">
                  <Dumbbell className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">참고사항</span> · {requirements.physical.join(", ")}
                  </div>
                </div>
              )}
              {requirements.ageRange && (
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">모집 연령</span> · {requirements.ageRange}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 근무지 */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">근무지</h2>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="h-4 w-4 text-gray-400" />
            {job.location}
          </div>
          {job.pickup && (
            <p className="text-sm text-blue-600 mt-2 flex items-center gap-1.5">
              <Car className="h-4 w-4" />
              픽업 차량이 제공되는 사업장이에요
            </p>
          )}
        </section>
      </main>

      {/* 하단 고정 지원 버튼 */}
      {!isEmployer && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-3">
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-400">
                {job.payType === "daily" ? "일급" : "시급"}
              </p>
              <p className="text-lg font-bold text-blue-600 leading-tight">
                {job.payAmount.toLocaleString()}원
              </p>
            </div>
            <Button
              onClick={openApplyDrawer}
              disabled={applied || applying}
              className={`flex-1 h-13 py-3.5 rounded-2xl text-base font-semibold ${
                applied ? "bg-gray-100 text-gray-400" : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {applied ? "지원완료" : "지원하기"}
            </Button>
          </div>
        </div>
      )}

      {/* 지원 확인 바텀시트 */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="bg-white">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-lg font-bold text-gray-900">
              {job.companyName}에 지원하기
            </DrawerTitle>
            <DrawerDescription className="text-sm text-gray-500 mt-1">
              일할 수 있는 날짜를 확인해주세요. 못 가는 날은 눌러서 빼면 돼요.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-2 overflow-y-auto">
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                {job.startTime} ~ {job.endTime}
                <span className="font-semibold text-blue-600 ml-1">
                  {job.payType === "daily" ? "일급" : "시급"} {job.payAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[...job.dates].sort().map(date => {
                const selected = applyDates.has(date)
                return (
                  <button
                    key={date}
                    onClick={() => toggleApplyDate(date)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-400"
                    }`}
                  >
                    {format(parseISO(date), "M/d (EEE)", { locale: ko })}
                  </button>
                )
              })}
            </div>
            {applyDates.size === 0 && (
              <p className="text-sm text-red-500 mt-3">최소 1일 이상 선택해주세요</p>
            )}
          </div>

          <DrawerFooter>
            <Button
              onClick={handleApply}
              disabled={applyDates.size === 0 || applying}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-base font-semibold disabled:opacity-50"
            >
              {applying ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                `${applyDates.size}일 근무 가능으로 지원하기`
              )}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
