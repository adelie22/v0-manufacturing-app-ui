"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Clock,
  Wallet,
  ChevronRight,
  Search,
  User,
  Home,
  Bell,
  FileText,
  LogOut,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react"

type Notification = {
  id: string
  type: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
}

type Application = {
  id: string
  status: string // pending | accepted | rejected
  selectedDates: string[]
  createdAt: string
  job: {
    id: string
    companyName: string
    category: string
    location: string
    dates: string[]
    startTime: string
    endTime: string
    payType: string
    payAmount: number
    status: string
  }
}

const APP_STATUS: Record<string, { label: string; color: string; icon: typeof Hourglass }> = {
  pending: { label: "검토중", color: "bg-amber-100 text-amber-700", icon: Hourglass },
  accepted: { label: "합격", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  rejected: { label: "미선발", color: "bg-gray-100 text-gray-500", icon: XCircle },
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

function formatDates(dates: string[]): string {
  if (!dates || dates.length === 0) return ""
  const sorted = [...dates].sort()
  const fmt = (d: string) => {
    const [, m, day] = d.split("-")
    return `${Number(m)}/${Number(day)}`
  }
  if (sorted.length === 1) return fmt(sorted[0])
  return `${fmt(sorted[0])} ~ ${fmt(sorted[sorted.length - 1])} (${sorted.length}일)`
}

type TabId = "home" | "profile"

export default function WorkerDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<TabId>("home")

  const [applications, setApplications] = useState<Application[]>([])
  const [appsLoading, setAppsLoading] = useState(true)

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const bellRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const displayName = session?.user?.name ?? "회원"

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

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/worker/applications")
      if (!res.ok) return
      const data = await res.json()
      setApplications(Array.isArray(data) ? data : [])
    } catch {}
    finally { setAppsLoading(false) }
  }, [])

  useEffect(() => {
    fetchNotifications()
    fetchApplications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications, fetchApplications])

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

  const pendingCount = applications.filter((a) => a.status === "pending").length
  const acceptedCount = applications.filter((a) => a.status === "accepted").length

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* 헤더 */}
      <header className="px-5 pt-8 pb-2 max-w-3xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="font-bold text-gray-900 font-[family-name:var(--font-dm-sans)] tracking-tight">Da-Itda</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              안녕하세요, <span className="text-blue-600">{displayName}</span>님
            </h1>
          </div>

          {/* 알림 벨 */}
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
                    notifications.slice(0, 10).map((noti) => (
                      <button
                        key={noti.id}
                        onClick={() => { if (!noti.isRead) handleMarkOneRead(noti.id) }}
                        className="w-full text-left px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          {!noti.isRead && (
                            <span className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-blue-600" />
                          )}
                          <div className={noti.isRead ? "pl-[22px]" : ""}>
                            <p className="text-base font-semibold text-gray-900 leading-snug">{noti.title}</p>
                            <p className="text-sm text-gray-500 mt-0.5 leading-snug">{noti.body}</p>
                            <p className="text-sm text-gray-400 mt-1">{timeAgo(noti.createdAt)}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-8 space-y-4 mt-4">
        {activeTab === "home" && (
          <>
            {/* 지원 현황 요약 */}
            <section className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Hourglass className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">검토중</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-amber-600">{pendingCount}</span>
                  <span className="text-base text-gray-500">건</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">합격</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-emerald-600">{acceptedCount}</span>
                  <span className="text-base text-gray-500">건</span>
                </div>
              </div>
            </section>

            {/* 일자리 찾기 CTA */}
            <section>
              <Link href="/">
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl text-base font-semibold">
                  <Search className="h-5 w-5 mr-2" />
                  일자리 찾아보기
                </Button>
              </Link>
            </section>

            {/* 내 지원 내역 */}
            <section>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">내 지원 내역</h2>
                {appsLoading ? (
                  <div className="py-12 text-center text-sm text-gray-400">불러오는 중...</div>
                ) : applications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <p className="text-base text-gray-400">아직 지원한 공고가 없습니다</p>
                    <Link href="/">
                      <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white h-12 px-6 rounded-2xl text-base font-semibold">
                        <Search className="h-5 w-5" />
                        일자리 찾아보기
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => {
                      const st = APP_STATUS[app.status] ?? APP_STATUS.pending
                      const dates = app.selectedDates.length > 0 ? app.selectedDates : app.job.dates
                      return (
                        <div key={app.id} className="border border-gray-100 rounded-2xl p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm text-gray-400">{app.job.category}</p>
                              <p className="text-base font-bold text-gray-900">{app.job.companyName}</p>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${st.color}`}>
                              {st.label}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                              {app.job.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CalendarDays className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                              {formatDates(dates)}
                              <Clock className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 ml-1" />
                              {app.job.startTime} ~ {app.job.endTime}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Wallet className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                              <span className="font-semibold text-blue-600">
                                {app.job.payType === "daily" ? "일급" : "시급"} {app.job.payAmount.toLocaleString()}원
                              </span>
                            </div>
                          </div>
                          {app.status === "accepted" && (
                            <div className="mt-3 bg-emerald-50 rounded-xl px-3 py-2.5 text-sm text-emerald-700 font-medium">
                              🎉 합격했어요! 사장님 연락을 기다려주세요
                            </div>
                          )}
                          <p className="text-xs text-gray-400 mt-2">{timeAgo(app.createdAt)} 지원</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === "profile" && (
          <>
            {/* 프로필 카드 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {session?.user?.image && <AvatarImage src={session.user.image} />}
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
                  <p className="text-sm text-gray-500 truncate">{session?.user?.email ?? ""}</p>
                </div>
              </div>
            </div>

            {/* 메뉴 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <Link
                href="/worker/profile"
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-base text-gray-900">내 이력서 관리</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                href="/"
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors min-h-[44px] border-t border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-gray-500" />
                  <span className="text-base text-gray-900">일자리 찾기</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>

            {/* 로그아웃 */}
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 h-14 rounded-2xl text-base font-semibold border-0"
            >
              <LogOut className="h-5 w-5 mr-2" />
              로그아웃
            </Button>
          </>
        )}
      </main>

      {/* 하단 탭 바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-16 z-50 pb-[env(safe-area-inset-bottom)]">
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
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-11 text-gray-400"
          >
            <Search className="h-5 w-5" />
            <span className="text-sm font-medium">일자리찾기</span>
          </Link>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-11 ${
              activeTab === "profile" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">내 정보</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
