"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { 
  Users, 
  DollarSign, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Star,
  Calendar,
  Truck,
  Building2,
  ShieldCheck,
  AlertTriangle
} from "lucide-react"

// Mock data
const summaryData = {
  todayWorkers: 12,
  monthlyExpense: 4850000,
  pendingPickups: 3
}

const jobPostings = [
  { id: 1, title: "단순 조립 작업", applicants: 8, needed: 5, status: "모집중", location: "청주 공장 A동" },
  { id: 2, title: "포장 및 검수", applicants: 3, needed: 3, status: "매칭완료", location: "청주 공장 B동" },
  { id: 3, title: "물류 이동 보조", applicants: 2, needed: 4, status: "모집중", location: "청주 물류센터" },
]

const trustedWorkers = [
  { id: 1, name: "김민수", trustScore: 95, noShows: 0, consecutiveDays: 14, tags: ["성실", "경험자"] },
  { id: 2, name: "이영희", trustScore: 88, noShows: 1, consecutiveDays: 7, tags: ["초보가능", "성실"] },
  { id: 3, name: "박철수", trustScore: 92, noShows: 0, consecutiveDays: 21, tags: ["경험자", "리더십"] },
  { id: 4, name: "정지은", trustScore: 85, noShows: 2, consecutiveDays: 5, tags: ["초보가능"] },
]

