"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import BusinessVerifyBanner from "@/components/BusinessVerifyBanner"
import {
  ChevronRight,
  Bell,
  Plus,
  Home,
  FileText,
  Users,
  ClipboardList,
  X,
  Briefcase,
  CalendarClock,
} from "lucide-react"

type Notification = {
  id: string
  type: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
  metadata?: { jobId?: string; applicationId?: string }
}

type JobPosting = {
  id: string
  companyName: string
  category: string
  dates: string[]
  headcount: number
  status: string
  createdAt: string
  _count: { applications: number }
}

type EmployerApplication = {
  id: string
  status: string // pending | accepted | rejected
  selectedDates: string[]
  createdAt: string
  worker: {
    id: string
    name: string | null
    image: string | null
    phone: string | null
    workerProfile: { experienceLevel?: string | null; skills?: string[] } | null
  }
  job: { id: string; companyName: string; category: string; dates: string[] }
}

const APP_STATUS_META: Record<string, { label: string; color: string }> = {
  pending: { label: "검토중", color: "bg-amber-100 text-amber-700" },
  accepted: { label: "수락", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "거절", color: "bg-red-100 text-red-600" },
}

function timeAgo(dateStr: string): string {
  const diff = Math.max(0, Date.now() - new Date(dateStr).getTime())
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "방금 전"
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]

