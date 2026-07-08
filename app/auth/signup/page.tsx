"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Building2, HardHat, CheckCircle2, LogOut, ShieldCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Role = "employer" | "worker"

// 000-00-00000 형태로 표시
function formatBusinessNumber(value: string): string {
  const digits = value.replace(/[^0-9]/g, "").slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
}

export default function SignupPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [role, setRole] = useState<Role | null>(null)
  const [name, setName] = useState(session?.user?.name ?? "")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 사장님 사업자 인증
  const [businessName, setBusinessName] = useState("")
  const [businessNumber, setBusinessNumber] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [verifyMsg, setVerifyMsg] = useState("")

  const handleBusinessNumberChange = (value: string) => {
    setBusinessNumber(formatBusinessNumber(value))
    // 번호가 바뀌면 인증 무효화
    if (verified) { setVerified(false); setVerifyMsg("") }
  }

  const handleVerifyBusiness = async () => {
    const digits = businessNumber.replace(/[^0-9]/g, "")
    if (digits.length !== 10) {
      setVerifyMsg("사업자등록번호 10자리를 입력해주세요")
      return
    }
    setVerifying(true)
    setVerifyMsg("")
    try {
      const res = await fetch("/api/auth/verify-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessNumber: digits }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        setVerified(true)
        setVerifyMsg(data.message ?? "인증되었습니다")
      } else {
        setVerified(false)
        setVerifyMsg(data.error ?? "인증에 실패했습니다")
      }
    } catch {
      setVerified(false)
      setVerifyMsg("인증 중 오류가 발생했습니다. 다시 시도해주세요")
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) { setError("역할을 선택해주세요"); return }
    if (!name.trim()) { setError("이름을 입력해주세요"); return }
    if (!phone.trim()) { setError("전화번호를 입력해주세요"); return }
    if (role === "employer") {
      if (!businessName.trim()) { setError("상호명을 입력해주세요"); return }
      if (!verified) { setError("사업자등록번호 인증을 완료해주세요"); return }
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name,
          phone,
          ...(role === "employer"
            ? {
                businessNumber: businessNumber.replace(/[^0-9]/g, ""),
                businessName,
              }
            : {}),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "프로필 저장에 실패했습니다")
      }

      await update()
      router.push(role === "employer" ? "/employer" : "/jobs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <CheckCircle2 className="h-14 w-14 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">프로필 완성하기</h1>
          <p className="text-gray-500">서비스 이용을 위해 기본 정보를 입력해주세요</p>
        </div>

        <Card className="bg-white rounded-3xl border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">기본 정보 입력</CardTitle>
            <CardDescription className="text-gray-500">
              처음 가입 시 한 번만 입력하면 됩니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 역할 선택 */}
              <div className="space-y-3">
                <Label className="text-gray-700 text-base">나는 어떤 사용자인가요?</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("employer")}
                    className={`p-4 rounded-xl border-2 transition-all text-left space-y-2 min-h-[44px] ${
                      role === "employer"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <Building2 className={`h-7 w-7 ${role === "employer" ? "text-blue-600" : "text-gray-400"}`} />
                    <div>
                      <p className={`font-semibold ${role === "employer" ? "text-blue-700" : "text-gray-700"}`}>사장님</p>
                      <p className="text-sm text-gray-400">인력을 구하는 업체</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("worker")}
                    className={`p-4 rounded-xl border-2 transition-all text-left space-y-2 min-h-[44px] ${
                      role === "worker"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <HardHat className={`h-7 w-7 ${role === "worker" ? "text-blue-600" : "text-gray-400"}`} />
                    <div>
                      <p className={`font-semibold ${role === "worker" ? "text-blue-700" : "text-gray-700"}`}>구직자</p>
                      <p className="text-sm text-gray-400">일자리를 찾는 분</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 text-base">이름</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="실명을 입력해주세요"
                  className="border-gray-200 focus:border-blue-600 h-14"
                />
              </div>

              {/* 전화번호 */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 text-base">전화번호</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="border-gray-200 focus:border-blue-600 h-14"
                />
              </div>

              {/* 사장님: 사업자 인증 */}
              {role === "employer" && (
                <div className="space-y-4 rounded-2xl bg-blue-50/60 border border-blue-100 p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-bold text-blue-800">사업자 인증</p>
                  </div>
                  <p className="text-xs text-blue-600/80 -mt-2">
                    신뢰할 수 있는 채용 환경을 위해 영업 중인 사업자만 공고를 등록할 수 있습니다
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-gray-700 text-sm">상호명</Label>
                    <Input
                      id="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="예) 대성정밀"
                      className="border-gray-200 focus:border-blue-600 h-12 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessNumber" className="text-gray-700 text-sm">사업자등록번호</Label>
                    <div className="flex gap-2">
                      <Input
                        id="businessNumber"
                        inputMode="numeric"
                        value={businessNumber}
                        onChange={(e) => handleBusinessNumberChange(e.target.value)}
                        placeholder="000-00-00000"
                        disabled={verified}
                        className="border-gray-200 focus:border-blue-600 h-12 bg-white flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyBusiness}
                        disabled={verifying || verified || businessNumber.replace(/[^0-9]/g, "").length !== 10}
                        className={`h-12 px-4 rounded-xl text-sm font-semibold whitespace-nowrap ${
                          verified
                            ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                      >
                        {verifying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : verified ? (
                          "인증완료"
                        ) : (
                          "인증하기"
                        )}
                      </Button>
                    </div>
                    {verifyMsg && (
                      <p className={`text-xs font-medium ${verified ? "text-emerald-600" : "text-red-500"}`}>
                        {verified && "✓ "}{verifyMsg}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl text-base"
              >
                {loading ? "저장 중..." : "시작하기"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="w-full h-14 text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                다른 계정으로 로그인
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