export default function EmployerDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [jobForm, setJobForm] = useState({
    date: "",
    time: "09:00",
    workers: "3",
    task: "단순 조립"
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-800 text-white px-4 py-5 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-9 w-9" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">일손매칭</h1>
              <p className="text-slate-300 text-base md:text-lg">사장님 관리 대시보드</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg md:text-xl font-medium">청주제조(주)</p>
            <p className="text-slate-300 text-base">홍길동 사장님</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader className="pb-3">
              <CardDescription className="text-lg text-slate-600">오늘 출근 인원</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-5xl md:text-6xl font-bold text-slate-800">{summaryData.todayWorkers}</span>
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users className="h-9 w-9 text-emerald-600" />
                </div>
              </div>
              <p className="text-lg text-slate-500 mt-2">명</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader className="pb-3">
              <CardDescription className="text-lg text-slate-600">금월 인건비 지출</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl md:text-5xl font-bold text-slate-800">485</span>
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-9 w-9 text-blue-600" />
                </div>
              </div>
              <p className="text-lg text-slate-500 mt-2">만원</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader className="pb-3">
              <CardDescription className="text-lg text-slate-600">대기 중 픽업 요청</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-5xl md:text-6xl font-bold text-amber-600">{summaryData.pendingPickups}</span>
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Truck className="h-9 w-9 text-amber-600" />
                </div>
              </div>
              <p className="text-lg text-slate-500 mt-2">건</p>
            </CardContent>
          </Card>
        </section>

        {/* Safety Zone Monitor Link */}
        <section>
          <Link href="/employer/safety-zone">
            <Card className="border-2 border-amber-200 bg-amber-50 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center">
                      <ShieldCheck className="h-8 w-8 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold text-amber-800">안전 구역 모니터</h3>
                      <p className="text-lg text-amber-600">일용직 근무일수 관리 및 4대보험 비용 계산</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                    <span className="text-lg font-medium text-amber-700">3명 주의</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Quick Job Posting Button */}
        <section>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="w-full md:w-auto h-16 text-xl px-8 bg-slate-700 hover:bg-slate-800 text-white"
              >
                <Plus className="h-7 w-7 mr-3" />
                간편 공고 등록
              </Button>
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
                    onChange={(e) => setJobForm({...jobForm, date: e.target.value})}
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-lg">시작 시간</FieldLabel>
                  <Select value={jobForm.time} onValueChange={(v) => setJobForm({...jobForm, time: v})}>
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
                  <Select value={jobForm.workers} onValueChange={(v) => setJobForm({...jobForm, workers: v})}>
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <SelectItem key={n} value={String(n)} className="text-lg">{n}명</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="text-lg">작업 유형</FieldLabel>
                  <Select value={jobForm.task} onValueChange={(v) => setJobForm({...jobForm, task: v})}>
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
        </section>

        {/* Real-time Matching Status */}
        <section>
          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-3 text-slate-800">
                <Clock className="h-8 w-8" />
                실시간 매칭 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobPostings.map((job) => (
                <div 
                  key={job.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl bg-slate-100 border-2 border-slate-200 gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-slate-800">{job.title}</h3>
                    <p className="text-lg text-slate-600 flex items-center gap-2 mt-1">
                      <MapPin className="h-5 w-5" />
                      {job.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-center">
                      <p className="text-lg text-slate-600">지원자</p>
                      <p className="text-2xl md:text-3xl font-bold text-slate-800">
                        {job.applicants}/{job.needed}
                      </p>
                    </div>
                    <Badge 
                      className={`text-lg px-4 py-2 ${
                        job.status === "매칭완료" 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      {job.status === "매칭완료" ? (
                        <CheckCircle className="h-5 w-5 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mr-2" />
                      )}
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Trusted Workers List */}
        <section>
          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-3 text-slate-800">
                <Star className="h-8 w-8" />
                신뢰 기반 인력 리스트
              </CardTitle>
              <CardDescription className="text-lg">과거 근무 이력을 기반으로 한 추천 인력</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trustedWorkers.map((worker) => (
                  <div 
                    key={worker.id} 
                    className="p-5 rounded-xl bg-slate-100 border-2 border-slate-200 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl md:text-2xl font-semibold text-slate-800">{worker.name}</h3>
                      <div className="flex items-center gap-2">
                        {worker.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-base bg-slate-200 text-slate-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-slate-600">신뢰 점수</span>
                        <span className="text-xl font-bold text-slate-800">{worker.trustScore}점</span>
                      </div>
                      <Progress value={worker.trustScore} className="h-3" />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Badge 
                        variant="outline" 
                        className={`text-base px-3 py-1 ${
                          worker.noShows === 0 
                            ? "border-emerald-300 text-emerald-700 bg-emerald-50" 
                            : "border-amber-300 text-amber-700 bg-amber-50"
                        }`}
                      >
                        노쇼 {worker.noShows}회
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-base px-3 py-1 border-blue-300 text-blue-700 bg-blue-50"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        연속 {worker.consecutiveDays}일
                      </Badge>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full h-12 text-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-200"
                    >
                      우선 매칭 요청
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Map Placeholder */}
        <section>
          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-3 text-slate-800">
                <MapPin className="h-8 w-8" />
                픽업 위치 및 지원자 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 md:h-96 rounded-xl bg-slate-200 border-2 border-slate-300 flex items-center justify-center overflow-hidden">
                {/* Map placeholder with visual elements */}
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    {/* Roads */}
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#64748b" strokeWidth="8" />
                    <line x1="200" y1="0" x2="200" y2="300" stroke="#64748b" strokeWidth="8" />
                    <line x1="50" y1="80" x2="350" y2="220" stroke="#94a3b8" strokeWidth="4" />
                    {/* Buildings */}
                    <rect x="60" y="60" width="60" height="50" fill="#475569" rx="4" />
                    <rect x="280" y="180" width="70" height="60" fill="#475569" rx="4" />
                    <rect x="140" y="200" width="50" height="45" fill="#475569" rx="4" />
                  </svg>
                </div>
                {/* Factory marker */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center shadow-lg">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <span className="mt-2 text-base font-medium text-slate-700 bg-white px-2 py-1 rounded shadow">공장</span>
                  </div>
                </div>
                {/* Worker markers */}
                <div className="absolute top-1/4 left-1/4">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg border-2 border-white">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="absolute top-2/3 right-1/3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg border-2 border-white">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-1/4 left-1/3">
                  <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                </div>
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow">
                  <div className="flex items-center gap-4 text-base">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                      <span className="text-slate-700">지원자</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                      <span className="text-slate-700">픽업 차량</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
