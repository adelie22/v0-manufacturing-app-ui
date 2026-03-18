"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Flame, 
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
  Briefcase,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  Filter,
  Search,
  Heart,
  Building2,
  CreditCard,
  HelpCircle,
  FileText,
  Award,
  Target,
  Gift
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
  streakBonus: 50000,
  daysToBonus: 2,
  totalEarnings: 1850000,
  availableBalance: 620000,
  totalWorkDays: 47,
  completionRate: 98,
  joinDate: "2024년 8월"
}

const jobListings = [
  { 
    id: 1, 
    company: "삼성전자 협력사", 
    task: "PCB 조립 작업",
    location: "청주 오창읍",
    distance: "3.2km",
    time: "오전 9시 - 오후 6시",
    pay: 130000,
    tags: ["픽업 제공", "당일 입금", "초보 가능"],
    urgent: true,
    saved: false
  },
  { 
    id: 2, 
    company: "청주물류센터", 
    task: "상품 포장 및 분류",
    location: "청주 오송읍",
    distance: "5.8km",
    time: "오전 8시 - 오후 5시",
    pay: 120000,
    tags: ["당일 입금", "식사 제공"],
    urgent: false,
    saved: true
  },
  { 
    id: 3, 
    company: "대한제약", 
    task: "의약품 검수 작업",
    location: "청주 흥덕구",
    distance: "4.1km",
    time: "오전 10시 - 오후 7시",
    pay: 140000,
    tags: ["픽업 제공", "초보 가능", "냉난방 완비"],
    urgent: false,
    saved: false
  },
  { 
    id: 4, 
    company: "충북식품", 
    task: "식품 포장 작업",
    location: "청주 서원구",
    distance: "2.5km",
    time: "오전 7시 - 오후 4시",
    pay: 125000,
    tags: ["당일 입금", "초보 가능"],
    urgent: true,
    saved: false
  },
  { 
    id: 5, 
    company: "한국자동차부품", 
    task: "부품 조립 및 검사",
    location: "청주 청원구",
    distance: "6.2km",
    time: "오전 8시 - 오후 5시",
    pay: 135000,
    tags: ["픽업 제공", "식사 제공", "경력 우대"],
    urgent: false,
    saved: true
  },
]

const walletTransactions = [
  { id: 1, type: "income", description: "삼성전자 협력사 일당", amount: 130000, date: "오늘", status: "completed" },
  { id: 2, type: "income", description: "청주물류센터 일당", amount: 120000, date: "어제", status: "completed" },
  { id: 3, type: "withdraw", description: "출금 신청", amount: -200000, date: "3일 전", status: "completed" },
  { id: 4, type: "bonus", description: "5일 연속 근무 보너스", amount: 50000, date: "5일 전", status: "completed" },
  { id: 5, type: "income", description: "대한제약 일당", amount: 140000, date: "6일 전", status: "completed" },
  { id: 6, type: "income", description: "충북식품 일당", amount: 125000, date: "1주 전", status: "completed" },
]

const achievements = [
  { id: 1, title: "첫 출근 완료", description: "첫 번째 일을 완료했어요", icon: Award, earned: true },
  { id: 2, title: "5일 연속 근무", description: "5일 연속으로 근무했어요", icon: Flame, earned: true },
  { id: 3, title: "신뢰 점수 80+", description: "신뢰 점수가 80점을 넘었어요", icon: Shield, earned: true },
  { id: 4, title: "10일 연속 근무", description: "10일 연속으로 근무해보세요", icon: Target, earned: false },
  { id: 5, title: "레벨 10 달성", description: "레벨 10을 달성해보세요", icon: Trophy, earned: false },
]