export default function EmployerDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"home" | "posts" | "applicants">("home")
  const [showPostTypeModal, setShowPostTypeModal] = useState(false)

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const bellRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)

  const [apps, setApps] = useState<EmployerApplication[]>([])
  const [appsLoading, setAppsLoading] = useState(true)
  const [appFilter, setAppFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all")

  const today = new Date()
  const todayStr = `${today.getMonth() + 1}월 ${today.getDate()}일 ${WEEKDAYS[today.getDay()]}요일`
  const hour = today.getHours()
  const greeting = hour < 12 ? "좋은 아침이에요" : hour < 18 ? "안녕하세요" : "수고 많으셨어요"

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      if (!res.ok) return
      const data = await res.json()
      const items: Notification[] = data.notifications ?? []
      setNotifications(items)
      setUnreadCount(items.filter((n) => !n.isRead).length)
    } catch {}
  }, [])

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/employer/jobs")
      if (!res.ok) return
      setJobs(await res.json())
    } catch {}
    finally { setJobsLoading(false) }
  }, [])

  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch("/api/employer/applications")
      if (!res.ok) return
      const data = await res.json()
      setApps(Array.isArray(data) ? data : [])
    } catch {}
    finally { setAppsLoading(false) }
  }, [])

  useEffect(() => {
    fetchNotifications()
    fetchJobs()
    fetchApps()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications, fetchJobs, fetchApps])

  useEffect(() => {
    if (activeTab === "posts") fetchJobs()
    if (activeTab === "applicants") fetchApps()
  }, [activeTab, fetchJobs, fetchApps])

  useEffect(() => {
    if (!showNotifications) return
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) setShowNotifications(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showNotifications])

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
    await fetch("/api/notifications/read-all", { method: "PATCH" }).catch(() => {})
  }

  const handleMarkOneRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    setUnreadCount((c) => Math.max(0, c - 1))
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH" }).catch(() => {})
  }

  const activeJobs = jobs.filter((j) => j.status === "active")

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">

      {/* 공고 유형 선택 모달 */}
      {showPostTypeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPostTypeModal(false)} />
          <div className="relative bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">어떤 인력이 필요하세요?</h2>
              <button onClick={() => setShowPostTypeModal(false)} className="p-1.5 rounded-xl hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => { setShowPostTypeModal(false); router.push("/employer/post?type=daily") }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">일용직 구하기</p>
                  <p className="text-sm text-gray-500 mt-0.5">하루~며칠 단기로 바로 일할 분</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 ml-auto flex-shrink-0" />
              </button>
              <button
                onClick={() => { setShowPostTypeModal(false); router.push("/employer/post?type=trial") }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CalendarClock className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">7일 체험 후 정규직</p>
                  <p className="text-sm text-gray-500 mt-0.5">7일 일해보고 맞으면 정규직 전환</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 ml-auto flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <header className="px-5 pt-8 pb-2 max-w-3xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="font-bold text-gray-900 font-[family-name:var(--font-dm-sans)] tracking-tight">Da-Itda</span>
            </Link>
            <p className="text-sm font-medium text-gray-500">{todayStr}</p>
            <h1 className="text-2xl font-bold mt-1 text-gray-900">
              {greeting},{" "}
              <span className="text-blue-600">{session?.user?.name ?? "사장님"}</span>
            </h1>
          </div>

          <div className="relative">
            <button
              ref={bellRef}
              onClick={() => setShowNotifications((v) => !v)}
              className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="알림"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-sm font-bold leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-14 w-80 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="text-base font-bold text-gray-900">알림</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 min-h-[44px] flex items-center"
                    >
                      모두 읽음
                    </button>
                  )}
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex items-center justify-center py-10">
                      <p className="text-sm text-gray-400">새로운 알림이 없습니다</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((noti) => {
                      const applicationId = noti.metadata?.applicationId
                      const inner = (
                        <div className="flex items-start gap-3">
                          {!noti.isRead && (
                            <span className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-blue-600" />
                          )}
                          <div className={noti.isRead ? "pl-[22px]" : ""}>
                            <p className="text-base font-semibold text-gray-900 leading-snug">{noti.title}</p>
                            <p className="text-sm text-gray-500 mt-0.5 leading-snug">{noti.body}</p>
                            <p className="text-sm text-gray-400 mt-1">{timeAgo(noti.createdAt)}</p>
                            {applicationId && noti.type === "new_application" && (
                              <span className="inline-block mt-1.5 text-sm font-semibold text-blue-600">
                                지원자 확인 →
                              </span>
                            )}
                          </div>
                        </div>
                      )
                      const handleRead = () => { if (!noti.isRead) handleMarkOneRead(noti.id) }

                      return applicationId && noti.type === "new_application" ? (
                        <Link
                          key={noti.id}
                          href={`/employer/applications/${applicationId}`}
                          onClick={handleRead}
                          className="block w-full text-left px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50 last:border-0"
                        >
                          {inner}
                        </Link>
                      ) : (
                        <button
                          key={noti.id}
                          onClick={handleRead}
                          className="w-full text-left px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50 last:border-0"
                        >
                          {inner}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-8 space-y-4 mt-4">

        {/* ── 공고관리 탭 ───────────────────────────────────────── */}
        {activeTab === "posts" && (
          <section>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">내 공고</h2>
                <button
                  onClick={() => setShowPostTypeModal(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  공고등록
                </button>
              </div>
              {jobsLoading ? (
                <div className="py-12 text-center text-sm text-gray-400">불러오는 중...</div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <p className="text-base text-gray-400">등록된 공고가 없습니다</p>
                  <button
                    onClick={() => setShowPostTypeModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white h-12 px-6 rounded-2xl text-base font-semibold"
                  >
                    <Plus className="h-5 w-5" />
                    공고등록
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {jobs.map((job) => (
                    <Link key={job.id} href={`/employer/jobs/${job.id}`}>
                      <div className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-base font-semibold text-gray-900 truncate">
                              {job.companyName} · {job.category}
                            </p>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              job.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                            }`}>
                              {job.status === "active" ? "모집중" : "마감"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {job.dates[0]}{job.dates.length > 1 ? ` 외 ${job.dates.length - 1}일` : ""} · 필요 {job.headcount}명
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <span className={`text-base font-bold ${
                            job._count.applications >= job.headcount ? "text-emerald-600" : "text-amber-600"
                          }`}>
                            지원 {job._count.applications}명
                          </span>
                          <ChevronRight className="h-5 w-5 text-gray-300" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 지원자 관리 탭 ─────────────────────────────────────── */}
        {activeTab === "applicants" && (
          <section>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">지원자 관리</h2>

              {/* 상태 필터 */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {([
                  { key: "all", label: `전체 ${apps.length}` },
                  { key: "pending", label: `검토중 ${apps.filter((a) => a.status === "pending").length}` },
                  { key: "accepted", label: `수락 ${apps.filter((a) => a.status === "accepted").length}` },
                  { key: "rejected", label: `거절 ${apps.filter((a) => a.status === "rejected").length}` },
                ] as const).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setAppFilter(f.key)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                      appFilter === f.key ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {appsLoading ? (
                <div className="py-12 text-center text-sm text-gray-400">불러오는 중...</div>
              ) : (
                (() => {
                  const filtered = appFilter === "all" ? apps : apps.filter((a) => a.status === appFilter)
                  if (filtered.length === 0) {
                    return (
                      <div className="py-12 text-center">
                        <p className="text-base text-gray-400">
                          {appFilter === "all" ? "아직 지원자가 없습니다" : "해당 상태의 지원자가 없습니다"}
                        </p>
                      </div>
                    )
                  }
                  return (
                    <div className="space-y-1">
                      {filtered.map((app) => {
                        const meta = APP_STATUS_META[app.status] ?? APP_STATUS_META.pending
                        return (
                          <Link key={app.id} href={`/employer/applications/${app.id}`}>
                            <div className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <span className="text-blue-700 font-bold text-sm">
                                    {(app.worker.name ?? "?").charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-base font-semibold text-gray-900 truncate">
                                      {app.worker.name ?? "이름 없음"}
                                    </p>
                                    {app.worker.workerProfile?.experienceLevel && (
                                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                        {app.worker.workerProfile.experienceLevel}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 truncate mt-0.5">
                                    {app.job.companyName} · {app.job.category} · {timeAgo(app.createdAt)} 지원
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                                  {meta.label}
                                </span>
                                <ChevronRight className="h-5 w-5 text-gray-300" />
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )
                })()
              )}
            </div>
          </section>
        )}

        {/* ── 홈 탭 ─────────────────────────────────────────────── */}
        {activeTab === "home" && (
          <>
            {/* 사업자 인증 배너 (미인증 시) */}
            <BusinessVerifyBanner />

            {/* 요약 카드 2개 */}
            <section className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab("posts")}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:border-blue-200 active:bg-blue-50 transition-colors w-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">진행중 공고</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-blue-600">{activeJobs.length}</span>
                  <span className="text-base text-gray-500">건</span>
                </div>
                <p className="text-xs text-blue-500 mt-1">탭해서 보기 →</p>
              </button>

              <button
                onClick={() => setActiveTab("applicants")}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:border-amber-200 active:bg-amber-50 transition-colors w-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">검토 대기 지원자</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-amber-600">{apps.filter((a) => a.status === "pending").length}</span>
                  <span className="text-base text-gray-500">명</span>
                </div>
                <p className="text-xs text-amber-500 mt-1">탭해서 보기 →</p>
              </button>
            </section>

            {/* 공고등록 버튼 */}
            <section>
              <Button
                onClick={() => setShowPostTypeModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl text-base font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                공고등록
              </Button>
            </section>

            {/* 최근 알림 */}
            <section>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">최근 알림</h2>
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">알림이 없습니다</p>
                ) : (
                  <div className="space-y-1">
                    {notifications.slice(0, 5).map((noti) => {
                      const applicationId = noti.metadata?.applicationId
                      const content = (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            {!noti.isRead && (
                              <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-blue-600" />
                            )}
                            <div className={noti.isRead ? "pl-[16px]" : ""}>
                              <p className="text-sm font-semibold text-gray-900">{noti.title}</p>
                              <p className="text-sm text-gray-500 mt-0.5 leading-snug">{noti.body}</p>
                              <p className="text-xs text-gray-400 mt-1">{timeAgo(noti.createdAt)}</p>
                            </div>
                          </div>
                          {applicationId && noti.type === "new_application" && (
                            <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0 mt-1" />
                          )}
                        </div>
                      )

                      return applicationId && noti.type === "new_application" ? (
                        <Link
                          key={noti.id}
                          href={`/employer/applications/${applicationId}`}
                          onClick={() => { if (!noti.isRead) handleMarkOneRead(noti.id) }}
                          className="block py-3 px-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                          {content}
                        </Link>
                      ) : (
                        <div key={noti.id} className="py-3 px-2">
                          {content}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* 하단 탭 바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-16 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-around h-full px-4">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-11 ${
              activeTab === "home" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-sm font-medium">홈</span>
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-11 ${
              activeTab === "posts" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">공고관리</span>
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-11 ${
              activeTab === "applicants" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">지원자</span>
            {apps.filter((a) => a.status === "pending").length > 0 && (
              <span className="absolute -top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                {apps.filter((a) => a.status === "pending").length}
              </span>
            )}
          </button>
        </div>
      </nav>
    </div>
  )
}
