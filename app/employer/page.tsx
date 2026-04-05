"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
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
  Calculator,
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

const withholdingDeadline = new Date(
  todayDate.getFullYear(),
  todayDate.getMonth(),
  10
)
if (todayDate > withholdingDeadline)
  withholdingDeadline.setMonth(withholdingDeadline.getMonth() + 1)
const daysUntilTax = Math.ceil(
  (withholdingDeadline.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
)

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]
const todayStr = `${todayDate.getMonth() + 1}월 ${todayDate.getDate()}일 ${WEEKDAYS[todayDate.getDay()]}요일`
const greetingHour = todayDate.getHours()
const greeting =
  greetingHour < 12
    ? "좋은 아침이에요"
    : greetingHour < 18
      ? "안녕하세요"
      : "수고 많으셨어요"

export default function EmployerDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"home" | "posts" | "tax">("home")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [jobForm, setJobForm] = useState({
    date: "",
    time: "09:00",
    workers: "3",
    task: "단순 조립",
  })

  // 퇴근 여부 (mock: 현재 시각이 18시 이후면 정산 가능)
  const canSettle = greetingHour >= 18

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* ── 헤더: 인사 + 날짜 ──────────────────────────────────── */}
      <header className="px-5 pt-8 pb-2 max-w-3xl mx-auto">
        <p className="text-sm font-medium text-gray-500">{todayStr}</p>
        <h1 className="text-2xl font-bold mt-1 text-gray-900">
          {greeting},{" "}
          <span className="text-blue-600">
            {session?.user?.name ?? "사장님"}
          </span>
        </h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-8 space-y-4">
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl text-base font-semibold">
                      <Plus className="h-5 w-5 mr-2" />
                      일손 구하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-900">
                        언제, 몇 명 필요해요?
                      </DialogTitle>
                      <DialogDescription className="text-sm text-gray-500">
                        간단하게 입력하면 바로 올려드릴게요
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="gap-5 pt-2">
                      <Field>
                        <FieldLabel className="text-base font-semibold text-gray-900">
                          날짜가 언제예요?
                        </FieldLabel>
                        <Input
                          type="date"
                          className="h-14 text-base rounded-2xl border border-gray-200 bg-white"
                          value={jobForm.date}
                          onChange={(e) =>
                            setJobForm({ ...jobForm, date: e.target.value })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel className="text-base font-semibold text-gray-900">
                          몇 시에 시작할까요?
                        </FieldLabel>
                        <Select
                          value={jobForm.time}
                          onValueChange={(v) =>
                            setJobForm({ ...jobForm, time: v })
                          }
                        >
                          <SelectTrigger className="h-14 text-base rounded-2xl border border-gray-200 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "07:00",
                              "08:00",
                              "09:00",
                              "10:00",
                              "13:00",
                              "14:00",
                            ].map((t) => (
                              <SelectItem
                                key={t}
                                value={t}
                                className="text-base"
                              >
                                {parseInt(t) < 12
                                  ? `오전 ${parseInt(t)}시`
                                  : `오후 ${parseInt(t) - 12 || 12}시`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel className="text-base font-semibold text-gray-900">
                          몇 명 필요해요?
                        </FieldLabel>
                        <Select
                          value={jobForm.workers}
                          onValueChange={(v) =>
                            setJobForm({ ...jobForm, workers: v })
                          }
                        >
                          <SelectTrigger className="h-14 text-base rounded-2xl border border-gray-200 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                              <SelectItem
                                key={n}
                                value={String(n)}
                                className="text-base"
                              >
                                {n}명
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel className="text-base font-semibold text-gray-900">
                          어떤 작업이에요?
                        </FieldLabel>
                        <Select
                          value={jobForm.task}
                          onValueChange={(v) =>
                            setJobForm({ ...jobForm, task: v })
                          }
                        >
                          <SelectTrigger className="h-14 text-base rounded-2xl border border-gray-200 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "단순 조립",
                              "포장 작업",
                              "검수 작업",
                              "물류 이동",
                            ].map((t) => (
                              <SelectItem
                                key={t}
                                value={t}
                                className="text-base"
                              >
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Button
                        onClick={() => setIsDialogOpen(false)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl text-base font-semibold"
                      >
                        공고 올리기
                      </Button>
                    </FieldGroup>
                  </DialogContent>
                </Dialog>
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

        {/* ⑤ 세금 마감 알림 (D-7 이하일 때만 표시) ───────────── */}
        {daysUntilTax <= 7 && (
          <section>
            <Link href="/employer/tax">
              <div
                className={`rounded-2xl border shadow-sm p-5 flex items-center justify-between active:opacity-90 transition-opacity ${
                  daysUntilTax <= 3
                    ? "bg-red-50 border-red-100"
                    : "bg-amber-50 border-amber-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      daysUntilTax <= 3 ? "bg-red-100" : "bg-amber-100"
                    }`}
                  >
                    <Bell
                      className={`h-5 w-5 ${
                        daysUntilTax <= 3
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-base font-semibold ${
                        daysUntilTax <= 3
                          ? "text-red-700"
                          : "text-amber-700"
                      }`}
                    >
                      원천징수 신고 D-{daysUntilTax}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {withholdingDeadline.getMonth() + 1}월 10일 마감
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 flex-shrink-0 ${
                    daysUntilTax <= 3 ? "text-red-400" : "text-amber-400"
                  }`}
                />
              </div>
            </Link>
          </section>
        )}
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
          <Link href="/employer/post" className="block">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-11 ${
                activeTab === "posts" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">공고관리</span>
            </button>
          </Link>
          <Link href="/employer/tax" className="block">
            <button
              onClick={() => setActiveTab("tax")}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-11 ${
                activeTab === "tax" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <Calculator className="h-5 w-5" />
              <span className="text-sm font-medium">정산·세금</span>
            </button>
          </Link>
        </div>
      </nav>
    </div>
  )
}
