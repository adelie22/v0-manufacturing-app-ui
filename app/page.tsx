"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import AiPostingChat from "@/components/AiPostingChat"
import {
  Building2,
  Smartphone,
  Shield,
  Zap,
  Menu,
  FileText,
  BadgeCheck,
  ChevronRight,
  Gift
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const { data: session } = useSession()
  const workerHref = session ? "/jobs" : "/auth/login?callbackUrl=/jobs"

  const navItems = [
    { label: "알바찾기", href: "/jobs" },
    { label: "공고등록", href: "/employer/post" },
    { label: "지원금정보", href: "/benefits" },
    { label: "서비스소개", href: "/about" },
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full">
          <div className="flex items-center h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="일손매칭" width={36} height={36} className="rounded-xl object-cover" />
              <span className="text-xl font-bold text-gray-900">일손매칭</span>
            </Link>

            {/* Desktop Navigation - center */}
            <nav className="hidden lg:flex items-center gap-8 mx-auto">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Right buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-base font-medium text-gray-600 hover:text-gray-900">
                  로그인
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white h-10 rounded-xl px-5 text-base font-semibold">
                  무료 시작하기
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden ml-auto">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">메뉴 열기</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <Image src="/logo.png" alt="일손매칭" width={36} height={36} className="rounded-xl object-cover" />
                        <span className="text-xl font-bold text-gray-900">일손매칭</span>
                      </div>
                    </div>
                    <nav className="flex-1 p-4">
                      <ul className="space-y-1">
                        {navItems.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-4 rounded-2xl text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                              <span className="font-medium text-base">{item.label}</span>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                    <div className="p-4 border-t border-gray-100 space-y-3">
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-14 rounded-2xl text-base font-semibold text-gray-800">
                          로그인
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl text-base font-semibold">
                          무료 시작하기
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-blue-50 text-blue-600 rounded-full px-4 py-1 text-sm font-semibold">
            제조업 일용직 No.1 매칭 플랫폼
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 leading-tight">
            오늘 일할 사람,
            <br />
            지금 바로 구하세요
          </h1>
          <p className="text-xl text-gray-500 mt-4">
            공고 등록 3분 · 당일 매칭 · 급여 자동 정산
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/login?callbackUrl=/employer">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl px-8 text-base font-semibold">
                사장님 — 인력 구하기
              </Button>
            </Link>
            <Link href={workerHref}>
              <Button variant="outline" className="w-full sm:w-auto bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 h-14 rounded-2xl px-8 text-base font-semibold">
                구직자 — 일자리 찾기
              </Button>
            </Link>
          </div>

          {/* Trust Stats */}
          <div className="mt-12 flex flex-wrap gap-8 justify-center text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">12,400+</p>
              <p className="text-sm text-gray-500">등록 사업장</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">89,000+</p>
              <p className="text-sm text-gray-500">구직자</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">4.8★</p>
              <p className="text-sm text-gray-500">사용자 만족도</p>
            </div>
          </div>
        </div>
      </section>

      {/* Split Feature Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 사장님 Card */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mt-4">사장님</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "공고 등록 (3분이면 충분해요)",
                  "지원자 확인 및 수락",
                  "출퇴근 관리 · 급여 자동 정산",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-base">
                    <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-sm flex-shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
              <Link href="/auth/login?callbackUrl=/employer" className="block mt-6">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-2xl h-12 font-semibold w-full text-base">
                  무료로 인력 구하기 →
                </Button>
              </Link>
            </div>

            {/* 구직자 Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-4">구직자</h3>
              <ul className="mt-4 space-y-3 text-gray-600">
                {[
                  "날짜 선택 (내가 일하고 싶은 날짜)",
                  "주변 공고 확인 · 원터치 지원",
                  "당일 급여 계좌 입금",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-base">
                    <span className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
              <Link href={workerHref} className="block mt-6">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-12 font-semibold w-full text-base">
                  일자리 찾아보기 →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900">왜 일손매칭인가요?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { icon: Zap, color: "amber", title: "당일 매칭", desc: "공고 등록 즉시 구직자에게 알림 발송" },
              { icon: Shield, color: "blue", title: "급여 보장", desc: "당일지급 보장 · 자동 계좌 이체" },
              { icon: FileText, color: "emerald", title: "세금 자동화", desc: "원천징수 서류 자동 생성 · 엑셀 출력" },
              { icon: BadgeCheck, color: "violet", title: "신뢰 시스템", desc: "노쇼 방지 · 양방향 리뷰" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  feature.color === "amber" ? "bg-amber-50" :
                  feature.color === "blue" ? "bg-blue-50" :
                  feature.color === "emerald" ? "bg-emerald-50" :
                  "bg-violet-50"
                }`}>
                  <feature.icon className={`h-5 w-5 ${
                    feature.color === "amber" ? "text-amber-600" :
                    feature.color === "blue" ? "text-blue-600" :
                    feature.color === "emerald" ? "text-emerald-600" :
                    "text-violet-600"
                  }`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-3">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900">사장님들의 이야기</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                quote: "공고 올리고 2시간 만에 5명 다 채웠어요. 신기할 정도예요.",
                name: "충북 청주 A 부품공장",
              },
              {
                quote: "급여 정산도 앱에서 클릭 한번이라 너무 편합니다.",
                name: "경기 안산 B 물류센터",
              },
              {
                quote: "세금 서류 자동으로 만들어줘서 세무사 비용 절감됐어요.",
                name: "대전 C 식품공장",
              },
            ].map((review, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <p className="text-amber-400 text-lg">★★★★★</p>
                <p className="text-base text-gray-700 leading-relaxed mt-3">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <p className="text-sm text-gray-500 mt-4">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold">지금 바로 시작해보세요</h2>
          <p className="text-lg mt-2 text-blue-200">무료 회원가입 · 첫 공고 등록 무료</p>
          <Link href="/auth/signup" className="inline-block mt-8">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-2xl h-14 px-10 font-bold text-base">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* AI 공고 등록 챗봇 */}
      {aiChatOpen && <AiPostingChat onClose={() => setAiChatOpen(false)} />}

      {/* 중소기업 지원혜택 플로팅 버튼 */}
      <Link
        href="/benefits"
        className="fixed right-5 bottom-8 z-50 group"
        aria-label="중소기업 정부지원혜택 모아보기"
      >
        <div className="relative flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all duration-200 rounded-2xl px-5 py-3.5 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Gift className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white font-bold text-sm whitespace-nowrap">중소기업 정부지원혜택</span>
            <span className="text-emerald-100 text-sm font-medium">모아보기 →</span>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-5xl mx-auto px-4 text-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <Image src="/logo.png" alt="일손매칭" width={28} height={28} className="rounded-lg object-cover" />
            <span className="text-white font-bold text-base">일손매칭</span>
          </div>
          <div className="flex gap-4 mb-6">
            <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
            <span>|</span>
            <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-white transition-colors">고객센터</Link>
          </div>
          <p>© 2025 일손매칭. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
