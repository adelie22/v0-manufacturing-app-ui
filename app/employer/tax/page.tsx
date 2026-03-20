"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileText, RefreshCw, AlertCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Worker {
  id: string
  name: string
  days: number
  totalPay: number
  incomeTax: number
  localTax: number
  totalTax: number
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
  deadlines: {
    withholding: string
    work: string
    statement: string
  }
}

const DOCS = [
  { key: "tax",         label: "세금계산 내역",            desc: "근로자별 세금 상세",        color: "blue" },
  { key: "withholding", label: "원천징수이행상황신고서",    desc: "매월 10일까지 홈택스 제출", color: "orange" },
  { key: "work",        label: "근로내용확인신고서",        desc: "매월 15일까지 근복공 제출", color: "emerald" },
  { key: "statement",   label: "일용근로소득 지급명세서",   desc: "분기 다음달 말 홈택스 제출", color: "purple" },
] as const

function fmt(n: number) { return n.toLocaleString("ko-KR") }

export default function TaxPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [data, setData] = useState<TaxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [tab, setTab] = useState<"summary" | "workers">("summary")

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/employer/tax-report?year=${year}&month=${month}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
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

  const colorMap = {
    blue:    { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   btn: "bg-blue-600 hover:bg-blue-500" },
    orange:  { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", btn: "bg-orange-500 hover:bg-orange-400" },
    emerald: { bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200",btn: "bg-emerald-600 hover:bg-emerald-500" },
    purple:  { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", btn: "bg-purple-600 hover:bg-purple-500" },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
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
        <div className="flex gap-2">
          <div className="relative">
            <select value={year} onChange={e => setYear(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
              {[now.getFullYear() - 1, now.getFullYear()].map(y => <option key={y}>{y}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={month} onChange={e => setMonth(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m =>
                <option key={m} value={m}>{m}월</option>
              )}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
          <span className="flex items-center text-sm text-gray-500">기준 현황</span>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-sm">계산 중...</p>
          </div>
        )}

        {!loading && data && (
          <>
            {/* 요약 카드 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">{year}년 {month}월 현황</h2>
                <Button onClick={() => handleDownload("all")} disabled={!!downloading}
                  className="h-8 px-3 text-xs bg-gray-900 hover:bg-gray-700 text-white rounded-lg">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  전체 다운로드
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "근무 인원", value: `${data.summary.workerCount}명` },
                  { label: "총 지급액", value: `${fmt(data.summary.totalPay)}원` },
                  { label: "원천징수세액", value: `${fmt(data.summary.totalIncomeTax)}원`, sub: "소득세" },
                  { label: "지방소득세", value: `${fmt(data.summary.totalLocalTax)}원` },
                  { label: "합계 세액", value: `${fmt(data.summary.totalTax)}원`, highlight: true },
                  { label: "실 지급액", value: `${fmt(data.summary.netPay)}원` },
                ].map(item => (
                  <div key={item.label} className={`p-3 rounded-xl ${item.highlight ? "bg-blue-50" : "bg-gray-50"}`}>
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className={`text-sm font-bold ${item.highlight ? "text-blue-700" : "text-gray-900"}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {data.summary.workerCount === 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  이 기간에 확정된 근무 내역이 없습니다. 공고에서 지원자를 수락하면 집계됩니다.
                </div>
              )}
            </div>

            {/* 신고 마감일 */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> 신고 마감일
              </p>
              {Object.values(data.deadlines).map(d => (
                <p key={d} className="text-xs text-amber-700">⏰ {d}</p>
              ))}
            </div>

            {/* 탭 */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {(["summary", "workers"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                  {t === "summary" ? "서류 다운로드" : "근로자별 상세"}
                </button>
              ))}
            </div>

            {/* 서류 다운로드 */}
            {tab === "summary" && (
              <div className="space-y-3">
                {DOCS.map(doc => {
                  const c = colorMap[doc.color]
                  return (
                    <div key={doc.key} className={`bg-white rounded-2xl border ${c.border} p-4 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                          <FileText className={`h-5 w-5 ${c.text}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{doc.label}</p>
                          <p className="text-xs text-gray-400">{doc.desc}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(doc.key)}
                        disabled={!!downloading}
                        className={`h-9 px-4 text-xs text-white rounded-xl ${c.btn}`}
                      >
                        {downloading === doc.key
                          ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          : <><Download className="h-3.5 w-3.5 mr-1" />엑셀</>}
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* 근로자별 상세 */}
            {tab === "workers" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {data.workers.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    확정된 근무자가 없습니다
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {["성명", "근무일수", "총지급액", "소득세", "지방세", "합계세액"].map(h => (
                          <th key={h} className="px-3 py-3 text-xs font-medium text-gray-500 text-right first:text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.workers.map(w => (
                        <tr key={w.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 font-medium text-gray-900">{w.name}</td>
                          <td className="px-3 py-3 text-right text-gray-600">{w.days}일</td>
                          <td className="px-3 py-3 text-right text-gray-900">{fmt(w.totalPay)}</td>
                          <td className="px-3 py-3 text-right text-gray-600">{fmt(w.incomeTax)}</td>
                          <td className="px-3 py-3 text-right text-gray-600">{fmt(w.localTax)}</td>
                          <td className="px-3 py-3 text-right font-semibold text-blue-700">{fmt(w.totalTax)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-semibold">
                        <td className="px-3 py-3 text-gray-900">합계</td>
                        <td className="px-3 py-3 text-right text-gray-900">{data.workers.reduce((s, w) => s + w.days, 0)}일</td>
                        <td className="px-3 py-3 text-right text-gray-900">{fmt(data.summary.totalPay)}</td>
                        <td className="px-3 py-3 text-right text-gray-900">{fmt(data.summary.totalIncomeTax)}</td>
                        <td className="px-3 py-3 text-right text-gray-900">{fmt(data.summary.totalLocalTax)}</td>
                        <td className="px-3 py-3 text-right text-blue-700">{fmt(data.summary.totalTax)}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
