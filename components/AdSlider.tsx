"use client"

import { useState, useEffect } from "react"
import { Building2, Smartphone } from "lucide-react"

const slides = [
  {
    employer: {
      quote: "납기 시즌에만 잠깐\n일할 사람이 필요한데...",
      sub: "정규직 없이 딱 그 기간만",
    },
    worker: {
      quote: "여행 가기 전에\n며칠만 돈 모을 곳 없을까?",
      sub: "단기도 당일 입금 OK",
    },
  },
  {
    employer: {
      quote: "채용 공고, 면접까지\n시간이 어딨어...",
      sub: "공고 등록 3분, 매칭 30분",
    },
    worker: {
      quote: "학교 방학인데 부담 없이\n짧게 돈 버는 법",
      sub: "1일~4주, 경력 무관",
    },
  },
  {
    employer: {
      quote: "갑자기 사람이 빠졌는데\n내일 납품인데...",
      sub: "급구도 30분 내 해결",
    },
    worker: {
      quote: "주말 이틀만 일하고 싶은데\n눈치 안 봐도 되는 곳",
      sub: "단기 전문, 눈치 제로",
    },
  },
  {
    employer: {
      quote: "정규직 뽑기엔 일이\n몇 달뿐인데...",
      sub: "채용 절차 없이 필요한 날만",
    },
    worker: {
      quote: "이번 주 급하게 돈이 필요한데\n빠르게 구할 수 있는 일",
      sub: "오늘 지원, 내일 출근 가능",
    },
  },
]

export default function AdSlider() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length)
        setAnimating(false)
      }, 300)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  return (
    <section className="px-4 sm:px-6 py-10 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        {/* 슬라이드 카드 */}
        <div
          className={`grid grid-cols-2 gap-3 transition-all duration-300 ${
            animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          {/* 사장님 카드 */}
          <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="h-5 w-5 rounded-md bg-blue-100 flex items-center justify-center">
                <Building2 className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-blue-600">사장님</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 leading-snug whitespace-pre-line mb-2">
              &ldquo;{slide.employer.quote}&rdquo;
            </p>
            <p className="text-xs text-blue-600 font-medium">{slide.employer.sub}</p>
          </div>

          {/* 구직자 카드 */}
          <div className="bg-blue-600 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="h-5 w-5 rounded-md bg-white/20 flex items-center justify-center">
                <Smartphone className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-100">구직자</span>
            </div>
            <p className="text-sm font-semibold text-white leading-snug whitespace-pre-line mb-2">
              &ldquo;{slide.worker.quote}&rdquo;
            </p>
            <p className="text-xs text-blue-200 font-medium">{slide.worker.sub}</p>
          </div>
        </div>

        {/* 인디케이터 */}
        <div className="flex justify-center gap-1.5 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-blue-600" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
