"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Building2, Smartphone, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Role = "employer" | "worker"

export default function SignupPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [role, setRole] = useState<Role | null>(null)
  const [name, setName] = useState(session?.user?.name ?? "")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) {
      setError("역할을 선택해주세요")
      return
    }
    if (!name.trim()) {
      setError("이름을 입력해주세요")
      return
    }
    if (!phone.trim()) {
      setError("전화번호를 입력해주세요")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, name, phone }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "프로필 저장에 실패했습니다")
      }

      await update() // 세션 갱신
      router.push(role === "employer" ? "/employer" : "/worker")
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <CheckCircle2 className="h-14 w-14 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">프로필 완성하기</h1>
          <p className="text-slate-400">서비스 이용을 위해 기본 정보를 입력해주세요</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">기본 정보 입력</CardTitle>
            <CardDescription className="text-slate-400">
              처음 가입 시 한 번만 입력하면 됩니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 역할 선택 */}
              <div className="space-y-3">
                <Label className="text-slate-300 text-base">나는 어떤 사용자인가요?</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("employer")}
                    className={`p-4 rounded-xl border-2 transition-all text-left space-y-2 ${
                      role === "employer"
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-600 bg-slate-700/50 hover:border-slate-500"
                    }`}
                  >
                    <Building2 className={`h-7 w-7 ${role === "employer" ? "text-indigo-400" : "text-slate-400"}`} />
                    <div>
                      <p className={`font-semibold ${role === "employer" ? "text-indigo-300" : "text-slate-300"}`}>
                        사장님
                      </p>
                      <p className="text-xs text-slate-400">인력을 구하는 업체</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("worker")}
                    className={`p-4 rounded-xl border-2 transition-all text-left space-y-2 ${
                      role === "worker"
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-slate-600 bg-slate-700/50 hover:border-slate-500"
                    }`}
                  >
                    <Smartphone className={`h-7 w-7 ${role === "worker" ? "text-violet-400" : "text-slate-400"}`} />
                    <div>
                      <p className={`font-semibold ${role === "worker" ? "text-violet-300" : "text-slate-300"}`}>
                        구직자
                      </p>
                      <p className="text-xs text-slate-400">일자리를 찾는 분</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">이름</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="실명을 입력해주세요"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
                />
              </div>

              {/* 전화번호 */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">전화번호</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              >
                {loading ? "저장 중..." : "시작하기"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
