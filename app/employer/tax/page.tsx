"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileText, RefreshCw, AlertCircle, ChevronDown, ChevronUp, Eye, ExternalLink, Archive, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

// D-day 계산
function calcDeadlines(year: number, month: number) {
  // 원천징수: 다음달 10일
  const withholding = new Date(year, month, 10) // JS Date month은 0-indexed → month(1-based)이 그대로 다음달
  // 근로내용확인: 다음달 15일
  const work = new Date(year, month, 15)
  // 지급명세서: 분기 다음달 말일 (Q1→4/30, Q2→7/31, Q3→10/31, Q4→다음해 1/31)
  const quarter = Math.ceil(month / 3)
  const stmtMonth = quarter * 3 + 1 // 4, 7, 10, 13
  const stmtYear = year + (stmtMonth > 12 ? 1 : 0)
  const statement = new Date(stmtYear, stmtMonth > 12 ? 1 : stmtMonth, 0) // day=0 → 전달 말일
  return { withholding, work, statement }
}

function getDday(deadline: Date): { label: string; color: string; bgColor: string } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(deadline)
  d.setHours(0, 0, 0, 0)
  const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000)
  if (diff < 0)  return { label: `D+${Math.abs(diff)}`, color: "text-gray-400", bgColor: "bg-gray-100" }
  if (diff === 0) return { label: "D-DAY",  color: "text-red-600",    bgColor: "bg-red-100" }
  if (diff <= 3)  return { label: `D-${diff}`, color: "text-red-600",    bgColor: "bg-red-100" }
  if (diff <= 7)  return { label: `D-${diff}`, color: "text-orange-600", bgColor: "bg-orange-100" }
  return              { label: `D-${diff}`, color: "text-emerald-600", bgColor: "bg-emerald-100" }
}

