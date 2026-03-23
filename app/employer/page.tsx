"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Calendar,
  Building2,
  Shield,
  FileText,
  ChevronRight,
  UserCheck,
  UserX,
  Bell,
} from "lucide-react"

// Mock data
const todayWorkers = [
  { id: 1, name: "김민수", status: "출근", time: "08:02" },
  { id: 2, name: "이영희", status: "출근", time: "08:15" },
  { id: 3, name: "박철수", status: "출근", time: "07:58" },
  { id: 4, name: "정지은", status: "결근", time: null },
  { id: 5, name: "최동현", status: "출근", time: "08:30" },
]

const jobPostings = [
  { id: 1, title: "단순 조립 작업", applicants: 8, needed: 5, status: "모집중", date: "오늘" },
  { id: 2, title: "포장 및 검수", applicants: 3, needed: 3, status: "매칭완료", date: "내일" },
  { id: 3, title: "물류 이동 보조", applicants: 2, needed: 4, status: "모집중", date: "3/25" },
]

const insuranceWarnings = [
  { id: 1, name: "박철수", days: 8, status: "위험" },
  { id: 2, name: "김민수", days: 7, status: "주의" },
]

// 세금 마감일 계산 (원천징수: 매월 10일)
const today = new Date()
const withholdingDeadline = new Date(today.getFullYear(), today.getMonth(), 10)
if (today > withholdingDeadline) withholdingDeadline.setMonth(withholdingDeadline.getMonth() + 1)
const daysUntilTax = Math.ceil((withholdingDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

const weekdays = ["일", "월", "화", "수", "목", "금", "토"]
const todayStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 (${weekdays[today.getDay()]})`

const attendedCount = todayWorkers.filter((w) => w.status === "출근").length
const absentCount = todayWorkers.filter((w) => w.status === "결근").length

export default function EmployerDashboard() {
  const { data: session } = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [jobForm, setJobForm] = useState({
    date: "",
    time: "09:00",
    workers: "3",
    task: "단순 조립",
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="bg-slate-800 text-white px-4 py-5 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-9 w-9 text-slate-300" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">일손매칭</h1>
              <p className="text-slate-300 text-base">{todayStr}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">{session?.user?.name ?? "사장님"}</p>
            <p className="text-slate-400 text-base">사장님</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-5">

        {/* ① 오늘 핵심 현황 */}
        <section className="grid grid-cols-3 gap-3">
          {/* 오늘 출근 */}
          <Card className="border-2 border-emerald-200 bg-emerald-50 shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-base text-emerald-700 font-medium mb-1">오늘 출근</p>
              <p className="text-5xl font-bold text-emerald-700">{attendedCount}</p>
              <p className="text-base text-emerald-600 mt-1">명</p>
            </CardContent>
          </Card>

          {/* 이번달 인건비 */}
          <Card className="border-2 border-blue-200 bg-blue-50 shadow-sm">
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-base text-blue-700 font-medium mb-1">이번달 인건비</p>
              <p className="text-4xl font-bold text-blue-700">485</p>
              <p className="text-base text-blue-600 mt-1">만원</p>
            </CardContent>
          </Card>

          {/* 세금 마감 */}
          <Card className={`border-2 shadow-sm ${daysUntilTax <= 3 ? "border-red-300 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className={`text-base font-medium mb-1 ${daysUntilTax <= 3 ? "text-red-700" : "text-amber-700"}`}>세금 마감</p>
              <p className={`text-4xl font-bold ${daysUntilTax <= 3 ? "text-red-700" : "text-amber-700"}`}>
                D-{daysUntilTax}
              </p>
              <p className={`text-base mt-1 ${daysUntilTax <= 3 ? "text-red-600" : "text-amber-600"}`}>원천징수</p>
            </CardContent>
          </Card>
        </section>

        {/* ② 빠른 메뉴 */}
        <section>
          <p className="text-lg font-semibold text-slate-600 mb-3 px-1">빠른 메뉴</p>
          <div className="grid grid-cols-2 gap-3">
            {/* 일손 구하기 */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center justify-center gap-3 h-28 rounded-2xl bg-slate-700 hover:bg-slate-800 active:bg-slate-900 text-white shadow-md transition-all">
                  <Plus className="h-10 w-10" />
                  <span className="text-xl font-bold">일손 구하기</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">간편 공고 등록</DialogTitle>
                  <DialogDescription className="text-lg">
                    필요한 정보만 입력하세요
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup className="gap-5 pt-4">
                  <Field>
                    <FieldLabel className="text-lg">날짜</FieldLabel>
                    <Input
                      type="date"
                      className="h-14 text-lg"
                      value={jobForm.date}
                      onChange={(e) => setJobForm({ ...jobForm, date: e.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-lg">시작 시간</FieldLabel>
                    <Select value={jobForm.time} onValueChange={(v) => setJobForm({ ...jobForm, time: v })}>
                      <SelectTrigger className="h-14 text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="07:00" className="text-lg">오전 7시</SelectItem>
                        <SelectItem value="08:00" className="text-lg">오전 8시</SelectItem>
                        <SelectItem value="09:00" className="text-lg">오전 9시</SelectItem>
                        <SelectItem value="10:00" className="text-lg">오전 10시</SelectItem>
                        <SelectItem value="13:00" className="text-lg">오후 1시</SelectItem>
                        <SelectItem value="14:00" className="text-lg">오후 2시</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel className="text-lg">필요 인원</FieldLabel>
                    <Select value={jobForm.workers} onValueChange={(v) => setJobForm({ ...jobForm, workers: v })}>
                      <SelectTrigger className="h-14 text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <SelectItem key={n} value={String(n)} className="text-lg">{n}명</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel className="text-lg">작업 유형</FieldLabel>
                    <Select value={jobForm.task} onValueChange={(v) => setJobForm({ ...jobForm, task: v })}>
                      <SelectTrigger className="h-14 text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="단순 조립" className="text-lg">단순 조립</SelectItem>
                        <SelectItem value="포장 작업" className="text-lg">포장 작업</SelectItem>
                        <SelectItem value="검수 작업" className="text-lg">검수 작업</SelectItem>
                        <SelectItem value="물류 이동" className="text-lg">물류 이동</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Button
                    className="w-full h-14 text-xl mt-4 bg-slate-700 hover:bg-slate-800 text-white"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    공고 등록하기
                  </Button>
                </FieldGroup>
              </DialogContent>
            </Dialog>

            {/* 출근 확인 */}
            <button
              onClick={() => document.getElementById("attendance-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex flex-col items-center justify-center gap-3 h-28 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md transition-all"
            >
              <Users className="h-10 w-10" />
              <span className="text-xl font-bold">출근 확인</span>
            </button>

            {/* 세금 서류 */}
            <Link href="/employer/tax" className="block">
              <button className="w-full flex flex-col items-center justify-center gap-3 h-28 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md transition-all">
                <FileText className="h-10 w-10" />
                <span className="text-xl font-bold">세금 서류</span>
              </button>
            </Link>

            {/* 보험 관리 */}
            <Link href="/employer/safety-zone" className="block">
              <button className="w-full flex flex-col items-center justify-center gap-3 h-28 rounded-2xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-md transition-all">
                <Shield className="h-10 w-10" />
                <span className="text-xl font-bold">보험 관리</span>
              </button>
            </Link>
          </div>
        </section>

        {/* ③ 오늘 출근 명단 */}
        <section id="attendance-section">
          <Card className="border-2 border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center justify-between text-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="h-7 w-7 text-slate-600" />
                  오늘 출근 명단
                </div>
                <div className="flex items-center gap-3 text-base font-normal">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <UserCheck className="h-5 w-5" />{attendedCount}명
                  </span>
                  <span className="flex items-center gap-1 text-red-500 font-semibold">
                    <UserX className="h-5 w-5" />{absentCount}명
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className={`flex items-center justify-between px-4 py-4 rounded-xl border-2 ${
                    worker.status === "출근"
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      worker.status === "출근" ? "bg-emerald-200" : "bg-red-200"
                    }`}>
                      {worker.status === "출근"
                        ? <UserCheck className="h-6 w-6 text-emerald-700" />
                        : <UserX className="h-6 w-6 text-red-600" />
                      }
                    </div>
                    <span className="text-xl font-semibold text-slate-800">{worker.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {worker.time && (
                      <span className="text-lg text-slate-500">{worker.time}</span>
                    )}
                    <Badge className={`text-base px-3 py-1 ${
                      worker.status === "출근"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-red-100 text-red-600 hover:bg-red-100"
                    }`}>
                      {worker.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* ④ 세금 마감일 알림 배너 */}
        <section>
          <Link href="/employer/tax">
            <div className={`rounded-2xl p-5 flex items-center justify-between shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
              daysUntilTax <= 3
                ? "bg-red-600 border-red-700 text-white"
                : daysUntilTax <= 7
                ? "bg-amber-500 border-amber-600 text-white"
                : "bg-blue-600 border-blue-700 text-white"
            }`}>
              <div className="flex items-center gap-4">
                <Bell className="h-9 w-9 flex-shrink-0" />
                <div>
                  <p className="text-xl font-bold">
                    {daysUntilTax <= 3 ? "⚠️ 세금 마감이 얼마 남지 않았어요!" : "세금 신고 마감일 안내"}
                  </p>
                  <p className="text-lg mt-1 opacity-90">
                    원천징수 신고 마감 · {withholdingDeadline.getMonth() + 1}월 10일 · D-{daysUntilTax}일 남음
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-lg font-bold">바로가기</span>
                <ChevronRight className="h-7 w-7" />
              </div>
            </div>
          </Link>
        </section>

        {/* ⑤ 보험 주의 인원 */}
        {insuranceWarnings.length > 0 && (
          <section>
            <Card className="border-2 border-amber-200 bg-amber-50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl flex items-center justify-between text-amber-800">
                  <div className="flex items-center gap-2">
                    <Shield className="h-7 w-7" />
                    4대 보험 주의 인원
                  </div>
                  <Link href="/employer/safety-zone">
                    <span className="text-base text-amber-600 font-normal flex items-center gap-1 hover:text-amber-800">
                      전체보기 <ChevronRight className="h-5 w-5" />
                    </span>
                  </Link>
                </CardTitle>
                <p className="text-base text-amber-700">월 8일 이상 근무 시 4대 보험 가입 의무</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {insuranceWarnings.map((w) => (
                  <div key={w.id} className={`flex items-center justify-between px-4 py-4 rounded-xl border-2 ${
                    w.status === "위험" ? "bg-red-50 border-red-200" : "bg-amber-100 border-amber-300"
                  }`}>
                    <div className="flex items-center gap-3">
                      <AlertCircle className={`h-7 w-7 ${w.status === "위험" ? "text-red-500" : "text-amber-600"}`} />
                      <span className="text-xl font-semibold text-slate-800">{w.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-slate-600">이번달 {w.days}일 근무</span>
                      <Badge className={`text-base px-3 py-1 ${
                        w.status === "위험"
                          ? "bg-red-100 text-red-700 hover:bg-red-100"
                          : "bg-amber-200 text-amber-800 hover:bg-amber-200"
                      }`}>
                        {w.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        )}

        {/* ⑥ 진행중인 공고 */}
        <section>
          <Card className="border-2 border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center justify-between text-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="h-7 w-7 text-slate-600" />
                  진행중인 공고
                </div>
                <Link href="/employer/post">
                  <span className="text-base text-slate-500 font-normal flex items-center gap-1 hover:text-slate-800">
                    공고 등록 <ChevronRight className="h-5 w-5" />
                  </span>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobPostings.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between px-4 py-4 rounded-xl bg-slate-100 border-2 border-slate-200"
                >
                  <div>
                    <p className="text-xl font-semibold text-slate-800">{job.title}</p>
                    <p className="text-base text-slate-500 mt-1">{job.date} · 필요 {job.needed}명</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-base text-slate-500">지원자</p>
                      <p className="text-2xl font-bold text-slate-800">{job.applicants}/{job.needed}</p>
                    </div>
                    <Badge className={`text-base px-3 py-1 ${
                      job.status === "매칭완료"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                    }`}>
                      {job.status === "매칭완료"
                        ? <CheckCircle className="h-4 w-4 mr-1" />
                        : <AlertCircle className="h-4 w-4 mr-1" />
                      }
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* 하단 여백 */}
        <div className="h-4" />
      </main>
    </div>
  )
}
