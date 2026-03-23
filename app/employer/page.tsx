"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Shield,
  FileText,
  ChevronRight,
  UserCheck,
  UserX,
  Bell,
  Banknote,
  CalendarCheck,
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

const closedPostings = [
  { id: 2, title: "포장 및 검수", applicants: 3, needed: 3, date: "3/22" },
  { id: 4, title: "생산라인 보조", applicants: 5, needed: 5, date: "3/20" },
]

const insuranceWarnings = [
  { id: 1, name: "박철수", days: 8, status: "위험" },
  { id: 2, name: "김민수", days: 7, status: "주의" },
]

// ─── 계산 ──────────────────────────────────────────────────────
const DAILY_WAGE = 130000
const todayDate = new Date()
const attendedWorkers = todayWorkers.filter((w) => w.status === "출근")
const absentWorkers = todayWorkers.filter((w) => w.status === "결근")
const todayExpense = attendedWorkers.length * DAILY_WAGE

const withholdingDeadline = new Date(todayDate.getFullYear(), todayDate.getMonth(), 10)
if (todayDate > withholdingDeadline) withholdingDeadline.setMonth(withholdingDeadline.getMonth() + 1)
const daysUntilTax = Math.ceil((withholdingDeadline.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24))

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]
const todayStr = `${todayDate.getMonth() + 1}월 ${todayDate.getDate()}일 ${WEEKDAYS[todayDate.getDay()]}요일`
const greetingHour = todayDate.getHours()
const greeting = greetingHour < 12 ? "좋은 아침이에요" : greetingHour < 18 ? "안녕하세요" : "수고 많으셨어요"

// ─── 뉴모피즘 shadow 상수 ──────────────────────────────────────
const nmShadow = "8px 8px 16px rgba(163,177,198,0.6), -6px -6px 14px rgba(255,255,255,0.9)"
const nmShadowHover = "10px 10px 20px rgba(163,177,198,0.7), -8px -8px 16px rgba(255,255,255,1)"
const nmShadowPressed = "inset 4px 4px 10px rgba(163,177,198,0.5), inset -4px -4px 10px rgba(255,255,255,0.8)"