function fmtDate(d: Date) {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

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
      <p className="text-gray-400">※ 참고용 미리보기 — XML 파일 다운로드 후 토탈서비스에 업로드하세요</p>
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

// 서류별 메타 정보
const DOCS = [
  {
    key: "withholding",
    label: "원천징수이행상황신고서",
    deadline: "매월 10일까지",
    color: "orange",
    fileType: "XLSX",
    fileLabel: "XLSX 다운로드",
    submitRequired: true,
    siteLabel: "홈택스",
    siteUrl: "https://www.hometax.go.kr",
    siteNote: "홈택스 → 신고/납부 → 원천세",
    apiKey: "withholding",
    fileExt: "xlsx",
  },
  {
    key: "work",
    label: "근로내용확인신고서",
    deadline: "매월 15일까지",
    color: "emerald",
    fileType: "XML",
    fileLabel: "XML 다운로드",
    submitRequired: true,
    siteLabel: "토탈서비스",
    siteUrl: "https://total.comwel.or.kr",
    siteNote: "토탈서비스 → 근로내용확인신고",
    apiKey: "work_xml",
    fileExt: "xml",
  },
  {
    key: "statement",
    label: "일용근로소득 지급명세서",
    deadline: "분기 다음달 말",
    color: "purple",
    fileType: "XLSX",
    fileLabel: "XLSX 다운로드",
    submitRequired: true,
    siteLabel: "홈택스",
    siteUrl: "https://www.hometax.go.kr",
    siteNote: "홈택스 → 신고/납부 → 지급명세서",
    apiKey: "statement",
    fileExt: "xlsx",
  },
  {
    key: "tax",
    label: "세금계산 내역",
    deadline: "제출 불필요",
    color: "blue",
    fileType: "XLSX",
    fileLabel: "XLSX 다운로드",
    submitRequired: false,
    siteLabel: null,
    siteUrl: null,
    siteNote: null,
    apiKey: "tax",
    fileExt: "xlsx",
  },
] as const

type DocKey = typeof DOCS[number]["key"]
type ColorKey = typeof DOCS[number]["color"]

const COLOR: Record<ColorKey, { bg: string; text: string; border: string; btn: string; sitebtn: string; step: string }> = {
  blue:    { bg:"bg-blue-50",    text:"text-blue-700",    border:"border-blue-200",    btn:"bg-blue-600 hover:bg-blue-500",         sitebtn:"border-blue-300 text-blue-700 hover:bg-blue-50",       step:"bg-blue-100 text-blue-800"    },
  orange:  { bg:"bg-orange-50",  text:"text-orange-700",  border:"border-orange-200",  btn:"bg-orange-500 hover:bg-orange-400",      sitebtn:"border-orange-300 text-orange-700 hover:bg-orange-50", step:"bg-orange-100 text-orange-800" },
  emerald: { bg:"bg-emerald-50", text:"text-emerald-700", border:"border-emerald-200", btn:"bg-emerald-600 hover:bg-emerald-500",    sitebtn:"border-emerald-300 text-emerald-700 hover:bg-emerald-50", step:"bg-emerald-100 text-emerald-800" },
  purple:  { bg:"bg-purple-50",  text:"text-purple-700",  border:"border-purple-200",  btn:"bg-purple-600 hover:bg-purple-500",      sitebtn:"border-purple-300 text-purple-700 hover:bg-purple-50", step:"bg-purple-100 text-purple-800"  },
}

export default function TaxPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [data, setData] = useState<TaxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [openPreview, setOpenPreview] = useState<DocKey | null>(null)
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

  const handleDownload = async (apiKey: string, fileExt: string, label: string) => {
    setDownloading(apiKey)
    const res = await fetch(`/api/employer/tax-report?year=${year}&month=${month}&download=${apiKey}`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${label}_${year}${String(month).padStart(2, "0")}.${fileExt}`
      a.click()
      URL.revokeObjectURL(url)
    }
    setDownloading(null)
  }

  const togglePreview = (key: DocKey) =>
    setOpenPreview(prev => prev === key ? null : key)

  // D-day 계산 (선택된 year/month 기준)
  const deadlineDates = calcDeadlines(year, month)
  const ddayMap: Record<string, { date: Date; dday: ReturnType<typeof getDday> }> = {
    withholding: { date: deadlineDates.withholding, dday: getDday(deadlineDates.withholding) },
    work:        { date: deadlineDates.work,         dday: getDday(deadlineDates.work) },
    statement:   { date: deadlineDates.statement,    dday: getDday(deadlineDates.statement) },
  }

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
                <Button
                  onClick={() => handleDownload("all", "xlsx", "전체세금자료")}
                  disabled={!!downloading}
                  className="h-8 px-3 text-xs bg-gray-900 hover:bg-gray-700 text-white rounded-lg">
                  {downloading === "all" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <><Download className="h-3.5 w-3.5 mr-1" />전체 XLSX</>}
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

            {/* 마감일 D-day */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-amber-500" /> 신고 마감일
              </p>
              <div className="space-y-2">
                {[
                  { label: "원천징수이행상황신고서", key: "withholding", color: "orange" },
                  { label: "근로내용확인신고서",     key: "work",        color: "emerald" },
                  { label: "일용근로소득 지급명세서", key: "statement",   color: "purple" },
                ].map(item => {
                  const info = ddayMap[item.key]
                  const { label: ddayLabel, color: ddayColor, bgColor } = info.dday
                  return (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-xs font-medium text-gray-700">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{fmtDate(info.date)}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bgColor} ${ddayColor}`}>
                        {ddayLabel}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 서류별 카드 */}
            <div className="space-y-3">
              {DOCS.map(doc => {
                const c = COLOR[doc.color]
                const Preview = PREVIEW_MAP[doc.key]
                const isOpen = openPreview === doc.key
                const isDownloading = downloading === doc.apiKey
                const ddayInfo = ddayMap[doc.key]

                return (
                  <div key={doc.key} className={`bg-white rounded-2xl border ${c.border} overflow-hidden`}>

                    {/* 카드 헤더 */}
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`h-10 w-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                          {doc.submitRequired
                            ? <FileText className={`h-5 w-5 ${c.text}`} />
                            : <Archive className={`h-5 w-5 ${c.text}`} />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{doc.label}</p>
                          <p className={`text-xs font-medium mt-0.5 ${doc.submitRequired ? "text-gray-500" : "text-gray-400"}`}>
                            {doc.submitRequired && ddayInfo
                              ? fmtDate(ddayInfo.date)
                              : doc.deadline
                            }
                            {!doc.submitRequired && (
                              <span className="ml-2 inline-flex items-center gap-0.5 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">
                                내부 보관용
                              </span>
                            )}
                          </p>
                        </div>
                        {/* D-day 배지 */}
                        {ddayInfo && (
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${ddayInfo.dday.bgColor} ${ddayInfo.dday.color}`}>
                            {ddayInfo.dday.label}
                          </span>
                        )}
                      </div>

                      {/* 2단계 제출 가이드 */}
                      {doc.submitRequired && doc.siteLabel && (
                        <div className={`rounded-xl px-3 py-2.5 mb-3 ${c.step}`}>
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <span className="flex items-center gap-1.5">
                              <span className="h-5 w-5 rounded-full bg-white/60 flex items-center justify-center font-bold text-xs">①</span>
                              {doc.fileType} 파일 다운로드
                            </span>
                            <span className="text-current opacity-50">→</span>
                            <span className="flex items-center gap-1.5">
                              <span className="h-5 w-5 rounded-full bg-white/60 flex items-center justify-center font-bold text-xs">②</span>
                              {doc.siteLabel}에 업로드
                            </span>
                          </div>
                          {doc.siteNote && (
                            <p className="text-xs mt-1 opacity-70">{doc.siteNote}</p>
                          )}
                        </div>
                      )}

                      {/* 버튼 행 */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* 파일 다운로드 */}
                        <Button
                          onClick={() => handleDownload(doc.apiKey, doc.fileExt, doc.label)}
                          disabled={!!downloading}
                          className={`h-8 px-3 text-xs text-white rounded-lg ${c.btn}`}>
                          {isDownloading
                            ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            : <><Download className="h-3 w-3 mr-1" />{doc.fileLabel}</>
                          }
                        </Button>

                        {/* 미리보기 */}
                        <button
                          onClick={() => togglePreview(doc.key)}
                          className={`flex items-center gap-1 text-xs font-medium h-8 px-3 rounded-lg border transition-colors ${isOpen ? `${c.bg} ${c.text} border-current` : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                          <Eye className="h-3.5 w-3.5" />
                          {isOpen ? "닫기" : "미리보기"}
                          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        {/* 사이트 바로가기 */}
                        {doc.siteUrl && (
                          <a
                            href={doc.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1 text-xs font-medium h-8 px-3 rounded-lg border transition-colors ${c.sitebtn} ml-auto`}>
                            <ExternalLink className="h-3.5 w-3.5" />
                            {doc.siteLabel} 바로가기
                          </a>
                        )}
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
