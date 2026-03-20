"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Smartphone, 
  ArrowRight, 
  Users, 
  Briefcase, 
  Shield, 
  Zap,
  Menu,
  X,
  FileText,
  HelpCircle,
  CreditCard,
  BookOpen,
  Search,
  PlusCircle
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "알바찾기", href: "/jobs", icon: Search },
    { label: "공고등록", href: "/employer", icon: PlusCircle },
    { label: "무료 근로계약서", href: "/contract", icon: FileText },
    { label: "회사소개", href: "/about", icon: Building2 },
    { label: "FAQ", href: "/faq", icon: HelpCircle },
    { label: "요금안내", href: "/pricing", icon: CreditCard },
    { label: "Blog", href: "/blog", icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">*</span>
              </div>
              <span className="text-xl font-bold text-blue-600">일손매칭</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Sign Up Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/signup/employer">
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Building2 className="h-4 w-4 mr-1.5" />
                  사장님 가입
                </Button>
              </Link>
              <Link href="/signup/worker">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Smartphone className="h-4 w-4 mr-1.5" />
                  구직자 가입
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">*</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">일손매칭</span>
                    </div>
                  </div>

                  {/* Mobile Sign Up Buttons */}
                  <div className="p-4 space-y-3 border-b border-border bg-muted/30">
                    <Link href="/signup/employer" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start border-blue-600 text-blue-600 hover:bg-blue-50">
                        <Building2 className="h-4 w-4 mr-2" />
                        사장님 회원가입
                      </Button>
                    </Link>
                    <Link href="/signup/worker" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                        <Smartphone className="h-4 w-4 mr-2" />
                        구직자 회원가입
                      </Button>
                    </Link>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                      {navItems.map((item) => (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                          >
                            <item.icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{item.label}</span>
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
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-blue-400 text-lg md:text-xl mb-4">
              하루만 일손이 필요할 때
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
              일손매칭의 시작과 끝을<br />
              <span className="text-blue-400">함께 해보세요!</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg">
              제조업 일용직 매칭 플랫폼. 사장님과 구직자를 신뢰 기반으로 연결합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/employer">
                <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8">
                  <Building2 className="h-5 w-5 mr-2" />
                  무료로 공고 등록하기
                </Button>
              </Link>
              <Link href="/worker">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-semibold px-8">
                  <Smartphone className="h-5 w-5 mr-2" />
                  알바 찾기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            왜 <span className="text-blue-600">일손매칭</span>인가요?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Users, label: "신뢰 기반 매칭", desc: "검증된 인력만 연결" },
              { icon: Zap, label: "즉시 매칭", desc: "빠른 인력 확보" },
              { icon: Shield, label: "안전한 거래", desc: "보험 관리 지원" },
              { icon: Briefcase, label: "간편 공고", desc: "3분 만에 등록" },
            ].map((feature) => (
              <div key={feature.label} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-semibold text-foreground text-center">{feature.label}</span>
                <span className="text-sm text-muted-foreground text-center">{feature.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selection Cards */}
      <main className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            서비스 선택
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            사장님 또는 구직자로 시작하세요
          </p>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Employer Card */}
            <Link href="/employer" className="group">
              <Card className="h-full bg-background border-2 border-border hover:border-blue-300 transition-all duration-300 hover:shadow-xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-foreground">사장님용</CardTitle>
                      <CardDescription className="text-muted-foreground text-base">Employer Dashboard</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ul className="space-y-3 text-foreground">
                    {["실시간 매칭 현황 확인", "신뢰 기반 인력 관리", "간편 공고 등록", "4대 보험 관리 (Safety Zone)"].map(item => (
                      <li key={item} className="flex items-center gap-3 text-base">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
                    사장님으로 시작하기
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Worker Card */}
            <Link href="/worker" className="group">
              <Card className="h-full bg-gradient-to-br from-blue-600 to-blue-800 border-0 hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:shadow-xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white">구직자용</CardTitle>
                      <CardDescription className="text-blue-200 text-base">Worker Mobile App</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ul className="space-y-3 text-blue-100">
                    {["신뢰 등급 및 레벨 시스템", "연속 근무 보너스", "GPS 출근 체크인", "다크모드, 게임화 요소"].map(item => (
                      <li key={item} className="flex items-center gap-3 text-base">
                        <div className="h-2 w-2 rounded-full bg-white" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 text-lg py-6">
                    구직자로 시작하기
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      {/* CTA Banner */}
      <section className="px-4 py-12 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-blue-100 mb-8">
            가입비 무료, 공고 등록 무료
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup/employer">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8">
                <Building2 className="h-5 w-5 mr-2" />
                사장님 회원가입
              </Button>
            </Link>
            <Link href="/signup/worker">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-semibold px-8">
                <Smartphone className="h-5 w-5 mr-2" />
                구직자 회원가입
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">서비스</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/jobs" className="hover:text-white transition-colors">알바찾기</Link></li>
                <li><Link href="/employer" className="hover:text-white transition-colors">공고등록</Link></li>
                <li><Link href="/contract" className="hover:text-white transition-colors">무료 근로계약서</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">회사</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">회사소개</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">채용</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">고객지원</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">요금안내</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">법적 고지</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">*</span>
              </div>
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
