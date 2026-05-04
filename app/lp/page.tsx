"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Wallet,
  MapPin,
  Star,
  ChevronDown,
  Zap,
  Shield,
  Users,
} from "lucide-react";

// 카운트업 애니메이션 훅
function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const REVIEWS = [
  {
    name: "김○○ (23세)",
    tag: "대학생",
    text: "스펙 없어도 되고, 하루만 일해도 돼서 시험 기간 빼고 틈틈이 돈 벌어요.",
    stars: 5,
  },
  {
    name: "이○○ (27세)",
    tag: "취준생",
    text: "당일 입금이라 진짜예요? 믿기 힘들었는데 실제로 퇴근하고 바로 들어왔어요.",
    stars: 5,
  },
  {
    name: "박○○ (22세)",
    tag: "대학생",
    text: "공장 일이 힘들 줄 알았는데 생각보다 할 만하고, 무엇보다 일당이 높아요.",
    stars: 5,
  },
];

export default function LandingPage() {
  const workerCount = useCountUp(1240);
  const jobCount = useCountUp(380);
  const payCount = useCountUp(98);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* 최상단 배너 */}
      <div className="bg-blue-600 text-white text-center text-sm py-2 font-medium">
        지금 가입하면 첫 지원 수수료 <span className="underline font-bold">무료</span>
      </div>

      {/* 헤더 - 미니멀 (이탈 최소화) */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="다잇다" width={30} height={30} className="rounded-lg" />
            <span className="font-bold text-lg">다잇다</span>
          </Link>
          <Link
            href="/auth/login?callbackUrl=/jobs"
            className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-500 transition-colors"
          >
            무료 시작
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-5 pt-12 pb-16 text-center">
        <div className="max-w-lg mx-auto">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
            중소기업 일용직 매칭 플랫폼
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mb-4">
            오늘 일하고,
            <br />
            <span className="text-blue-600">오늘 받아요.</span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            스펙 불필요. 하루 단위 자유 근무.
            <br />
            집 근처 중소기업에서 일당 바로 지급.
          </p>

          {/* 메인 CTA */}
          <Link
            href="/auth/login?callbackUrl=/jobs"
            className="block w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-lg font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-blue-200"
          >
            지금 일자리 찾기
            <ArrowRight className="inline ml-2 h-5 w-5" />
          </Link>
          <p className="text-xs text-gray-400 mt-3">무료 가입 · 1분 완성 · 즉시 지원 가능</p>
        </div>
      </section>

      {/* 숫자 사회증명 */}
      <section className="bg-blue-600 text-white px-5 py-8">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold">{workerCount.toLocaleString()}+</p>
            <p className="text-blue-200 text-xs mt-1">가입 구직자</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold">{jobCount.toLocaleString()}+</p>
            <p className="text-blue-200 text-xs mt-1">등록 공고</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold">{payCount}%</p>
            <p className="text-blue-200 text-xs mt-1">당일 지급률</p>
          </div>
        </div>
      </section>

      {/* 페인포인트 → 솔루션 */}
      <section className="px-5 py-14">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            이런 경험 있으신가요?
          </h2>
          <div className="space-y-4 mb-10">
            {[
              "알바 구하려다 이력서에 막혀버렸다",
              "급하게 돈이 필요한데 급여일이 한 달 뒤다",
              "하루만 일하고 싶은데 단기 알바가 없다",
            ].map((pain) => (
              <div key={pain} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                <span className="text-gray-400 text-lg mt-0.5">😓</span>
                <p className="text-gray-700 text-sm leading-relaxed">{pain}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <ChevronDown className="h-6 w-6 text-blue-400 mx-auto animate-bounce" />
            <p className="text-blue-600 font-bold mt-2">다잇다이 해결합니다</p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Zap,
                color: "text-blue-600",
                bg: "bg-blue-50",
                title: "이력서 없이 바로 지원",
                desc: "프로필 간단 등록 후 즉시 지원. 경력 없어도 OK.",
              },
              {
                icon: Wallet,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                title: "당일 급여 지급",
                desc: "근무 완료 후 당일~익일 계좌 입금. 기다림 없음.",
              },
              {
                icon: Clock,
                color: "text-orange-600",
                bg: "bg-orange-50",
                title: "하루 단위 자유 선택",
                desc: "일하고 싶은 날만 골라서 일해요. 강제 없음.",
              },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100">
                <div className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">{title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이용 방법 3단계 */}
      <section className="bg-gray-50 px-5 py-14">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">딱 3단계</h2>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "무료 가입",
                desc: "카카오·네이버·구글 소셜 로그인으로 30초 완성",
              },
              {
                step: "02",
                title: "공고 확인 후 지원",
                desc: "집 근처, 원하는 날짜, 원하는 일당 필터로 빠르게 검색",
              },
              {
                step: "03",
                title: "일하고 당일 입금",
                desc: "근무 완료 후 급여 즉시 확정. 더 이상 기다리지 마세요",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-5">
                <span className="text-3xl font-extrabold text-blue-200 leading-none w-10 flex-shrink-0">
                  {step}
                </span>
                <div>
                  <p className="font-bold text-base mb-1">{title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 후기 */}
      <section className="px-5 py-14">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">실제 후기</h2>
          <div className="space-y-4">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">"{r.text}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-800">{r.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {r.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 신뢰 배지 */}
      <section className="bg-blue-50 px-5 py-10">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Shield, label: "안전 거래", sub: "신뢰 기반 매칭" },
            { icon: Users, label: "검증 기업", sub: "등록 사업자 한정" },
            { icon: MapPin, label: "위치 기반", sub: "집 근처 공고 우선" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="h-11 w-11 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs font-bold">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="px-5 py-14 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-extrabold mb-3">
            지금 바로 시작해보세요
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            가입 무료 · 수수료 없음 · 언제든 탈퇴 가능
          </p>
          <Link
            href="/auth/login?callbackUrl=/jobs"
            className="block w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-lg font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-blue-200 mb-4"
          >
            무료로 일자리 찾기
            <ArrowRight className="inline ml-2 h-5 w-5" />
          </Link>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            {["무료 가입", "스펙 불필요", "당일 입금"].map((item, i) => (
              <span key={item} className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-100 px-5 py-8 text-center text-xs text-gray-400">
        <p className="mb-2 font-semibold text-gray-600">다잇다</p>
        <p className="leading-relaxed">
          중소기업 일용직 매칭 플랫폼 · 사업자등록번호 000-00-00000
          <br />
          © 2025 다잇다. All rights reserved.
        </p>
      </footer>

      {/* 모바일 하단 고정 CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 sm:hidden">
        <Link
          href="/auth/login?callbackUrl=/jobs"
          className="block w-full bg-blue-600 text-white text-base font-bold py-3.5 rounded-2xl text-center"
        >
          무료로 일자리 찾기 →
        </Link>
      </div>
      {/* 모바일 하단 CTA 여백 */}
      <div className="h-20 sm:hidden" />
    </div>
  );
}
