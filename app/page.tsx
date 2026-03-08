import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Smartphone, ArrowRight, Users, Briefcase, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <header className="px-4 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center mb-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/25">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight text-balance">
            일손매칭
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto text-balance">
            제조업 일용직 매칭 플랫폼
          </p>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            사장님과 구직자를 신뢰 기반으로 연결합니다
          </p>
        </div>
      </header>

      {/* Features */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "신뢰 기반 매칭" },
            { icon: Zap, label: "즉시 매칭" },
            { icon: Shield, label: "검증된 인력" },
            { icon: Briefcase, label: "간편 공고" },
          ].map((feature) => (
            <div key={feature.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <feature.icon className="h-6 w-6 text-indigo-400" />
              <span className="text-sm text-slate-300 text-center">{feature.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Selection Cards */}
      <main className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-white text-center mb-8">
            서비스 선택
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Employer Card */}
            <Link href="/employer" className="group">
              <Card className="h-full bg-slate-800 border-slate-700 hover:border-slate-500 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-slate-700 flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                      <Building2 className="h-7 w-7 text-slate-300" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">사장님용 대시보드</CardTitle>
                      <CardDescription className="text-slate-400">Employer Dashboard</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      실시간 매칭 현황 확인
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      신뢰 기반 인력 관리
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      간편 공고 등록
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      큰 글씨, 직관적인 UI
                    </li>
                  </ul>
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white group-hover:bg-slate-600 transition-colors">
                    사장님용 입장
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Worker Card */}
            <Link href="/worker" className="group">
              <Card className="h-full bg-gradient-to-br from-indigo-600 to-violet-700 border-0 hover:from-indigo-500 hover:to-violet-600 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/50 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Smartphone className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">구직자용 모바일 앱</CardTitle>
                      <CardDescription className="text-indigo-200">Worker Mobile App</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-indigo-100">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      신뢰 등급 및 레벨 시스템
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      연속 근무 보너스
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      GPS 출근 체크인
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      다크모드, 게임화 요소
                    </li>
                  </ul>
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 transition-colors">
                    구직자용 입장
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            일손매칭 - 제조업 일용직 매칭 플랫폼
          </p>
        </div>
      </footer>
    </div>
  )
}