export default function WorkerMobileApp() {
  const { data: session } = useSession()
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [jobFilter, setJobFilter] = useState("all")
  const [savedJobs, setSavedJobs] = useState<number[]>([2, 5])

  const levelProgress = (userData.trustScore / userData.nextLevelScore) * 100

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const filteredJobs = jobListings.filter(job => {
    if (jobFilter === "saved") return savedJobs.includes(job.id)
    if (jobFilter === "urgent") return job.urgent
    return true
  })

  // Home Tab Content
  const HomeContent = () => (
    <main className="px-4 py-6 space-y-6 pb-24">
      {/* Trust Level Card */}
      <Card className={`border-0 ${darkMode ? "bg-gradient-to-br from-indigo-600 to-violet-700" : "bg-gradient-to-br from-indigo-500 to-violet-600"} text-white overflow-hidden relative`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <CardHeader className="pb-2 relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-white/90">나의 신뢰 등급</CardTitle>
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
              <Trophy className="h-3 w-3 mr-1" />
              Lv.{userData.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-end gap-2 mb-4">
            <span className="text-5xl font-bold">{userData.trustScore}</span>
            <span className="text-xl text-white/70 mb-1">/ {userData.nextLevelScore}</span>
          </div>
          <Progress value={levelProgress} className="h-3 bg-white/20" />
          <p className="text-sm text-white/80 mt-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            다음 레벨까지 {userData.nextLevelScore - userData.trustScore}점
          </p>
        </CardContent>
      </Card>

      {/* Streak Card */}
      <Card className={`border-2 ${darkMode ? "bg-zinc-900 border-amber-500/50" : "bg-white border-amber-400"} overflow-hidden`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-2xl ${darkMode ? "bg-amber-500/20" : "bg-amber-100"} flex items-center justify-center`}>
              <Flame className={`h-9 w-9 ${darkMode ? "text-amber-400" : "text-amber-500"}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-3xl font-bold ${darkMode ? "text-amber-400" : "text-amber-600"}`}>{userData.streak}일</span>
                <span className={`text-lg ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>연속 근무 중!</span>
              </div>
              <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"} mt-1`}>
                <span className={`font-semibold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>{userData.daysToBonus}일만 더 하면</span> +{(userData.streakBonus / 10000).toFixed(0)}만 원 보너스!
              </p>
            </div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((day) => (
                <div 
                  key={day}
                  className={`h-8 w-6 rounded ${
                    day <= userData.streak 
                      ? darkMode ? "bg-amber-500" : "bg-amber-400"
                      : day <= userData.streak + userData.daysToBonus
                        ? darkMode ? "bg-amber-500/30 border border-amber-500/50" : "bg-amber-200 border border-amber-300"
                        : darkMode ? "bg-zinc-700" : "bg-zinc-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Wallet */}
      <Card className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-xl ${darkMode ? "bg-emerald-500/20" : "bg-emerald-100"} flex items-center justify-center`}>
                <Wallet className={`h-6 w-6 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>내 지갑</p>
                <p className="text-xl font-bold">{(userData.availableBalance / 10000).toFixed(0)}만원</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>총 수익</p>
              <p className={`text-sm font-medium ${darkMode ? "text-zinc-300" : "text-zinc-600"}`}>{(userData.totalEarnings / 10000).toFixed(0)}만원</p>
            </div>
          </div>
          <Button 
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white h-11"
            onClick={() => setActiveTab("wallet")}
          >
            <Banknote className="h-4 w-4 mr-2" />
            출금하기
          </Button>
        </CardContent>
      </Card>

      {/* Check-in Button */}
      <Button 
        className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl shadow-lg shadow-indigo-500/25"
      >
        <CheckCircle className="h-6 w-6 mr-3" />
        GPS 출근 체크인
      </Button>

      {/* Job Listings */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">청주 지역 맞춤 공고</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className={darkMode ? "text-indigo-400" : "text-indigo-600"}
            onClick={() => setActiveTab("jobs")}
          >
            전체보기
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {jobListings.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </main>
  )

  // Job Card Component
  const JobCard = ({ job }: { job: typeof jobListings[0] }) => (
    <Card 
      className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"} ${job.urgent ? darkMode ? "ring-2 ring-indigo-500/50" : "ring-2 ring-indigo-400/50" : ""} overflow-hidden`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {job.urgent && (
                <Badge className="bg-indigo-600 text-white text-xs px-2 py-0 h-5">
                  <Zap className="h-3 w-3 mr-1" />
                  급구
                </Badge>
              )}
              <h3 className="font-semibold">{job.task}</h3>
            </div>
            <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"} mt-1`}>{job.company}</p>
          </div>
          <div className="flex items-start gap-2">
            <button 
              onClick={() => toggleSaveJob(job.id)}
              className={`p-2 rounded-lg ${darkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
            >
              <Heart 
                className={`h-5 w-5 ${
                  savedJobs.includes(job.id)
                    ? "fill-rose-500 text-rose-500"
                    : darkMode ? "text-zinc-500" : "text-zinc-400"
                }`} 
              />
            </button>
            <div className="text-right">
              <p className={`text-xl font-bold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                {(job.pay / 10000).toFixed(0)}만원
              </p>
              <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>일당</p>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center gap-4 text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"} mb-3`}>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.location} ({job.distance})
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {job.time}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary"
              className={`text-xs ${
                tag === "픽업 제공" 
                  ? darkMode ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-blue-100 text-blue-700"
                  : tag === "당일 입금"
                    ? darkMode ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-100 text-emerald-700"
                    : tag === "초보 가능"
                      ? darkMode ? "bg-violet-500/20 text-violet-400 border-violet-500/30" : "bg-violet-100 text-violet-700"
                      : darkMode ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {tag === "픽업 제공" && <Car className="h-3 w-3 mr-1" />}
              {tag === "당일 입금" && <Banknote className="h-3 w-3 mr-1" />}
              {tag === "초보 가능" && <Star className="h-3 w-3 mr-1" />}
              {tag}
            </Badge>
          ))}
        </div>

        <Button 
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          지원하기
        </Button>
      </CardContent>
    </Card>
  )

  // Jobs Tab Content
  const JobsContent = () => (
    <main className="px-4 py-6 pb-24">
      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${darkMode ? "bg-zinc-900" : "bg-white"} border ${darkMode ? "border-zinc-800" : "border-zinc-200"}`}>
          <Search className={`h-5 w-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`} />
          <input 
            type="text"
            placeholder="일자리 검색..."
            className={`flex-1 bg-transparent border-0 outline-none text-sm ${darkMode ? "placeholder:text-zinc-500" : "placeholder:text-zinc-400"}`}
          />
        </div>
        
        <div className="flex gap-2">
          {[
            { id: "all", label: "전체" },
            { id: "urgent", label: "급구" },
            { id: "saved", label: "저장됨" },
          ].map((filter) => (
            <Button
              key={filter.id}
              variant={jobFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setJobFilter(filter.id)}
              className={jobFilter === filter.id 
                ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                : darkMode ? "border-zinc-700 text-zinc-300" : ""
              }
            >
              {filter.label}
              {filter.id === "saved" && ` (${savedJobs.length})`}
            </Button>
          ))}
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className={`text-center py-12 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>저장된 공고가 없습니다</p>
          </div>
        )}
      </div>
    </main>
  )

  // Wallet Tab Content
  const WalletContent = () => (
    <main className="px-4 py-6 pb-24 space-y-6">
      {/* Balance Card */}
      <Card className={`border-0 ${darkMode ? "bg-gradient-to-br from-emerald-600 to-teal-700" : "bg-gradient-to-br from-emerald-500 to-teal-600"} text-white overflow-hidden relative`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-white/90">출금 가능 잔액</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl font-bold">{userData.availableBalance.toLocaleString()}</span>
            <span className="text-xl text-white/70 mb-1">원</span>
          </div>
          <div className="flex gap-3">
            <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 h-12">
              <ArrowUpRight className="h-5 w-5 mr-2" />
              출금하기
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 h-12">
              <CreditCard className="h-5 w-5 mr-2" />
              계좌 관리
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <CardContent className="p-4 text-center">
            <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>총 수익</p>
            <p className="text-2xl font-bold mt-1">{(userData.totalEarnings / 10000).toFixed(0)}만원</p>
          </CardContent>
        </Card>
        <Card className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <CardContent className="p-4 text-center">
            <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>이번 달</p>
            <p className="text-2xl font-bold mt-1">62만원</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">거래 내역</h2>
          <Button variant="ghost" size="sm" className={darkMode ? "text-zinc-400" : "text-zinc-500"}>
            <Calendar className="h-4 w-4 mr-1" />
            이번 달
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <Card className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <CardContent className="p-0 divide-y divide-zinc-800">
            {walletTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    tx.type === "income" 
                      ? darkMode ? "bg-emerald-500/20" : "bg-emerald-100"
                      : tx.type === "bonus"
                        ? darkMode ? "bg-amber-500/20" : "bg-amber-100"
                        : darkMode ? "bg-zinc-800" : "bg-zinc-100"
                  }`}>
                    {tx.type === "income" && <ArrowDownLeft className={`h-5 w-5 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`} />}
                    {tx.type === "withdraw" && <ArrowUpRight className={`h-5 w-5 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`} />}
                    {tx.type === "bonus" && <Gift className={`h-5 w-5 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>{tx.date}</p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  tx.amount > 0 
                    ? darkMode ? "text-emerald-400" : "text-emerald-600"
                    : darkMode ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()}원
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  )

  // Profile Tab Content
  const ProfileContent = () => (
    <main className="px-4 py-6 pb-24 space-y-6">
      {/* Profile Header */}
      <Card className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-indigo-600 text-white text-xl">
              {(session?.user?.name ?? "U").charAt(0)}
            </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{session?.user?.name ?? userData.name}</h2>
              <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{session?.user?.email ?? userData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-indigo-600 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  Lv.{userData.level}
                </Badge>
                <Badge variant="secondary" className={darkMode ? "bg-zinc-800 text-zinc-300" : ""}>
                  신뢰 {userData.trustScore}점
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <CardContent className="p-4 text-center">
            <Calendar className={`h-5 w-5 mx-auto mb-2 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            <p className="text-xl font-bold">{userData.totalWorkDays}일</p>
            <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>총 근무일</p>
          </CardContent>
        </Card>
        <Card className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <CardContent className="p-4 text-center">
            <CheckCircle className={`h-5 w-5 mx-auto mb-2 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`} />
            <p className="text-xl font-bold">{userData.completionRate}%</p>
            <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>완료율</p>
          </CardContent>
        </Card>
        <Card className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
          <CardContent className="p-4 text-center">
            <Flame className={`h-5 w-5 mx-auto mb-2 ${darkMode ? "text-amber-400" : "text-amber-600"}`} />
            <p className="text-xl font-bold">{userData.streak}일</p>
            <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>연속 근무</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <section>
        <h2 className="text-lg font-semibold mb-4">획득 배지</h2>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id}
              className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"} ${!achievement.earned ? "opacity-50" : ""}`}
            >
              <CardContent className="p-4 text-center">
                <div className={`h-12 w-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  achievement.earned 
                    ? darkMode ? "bg-indigo-500/20" : "bg-indigo-100"
                    : darkMode ? "bg-zinc-800" : "bg-zinc-100"
                }`}>
                  <achievement.icon className={`h-6 w-6 ${
                    achievement.earned
                      ? darkMode ? "text-indigo-400" : "text-indigo-600"
                      : darkMode ? "text-zinc-600" : "text-zinc-400"
                  }`} />
                </div>
                <p className="text-xs font-medium">{achievement.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Menu Items */}
      <Card className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
        <CardContent className="p-0 divide-y divide-zinc-800">
          {[
            { icon: User, label: "내 정보 수정" },
            { icon: Building2, label: "근무 이력" },
            { icon: FileText, label: "이용약관" },
            { icon: HelpCircle, label: "고객센터" },
            { icon: Settings, label: "설정" },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between p-4 ${darkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-50"} transition-colors`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`} />
                <span>{item.label}</span>
              </div>
              <ChevronRight className={`h-5 w-5 ${darkMode ? "text-zinc-600" : "text-zinc-400"}`} />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Logout */}
      <Button 
        variant="outline" 
        className={`w-full ${darkMode ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800" : "border-zinc-300 text-zinc-600 hover:bg-zinc-100"}`}
      >
        <LogOut className="h-4 w-4 mr-2" />
        로그아웃
      </Button>

      <p className={`text-center text-xs ${darkMode ? "text-zinc-600" : "text-zinc-400"}`}>
        가입일: {userData.joinDate}
      </p>
    </main>
  )

  return (
    <div className={`min-h-screen ${darkMode ? "bg-zinc-950 text-zinc-50" : "bg-zinc-50 text-zinc-900"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 px-4 py-4 ${darkMode ? "bg-zinc-900/95 backdrop-blur" : "bg-white/95 backdrop-blur"} border-b ${darkMode ? "border-zinc-800" : "border-zinc-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>안녕하세요</p>
              <p className="font-semibold">{session?.user?.name ?? userData.name}님</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>다크모드</span>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center text-white">3</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content based on active tab */}
      {activeTab === "home" && <HomeContent />}
      {activeTab === "jobs" && <JobsContent />}
      {activeTab === "wallet" && <WalletContent />}
      {activeTab === "profile" && <ProfileContent />}

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 ${darkMode ? "bg-zinc-900/95 backdrop-blur border-zinc-800" : "bg-white/95 backdrop-blur border-zinc-200"} border-t px-4 py-2 z-50`}>
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            { id: "home", icon: Home, label: "홈" },
            { id: "jobs", icon: Briefcase, label: "공고" },
            { id: "wallet", icon: Wallet, label: "지갑" },
            { id: "profile", icon: User, label: "프로필" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? darkMode ? "text-indigo-400" : "text-indigo-600"
                  : darkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
