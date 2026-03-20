"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileText, RefreshCw, AlertCircle, ChevronDown, ChevronUp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Worker {
  id: string
  name: string
  days: number
  totalPay: number
  incomeTax: number
  localTax: number
  totalTax: number
  jobs: { date: string; pay: number }[]
}

interface TaxData {
  year: number
  month: number
  summary: {
    workerCount: number
    totalPay: number
    totalIncomeTax: number
    totalLocalTax: number
    totalTax: number
    netPay: number
  }
  workers: Worker[]
  deadlines: { withholding: string; work: string; statement: string }
}

// 하드코딩 샘플 데이터 (실제 데이터 없을 때 표시)
const MOCK: TaxData = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  summary: {
    workerCount: 4,
    totalPay: 4820000,
    totalIncomeTax: 82140,
    totalLocalTax: 8214,
    totalTax: 90354,
    netPay: 4729646,
  },
  workers: [
    { id: "1", name: "김민수", days: 12, totalPay: 1560000, incomeTax: 34020, localTax: 3402, totalTax: 37422, jobs: [{ date: "3월 3일", pay: 130000 }, { date: "3월 5일", pay: 130000 }] },
    { id: "2", name: "이영희", days: 8,  totalPay: 960000,  incomeTax: 21600, localTax: 2160, totalTax: 23760, jobs: [{ date: "3월 4일", pay: 120000 }] },
    { id: "3", name: "박철수", days: 10, totalPay: 1300000, incomeTax: 18900, localTax: 1890, totalTax: 20790, jobs: [{ date: "3월 6일", pay: 130000 }] },
    { id: "4", name: "정지은", days: 7,  totalPay: 1000000, incomeTax: 7620,  localTax: 762,  totalTax: 8382,  jobs: [{ date: "3월 7일", pay: 143000 }] },
  ],
  deadlines: {
    withholding: `${new Date().getFullYear()}년 ${new Date().getMonth() + 2}월 10일 (원천징수이행상황신고서)`,
    work:        `${new Date().getFullYear()}년 ${new Date().getMonth() + 2}월 15일 (근로내용확인신고서)`,
    statement:   `${new Date().getFullYear()}년 ${Math.ceil((new Date().getMonth() + 1) / 3) * 3 + 1}월 말일 (일용근로소득 지급명세서)`,
  },
}

function fmt(n: number) { return n.toLocaleString("ko-KR") }

// ── 미리보기 컴포넌트들 ──────────────────────────────────────

