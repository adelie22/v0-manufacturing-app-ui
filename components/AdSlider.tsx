"use client"

import { useState, useEffect } from "react"

const slides = [
  {
    employer: "납기 시즌에만 잠깐\n일할 사람이 필요한데...",
    worker:   "여행 가기 전에\n며칠만 돈 모을 곳 없을까?",
  },
  {
    employer: "채용 공고, 면접까지\n시간이 어딨어...",
    worker:   "방학인데 부담 없이\n짧게 돈 버는 법 없을까?",
  },
  {
    employer: "갑자기 사람이 빠졌는데\n내일 납품인데...",
    worker:   "주말 이틀만 일하고 싶은데\n눈치 안 봐도 되는 곳",
  },
  {
    employer: "정규직 뽑기엔\n일이 몇 달뿐인데...",
    worker:   "이번 주 급하게 돈이 필요한데\n빠르게 구할 수 있는 일",
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
    <div className="max-w-2xl mx-auto mt-5">
      <div
        className={`grid grid-cols-2 gap-4 transition-all duration-300 ${
          animating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        <p className="text-base font-medium text-gray-900 leading-relaxed whitespace-pre-line text-center">
          &ldquo;{slide.employer}&rdquo;
        </p>
        <p className="text-base font-medium text-gray-900 leading-relaxed whitespace-pre-line text-center">
          &ldquo;{slide.worker}&rdquo;
        </p>
      </div>
    </div>
  )
}
