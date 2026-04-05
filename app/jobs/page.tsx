"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { MapPin, Clock, Calendar, ChevronDown, Wallet, Loader2, X, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export default function JobsPage() {
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
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="일손매칭" width={28} height={28} className="rounded-lg object-cover" />
            <span className="font-bold text-gray-900">일손매칭</span>
          </Link>
        </div>
      </header>

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
            <Link href="/employer/post" className="text-sm font-bold text-blue-600 flex items-center gap-1">
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
            <div className="px-4 flex justify-center">
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
                modifiers={{
                  hasJob: availableDateObjects,
                }}
                modifiersClassNames={{
                  hasJob: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-blue-600",
                }}
                className="w-full"
              />
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
    </div>
  )
}