export default function EmployerDashboard() {
  const { data: session } = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pressedBtn, setPressedBtn] = useState<string | null>(null)
  const [jobForm, setJobForm] = useState({
    date: "",
    time: "09:00",
    workers: "3",
    task: "단순 조립",
  })

  const getButtonShadow = (key: string) =>
    pressedBtn === key ? nmShadowPressed : nmShadow

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eef1f6" }}>

      {/* ── 헤더 ─────────────────────────────────────────────── */}
      <header style={{ backgroundColor: "#eef1f6" }} className="px-5 pt-8 pb-4 max-w-3xl mx-auto">
        <p className="text-base font-medium" style={{ color: "#8a96a8" }}>{todayStr}</p>
        <h1 className="text-3xl font-bold mt-1" style={{ color: "#1e2530" }}>
          {greeting},&nbsp;
          <span style={{ color: "#3b82f6" }}>{session?.user?.name ?? "사장님"}</span> 👋
        </h1>
        <p className="text-base mt-1" style={{ color: "#8a96a8" }}>오늘도 좋은 하루 되세요</p>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-12 space-y-6">

        {/* ① 오늘 핵심 현황 ─────────────────────────────────── */}
        <section className="grid grid-cols-3 gap-4">

          {/* 오늘 출근 */}
          <div
            className="rounded-3xl p-5 text-center transition-all duration-200"
            style={{ backgroundColor: "#eef1f6", boxShadow: nmShadow }}
          >
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#d1fae5" }}>
                <Users className="h-5 w-5" style={{ color: "#059669" }} />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8a96a8" }}>출근 인원</p>
            <p className="text-4xl font-bold mt-1" style={{ color: "#059669" }}>{attendedWorkers.length}</p>
            <p className="text-sm" style={{ color: "#8a96a8" }}>명</p>
          </div>

          {/* 오늘 지출할 인건비 */}
          <div
            className="rounded-3xl p-5 text-center transition-all duration-200"
            style={{ backgroundColor: "#eef1f6", boxShadow: nmShadow }}
          >
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#dbeafe" }}>
                <Banknote className="h-5 w-5" style={{ color: "#2563eb" }} />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8a96a8" }}>오늘 인건비</p>
            <p className="text-3xl font-bold mt-1" style={{ color: "#2563eb" }}>
              {(todayExpense / 10000).toFixed(0)}
            </p>
            <p className="text-sm" style={{ color: "#8a96a8" }}>만원</p>
          </div>

          {/* 세금 마감 */}
          <div
            className="rounded-3xl p-5 text-center transition-all duration-200"
            style={{ backgroundColor: "#eef1f6", boxShadow: nmShadow }}
          >
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: daysUntilTax <= 3 ? "#fee2e2" : "#fef3c7" }}>
                <Bell className="h-5 w-5" style={{ color: daysUntilTax <= 3 ? "#dc2626" : "#d97706" }} />
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#8a96a8" }}>세금 마감</p>
            <p className="text-3xl font-bold mt-1"
              style={{ color: daysUntilTax <= 3 ? "#dc2626" : "#d97706" }}>
              D-{daysUntilTax}
            </p>
            <p className="text-sm" style={{ color: "#8a96a8" }}>원천징수</p>
          </div>
        </section>

        {/* ② 빠른 메뉴 ──────────────────────────────────────── */}
        <section>
          <p className="text-base font-semibold mb-3 px-1" style={{ color: "#8a96a8" }}>빠른 메뉴</p>
          <div className="grid grid-cols-2 gap-4">

            {/* 일손 구하기 */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  onMouseDown={() => setPressedBtn("hire")}
                  onMouseUp={() => setPressedBtn(null)}
                  onMouseLeave={() => setPressedBtn(null)}
                  className="flex flex-col items-center justify-center gap-3 h-32 rounded-3xl transition-all duration-150 w-full"
                  style={{
                    backgroundColor: "#eef1f6",
                    boxShadow: getButtonShadow("hire"),
                    color: "#1e2530",
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#1e2530" }}>
                    <Plus className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-lg font-bold">일손 구하기</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">언제, 몇 명 필요해요?</DialogTitle>
                  <DialogDescription className="text-base" style={{ color: "#8a96a8" }}>
                    간단하게 입력하면 바로 올려드릴게요
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup className="gap-5 pt-2">
                  <Field>
                    <FieldLabel className="text-lg font-semibold">날짜가 언제예요?</FieldLabel>
                    <Input
                      type="date"
                      className="h-14 text-lg rounded-2xl border-0"
                      style={{ backgroundColor: "#eef1f6", boxShadow: nmShadowPressed }}
                      value={jobForm.date}
                      onChange={(e) => setJobForm({ ...jobForm, date: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-lg font-semibold">몇 시에 시작할까요?</FieldLabel>
                    <Select value={jobForm.time} onValueChange={(v) => setJobForm({ ...jobForm, time: v })}>
                      <SelectTrigger className="h-14 text-lg rounded-2xl border-0" style={{ backgroundColor: "#eef1f6", boxShadow: nmShadowPressed }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["07:00", "08:00", "09:00", "10:00", "13:00", "14:00"].map((t) => (
                          <SelectItem key={t} value={t} className="text-lg">
                            {parseInt(t) < 12 ? `오전 ${parseInt(t)}시` : `오후 ${parseInt(t) - 12}시`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel className="text-lg font-semibold">몇 명 필요해요?</FieldLabel>
                    <Select value={jobForm.workers} onValueChange={(v) => setJobForm({ ...jobForm, workers: v })}>
                      <SelectTrigger className="h-14 text-lg rounded-2xl border-0" style={{ backgroundColor: "#eef1f6", boxShadow: nmShadowPressed }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                          <SelectItem key={n} value={String(n)} className="text-lg">{n}명</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel className="text-lg font-semibold">어떤 작업이에요?</FieldLabel>
                    <Select value={jobForm.task} onValueChange={(v) => setJobForm({ ...jobForm, task: v })}>
                      <SelectTrigger className="h-14 text-lg rounded-2xl border-0" style={{ backgroundColor: "#eef1f6", boxShadow: nmShadowPressed }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["단순 조립", "포장 작업", "검수 작업", "물류 이동"].map((t) => (
                          <SelectItem key={t} value={t} className="text-lg">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full h-14 text-xl font-bold rounded-2xl text-white transition-all duration-150 active:scale-95"
                    style={{ backgroundColor: "#1e2530" }}
                  >
                    공고 올리기
                  </button>
                </FieldGroup>
              </DialogContent>
            </Dialog>

            {/* 출근 확인 */}
            <button
              onMouseDown={() => setPressedBtn("attend")}
              onMouseUp={() => setPressedBtn(null)}
              onMouseLeave={() => setPressedBtn(null)}
              onClick={() => document.getElementById("attendance-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex flex-col items-center justify-center gap-3 h-32 rounded-3xl transition-all duration-150"
              style={{ backgroundColor: "#eef1f6", boxShadow: getButtonShadow("attend"), color: "#1e2530" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#d1fae5" }}>
                <UserCheck className="h-7 w-7" style={{ color: "#059669" }} />
              </div>
              <span className="text-lg font-bold">출근 확인</span>
            </button>

            {/* 세금 서류 */}
            <Link href="/employer/tax" className="block">
              <button
                onMouseDown={() => setPressedBtn("tax")}
                onMouseUp={() => setPressedBtn(null)}
                onMouseLeave={() => setPressedBtn(null)}
                className="w-full flex flex-col items-center justify-center gap-3 h-32 rounded-3xl transition-all duration-150"
                style={{ backgroundColor: "#eef1f6", boxShadow: getButtonShadow("tax"), color: "#1e2530" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#dbeafe" }}>
                  <FileText className="h-7 w-7" style={{ color: "#2563eb" }} />
                </div>
                <span className="text-lg font-bold">세금 서류</span>
              </button>
            </Link>

            {/* 보험 관리 */}
            <Link href="/employer/safety-zone" className="block">
              <button
                onMouseDown={() => setPressedBtn("ins")}
                onMouseUp={() => setPressedBtn(null)}
                onMouseLeave={() => setPressedBtn(null)}
                className="w-full flex flex-col items-center justify-center gap-3 h-32 rounded-3xl transition-all duration-150"
                style={{ backgroundColor: "#eef1f6", boxShadow: getButtonShadow("ins"), color: "#1e2530" }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#ede9fe" }}>
                  <Shield className="h-7 w-7" style={{ color: "#7c3aed" }} />
                </div>
                <span className="text-lg font-bold">보험 관리</span>
              </button>
            </Link>
          </div>
        </section>

        {/* ③ 오늘 출근 명단 ─────────────────────────────────── */}
        <section id="attendance-section">
          <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: "#eef1f6", boxShadow: nmShadow }}>
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6" style={{ color: "#8a96a8" }} />
                <h2 className="text-xl font-bold" style={{ color: "#1e2530" }}>오늘 출근 명단</h2>
              </div>
              <div className="flex items-center gap-3 text-base">
                <span className="flex items-center gap-1 font-bold" style={{ color: "#059669" }}>
                  <UserCheck className="h-4 w-4" />{attendedWorkers.length}명 출근
                </span>
                {absentWorkers.length > 0 && (
                  <span className="flex items-center gap-1 font-bold" style={{ color: "#dc2626" }}>
                    <UserX className="h-4 w-4" />{absentWorkers.length}명 결근
                  </span>
                )}
              </div>
            </div>
            <div className="px-4 pb-5 space-y-2">
              {todayWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-150"
                  style={{
                    backgroundColor: worker.status === "출근" ? "#f0fdf4" : "#fff5f5",
                    boxShadow: "inset 2px 2px 5px rgba(163,177,198,0.3), inset -2px -2px 5px rgba(255,255,255,0.7)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: worker.status === "출근" ? "#d1fae5" : "#fee2e2" }}>
                      {worker.status === "출근"
                        ? <UserCheck className="h-5 w-5" style={{ color: "#059669" }} />
                        : <UserX className="h-5 w-5" style={{ color: "#dc2626" }} />
                      }
                    </div>
                    <span className="text-xl font-semibold" style={{ color: "#1e2530" }}>{worker.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {worker.time && (
                      <span className="text-base" style={{ color: "#8a96a8" }}>{worker.time}</span>
                    )}
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      worker.status === "출근" ? "text-emerald-700 bg-emerald-100" : "text-red-600 bg-red-100"
                    }`}>
                      {worker.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ④ 세금 마감 배너 ────────────────────────────────── */}
        <section>
          <Link href="/employer/tax">
            <div
              className="rounded-3xl p-5 flex items-center justify-between transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              style={{
                background: daysUntilTax <= 3
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : daysUntilTax <= 7
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: daysUntilTax <= 3
                  ? "6px 6px 14px rgba(220,38,38,0.4)"
                  : daysUntilTax <= 7
                  ? "6px 6px 14px rgba(217,119,6,0.4)"
                  : "6px 6px 14px rgba(37,99,235,0.4)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">
                    {daysUntilTax <= 3 ? "마감이 코앞이에요! 지금 바로 신고하세요" : "세금 신고 마감일을 확인하세요"}
                  </p>
                  <p className="text-sm text-white/80 mt-0.5">
                    원천징수 신고 · {withholdingDeadline.getMonth() + 1}월 10일 마감 · D-{daysUntilTax}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-white flex-shrink-0" />
            </div>
          </Link>
        </section>

        {/* ⑤ 보험 주의 인원 ────────────────────────────────── */}
        {insuranceWarnings.length > 0 && (
          <section>
            <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: "#eef1f6", boxShadow: nmShadow }}>
              <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6" style={{ color: "#d97706" }} />
                  <h2 className="text-xl font-bold" style={{ color: "#1e2530" }}>보험 가입 주의 인원</h2>
                </div>
                <Link href="/employer/safety-zone">
                  <span className="text-base font-semibold flex items-center gap-1" style={{ color: "#d97706" }}>
                    전체보기 <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
              <p className="px-6 pb-3 text-sm" style={{ color: "#8a96a8" }}>월 8일 이상 근무하면 4대 보험에 가입해야 해요</p>
              <div className="px-4 pb-5 space-y-2">
                {insuranceWarnings.map((w) => (
                  <div key={w.id} className="flex items-center justify-between px-4 py-4 rounded-2xl"
                    style={{
                      backgroundColor: w.status === "위험" ? "#fff5f5" : "#fffbeb",
                      boxShadow: "inset 2px 2px 5px rgba(163,177,198,0.3), inset -2px -2px 5px rgba(255,255,255,0.7)",
                    }}>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-6 w-6" style={{ color: w.status === "위험" ? "#dc2626" : "#d97706" }} />
                      <span className="text-xl font-semibold" style={{ color: "#1e2530" }}>{w.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base" style={{ color: "#8a96a8" }}>이번달 {w.days}일</span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        w.status === "위험" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>{w.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ⑥ 공고 현황 (2열: 진행중 | 마감) ─────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-6 w-6" style={{ color: "#8a96a8" }} />
              <h2 className="text-xl font-bold" style={{ color: "#1e2530" }}>공고 현황</h2>
            </div>
            <Link href="/employer/post">
              <span className="text-base font-semibold flex items-center gap-1" style={{ color: "#3b82f6" }}>
                <Plus className="h-4 w-4" />공고 등록
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 진행중인 공고 */}
            <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: "#eef1f6", boxShadow: nmShadow }}>
              <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-base font-bold" style={{ color: "#059669" }}>진행중</span>
                <span className="text-sm ml-auto font-semibold" style={{ color: "#8a96a8" }}>{activePostings.length}건</span>
              </div>
              <div className="px-3 pb-4 space-y-2">
                {activePostings.map((job) => (
                  <Link key={job.id} href={`/employer/jobs/${job.id}`}>
                    <div
                      className="p-4 rounded-2xl cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        backgroundColor: "#f0fdf4",
                        boxShadow: "inset 2px 2px 5px rgba(163,177,198,0.3), inset -2px -2px 5px rgba(255,255,255,0.7)",
                      }}
                    >
                      <p className="text-base font-bold leading-tight" style={{ color: "#1e2530" }}>{job.title}</p>
                      <p className="text-sm mt-1" style={{ color: "#8a96a8" }}>{job.date} · 필요 {job.needed}명</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm" style={{ color: "#8a96a8" }}>지원자</span>
                        <span className="text-lg font-bold" style={{ color: job.applicants >= job.needed ? "#059669" : "#d97706" }}>
                          {job.applicants}/{job.needed}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full mt-2" style={{ backgroundColor: "#d1fae5" }}>
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min((job.applicants / job.needed) * 100, 100)}%`,
                            backgroundColor: job.applicants >= job.needed ? "#059669" : "#f59e0b",
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1 mt-3">
                        <ChevronRight className="h-4 w-4" style={{ color: "#3b82f6" }} />
                        <span className="text-sm font-semibold" style={{ color: "#3b82f6" }}>공고 보기</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 마감된 공고 */}
            <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: "#eef1f6", boxShadow: nmShadow }}>
              <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-base font-bold" style={{ color: "#8a96a8" }}>마감</span>
                <span className="text-sm ml-auto font-semibold" style={{ color: "#8a96a8" }}>{closedPostings.length}건</span>
              </div>
              <div className="px-3 pb-4 space-y-2">
                {closedPostings.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: "#f8f9fb",
                      boxShadow: "inset 2px 2px 5px rgba(163,177,198,0.3), inset -2px -2px 5px rgba(255,255,255,0.7)",
                    }}
                  >
                    <p className="text-base font-bold leading-tight" style={{ color: "#8a96a8" }}>{job.title}</p>
                    <p className="text-sm mt-1" style={{ color: "#b0b8c5" }}>{job.date} · {job.needed}명</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm" style={{ color: "#b0b8c5" }}>지원자</span>
                      <span className="text-lg font-bold" style={{ color: "#b0b8c5" }}>
                        {job.applicants}/{job.needed}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full mt-2" style={{ backgroundColor: "#e2e8f0" }}>
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.min((job.applicants / job.needed) * 100, 100)}%`,
                          backgroundColor: "#94a3b8",
                        }}
                      />
                    </div>
                    <div className="mt-3">
                      <span className="text-sm font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: "#e2e8f0", color: "#8a96a8" }}>
                        마감완료
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="h-6" />
      </main>
    </div>
  )
}
