"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Users,
  Banknote,
  ChevronRight,
  UserCheck,
  UserX,
  Bell,
  Plus,
  Home,
  FileText,

} from "lucide-react"

// ─── Mock data ────────────────────────────────────────────────
const todayWorkers = [
  { id: 1, name: "김민수", status: "출근", time: "08:02" },
  { id: 2, name: "이영희", status: "출근", time: "08:15" },
  { id: 3, name: "박철수", status: "출근", time: "07:58" },
  { id: 4, name: "정지은", status: "결근", time: null },
  { id: 5, name: "최동현", status: "출근", time: "08:30" },
]

const activePostings = [
  { id: 1, title: "단순 조립 작업", applicants: 8, needed: 5, date: "오늘" },
  { id: 3, title: "물류 이동 보조", applicants: 2, needed: 4, date: "3/25" },
]

// ─── 계산 ──────────────────────────────────────────────────────
const DAILY_WAGE = 130000
const todayDate = new Date()
const attendedWorkers = todayWorkers.filter((w) => w.status === "출근")
const absentWorkers = todayWorkers.filter((w) => w.status === "결근")
const todayExpense = attendedWorkers.length * DAILY_WAGE


const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]
const todayStr = `${todayDate.getMonth() + 1}월 ${todayDate.getDate()}일 ${WEEKDAYS[todayDate.getDay()]}요일`
const greetingHour = todayDate.getHours()
const greeting =
  greetingHour < 12
    ? "좋은 아침이에요"
    : greetingHour < 18
      ? "안녕하세요"
      : "수고 많으셨어요"

// ─── 시간 표시 헬퍼 ──────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.max(0, now - then)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "방금 전"
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

type Notification = {
  id: string
  type: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
  metadata?: any
}