function PreviewTax({ d }: { d: TaxData }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <p className="text-xs text-gray-400 mb-2">※ 참고용 미리보기입니다</p>
      <table className="w-full text-xs border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-blue-50">
          <tr>{["성명","근무일수","총지급액","원천징수세액","지방소득세","합계세액","차감지급액"].map(h =>
            <th key={h} className="px-2 py-2 text-gray-600 font-medium text-right first:text-left border-b border-gray-200">{h}</th>
          )}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {d.workers.map(w => (
            <tr key={w.id} className="bg-white">
              <td className="px-2 py-2 font-medium text-gray-900">{w.name}</td>
              <td className="px-2 py-2 text-right text-gray-700">{w.days}일</td>
              <td className="px-2 py-2 text-right text-gray-700">{fmt(w.totalPay)}</td>
              <td className="px-2 py-2 text-right text-gray-700">{fmt(w.incomeTax)}</td>
              <td className="px-2 py-2 text-right text-gray-700">{fmt(w.localTax)}</td>
              <td className="px-2 py-2 text-right font-semibold text-blue-700">{fmt(w.totalTax)}</td>
              <td className="px-2 py-2 text-right text-gray-700">{fmt(w.totalPay - w.totalTax)}</td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-semibold">
            <td className="px-2 py-2 text-gray-900">합계</td>
            <td className="px-2 py-2 text-right">{d.workers.reduce((s,w)=>s+w.days,0)}일</td>
            <td className="px-2 py-2 text-right">{fmt(d.summary.totalPay)}</td>
            <td className="px-2 py-2 text-right">{fmt(d.summary.totalIncomeTax)}</td>
            <td className="px-2 py-2 text-right">{fmt(d.summary.totalLocalTax)}</td>
            <td className="px-2 py-2 text-right text-blue-700">{fmt(d.summary.totalTax)}</td>
            <td className="px-2 py-2 text-right">{fmt(d.summary.netPay)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function PreviewWithholding({ d }: { d: TaxData }) {
  return (
    <div className="mt-3 text-xs space-y-3">
      <p className="text-gray-400">※ 참고용 미리보기 — 홈택스 원천세 신고 메뉴에 동일하게 입력하세요</p>
      <div className="border border-orange-200 rounded-xl overflow-hidden">
        <div className="bg-orange-50 px-3 py-2 font-semibold text-orange-800">원천징수이행상황신고서</div>
        <div className="bg-white px-3 py-2 space-y-1 text-gray-600">
          <p>신고기간: {d.year}년 {d.month}월</p>
          <p>신고기한: {d.deadlines.withholding.split("(")[0].trim()}</p>
        </div>
        <table className="w-full">
          <thead className="bg-orange-50">
            <tr>{["소득구분","인원","총지급액","소득세","지방소득세","납부세액"].map(h =>
              <th key={h} className="px-2 py-2 text-gray-600 font-medium text-right first:text-left border-y border-orange-100">{h}</th>
            )}</tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="px-2 py-2 text-gray-800 font-medium">일용근로(A03)</td>
              <td className="px-2 py-2 text-right">{d.summary.workerCount}명</td>
              <td className="px-2 py-2 text-right">{fmt(d.summary.totalPay)}</td>
              <td className="px-2 py-2 text-right">{fmt(d.summary.totalIncomeTax)}</td>
              <td className="px-2 py-2 text-right">{fmt(d.summary.totalLocalTax)}</td>
              <td className="px-2 py-2 text-right font-bold text-orange-700">{fmt(d.summary.totalTax)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PreviewWork({ d }: { d: TaxData }) {
  return (
    <div className="mt-3 text-xs space-y-3">
      <p className="text-gray-400">※ 참고용 미리보기 — 근로복지공단 EDI에 제출하세요</p>
      <div className="border border-emerald-200 rounded-xl overflow-hidden">
        <div className="bg-emerald-50 px-3 py-2 font-semibold text-emerald-800">근로내용확인신고서</div>
        <div className="bg-white px-3 py-2 text-gray-600">
          <p>신고기간: {d.year}년 {d.month}월 / 기한: {d.deadlines.work.split("(")[0].trim()}</p>
        </div>
        <table className="w-full">
          <thead className="bg-emerald-50">
            <tr>{["성명","근무일수","총지급액","근무날짜"].map(h =>
              <th key={h} className="px-2 py-2 text-gray-600 font-medium text-left border-y border-emerald-100">{h}</th>
            )}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {d.workers.map(w => (
              <tr key={w.id} className="bg-white">
                <td className="px-2 py-2 font-medium text-gray-900">{w.name}</td>
                <td className="px-2 py-2 text-gray-700">{w.days}일</td>
                <td className="px-2 py-2 text-gray-700">{fmt(w.totalPay)}</td>
                <td className="px-2 py-2 text-gray-500">{w.jobs.map(j=>j.date).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PreviewStatement({ d }: { d: TaxData }) {
  return (
    <div className="mt-3 text-xs space-y-3">
      <p className="text-gray-400">※ 참고용 미리보기 — 홈택스 지급명세서 제출 메뉴에서 제출하세요</p>
      <div className="border border-purple-200 rounded-xl overflow-hidden">
        <div className="bg-purple-50 px-3 py-2 font-semibold text-purple-800">일용근로소득 지급명세서</div>
        <div className="bg-white px-3 py-2 text-gray-600">
          <p>신고기간: {d.year}년 {d.month}월 / 기한: {d.deadlines.statement.split("(")[0].trim()}</p>
        </div>
        <table className="w-full">
          <thead className="bg-purple-50">
            <tr>{["일련번호","성명","근무일수","총지급액","소득세","지방세","차감지급액"].map(h =>
              <th key={h} className="px-2 py-2 text-gray-600 font-medium text-right first:text-left border-y border-purple-100">{h}</th>
            )}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {d.workers.map((w, i) => (
              <tr key={w.id} className="bg-white">
                <td className="px-2 py-2 text-gray-500">{i+1}</td>
                <td className="px-2 py-2 font-medium text-gray-900">{w.name}</td>
                <td className="px-2 py-2 text-right text-gray-700">{w.days}일</td>
                <td className="px-2 py-2 text-right text-gray-700">{fmt(w.totalPay)}</td>
                <td className="px-2 py-2 text-right text-gray-700">{fmt(w.incomeTax)}</td>
                <td className="px-2 py-2 text-right text-gray-700">{fmt(w.localTax)}</td>
                <td className="px-2 py-2 text-right font-semibold text-purple-700">{fmt(w.totalPay-w.totalTax)}</td>
              </tr>
            ))}
            <tr className="bg-purple-50 font-semibold">
              <td colSpan={2} className="px-2 py-2 text-gray-900">합계</td>
              <td className="px-2 py-2 text-right">{d.workers.reduce((s,w)=>s+w.days,0)}일</td>
              <td className="px-2 py-2 text-right">{fmt(d.summary.totalPay)}</td>
              <td className="px-2 py-2 text-right">{fmt(d.summary.totalIncomeTax)}</td>
              <td className="px-2 py-2 text-right">{fmt(d.summary.totalLocalTax)}</td>
              <td className="px-2 py-2 text-right text-purple-700">{fmt(d.summary.netPay)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const PREVIEW_MAP = {
  tax:         PreviewTax,
  withholding: PreviewWithholding,
  work:        PreviewWork,
  statement:   PreviewStatement,
}

const DOCS = [
  { key: "tax",         label: "세금계산 내역",           desc: "근로자별 세금 상세",         color: "blue"    },
  { key: "withholding", label: "원천징수이행상황신고서",   desc: "매월 10일 · 홈택스 제출",    color: "orange"  },
  { key: "work",        label: "근로내용확인신고서",       desc: "매월 15일 · 근복공 제출",    color: "emerald" },
  { key: "statement",   label: "일용근로소득 지급명세서",  desc: "분기 다음달 말 · 홈택스",    color: "purple"  },
] as const

const COLOR = {
  blue:    { bg:"bg-blue-50",    text:"text-blue-700",    border:"border-blue-200",    btn:"bg-blue-600 hover:bg-blue-500",       eye:"text-blue-600"    },
  orange:  { bg:"bg-orange-50",  text:"text-orange-700",  border:"border-orange-200",  btn:"bg-orange-500 hover:bg-orange-400",   eye:"text-orange-500"  },
  emerald: { bg:"bg-emerald-50", text:"text-emerald-700", border:"border-emerald-200", btn:"bg-emerald-600 hover:bg-emerald-500", eye:"text-emerald-600" },
  purple:  { bg:"bg-purple-50",  text:"text-purple-700",  border:"border-purple-200",  btn:"bg-purple-600 hover:bg-purple-500",   eye:"text-purple-600"  },
}

export default function TaxPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [data, setData] = useState<TaxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [openPreview, setOpenPreview] = useState<string | null>(null)
  const [isMock, setIsMock] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/employer/tax-report?year=${year}&month=${month}`)
      .then(r => r.json())
      .then(d => {
        if (d.summary?.workerCount === 0) {
          setData({ ...MOCK, year, month })
          setIsMock(true)
        } else {
          setData(d)
          setIsMock(false)
        }
        setLoading(false)
      })
      .catch(() => { setData({ ...MOCK, year, month }); setIsMock(true); setLoading(false) })
  }, [year, month])

  useEffect(() => { load() }, [load])

  const handleDownload = async (type: string) => {
    setDownloading(type)
    const res = await fetch(`/api/employer/tax-report?year=${year}&month=${month}&download=${type}`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}_${year}${String(month).padStart(2, "0")}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    }
    setDownloading(null)
  }

  const togglePreview = (key: string) =>
    setOpenPreview(prev => prev === key ? null : key)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/employer" className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <span className="font-semibold text-gray-900">세금 · 신고 현황</span>
          <button onClick={load} className="ml-auto p-2 rounded-full hover:bg-gray-100">
            <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* 기간 선택 */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select value={year} onChange={e => setYear(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
              {[now.getFullYear()-1, now.getFullYear()].map(y=><option key={y}>{y}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={month} onChange={e => setMonth(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
              {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}월</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-sm text-gray-500">기준</span>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-sm">계산 중...</p>
          </div>
        )}

        {!loading && data && (
          <>
            {/* 샘플 안내 */}
            {isMock && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                실제 근무 데이터가 없어 샘플로 표시 중입니다. 공고에서 지원자를 수락하면 실제 데이터로 반영됩니다.
              </div>
            )}

            {/* 요약 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">{year}년 {month}월 현황</h2>
                <Button onClick={() => handleDownload("all")} disabled={!!downloading}
                  className="h-8 px-3 text-xs bg-gray-900 hover:bg-gray-700 text-white rounded-lg">
                  {downloading === "all" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <><Download className="h-3.5 w-3.5 mr-1" />전체 엑셀</>}
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label:"근무 인원",    value:`${data.summary.workerCount}명` },
                  { label:"총 지급액",    value:`${fmt(data.summary.totalPay)}원` },
                  { label:"원천징수세액", value:`${fmt(data.summary.totalIncomeTax)}원` },
                  { label:"지방소득세",   value:`${fmt(data.summary.totalLocalTax)}원` },
                  { label:"합계 세액",    value:`${fmt(data.summary.totalTax)}원`, highlight:true },
                  { label:"실 지급액",    value:`${fmt(data.summary.netPay)}원` },
                ].map(item => (
                  <div key={item.label} className={`p-3 rounded-xl ${item.highlight ? "bg-blue-50" : "bg-gray-50"}`}>
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className={`text-sm font-bold ${item.highlight ? "text-blue-700" : "text-gray-900"}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 마감일 */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-1.5">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> 신고 마감일
              </p>
              {Object.values(data.deadlines).map(d => (
                <p key={d} className="text-xs text-amber-700">⏰ {d}</p>
              ))}
            </div>

            {/* 서류별 미리보기 + 다운로드 */}
            <div className="space-y-3">
              {DOCS.map(doc => {
                const c = COLOR[doc.color]
                const Preview = PREVIEW_MAP[doc.key]
                const isOpen = openPreview === doc.key
                return (
                  <div key={doc.key} className={`bg-white rounded-2xl border ${c.border} overflow-hidden`}>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                          <FileText className={`h-5 w-5 ${c.text}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{doc.label}</p>
                          <p className="text-xs text-gray-400">{doc.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePreview(doc.key)}
                          className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${isOpen ? `${c.bg} ${c.text} border-current` : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                          <Eye className="h-3.5 w-3.5" />
                          {isOpen ? "닫기" : "미리보기"}
                          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                        <Button onClick={() => handleDownload(doc.key)} disabled={!!downloading}
                          className={`h-8 px-3 text-xs text-white rounded-lg ${c.btn}`}>
                          {downloading === doc.key ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <><Download className="h-3 w-3 mr-1" />엑셀</>}
                        </Button>
                      </div>
                    </div>

                    {/* 인라인 미리보기 */}
                    {isOpen && (
                      <div className={`border-t ${c.border} px-4 pb-4`}>
                        <Preview d={data} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
