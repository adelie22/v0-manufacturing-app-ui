"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
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
  Bell
} from "lucide-react"

// Mock data
const userData = {
  name: "김민수",
  level: 7,
  trustScore: 85,
  nextLevelScore: 100,
  streak: 3,
  streakBonus: 50000,
  daysToBonus: 2,
  totalEarnings: 1850000,
  availableBalance: 620000
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
    urgent: true
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
    urgent: false
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
    urgent: false
  },
]

export default function WorkerMobileApp() {
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState("home")

  const levelProgress = (userData.trustScore / userData.nextLevelScore) * 100

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
              <p className="font-semibold">{userData.name}님</p>
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
            <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white h-11">
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
            <Button variant="ghost" size="sm" className={darkMode ? "text-indigo-400" : "text-indigo-600"}>
              전체보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {jobListings.map((job) => (
              <Card 
                key={job.id} 
                className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"} ${job.urgent ? darkMode ? "ring-2 ring-indigo-500/50" : "ring-2 ring-indigo-400/50" : ""} overflow-hidden`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
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
                    <div className="text-right">
                      <p className={`text-xl font-bold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                        {(job.pay / 10000).toFixed(0)}만원
                      </p>
                      <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>일당</p>
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
            ))}
          </div>
        </section>
      </main>

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
