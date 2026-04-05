"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Clock,
  Wallet,
  CheckCircle,
  ChevronRight,
  Trophy,
  Zap,
  Star,
  TrendingUp,
  Car,
  Banknote,
  User,
  Home,
  Search,
  Building2,
  HelpCircle,
  FileText,
  Award,
  Target,
  Shield,
  LogOut,
  Flame,
  Calendar,
  Settings,
  XCircle,
  AlertCircle,
} from "lucide-react"

// Mock data
const userData = {
  name: "김민수",
  email: "minsu.kim@email.com",
  phone: "010-1234-5678",
  level: 7,
  trustScore: 85,
  nextLevelScore: 100,
  streak: 3,
  totalEarnings: 1850000,
  availableBalance: 620000,
  totalWorkDays: 47,
  monthWorkDays: 12,
  monthEarnings: 1560000,
  completionRate: 98,
  joinDate: "2024년 8월",
}

const recommendedJobs = [
  {
    id: 1,
    company: "삼성전자 협력사",
    task: "PCB 조립 작업",
    location: "청주 오창읍",
    distance: "3.2km",
    time: "오전 9시 - 오후 6시",
    pay: 130000,
    sameDay: true,
    urgent: true,
  },
  {
    id: 2,
    company: "청주물류센터",
    task: "상품 포장 및 분류",
    location: "청주 오송읍",
    distance: "5.8km",
    time: "오전 8시 - 오후 5시",
    pay: 120000,
    sameDay: true,
    urgent: false,
  },
]

const allJobs = [
  ...recommendedJobs,
  {
    id: 3,
    company: "대한제약",
    task: "의약품 검수 작업",
    location: "청주 흥덕구",
    distance: "4.1km",
    time: "오전 10시 - 오후 7시",
    pay: 140000,
    sameDay: false,
    urgent: false,
  },
  {
    id: 4,
    company: "충북식품",
    task: "식품 포장 작업",
    location: "청주 서원구",
    distance: "2.5km",
    time: "오전 7시 - 오후 4시",
    pay: 125000,
    sameDay: true,
    urgent: true,
  },
  {
    id: 5,
    company: "한국자동차부품",
    task: "부품 조립 및 검사",
    location: "청주 청원구",
    distance: "6.2km",
    time: "오전 8시 - 오후 5시",
    pay: 135000,
    sameDay: false,
    urgent: false,
  },
]

const achievements = [
  { id: 1, title: "첫 출근 완료", description: "첫 번째 일을 완료했어요", icon: Award, earned: true },
  { id: 2, title: "5일 연속 근무", description: "5일 연속으로 근무했어요", icon: Flame, earned: true },
  { id: 3, title: "신뢰 점수 80+", description: "신뢰 점수가 80점을 넘었어요", icon: Shield, earned: true },
  { id: 4, title: "10일 연속 근무", description: "10일 연속으로 근무해보세요", icon: Target, earned: false },
  { id: 5, title: "레벨 10 달성", description: "레벨 10을 달성해보세요", icon: Trophy, earned: false },
]

type TabId = "home" | "jobs" | "profile"

