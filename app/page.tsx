"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AiPostingChat from "@/components/AiPostingChat";
import AdSlider from "@/components/AdSlider";
import {
  Building2,
  Smartphone,
  ArrowRight,
  Sparkles,
  Menu,
  FileText,
  CreditCard,
  Search,
  PlusCircle,
  ChevronRight,
  Gift,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [resRole, setResRole] = useState<"employer" | "worker">("employer");
  const [resPhone, setResPhone] = useState("");
  const [resName, setResName] = useState("");
  const [resStatus, setResStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [resMsg, setResMsg] = useState("");
  const reservationRef = useRef<HTMLElement>(null);

  const handleReservation = async () => {
    setResStatus("loading");
    const res = await fetch("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: resName, phone: resPhone, role: resRole }),
    });
    const data = await res.json();
    if (res.ok) {
      setResStatus("done");
      setResMsg("사전예약이 완료됐습니다! 오픈되면 연락드릴게요 😊");
    } else {
      setResStatus("error");
      setResMsg(data.error ?? "오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  const { data: session } = useSession();
  const workerHref = session ? "/jobs" : "/auth/login?callbackUrl=/jobs";

  const navItems = [
    { label: "알바찾기", href: "/jobs", icon: Search },
    { label: "공고등록", href: "/employer/post", icon: PlusCircle },
    { label: "무료 근로계약서", href: "/contract", icon: FileText },
    { label: "회사소개", href: "/about", icon: Building2 },
    { label: "요금안내", href: "/pricing", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Toss Bank Style */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="다잇다"
                width={36}
                height={36}
                className="rounded-xl object-cover"
              />
              <span className="text-xl font-bold text-foreground">
                다잇다
              </span>
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
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  로그아웃
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-base font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  로그인
                </Link>
              )}
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
                        <Image
                          src="/logo.png"
                          alt="다잇다"
                          width={36}
                          height={36}
                          className="rounded-xl object-cover"
                        />
                        <span className="text-xl font-bold text-foreground">
                          다잇다
                        </span>
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
                        <li>
                          {session ? (
                            <button
                              onClick={() => signOut({ callbackUrl: "/" })}
                              className="w-full flex items-center justify-between px-4 py-4 rounded-2xl text-foreground hover:bg-muted transition-colors"
                            >
                              <span className="font-medium">로그아웃</span>
                            </button>
                          ) : (
                            <Link
                              href="/auth/login"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-4 rounded-2xl text-blue-600 hover:bg-muted transition-colors"
                            >
                              <span className="font-medium">로그인</span>
                              <ChevronRight className="h-5 w-5" />
                            </Link>
                          )}
                        </li>
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
              7일만 먼저 써보세요
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] mb-6 tracking-tight text-balance">
              다-잇다
              <br />
              <span className="text-blue-600">중소기업 전문 구인구직</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-xl mx-auto">
              단기 근무로 시작해서 맞으면 오래 함께하세요.
              <br className="hidden sm:block" />
              사장님도, 구직자도 부담 없이.
            </p>

            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                🔧 일용직
              </span>
              <span className="text-gray-300 font-light">+</span>
              <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                🌱 7일 체험 → 정규직
              </span>
            </div>

            {/* Selection Cards - Toss Style */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-12 pt-10">
              <div className="relative">
                {/* AI 말풍선 */}
                <button
                  onClick={() => setAiChatOpen(true)}
                  className="absolute -top-12 left-2 z-10 animate-bounce"
                  style={{ animationDuration: "2s" }}
                >
                  <div className="relative bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    챗봇으로 간편하게 공고등록
                    {/* 말풍선 꼬리 */}
                    <span className="absolute -bottom-1.5 left-4 w-3 h-3 bg-blue-600 rotate-45 rounded-sm" />
                  </div>
                </button>

                <Link
                  href="/auth/login?callbackUrl=/employer"
                  className="group"
                >
                  <Card className="h-full bg-background border border-border/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <Building2 className="h-7 w-7 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-foreground">
                            사장님
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            인력이 필요하신가요?
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-blue-600 font-medium">
                        <span>시작하기</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              <Link
                href={workerHref}
                className="group block rounded-3xl bg-blue-600 hover:bg-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="py-12 px-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Smartphone className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">
                        구직자
                      </h3>
                      <p className="text-sm text-blue-200">
                        일자리를 찾고 계신가요?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-white font-medium">
                    <span>시작하기</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>

            {/* 공감 슬라이드 */}
            <AdSlider />
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40 pointer-events-none" />
      </section>

      {/* 사전예약 섹션 */}
      <section ref={reservationRef} className="px-4 sm:px-6 py-16 bg-slate-50">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-3">
              사전예약
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              오픈 알림 받기
            </h2>
            <p className="text-sm text-gray-500">
              정식 오픈 시 가장 먼저 연락드립니다
            </p>
          </div>

          {resStatus === "done" ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-4xl mb-4">🎉</p>
              <p className="text-base font-semibold text-gray-900">{resMsg}</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              {/* 역할 선택 */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
                {(["employer", "worker"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setResRole(r)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      resRole === r
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {r === "employer" ? "🏭 사장님" : "👷 구직자"}
                  </button>
                ))}
              </div>

              {/* 이름 (선택) */}
              <input
                type="text"
                placeholder="이름 (선택)"
                value={resName}
                onChange={(e) => setResName(e.target.value)}
                className="w-full h-12 px-4 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              {/* 전화번호 */}
              <input
                type="tel"
                placeholder="전화번호 (010-0000-0000)"
                value={resPhone}
                onChange={(e) => setResPhone(e.target.value)}
                className="w-full h-12 px-4 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              {resStatus === "error" && (
                <p className="text-sm text-red-500 text-center">{resMsg}</p>
              )}

              {/* 신청 버튼 */}
              <Button
                onClick={handleReservation}
                disabled={resStatus === "loading" || !resPhone}
                className="w-full h-12 rounded-2xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white"
              >
                {resStatus === "loading" ? "신청 중..." : "오픈 알림 신청"}
              </Button>

              {/* 카카오톡 버튼 */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">또는</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <a
                href="https://open.kakao.com/o/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-sm font-semibold bg-[#FEE500] hover:bg-[#F5DC00] text-[#191919] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#191919]">
                  <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.634 1.628 4.953 4.11 6.318L5 21l4.793-2.634A11.3 11.3 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
                </svg>
                카카오톡으로 알림 받기
              </a>
            </div>
          )}
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
        <div className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all duration-200 rounded-2xl px-5 py-3.5 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5">
          {/* 펄스 링 */}
          <span className="absolute -inset-0.5 rounded-2xl animate-pulse bg-emerald-400 opacity-20 pointer-events-none" />
          {/* 아이콘 */}
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Gift className="h-5 w-5 text-white" />
          </div>
          {/* 텍스트 */}
          <div className="flex flex-col leading-tight">
            <span className="text-white/70 text-[10px] font-medium tracking-wide uppercase">
              Government
            </span>
            <span className="text-white font-bold text-sm whitespace-nowrap">
              중소기업 정부지원혜택
            </span>
            <span className="text-emerald-100 text-[11px] font-medium">
              모아보기 →
            </span>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-white mb-4">서비스</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li>
                  <Link
                    href="/jobs"
                    className="hover:text-white transition-colors"
                  >
                    알바찾기
                  </Link>
                </li>
                <li>
                  <Link
                    href="/employer"
                    className="hover:text-white transition-colors"
                  >
                    공고등록
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contract"
                    className="hover:text-white transition-colors"
                  >
                    무료 근로계약서
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">회사</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    회사소개
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    채용
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">고객지원</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    요금안내
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    문의하기
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">법적 고지</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <Image
                src="/logo.png"
                alt="다잇다"
                width={36}
                height={36}
                className="rounded-xl object-cover"
              />
              <span className="text-xl font-bold text-white">다잇다</span>
            </div>
            <p className="text-slate-500 text-sm">
              다잇다 - 중소기업 일용직 매칭 플랫폼
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
