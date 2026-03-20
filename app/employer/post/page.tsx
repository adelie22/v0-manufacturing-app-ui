"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ChevronDown, MapPin, Calendar, Clock,
  Users, Wallet, CheckCircle2, ArrowLeft, Plus, X
} from "lucide-react"

const CATEGORIES = ["제조/생산", "물류/창고", "식품/음료", "건설/현장", "서비스/기타"]
const TASKS: Record<string, string[]> = {
  "제조/생산": ["단순조립", "검수", "포장", "도장보조", "용접보조", "프레스보조", "기타"],
  "물류/창고": ["분류", "피킹", "패킹", "상차", "하차", "재고관리", "기타"],
  "식품/음료": ["식품생산", "포장", "세척", "검수", "기타"],
  "건설/현장": ["자재운반", "청소", "잡부", "기타"],
  "서비스/기타": ["행사도우미", "주차관리", "청소", "기타"],
}

export default function PostJobPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    category: "",
    companyName: "",
    location: "",
    date: "",
    startTime: "09:00",
    endTime: "18:00",
    headcount: "1",
    payType: "daily",
    payAmount: "",
    instantPay: true,
    pickup: false,
    description: "",
    selectedTasks: [] as string[],
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (key: string, val: unknown) => setForm(prev => ({ ...prev, [key]: val }))

  const toggleTask = (task: string) => {
    set("selectedTasks",
      form.selectedTasks.includes(task)
        ? form.selectedTasks.filter(t => t !== task)
        : [...form.selectedTasks, task]
    )
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">공고가 등록되었습니다!</h2>
          <p className="text-gray-500">매칭이 시작되면 알림을 보내드릴게요</p>
          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => router.push("/employer")}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12">
              대시보드로 이동
            </Button>
            <Button onClick={() => { setSubmitted(false); setStep(1); setForm({ category: "", companyName: "", location: "", date: "", startTime: "09:00", endTime: "18:00", headcount: "1", payType: "daily", payAmount: "", instantPay: true, pickup: false, description: "", selectedTasks: [] }) }}
              variant="ghost" className="w-full text-gray-500 rounded-xl h-12">
              추가 공고 등록
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/employer" className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="일손매칭" width={24} height={24} className="rounded-lg object-cover" />
            <span className="font-semibold text-gray-900">공고 등록</span>
          </div>
          {/* 진행 바 */}
          <div className="ml-auto flex items-center gap-1.5">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-2 rounded-full transition-all ${s === step ? "w-8 bg-blue-600" : s < step ? "w-4 bg-blue-300" : "w-4 bg-gray-200"}`} />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* STEP 1: 기본 정보 */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">어떤 인력이 필요하신가요?</h2>
              <p className="text-sm text-gray-400">업종과 회사 정보를 입력해주세요</p>
            </div>

            {/* 업종 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">업종 선택</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => set("category", cat)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${form.category === cat ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 회사명 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">사업장명</label>
              <input
                value={form.companyName}
                onChange={e => set("companyName", e.target.value)}
                placeholder="예: 삼성전자 협력사, 청주 A공장"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 위치 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> 근무 위치
              </label>
              <input
                value={form.location}
                onChange={e => set("location", e.target.value)}
                placeholder="예: 충북 청주시 흥덕구 오송읍"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* STEP 2: 근무 조건 */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">근무 조건을 입력해주세요</h2>
              <p className="text-sm text-gray-400">날짜, 시간, 급여를 설정하세요</p>
            </div>

            {/* 날짜 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> 근무 날짜
              </label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* 시간 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> 근무 시간
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">시작</p>
                  <input type="time" value={form.startTime} onChange={e => set("startTime", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">종료</p>
                  <input type="time" value={form.endTime} onChange={e => set("endTime", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* 인원 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> 모집 인원
              </label>
              <div className="flex items-center gap-3">
                <button onClick={() => set("headcount", String(Math.max(1, Number(form.headcount) - 1)))}
                  className="h-10 w-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-lg font-medium hover:bg-gray-50">−</button>
                <span className="text-lg font-semibold w-8 text-center">{form.headcount}</span>
                <button onClick={() => set("headcount", String(Number(form.headcount) + 1))}
                  className="h-10 w-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-lg font-medium hover:bg-gray-50">+</button>
                <span className="text-sm text-gray-500">명</span>
              </div>
            </div>

            {/* 급여 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5" /> 급여
              </label>
              <div className="flex gap-2 mb-2">
                {[{ val: "daily", label: "일당" }, { val: "hourly", label: "시급" }].map(({ val, label }) => (
                  <button key={val} onClick={() => set("payType", val)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${form.payType === val ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600"}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={form.payAmount}
                  onChange={e => set("payAmount", e.target.value)}
                  placeholder={form.payType === "daily" ? "예: 120000" : "예: 12000"}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
              </div>
            </div>

            {/* 당일지급 / 픽업 */}
            <div className="space-y-3">
              {[
                { key: "instantPay", label: "당일지급 보장", desc: "근무 당일 급여 지급" },
                { key: "pickup", label: "픽업 제공", desc: "사업장 차량으로 픽업" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <button
                    onClick={() => set(key, !form[key as keyof typeof form])}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form[key as keyof typeof form] ? "bg-blue-600" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form[key as keyof typeof form] ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: 업무 내용 */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">업무 내용을 알려주세요</h2>
              <p className="text-sm text-gray-400">구직자가 어떤 일을 하는지 설명해주세요</p>
            </div>

            {/* 업무 태그 */}
            {form.category && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">업무 태그 선택</label>
                <div className="flex flex-wrap gap-2">
                  {(TASKS[form.category] ?? []).map(task => (
                    <button key={task} onClick={() => toggleTask(task)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all flex items-center gap-1 ${form.selectedTasks.includes(task) ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                      {form.selectedTasks.includes(task) ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                      {task}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 상세 설명 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">상세 업무 설명 (선택)</label>
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="예: 반도체 부품 단순 조립 작업입니다. 서서 하는 작업이며 체력 요구됩니다. 경험자 우대하나 초보도 가능합니다."
                rows={5}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* 공고 미리보기 요약 */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-semibold text-blue-800 mb-2">📋 공고 요약</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p>🏭 {form.category} · {form.companyName || "사업장명 미입력"}</p>
                <p>📍 {form.location || "위치 미입력"}</p>
                <p>📅 {form.date || "날짜 미입력"} · {form.startTime} ~ {form.endTime}</p>
                <p>👥 {form.headcount}명 · {form.payType === "daily" ? "일당" : "시급"} {Number(form.payAmount).toLocaleString() || "0"}원</p>
                {form.instantPay && <p className="text-emerald-600 font-medium">✅ 당일지급 보장</p>}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 1 && (
            <Button onClick={() => setStep(s => s - 1)} variant="outline"
              className="flex-1 h-12 rounded-xl border-gray-200 text-gray-600">
              이전
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && (!form.category || !form.companyName || !form.location)}
              className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              다음
            </Button>
          ) : (
            <Button onClick={handleSubmit}
              className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              공고 등록하기
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