export default function WorkerMobileApp() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<TabId>("home")

  const displayName = session?.user?.name ?? userData.name

  // ── Job Card Component ──
  const JobCard = ({ job }: { job: (typeof allJobs)[0] }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {job.urgent && (
              <Badge className="bg-red-600 text-white text-sm px-2 py-0.5 h-6">
                <Zap className="h-4 w-4 mr-1" />
                급구
              </Badge>
            )}
            <span className="text-sm text-gray-500">{job.company}</span>
          </div>
          <h3 className="text-base font-semibold text-gray-900">{job.task}</h3>
        </div>
        <div className="text-right ml-3">
          <p className="text-xl font-bold text-blue-600">
            {(job.pay / 10000).toFixed(0)}만원
          </p>
          <p className="text-sm text-gray-500">일당</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {job.location} ({job.distance})
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {job.time}
        </span>
      </div>

      {job.sameDay && (
        <div className="mb-4">
          <Badge className="bg-emerald-100 text-emerald-700 text-sm px-2 py-0.5 h-6">
            <Banknote className="h-4 w-4 mr-1" />
            당일입금
          </Badge>
        </div>
      )}

      <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl text-base font-semibold">
        지원하기
      </Button>
    </div>
  )

  // ── 홈 탭 ──
  const HomeContent = () => (
    <main className="px-4 py-6 space-y-6 pb-24">
      {/* 오늘 추천 공고 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">오늘 추천 공고</h2>
        <div className="space-y-4">
          {recommendedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* 내 이번달 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-1">내 이번달</h3>
        <p className="text-sm text-gray-500">
          이번달 근무 <span className="font-semibold text-gray-900">{userData.monthWorkDays}일</span> · 총{" "}
          <span className="font-semibold text-gray-900">{(userData.monthEarnings / 10000).toFixed(0)}만원</span>
        </p>
      </div>

      {/* 공고 더 보기 */}
      <button
        onClick={() => setActiveTab("jobs")}
        className="flex items-center gap-1 text-blue-600 font-semibold text-base h-11"
      >
        공고 더 보기
        <ChevronRight className="h-5 w-5" />
      </button>
    </main>
  )

  // ── 공고찾기 탭 ──
  const JobsContent = () => (
    <main className="px-4 py-6 pb-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">공고찾기</h2>
      <div className="space-y-4">
        {allJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </main>
  )

  // ── 내 정보 탭 ──
  const ProfileContent = () => (
    <main className="px-4 py-6 pb-24 space-y-6">
      {/* 프로필 헤더 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-blue-600 text-white text-xl">
              {(session?.user?.name ?? "사").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-sm text-gray-500">{session?.user?.email ?? userData.email}</p>
            <p className="text-sm text-gray-500 mt-0.5">가입일: {userData.joinDate}</p>
          </div>
        </div>
      </div>

      {/* 신뢰 등급 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">신뢰 등급</h3>
          <Badge className="bg-blue-600 text-white text-sm px-2 py-0.5 h-6">
            <Trophy className="h-4 w-4 mr-1" />
            Lv.{userData.level}
          </Badge>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-bold text-gray-900">{userData.trustScore}</span>
          <span className="text-lg text-gray-400 mb-1">/ {userData.nextLevelScore}</span>
        </div>
        <Progress value={(userData.trustScore / userData.nextLevelScore) * 100} className="h-3 bg-gray-100" />
        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          다음 레벨까지 {userData.nextLevelScore - userData.trustScore}점
        </p>
      </div>

      {/* 근무 통계 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">근무 통계</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Calendar className="h-5 w-5 mx-auto mb-2 text-blue-600" />
            <p className="text-xl font-bold text-gray-900">{userData.totalWorkDays}일</p>
            <p className="text-sm text-gray-500">총 근무일</p>
          </div>
          <div className="text-center">
            <CheckCircle className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
            <p className="text-xl font-bold text-gray-900">{userData.completionRate}%</p>
            <p className="text-sm text-gray-500">완료율</p>
          </div>
          <div className="text-center">
            <Flame className="h-5 w-5 mx-auto mb-2 text-amber-600" />
            <p className="text-xl font-bold text-gray-900">{userData.streak}일</p>
            <p className="text-sm text-gray-500">연속 근무</p>
          </div>
        </div>
      </div>

      {/* 출석 상태 예시 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">최근 출석</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm text-emerald-600 font-medium">출근</span>
            <span className="text-sm text-gray-500 ml-auto">4/4 (금)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm text-emerald-600 font-medium">출근</span>
            <span className="text-sm text-gray-500 ml-auto">4/3 (목)</span>
          </div>
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm text-red-600 font-medium">결근</span>
            <span className="text-sm text-gray-500 ml-auto">4/2 (수)</span>
          </div>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-amber-600 font-medium">대기</span>
            <span className="text-sm text-gray-500 ml-auto">4/1 (화)</span>
          </div>
        </div>
      </div>

      {/* 레벨 & 배지 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">획득 배지</h3>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`text-center p-3 rounded-xl ${!ach.earned ? "opacity-40" : ""}`}
            >
              <div
                className={`h-12 w-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  ach.earned ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <ach.icon
                  className={`h-6 w-6 ${ach.earned ? "text-blue-600" : "text-gray-400"}`}
                />
              </div>
              <p className="text-sm font-medium text-gray-900">{ach.title}</p>
              <p className="text-sm text-gray-500">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 메뉴 항목 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {[
          { icon: User, label: "내 정보 수정" },
          { icon: Building2, label: "근무 이력" },
          { icon: FileText, label: "이용약관" },
          { icon: HelpCircle, label: "고객센터" },
          { icon: Settings, label: "설정" },
        ].map((item, idx) => (
          <button
            key={item.label}
            className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors min-h-[44px] ${
              idx > 0 ? "border-t border-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-gray-500" />
              <span className="text-base text-gray-900">{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        ))}
      </div>

      {/* 로그아웃 */}
      <Button
        variant="outline"
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 h-14 rounded-2xl text-base font-semibold border-0"
      >
        <LogOut className="h-5 w-5 mr-2" />
        로그아웃
      </Button>
    </main>
  )

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">안녕하세요,</p>
            <p className="text-lg font-semibold text-gray-900">{displayName}님</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-500">잔액</p>
              <p className="text-base font-bold text-gray-900">{userData.availableBalance.toLocaleString()}원</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white h-11 rounded-2xl text-sm font-semibold px-4">
              <Wallet className="h-4 w-4 mr-1.5" />
              출금하기
            </Button>
          </div>
        </div>
      </header>

      {/* 탭 콘텐츠 */}
      {activeTab === "home" && <HomeContent />}
      {activeTab === "jobs" && <JobsContent />}
      {activeTab === "profile" && <ProfileContent />}

      {/* 하단 탭 바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-16 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around max-w-md mx-auto h-full">
          {([
            { id: "home" as TabId, icon: Home, label: "홈" },
            { id: "jobs" as TabId, icon: Search, label: "공고찾기" },
            { id: "profile" as TabId, icon: User, label: "내 정보" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[64px] transition-colors ${
                activeTab === tab.id ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <tab.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