export default function EmployerDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"home" | "posts">("home")

  // ── 알림 상태 ──────────────────────────────────────────────
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const bellRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      if (!res.ok) return
      const data = await res.json()
      const items: Notification[] = data.notifications ?? data ?? []
      setNotifications(items)
      setUnreadCount(items.filter((n) => !n.isRead).length)
    } catch {
      // 네트워크 오류 무시
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // 드롭다운 바깥 클릭 닫기
  useEffect(() => {
    if (!showNotifications) return
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showNotifications])

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" })
    } catch {
      // 실패 시 다음 폴링에서 복구
    }
  }

  const handleMarkOneRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
    } catch {
      // 실패 시 다음 폴링에서 복구
    }
  }

  // 퇴근 여부 (mock: 현재 시각이 18시 이후면 정산 가능)
  const canSettle = greetingHour >= 18

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* ── 헤더: 인사 + 날짜 + 알림 벨 ─────────────────────────── */}
      <header className="px-5 pt-8 pb-2 max-w-3xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{todayStr}</p>
            <h1 className="text-2xl font-bold mt-1 text-gray-900">
              {greeting},{" "}
              <span className="text-blue-600">
                {session?.user?.name ?? "사장님"}
              </span>
            </h1>
          </div>

          {/* 알림 벨 아이콘 */}
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

            {/* 알림 드롭다운 */}
            {showNotifications && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-14 w-80 bg-white rounded-2xl border border-gray-100 shadow-lg z-50 overflow-hidden"
              >
                {/* 드롭다운 헤더 */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="text-base font-bold text-gray-900">알림</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 active:text-blue-800 min-h-[44px] flex items-center"
                    >
                      모두 읽음
                    </button>
                  )}
                </div>

                {/* 알림 목록 */}
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex items-center justify-center py-10 px-5">
                      <p className="text-sm text-gray-400">
                        새로운 알림이 없습니다
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((noti) => (
                      <button
                        key={noti.id}
                        onClick={() => {
                          if (!noti.isRead) handleMarkOneRead(noti.id)
                        }}
                        className="w-full text-left px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50 last:border-0 min-h-[44px]"
                      >
                        <div className="flex items-start gap-3">
                          {!noti.isRead && (
                            <span className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-blue-600" />
                          )}
                          <div className={noti.isRead ? "pl-[22px]" : ""}>
                            <p className="text-base font-semibold text-gray-900 leading-snug">
                              {noti.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5 leading-snug">
                              {noti.body}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {timeAgo(noti.createdAt)}
                            </p>
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

      <main className="max-w-3xl mx-auto px-4 pb-8 space-y-4">
        {/* ── 공고관리 탭 ───────────────────────────────────────── */}
        {activeTab === "posts" && (
          <section>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">내 공고</h2>
                <Link href="/employer/post">
                  <button className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                    <Plus className="h-4 w-4" />
                    공고등록
                  </button>
                </Link>
              </div>
              {activePostings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <p className="text-base text-gray-400">등록된 공고가 없습니다</p>
                  <Link href="/employer/post">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white h-12 px-6 rounded-2xl text-base font-semibold">
                      <Plus className="h-5 w-5" />
                      공고등록
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activePostings.map((job) => (
                    <Link key={job.id} href={`/employer/jobs/${job.id}`}>
                      <div className="flex items-center justify-between py-3 px-1 border-b border-gray-50 last:border-0 active:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate">{job.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{job.date} · 필요 {job.needed}명</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <span className={`text-base font-bold ${job.applicants >= job.needed ? "text-emerald-600" : "text-amber-600"}`}>
                            {job.applicants}/{job.needed}
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

        {/* ── 홈 탭 ─────────────────────────────────────────────── */}
        {activeTab === "home" && <>
        {/* ① 오늘 핵심 현황: 2 stat cards ─────────────────────── */}
        <section className="grid grid-cols-2 gap-3">
          {/* 출근 현황 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                출근 현황
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-emerald-600">
                {attendedWorkers.length}
              </span>
              <span className="text-base text-gray-500">
                / {todayWorkers.length}명
              </span>
            </div>
            {absentWorkers.length > 0 && (
              <p className="text-sm text-red-600 mt-1">
                결근 {absentWorkers.length}명
              </p>
            )}
          </div>

          {/* 오늘 인건비 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Banknote className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                오늘 인건비
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-blue-600">
                {(todayExpense / 10000).toFixed(0)}
              </span>
              <span className="text-base text-gray-500">만원</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              일 {(DAILY_WAGE / 10000).toFixed(0)}만원 x{" "}
              {attendedWorkers.length}명
            </p>
          </div>
        </section>

        {/* ② 오늘 급여 정산하기 (primary action) ──────────────── */}
        <section>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">
                오늘 할 일
              </h2>
            </div>
            {canSettle ? (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  출근한 {attendedWorkers.length}명의 급여를 정산할 수 있어요
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl text-base font-semibold">
                  <Banknote className="h-5 w-5 mr-2" />
                  오늘 급여 정산하기
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  퇴근 후 급여 정산이 가능해요. 지금은 출근 현황을 확인하세요.
                </p>
                <Link href="/employer/post" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl text-base font-semibold">
                    <Plus className="h-5 w-5 mr-2" />
                    공고등록
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>

        {/* ③ 오늘 출근 명단 ───────────────────────────────────── */}
        <section>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                출근 명단
              </h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <UserCheck className="h-4 w-4" />
                  {attendedWorkers.length}명
                </span>
                {absentWorkers.length > 0 && (
                  <span className="flex items-center gap-1 font-semibold text-red-600">
                    <UserX className="h-4 w-4" />
                    {absentWorkers.length}명
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {todayWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                    worker.status === "출근"
                      ? "bg-emerald-50"
                      : "bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        worker.status === "출근"
                          ? "bg-emerald-100"
                          : "bg-red-100"
                      }`}
                    >
                      {worker.status === "출근" ? (
                        <UserCheck className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <span className="text-base font-semibold text-gray-900">
                      {worker.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {worker.time && (
                      <span className="text-sm text-gray-500">
                        {worker.time}
                      </span>
                    )}
                    <span
                      className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                        worker.status === "출근"
                          ? "text-emerald-700 bg-emerald-100"
                          : "text-red-600 bg-red-100"
                      }`}
                    >
                      {worker.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ④ 진행중인 공고 ───────────────────────────────────── */}
        <section>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                진행중인 공고
              </h2>
              <span className="text-sm font-medium text-gray-400">
                {activePostings.length}건
              </span>
            </div>
            <div className="space-y-3">
              {activePostings.map((job) => (
                <Link key={job.id} href={`/employer/jobs/${job.id}`}>
                  <div className="flex items-center justify-between py-3 px-1 border-b border-gray-50 last:border-0 active:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {job.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {job.date} · 필요 {job.needed}명
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span
                        className={`text-base font-bold ${
                          job.applicants >= job.needed
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {job.applicants}/{job.needed}
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        </>}

      </main>

      {/* ── 하단 탭 바 ─────────────────────────────────────────── */}
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
        </div>
      </nav>
    </div>
  )
}
