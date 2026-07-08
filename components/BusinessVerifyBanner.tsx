"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ShieldAlert, ShieldCheck, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function formatBusinessNumber(value: string): string {
  const digits = value.replace(/[^0-9]/g, "").slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
}

// 사업자 인증이 안 된 기존 사장님 계정용 인증 배너
export default function BusinessVerifyBanner() {
  const { data: session, update } = useSession()
  const [open, setOpen] = useState(false)
  const [businessName, setBusinessName] = useState("")
  const [businessNumber, setBusinessNumber] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState("")
  const [done, setDone] = useState(false)

  const verified =
    (session?.user as { businessVerified?: boolean } | undefined)?.businessVerified ?? false

  if (!session || verified || done) return null

  const handleVerify = async () => {
    const digits = businessNumber.replace(/[^0-9]/g, "")
    if (!businessName.trim()) { setMsg("상호명을 입력해주세요"); return }
    if (digits.length !== 10) { setMsg("사업자등록번호 10자리를 입력해주세요"); return }

    setSubmitting(true)
    setMsg("")
    try {
      const res = await fetch("/api/auth/verify-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessNumber: digits, businessName, save: true }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        setDone(true)
        await update()
      } else {
        setMsg(data.error ?? "인증에 실패했습니다")
      }
    } catch {
      setMsg("인증 중 오류가 발생했습니다. 다시 시도해주세요")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-amber-800">사업자 인증이 필요합니다</p>
          <p className="text-xs text-amber-600 mt-0.5">인증 완료 후 공고를 등록할 수 있어요</p>
        </div>
        <ChevronDown className={`h-5 w-5 text-amber-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="상호명 (예: 대성정밀)"
            className="h-11 bg-white border-amber-200 focus:border-amber-400"
          />
          <div className="flex gap-2">
            <Input
              inputMode="numeric"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(formatBusinessNumber(e.target.value))}
              placeholder="사업자등록번호 (000-00-00000)"
              className="h-11 bg-white border-amber-200 focus:border-amber-400 flex-1"
            />
            <Button
              onClick={handleVerify}
              disabled={submitting}
              className="h-11 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold whitespace-nowrap"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-1.5" />
                  인증하기
                </>
              )}
            </Button>
          </div>
          {msg && <p className="text-xs font-medium text-red-500">{msg}</p>}
        </div>
      )}
    </div>
  )
}
