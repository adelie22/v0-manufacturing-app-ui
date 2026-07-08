"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AiPostingChat from "@/components/AiPostingChat";
import FadeIn from "@/components/FadeIn";
import {
  Building2,
  ArrowRight,
  Sparkles,
  Menu,
  FileText,
  CreditCard,
  Search,
  PlusCircle,
  ChevronRight,
  Gift,
  HardHat,
  UserX,
  Scale,
  EyeOff,
  Handshake,
  BadgeCheck,
  Banknote,
  CalendarCheck,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const { data: session } = useSession();
  const workerHref = session ? "/jobs" : "/auth/login?callbackUrl=/jobs";

  const navItems = [
    { label: "일자리찾기", href: "/jobs", icon: Search },
    { label: "공고등록", href: "/employer/post", icon: PlusCircle },
    { label: "정부지원혜택", href: "/benefits", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-xl font-bold text-foreground font-[family-name:var(--font-dm-sans)] tracking-tight">
                Da-Itda
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
                        <span className="text-xl font-bold text-foreground font-[family-name:var(--font-dm-sans)] tracking-tight">
                          Da-Itda
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-background pt-16 pb-20 md:pt-28 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-6">
              <HardHat className="h-4 w-4" />
              중소 제조현장 전문 채용 플랫폼
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] mb-6 tracking-tight text-balance">
              면접 대신,
              <br />
              <span className="text-blue-600">3일 일해보고 결정하세요</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
              3~7일 트라이얼 근무 후 서로 맞으면 정규직으로.
              <br className="hidden sm:block" />
              사장님도 구직자도, 부담은 빼고 확신만 남깁니다.
            </p>

            {/* Trial process pill */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-0 max-w-2xl mx-auto mb-12">
              {[
                { step: "1", label: "지원 · 매칭", sub: "이력서 대신 현장으로" },
                { step: "2", label: "3~7일 근무", sub: "일해보며 서로 확인" },
                { step: "3", label: "정규직 전환", sub: "서로 맞을 때만" },
              ].map((item, i) => (
                <div key={item.step} className="flex items-center flex-1">
                  <div className="flex-1 bg-white border border-border/80 rounded-2xl px-4 py-3.5 text-left shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold font-[family-name:var(--font-dm-sans)]">
                        {item.step}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  </div>
                  {i < 2 && (
                    <ArrowRight className="hidden sm:block h-4 w-4 text-blue-300 mx-1.5 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Selection Cards */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-8">
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
                    <span className="absolute -bottom-1.5 left-4 w-3 h-3 bg-blue-600 rotate-45 rounded-sm" />
                  </div>
                </button>

                <Link
                  href="/auth/login?callbackUrl=/employer"
                  className="group block h-full rounded-3xl bg-white border border-border/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Building2 className="h-7 w-7 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-foreground">사장님</h3>
                        <p className="text-sm text-muted-foreground">
                          일 잘하는 사람, 일로 확인하세요
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-blue-600 font-medium">
                      <span>시작하기</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>

              <Link
                href={workerHref}
                className="group block rounded-3xl bg-blue-600 hover:bg-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <HardHat className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">구직자</h3>
                      <p className="text-sm text-blue-200">
                        며칠 일해보고 좋은 곳만 고르세요
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
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40 pointer-events-none" />
      </section>

      {/* Problem - dark section */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block text-sm font-semibold text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full mb-4">
                왜 다잇다인가
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug tracking-tight text-balance">
                지금의 채용 방식은
                <br />
                중소 제조현장에 맞지 않습니다
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: UserX,
                title: "뽑아도 한 달을 못 갑니다",
                desc: "어렵게 뽑은 직원이 통보 없이 사라지거나 며칠 만에 퇴사를 말합니다. 4대보험, 서류, 인수인계… 행정 피로만 쌓입니다.",
              },
              {
                icon: Scale,
                title: "한번 뽑으면 되돌리기 어렵습니다",
                desc: "막상 일을 시켜보니 맞지 않아도, 법적으로 해고는 쉽지 않습니다. 채용 실패의 비용을 사장님 혼자 떠안습니다.",
              },
              {
                icon: EyeOff,
                title: "구직자는 들어가봐야 압니다",
                desc: "작업 환경도, 분위기도 입사 전엔 알 수 없습니다. 실망하면 남는 선택지는 도망치듯 그만두는 것뿐입니다.",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 120}>
                <div className="h-full bg-slate-800/60 border border-slate-700/60 rounded-3xl p-7">
                  <div className="h-12 w-12 rounded-2xl bg-slate-700/80 flex items-center justify-center mb-5">
                    <item.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={200}>
            <div className="mt-14 text-center">
              <p className="text-xl md:text-2xl font-bold text-white leading-relaxed text-balance">
                그래서 순서를 바꿨습니다.
                <br />
                <span className="text-blue-400">먼저 일해보고, 그다음에 채용합니다.</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
                트라이얼 채용
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-snug tracking-tight text-balance">
                3~7일이면 서로를 알 수 있습니다
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
                현장 일은 몇 시간만 같이 해봐도 압니다.
                짧게 일해보고 확신이 들 때만 정규직으로 전환하세요.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                step: "STEP 1",
                icon: CalendarCheck,
                title: "공고 올리고, 지원하고",
                desc: "사장님은 챗봇으로 1분 만에 공고 등록. 구직자는 복잡한 이력서 없이 원하는 날짜에 바로 지원합니다.",
                points: ["AI 챗봇 공고 등록", "날짜 기반 간편 지원"],
              },
              {
                step: "STEP 2",
                icon: Banknote,
                title: "3~7일 트라이얼 근무",
                desc: "일용직으로 짧게 근무하며 서로를 확인합니다. 안 맞으면 기간이 끝나면 자연스럽게 종료 — 서로 부담이 없습니다.",
                points: ["원하는 날짜만 골라 근무", "부담 없는 종료"],
              },
              {
                step: "STEP 3",
                icon: Handshake,
                title: "서로 맞으면 정규직 전환",
                desc: "양쪽 모두 원할 때만 정규직 제안이 성사됩니다. 전환 시 받을 수 있는 정부지원금까지 다잇다가 챙겨드립니다.",
                points: ["상호 합의 전환", "정부지원혜택 알림"],
              },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 120}>
                <div className="h-full bg-white border border-border/80 rounded-3xl p-7 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-5">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-blue-500 tracking-widest font-[family-name:var(--font-dm-sans)]">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{item.desc}</p>
                  <ul className="space-y-2">
                    {item.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="h-4 w-4 text-blue-600 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Both sides value */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-snug tracking-tight text-balance">
                양쪽 모두에게 남는 거래
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-5">
            <FadeIn>
              <div className="h-full bg-white border border-border/80 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">사장님에게는</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    ["채용 실패 리스크 제로", "일하는 걸 직접 보고 뽑으니, 뽑고 후회할 일이 없습니다."],
                    ["해고 걱정 없는 검증 기간", "트라이얼은 일용직 계약 — 안 맞으면 다음 사람을 만나면 됩니다."],
                    ["지원 즉시 실시간 알림", "지원자가 생기면 바로 알림으로 확인하고 수락하세요."],
                    ["정규직 전환 지원금", "전환 시 받을 수 있는 정부지원혜택을 모아서 알려드립니다."],
                  ].map(([title, desc]) => (
                    <li key={title} className="flex gap-3">
                      <BadgeCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-foreground">{title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="h-full bg-slate-900 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <HardHat className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">구직자에게는</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    ["들어가보고 결정", "작업 환경·분위기·사람들, 며칠 일해보고 판단하세요."],
                    ["합격 소식 실시간 알림", "지원 결과를 기다릴 필요 없이 앱에서 바로 확인하세요."],
                    ["어색한 퇴사 통보 불필요", "기간이 끝나면 자연스럽게 종료. 도망칠 필요가 없습니다."],
                    ["여러 곳을 겪어보고 선택", "맞는 곳을 찾을 때까지, 가벼운 마음으로 옮겨 다니세요."],
                  ].map(([title, desc]) => (
                    <li key={title} className="flex gap-3">
                      <BadgeCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-white">{title}</p>
                        <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          {/* 정부지원혜택 banner */}
          <FadeIn delay={200}>
            <Link
              href="/benefits"
              className="group mt-5 flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 p-6 md:p-7"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-base md:text-lg">
                    정규직 채용 시 받을 수 있는 정부지원혜택
                  </p>
                  <p className="text-emerald-50 text-sm mt-0.5">
                    고용장려금부터 세제 혜택까지, 한곳에 모았습니다
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-white shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Trust strip */}
      <section className="px-4 sm:px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: ShieldCheck,
                title: "사업자 인증 사업장",
                desc: "사업자등록번호 인증을 거친 사장님만 공고를 올립니다",
              },
              {
                icon: BadgeCheck,
                title: "실시간 지원·합격 알림",
                desc: "지원과 합격 소식을 놓치지 않게 바로 알려드립니다",
              },
              {
                icon: CalendarCheck,
                title: "날짜 기반 간편 지원",
                desc: "이력서 부담 없이, 일할 수 있는 날짜만 골라 지원합니다",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 100}>
                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-6 py-5">
                  <div className="h-11 w-11 rounded-xl bg-white border border-border/60 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug tracking-tight mb-4 text-balance">
              사람 때문에 고민하는 시간,
              <br />
              <span className="text-blue-400">3일이면 충분합니다</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400 mb-10 leading-relaxed">
              대한민국 뿌리산업의 채용, 다잇다가 다시 잇습니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/auth/login?callbackUrl=/employer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-13 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
              >
                사장님으로 시작하기
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={workerHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-13 px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
              >
                구직자로 시작하기
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* AI 공고 등록 챗봇 */}
      {aiChatOpen && <AiPostingChat onClose={() => setAiChatOpen(false)} />}

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-16 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-8 mb-12 max-w-lg">
            <div>
              <h3 className="font-semibold text-white mb-4">서비스</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li>
                  <Link href="/jobs" className="hover:text-white transition-colors">
                    일자리찾기
                  </Link>
                </li>
                <li>
                  <Link href="/employer" className="hover:text-white transition-colors">
                    공고등록
                  </Link>
                </li>
                <li>
                  <Link href="/benefits" className="hover:text-white transition-colors">
                    정부지원혜택
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">법적 고지</h3>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <span className="text-xl font-bold text-white font-[family-name:var(--font-dm-sans)] tracking-tight">
                Da-Itda
              </span>
            </div>
            <p className="text-slate-500 text-sm">
              다잇다 — 일해보고 채용하는 중소 제조현장 전문 플랫폼
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
