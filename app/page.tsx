"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { MapPin, Clock, Calendar, ChevronDown, Wallet, Loader2, X, CalendarDays, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/SiteHeader"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { format, parseISO, eachDayOfInterval, isSameDay } from "date-fns"
import { ko } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { toast } from "sonner"

const REGIONS = ["전체", "서울", "경기", "인천", "부산", "대구", "대전", "광주", "충북", "충남", "경북", "경남", "전북", "전남"]

interface Job {
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
  _count: { applications: number }
}

function formatJobDates(dates: string[]): string {
  if (!dates || dates.length === 0) return ""
  const sorted = [...dates].sort()
  const parsed = sorted.map(d => parseISO(d))

  // Check if dates are consecutive
  const isConsecutive = parsed.every((date, i) => {
    if (i === 0) return true
    const prev = parsed[i - 1]
    const diffMs = date.getTime() - prev.getTime()
    return Math.round(diffMs / (1000 * 60 * 60 * 24)) === 1
  })

  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`

  if (parsed.length === 1) {
    return fmt(parsed[0])
  }

  if (isConsecutive) {
    return `${fmt(parsed[0])} ~ ${fmt(parsed[parsed.length - 1])}`
  }

  // Non-consecutive: show up to 3, then "외 N일"
  if (parsed.length <= 3) {
    return parsed.map(fmt).join(", ")
  }
  return `${parsed.slice(0, 2).map(fmt).join(", ")} 외 ${parsed.length - 2}일`
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

function formatDateLabel(start: Date, end: Date | undefined) {
  const s = format(start, "M월 d일", { locale: ko })
  if (!end || isSameDay(start, end)) return s
  const e = format(end, "M월 d일", { locale: ko })
  return `${s} ~ ${e}`
}

export default function HomePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [region, setRegion] = useState("전체")
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())

  // 날짜 필터 상태
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(undefined)

  const hasDateFilter = !!dateRange?.from

  // 공고 있는 날짜 조회
  useEffect(() => {
    const params = region !== "전체" ? `?region=${region}` : ""
    fetch(`/api/jobs/available-dates${params}`)
      .then(r => r.json())
      .then(data => setAvailableDates(data.dates ?? []))
      .catch(() => {})
  }, [region])

  // 공고 목록 조회
  const fetchJobs = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (region !== "전체") params.set("region", region)
    if (dateRange?.from) {
      params.set("startDate", format(dateRange.from, "yyyy-MM-dd"))
      params.set("endDate", format(dateRange.to ?? dateRange.from, "yyyy-MM-dd"))
    }
    const qs = params.toString()
    fetch(`/api/jobs${qs ? `?${qs}` : ""}`)
      .then(r => r.json())
      .then(data => { setJobs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [region, dateRange])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  // 지원 확인 드로어
  const [applyTarget, setApplyTarget] = useState<Job | null>(null)
  const [applyDates, setApplyDates] = useState<Set<string>>(new Set())

  const openApplyDrawer = (job: Job) => {
    if (!session) {
      window.location.href = `/auth/login?callbackUrl=/`
      return
    }
    setApplyTarget(job)
    setApplyDates(new Set(job.dates)) // 기본: 전체 날짜 가능
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
    if (!applyTarget) return
    const jobId = applyTarget.id
    setApplying(jobId)
    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedDates: [...applyDates].sort() }),
    })
    if (res.ok) {
      setAppliedIds(prev => new Set([...prev, jobId]))
      setApplyTarget(null)
      toast.success("지원 완료!", {
        description: "사장님이 확인하면 알림으로 알려드릴게요",
      })
    } else {
      const data = await res.json()
      toast.error(data.error ?? "오류가 발생했습니다")
    }
    setApplying(null)
  }

  const clearDateFilter = () => {
    setDateRange(undefined)
    setTempDateRange(undefined)
  }

  const handleOpenDrawer = () => {
    setTempDateRange(dateRange)
    setIsDrawerOpen(true)
  }

  const handleApplyDate = () => {
    setDateRange(tempDateRange)
    setIsDrawerOpen(false)
  }

  // 공고 있는 날짜에 dot 표시를 위한 modifiers
  const availableDateObjects = availableDates.map(d => parseISO(d))

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <SiteHeader />

      {/* 트라이얼 채용 소개 스트립 */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-white font-bold text-base sm:text-lg leading-snug">
                면접 대신, <span className="text-blue-400">3일 일해보고 결정하세요</span>
              </p>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                지원 · 매칭 → 3~7일 근무 → 서로 맞으면 정규직 전환
              </p>
            </div>
            <Link
              href="/business"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300 shrink-0"
            >
              트라이얼 채용 알아보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
        <h1 className="text-xl font-bold text-gray-900 mb-4">지역과 날짜를 선택해서 일을 찾아보세요</h1>

        {/* 필터 바 */}
        <div className="flex gap-2 mb-4">
          {/* 지역 필터 */}
          <div className="relative flex-1">
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {REGIONS.map(r => <option key={r}>{r}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* 날짜 필터 버튼 */}
          <button
            onClick={handleOpenDrawer}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors whitespace-nowrap ${
              hasDateFilter
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            {hasDateFilter
              ? formatDateLabel(dateRange!.from!, dateRange?.to)
              : "날짜 선택"}
          </button>
        </div>

        {/* 활성 필터 칩 */}
        {hasDateFilter && (
          <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-2 text-sm font-medium">
              <CalendarDays className="h-4 w-4" />
              {formatDateLabel(dateRange!.from!, dateRange?.to)} 근무 공고 {jobs.length}건
              <button onClick={clearDateFilter} className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* 공고 없음 */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            {hasDateFilter ? (
              <>
                <p className="text-lg font-medium mb-2 text-gray-600">
                  {formatDateLabel(dateRange!.from!, dateRange?.to)}에 {region !== "전체" ? `[${region}]` : ""} 공고가 없어요
                </p>
                <p className="text-sm mb-6">날짜를 변경하거나 지역을 바꿔보세요</p>
                <Button
                  onClick={handleOpenDrawer}
                  className="bg-blue-600 hover:bg-blue-500 text-white h-11 rounded-2xl px-6 text-sm font-semibold"
                >
                  날짜 다시 선택하기
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">등록된 공고가 없습니다</p>
                <p className="text-sm">다른 지역을 선택하거나 나중에 다시 확인해보세요</p>
              </>
            )}
          </div>
        )}

        {/* 공고 목록 */}
        <div className="grid sm:grid-cols-2 gap-3">
          {jobs.map(job => {
            const applied = appliedIds.has(job.id)
            return (
              <div
                key={job.id}
                onClick={() => router.push(`/jobs/${job.id}`)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
              >
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
                    <span>{formatJobDates(job.dates)}</span>
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
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {job.tasks.map(tag => (
                    <span key={tag} className="text-sm bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{tag}</span>
                  ))}
                  {job.pickup && (
                    <span className="text-sm bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">픽업제공</span>
                  )}
                </div>

                {/* 요구사항 요약 */}
                {job.requirements && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {job.requirements.skills?.includes("초보 가능") && (
                      <span className="text-sm font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg">초보가능</span>
                    )}
                    {(job.requirements.items && job.requirements.items.length > 0) && (
                      <span className="text-sm bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg">
                        준비: {job.requirements.items.slice(0, 2).join(", ")}{job.requirements.items.length > 2 ? ` 외 ${job.requirements.items.length - 2}` : ""}
                      </span>
                    )}
                    {(job.requirements.skills && job.requirements.skills.filter(s => s !== "초보 가능").length > 0) && (
                      <span className="text-sm bg-violet-50 text-violet-700 px-2.5 py-1 rounded-lg">
                        우대: {job.requirements.skills.filter(s => s !== "초보 가능").slice(0, 2).join(", ")}
                      </span>
                    )}
                  </div>
                )}

                {/* 지원 버튼 (비로그인 포함, 사장님 제외) */}
                {session?.user?.role !== "employer" && (
                  <Button
                    onClick={(e) => { e.stopPropagation(); openApplyDrawer(job) }}
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

      {/* 날짜 선택 플로팅 버튼 (하단 중앙) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={handleOpenDrawer}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-full shadow-lg text-sm font-semibold transition-all duration-200 ${
            hasDateFilter
              ? "bg-blue-600 text-white"
              : "bg-gray-900 text-white"
          }`}
        >
          <CalendarDays className="h-5 w-5" />
          {hasDateFilter
            ? <>{formatDateLabel(dateRange!.from!, dateRange?.to)} 근무 공고<button onClick={(e) => { e.stopPropagation(); clearDateFilter() }} className="ml-2 hover:bg-white/20 rounded-full p-0.5"><X className="h-4 w-4" /></button></>
            : "일하고 싶은 날짜를 선택하세요"
          }
        </button>
      </div>

      {/* 사장님 플로팅 CTA (우하단) */}
      {session?.user?.role !== "employer" && (
        <div className="fixed bottom-6 right-4 z-40">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-4 py-3">
            <p className="text-sm text-gray-500">사장님이신가요?</p>
            <Link href="/business" className="text-sm font-bold text-blue-600 flex items-center gap-1">
              무료로 채용 시작하기 →
            </Link>
          </div>
        </div>
      )}

      {/* 날짜 선택 바텀시트 */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-white">
          <DrawerHeader className="text-left">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-lg font-bold text-gray-900">일하고 싶은 날짜를 선택하세요</DrawerTitle>
                <DrawerDescription className="text-sm text-gray-500 mt-1">
                  날짜 범위를 선택할 수 있어요 (최대 5일)
                </DrawerDescription>
              </div>
              {tempDateRange?.from && (
                <button
                  onClick={() => setTempDateRange(undefined)}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  초기화
                </button>
              )}
            </div>
          </DrawerHeader>

          <div className="overflow-y-auto flex-1">
            <div className="px-5">
              <CalendarUI
                mode="range"
                selected={tempDateRange}
                onSelect={(range) => {
                  // 최대 5일 제한
                  if (range?.from && range?.to) {
                    const days = eachDayOfInterval({ start: range.from, end: range.to })
                    if (days.length > 5) return
                  }
                  setTempDateRange(range)
                }}
                locale={ko}
                disabled={{ before: new Date() }}
                showOutsideDays={false}
                formatters={{
                  formatCaption: (date) => format(date, "yyyy년 M월", { locale: ko }),
                }}
                modifiers={{
                  hasJob: availableDateObjects,
                }}
                modifiersClassNames={{
                  hasJob: "relative after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-blue-500 data-[selected=true]:after:bg-white",
                }}
                className="w-full max-w-sm mx-auto p-0 py-2 [--cell-size:2.9rem] bg-transparent"
                classNames={{
                  root: "w-full",
                  months: "w-full",
                  month: "w-full gap-3",
                  month_caption: "h-11 justify-center",
                  caption_label: "text-base font-bold text-gray-900",
                  nav: "h-11",
                  button_previous: "size-11 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                  button_next: "size-11 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                  weekdays: "flex mt-2",
                  weekday: "flex-1 text-xs font-semibold text-gray-400 pb-1 first:text-red-400 last:text-sky-500",
                  week: "flex w-full mt-1",
                  range_start: "rounded-l-full bg-blue-50",
                  range_middle: "rounded-none bg-blue-50",
                  range_end: "rounded-r-full bg-blue-50",
                  today: "[&_button]:font-bold",
                  disabled: "text-gray-300 opacity-40",
                  day_button:
                    "rounded-full text-[0.9rem] font-medium text-gray-700 hover:bg-gray-100 " +
                    "data-[selected-single=true]:bg-blue-600 data-[selected-single=true]:text-white " +
                    "data-[range-start=true]:bg-blue-600 data-[range-start=true]:text-white data-[range-start=true]:rounded-full data-[range-start=true]:shadow-md data-[range-start=true]:shadow-blue-200 " +
                    "data-[range-end=true]:bg-blue-600 data-[range-end=true]:text-white data-[range-end=true]:rounded-full data-[range-end=true]:shadow-md data-[range-end=true]:shadow-blue-200 " +
                    "data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-blue-700 data-[range-middle=true]:font-semibold",
                }}
              />
              <div className="max-w-sm mx-auto flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                <span className="inline-block h-1 w-1 rounded-full bg-blue-500" />
                점이 있는 날짜에 공고가 있어요
              </div>
            </div>

            {/* 선택된 날짜 표시 */}
            {tempDateRange?.from && (
              <div className="px-4 mt-2">
                <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-700 font-medium text-center">
                  선택: {formatDateLabel(tempDateRange.from, tempDateRange.to)}
                  {tempDateRange.to && !isSameDay(tempDateRange.from, tempDateRange.to) && (
                    <span className="text-blue-500 ml-1">
                      ({eachDayOfInterval({ start: tempDateRange.from, end: tempDateRange.to }).length}일)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <DrawerFooter>
            <Button
              onClick={handleApplyDate}
              disabled={!tempDateRange?.from}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-base font-semibold disabled:opacity-50"
            >
              {tempDateRange?.from
                ? `이 날짜로 공고 보기`
                : "날짜를 선택해주세요"
              }
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* 지원 확인 바텀시트 */}
      <Drawer open={!!applyTarget} onOpenChange={(open) => { if (!open) setApplyTarget(null) }}>
        <DrawerContent className="bg-white">
          {applyTarget && (
            <>
              <DrawerHeader className="text-left">
                <DrawerTitle className="text-lg font-bold text-gray-900">
                  {applyTarget.companyName}에 지원하기
                </DrawerTitle>
                <DrawerDescription className="text-sm text-gray-500 mt-1">
                  일할 수 있는 날짜를 확인해주세요. 못 가는 날은 눌러서 빼면 돼요.
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 pb-2 overflow-y-auto">
                {/* 공고 요약 */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    {applyTarget.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    {applyTarget.startTime} ~ {applyTarget.endTime}
                    <span className="font-semibold text-blue-600 ml-1">
                      {applyTarget.payType === "daily" ? "일급" : "시급"} {applyTarget.payAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                {/* 날짜 토글 */}
                <div className="flex flex-wrap gap-2">
                  {[...applyTarget.dates].sort().map(date => {
                    const selected = applyDates.has(date)
                    const d = parseISO(date)
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
                        {format(d, "M/d (EEE)", { locale: ko })}
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
                  disabled={applyDates.size === 0 || applying === applyTarget.id}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-base font-semibold disabled:opacity-50"
                >
                  {applying === applyTarget.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    `${applyDates.size}일 근무 가능으로 지원하기`
                  )}
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}
