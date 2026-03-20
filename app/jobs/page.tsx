"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, Calendar, ChevronDown, Wallet } from "lucide-react"

const REGIONS = ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "충북", "충남", "경북", "경남", "전북", "전남"]
const CITIES: Record<string, string[]> = {
  "서울": ["전체", "강남구", "강서구", "관악구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "성동구", "영등포구"],
  "경기": ["전체", "수원시", "성남시", "안양시", "부천시", "광명시", "평택시", "안산시", "고양시", "화성시", "이천시"],
  "충북": ["전체", "청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "진천군", "괴산군", "음성군", "단양군"],
}

const mockJobs = [
  {
    id: 1, category: "제조/생산 > 조립", company: "삼성전자 협력사", location: "화성시 동탄",
    date: "3월 21일 (금)", time: "09:00 ~ 18:00", daily: 130000, hourly: 14444,
    tags: ["단순조립", "검수", "초보가능"], instant: true, posted: "2분 전", urgent: true,
  },
  {
    id: 2, category: "제조/생산 > 포장", company: "CJ제일제당 진천공장", location: "진천군 진천읍",
    date: "3월 21일 (금)", time: "08:00 ~ 17:00", daily: 110000, hourly: 12222,
    tags: ["포장", "상품진열", "청소"], instant: true, posted: "5분 전", urgent: false,
  },
  {
    id: 3, category: "물류/창고 > 분류", company: "쿠팡 물류센터", location: "이천시 마장면",
    date: "3월 22일 (토)", time: "07:00 ~ 16:00", daily: 120000, hourly: 13333,
    tags: ["물류분류", "상차", "하차"], instant: true, posted: "8분 전", urgent: true,
  },
  {
    id: 4, category: "제조/생산 > 도장", company: "현대모비스 협력업체", location: "화성시 향남읍",
    date: "3월 22일 (토)", time: "08:00 ~ 17:00", daily: 140000, hourly: 15556,
    tags: ["도장보조", "운반", "기타"], instant: false, posted: "12분 전", urgent: false,
  },
  {
    id: 5, category: "식품/음료 > 생산", company: "농심 안양공장", location: "안양시 만안구",
    date: "3월 21일 (금)", time: "22:00 ~ 06:00", daily: 150000, hourly: 18750,
    tags: ["식품생산", "포장", "야간"], instant: true, posted: "15분 전", urgent: true,
  },
  {
    id: 6, category: "물류/창고 > 피킹", company: "롯데글로벌로지스", location: "부천시 오정구",
    date: "3월 23일 (일)", time: "09:00 ~ 18:00", daily: 115000, hourly: 12778,
    tags: ["피킹", "패킹", "재고관리"], instant: true, posted: "20분 전", urgent: false,
  },
]

export default function JobsPage() {
  const [region, setRegion] = useState("전체")
  const [city, setCity] = useState("전체")
  const [district, setDistrict] = useState("전체")

  const filtered = region === "전체"
    ? mockJobs
    : mockJobs.filter(j => j.location.includes(CITIES[region]?.[0] ?? ""))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="일손매칭" width={28} height={28} className="rounded-lg object-cover" />
            <span className="font-bold text-gray-900">일손매칭</span>
          </Link>
          <Link href="/auth/login?callbackUrl=/employer/post"
            className="text-sm text-blue-600 font-medium hover:underline">
            공고 등록하기
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 지역 필터 */}
        <h1 className="text-xl font-bold text-gray-900 mb-4">근무를 원하는 지역을 선택해보세요</h1>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {/* 시/도 */}
          <div className="relative">
            <select
              value={region}
              onChange={e => { setRegion(e.target.value); setCity("전체"); setDistrict("전체") }}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option>전체</option>
              {REGIONS.map(r => <option key={r}>{r}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* 구/군 */}
          <div className="relative">
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {(CITIES[region] ?? ["전체"]).map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* 동/읍 */}
          <div className="relative">
            <select
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option>전체</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* 공고 목록 */}
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map(job => (
            <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
              {/* 상단: 카테고리 + 등록시간 */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">일손</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{job.category}</p>
                    <p className="font-semibold text-gray-900 text-sm">{job.company}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{job.posted}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    <span>{job.location.split(" ")[1] ?? job.location}</span>
                  </div>
                </div>
              </div>

              {/* 날짜/시간/급여 */}
              <div className="space-y-1.5 mt-3 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span>{job.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span>{job.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-blue-600">
                    일급 {job.daily.toLocaleString()}원
                  </span>
                  <span className="text-xs text-gray-400">시급 {job.hourly.toLocaleString()}원</span>
                  {job.instant && (
                    <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      당일지급보장
                    </span>
                  )}
                </div>
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                    {tag}
                  </span>
                ))}
                {job.urgent && (
                  <span className="text-xs bg-red-50 text-red-500 font-medium px-2.5 py-1 rounded-lg">
                    급구
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 사장님 플로팅 버튼 */}
      <div className="fixed bottom-6 right-4 z-40">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
          <div>
            <p className="text-xs text-gray-500">사장님이신가요?</p>
            <Link href="/auth/login?callbackUrl=/employer/post"
              className="text-sm font-bold text-blue-600 flex items-center gap-1">
              무료로 채용 시작하기 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
