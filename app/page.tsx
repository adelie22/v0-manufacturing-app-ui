"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Smartphone,
  ArrowRight,
  Users,
  Shield,
  Zap,
  Menu,
  FileText,
  CreditCard,
  Search,
  PlusCircle,
  Star,
  Clock,
  Wallet,
  CheckCircle2,
  Quote,
  TrendingUp,
  BadgeCheck,
  ChevronRight
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "알바찾기", href: "/jobs", icon: Search },
    { label: "공고등록", href: "/employer", icon: PlusCircle },
    { label: "무료 근로계약서", href: "/contract", icon: FileText },
    { label: "회사소개", href: "/about", icon: Building2 },
    { label: "요금안내", href: "/pricing", icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Toss Bank Style */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="일손매칭" width={36} height={36} className="rounded-xl object-cover" />
              <span className="text-xl font-bold text-foreground">일손매칭</span>
            </Link>

            {/* Desktop Navigation - right aligned */}
            <nav className="hidden lg:flex items-center gap-8 ml-auto">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden ml-auto">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">메뉴 열기</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="p-5 border-b border-border">
                      <div className="flex items-center gap-2.5">
                        <Image src="/logo.png" alt="일손매칭" width={36} height={36} className="rounded-xl object-cover" />
                        <span className="text-xl font-bold text-foreground">일손매칭</span>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-4">
                      <ul className="space-y-1">
                        {navItems.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-4 rounded-2xl text-foreground hover:bg-muted transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{item.label}</span>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Toss Bank Style */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-background pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-blue-600 text-base md:text-lg font-medium mb-4 tracking-tight">
              하루만 일손이 필요할 때
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] mb-6 tracking-tight text-balance">
              일손매칭의 시작과 끝을
              <br />
              <span className="text-blue-600">함께 해보세요</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
              제조업 일용직 매칭 플랫폼.
              <br className="hidden sm:block" />
              사장님과 구직자를 신뢰 기반으로 연결합니다.
            </p>

            {/* Selection Cards - Toss Style */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-12">
              <Link href="/auth/login?callbackUrl=/employer" className="group">
                <Card className="h-full bg-background border border-border/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Building2 className="h-7 w-7 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-foreground">사장님</h3>
                        <p className="text-sm text-muted-foreground">인력이 필요하신가요?</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-blue-600 font-medium">
                      <span>시작하기</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/auth/login?callbackUrl=/worker" className="group">
                <Card className="h-full bg-blue-600 border-0 hover:bg-blue-500 transition-all duration-300 rounded-3xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Smartphone className="h-7 w-7 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-white">구직자</h3>
                        <p className="text-sm text-blue-200">일자리를 찾고 계신가요?</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-white font-medium">
                      <span>시작하기</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40" />
      </section>

      {/* Feature Section 1 - 당일 지급 */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
                <Wallet className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">빠른 정산</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6 tracking-tight">
                당일 일하고,
                <br />
                <span className="text-emerald-600">바로 지급!</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                일한 당일 바로 급여를 받을 수 있습니다.
                <br />
                더 이상 급여일까지 기다리지 마세요.
              </p>
              <ul className="space-y-4">
                {[
                  "근무 완료 즉시 급여 확정",
                  "당일 또는 익일 계좌 입금",
                  "투명한 급여 내역 확인"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 md:p-12">
                <div className="bg-background rounded-2xl shadow-xl p-6 max-w-sm mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-muted-foreground">오늘의 급여</span>
                    <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">입금완료</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-2">150,000원</p>
                  <p className="text-sm text-muted-foreground">근무시간: 8시간</p>
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">삼성전자 화성공장</p>
                        <p className="text-xs text-muted-foreground">포장 / 검수</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 - 신뢰 등급 */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12">
                <div className="bg-background rounded-2xl shadow-xl p-6 max-w-sm mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">A</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">김민수</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">5.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">누적 근무</span>
                      <span className="font-medium text-foreground">152회</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">출근율</span>
                      <span className="font-medium text-emerald-600">99.3%</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">재고용률</span>
                      <span className="font-medium text-blue-600">94.7%</span>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">우수 인력</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">성실왕</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                <BadgeCheck className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">신뢰 시스템</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6 tracking-tight">
                검증된 인력만
                <br />
                <span className="text-blue-600">신뢰 등급으로 확인</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                출근율, 근무 평가, 재고용률을 기반으로
                <br />
                신뢰 등급을 부여합니다.
              </p>
              <ul className="space-y-4">
                {[
                  "A~D 등급 신뢰 지표",
                  "실제 근무 데이터 기반 평가",
                  "우수 인력 우선 매칭"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 - Safety Zone */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 rounded-full mb-6">
                <Shield className="h-4 w-4 text-rose-600" />
                <span className="text-sm font-medium text-rose-700">Safety Zone</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6 tracking-tight">
                4대 보험 걱정 없이
                <br />
                <span className="text-rose-600">안전하게 고용</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                근무일수 기반 4대 보험 가입 여부를
                <br />
                자동으로 모니터링하고 알려드립니다.
              </p>
              <ul className="space-y-4">
                {[
                  "8일 이상 근무자 자동 알림",
                  "보험료 예상 비용 계산",
                  "법적 리스크 사전 관리"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-rose-500 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/employer/safety-zone">
                <Button className="mt-8 bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6">
                  Safety Zone 바로가기
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-3xl p-8 md:p-12">
                <div className="bg-background rounded-2xl shadow-xl p-6 max-w-sm mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-foreground">이번 달 근무 현황</h4>
                    <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">안전</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-emerald-600">5</span>
                        </div>
                        <span className="text-sm text-foreground">김민수</span>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">안전</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-amber-600">7</span>
                        </div>
                        <span className="text-sm text-foreground">이영희</span>
                      </div>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">주의</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-rose-600">9</span>
                        </div>
                        <span className="text-sm text-foreground">박철수</span>
                      </div>
                      <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-md text-xs font-medium">위험</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Quote className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">이용후기</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              실제 사용자들의 후기
            </h2>
            <p className="text-lg text-muted-foreground">
              일손매칭을 사용한 사장님과 구직자들의 생생한 이야기
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "김사장님",
                role: "제조업 대표",
                content: "급하게 인력이 필요할 때 정말 유용해요. 검증된 인력만 오니까 걱정 없이 일을 맡길 수 있습니다.",
                rating: 5
              },
              {
                name: "이민호",
                role: "구직자 (A등급)",
                content: "당일 정산이 정말 좋아요! 일한 만큼 바로 받으니까 동기부여도 되고, 신뢰 등급 올리는 재미도 있어요.",
                rating: 5
              },
              {
                name: "박공장장",
                role: "식품공장 관리자",
                content: "Safety Zone 기능 덕분에 4대보험 관리가 훨씬 편해졌어요. 리스크 없이 운영할 수 있습니다.",
                rating: 5
              }
            ].map((review, i) => (
              <Card key={i} className="bg-background border border-border/80 rounded-3xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {Array(review.rating).fill(0).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-6">
                    &ldquo;{review.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <Users className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">성장 지표</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              숫자로 보는 일손매칭
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: "누적 매칭", value: "50,000+", suffix: "건" },
              { label: "등록 사업장", value: "3,200+", suffix: "개" },
              { label: "활성 구직자", value: "12,000+", suffix: "명" },
              { label: "평균 매칭 시간", value: "30", suffix: "분" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 md:p-8 bg-slate-50 rounded-3xl">
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                  <span className="text-lg text-muted-foreground">{stat.suffix}</span>
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              더 많은 기능
            </h2>
            <p className="text-lg text-muted-foreground">
              일손매칭에서 제공하는 다양한 기능을 만나보세요
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "실시간 매칭", desc: "급한 인력도 30분 내 매칭", color: "blue" },
              { icon: FileText, title: "무료 근로계약서", desc: "법적 효력있는 전자계약서 무료 제공", color: "emerald" },
              { icon: Zap, title: "GPS 출퇴근", desc: "위치 기반 자동 출퇴근 체크", color: "amber" },
              { icon: Shield, title: "보험 관리", desc: "4대보험 자동 관리 및 알림", color: "rose" },
              { icon: Star, title: "보상 시스템", desc: "연속 근무 시 추가 보너스 지급", color: "purple" },
              { icon: Users, title: "단골 시스템", desc: "자주 찾는 인력/사업장 우선 매칭", color: "cyan" },
            ].map((feature) => (
              <Card key={feature.title} className="bg-background border border-border/80 rounded-3xl hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-2xl mb-4 flex items-center justify-center ${
                    feature.color === 'blue' ? 'bg-blue-100' :
                    feature.color === 'emerald' ? 'bg-emerald-100' :
                    feature.color === 'amber' ? 'bg-amber-100' :
                    feature.color === 'rose' ? 'bg-rose-100' :
                    feature.color === 'purple' ? 'bg-purple-100' :
                    'bg-cyan-100'
                  }`}>
                    <feature.icon className={`h-6 w-6 ${
                      feature.color === 'blue' ? 'text-blue-600' :
                      feature.color === 'emerald' ? 'text-emerald-600' :
                      feature.color === 'amber' ? 'text-amber-600' :
                      feature.color === 'rose' ? 'text-rose-600' :
                      feature.color === 'purple' ? 'text-purple-600' :
                      'text-cyan-600'
                    }`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg text-blue-100 mb-10">
            가입비 무료, 공고 등록 무료
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/login?callbackUrl=/employer">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 rounded-xl h-14 text-base">
                <Building2 className="h-5 w-5 mr-2" />
                사장님으로 시작
              </Button>
            </Link>
            <Link href="/auth/login?callbackUrl=/worker">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 font-semibold px-8 rounded-xl h-14 text-base">
                <Smartphone className="h-5 w-5 mr-2" />
                구직자로 시작
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-white mb-4">서비스</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="/jobs" className="hover:text-white transition-colors">알바찾기</Link></li>
                <li><Link href="/employer" className="hover:text-white transition-colors">공고등록</Link></li>
                <li><Link href="/contract" className="hover:text-white transition-colors">무료 근로계약서</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">회사</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">회사소개</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">채용</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">고객지원</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="/pricing" className="hover:text-white transition-colors">요금안내</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">법적 고지</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="일손매칭" width={36} height={36} className="rounded-xl object-cover" />
              <span className="text-xl font-bold text-white">일손매칭</span>
            </div>
            <p className="text-slate-500 text-sm">
              일손매칭 - 제조업 일용직 매칭 플랫폼
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
