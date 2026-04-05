"use client"

import { signIn, useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense, useEffect } from "react"
import Image from "next/image"

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace(callbackUrl)
    }
  }, [status, session, callbackUrl, router])

  const handleLogin = (provider: string) => {
    signIn(provider, { callbackUrl })
  }

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* 로고 */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/logo.png" alt="일손매칭" width={80} height={80} className="rounded-2xl object-cover shadow-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">일손매칭</h1>
            <p className="text-gray-500 mt-2">제조업 일용직 매칭 플랫폼</p>
          </div>
        </div>

        {/* 로그인 카드 */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">로그인 / 회원가입</CardTitle>
            <CardDescription className="text-gray-500">
              소셜 계정으로 간편하게 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Google 로그인 */}
            <Button
              onClick={() => handleLogin("google")}
              variant="outline"
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 font-medium"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google로 계속하기
            </Button>

            {/* Kakao 로그인 */}
            <Button
              onClick={() => handleLogin("kakao")}
              className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] font-medium border-0"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.73 1.71 5.13 4.29 6.57l-1.1 4.09c-.1.37.32.67.64.45L10.8 19.2c.39.04.79.06 1.2.06 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" />
              </svg>
              카카오로 계속하기
            </Button>

            {/* Naver 로그인 */}
            <Button
              onClick={() => handleLogin("naver")}
              className="w-full h-12 bg-[#03C75A] hover:bg-[#02B350] text-white font-medium border-0"
            >
              <span className="mr-3 font-bold text-lg leading-none">N</span>
              네이버로 계속하기
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-gray-400 text-xs">
          로그인 시 서비스 이용약관 및 개인정보처리방침에 동의합니다
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
