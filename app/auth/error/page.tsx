"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"

const errorMessages: Record<string, string> = {
  Configuration: "서버 설정 오류가 발생했습니다. 관리자에게 문의하세요.",
  AccessDenied: "접근이 거부되었습니다.",
  Verification: "인증 링크가 만료되었거나 이미 사용되었습니다.",
  OAuthSignin: "소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
  OAuthCallback: "소셜 로그인 콜백 중 오류가 발생했습니다.",
  OAuthAccountNotLinked: "이미 다른 방법으로 가입된 이메일입니다.",
  Default: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error") ?? "Default"
  const message = errorMessages[error] ?? errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-14 w-14 text-red-400" />
          </div>
          <CardTitle className="text-white text-xl">로그인 오류</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-slate-300">{message}</p>
          <Button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            로그인 페이지로 돌아가기
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
