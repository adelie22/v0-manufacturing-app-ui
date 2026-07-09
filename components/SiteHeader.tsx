"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Building2 } from "lucide-react"

interface SiteHeaderProps {
  /** business: 기업 랜딩에서 우측 CTA를 '공고 등록하기'로 표시 */
  variant?: "default" | "business"
}

export default function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const { data: session } = useSession()
  const role = session?.user?.role

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-gray-900 font-[family-name:var(--font-dm-sans)] tracking-tight">
              Da-Itda
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-5">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              채용공고
            </Link>
            <Link href="/benefits" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              정부지원혜택
            </Link>
          </nav>
        </div>

        {/* 역할별 우측 영역 */}
        {role === "worker" ? (
          <div className="flex items-center gap-4">
            <Link href="/worker/profile" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              내 이력서
            </Link>
            <Link href="/worker" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              마이페이지
            </Link>
          </div>
        ) : role === "employer" ? (
          <Link
            href="/employer"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            <Building2 className="h-4 w-4" />
            공고 관리
          </Link>
        ) : variant === "business" ? (
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              로그인
            </Link>
            <Link
              href="/auth/login?callbackUrl=/employer"
              className="inline-flex items-center h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
            >
              공고 등록하기
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              로그인
            </Link>
            <Link
              href="/business"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-sm font-semibold transition-colors"
            >
              <Building2 className="h-4 w-4" />
              기업 서비스
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
