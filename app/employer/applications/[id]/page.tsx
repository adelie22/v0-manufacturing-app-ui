"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, User, Phone, Briefcase, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type WorkerProfile = {
  bio: string | null
  workHistory: string[]
  skills: string[]
  desiredRegions?: string[]
  desiredCategories?: string[]
  experienceLevel?: string | null
}

type Application = {
  id: string
  status: string
  selectedDates: string[]
  createdAt: string
  worker: {
    id: string
    name: string | null
    image: string | null
    phone: string | null
    createdAt: string
    workerProfile: WorkerProfile | null
  }
  job: {
    id: string
    companyName: string
    category: string
    dates: string[]
    headcount: number
  }
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/employer/applications/${id}`)
      .then((r) => r.json())
      .then(setApplication)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleDecision = async (status: "accepted" | "rejected") => {
    setSubmitting(true)
    const res = await fetch(`/api/employer/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setApplication((prev) => prev ? { ...prev, status } : prev)
      toast.success(
        status === "accepted" ? "지원자를 수락했습니다" : "지원자를 거절했습니다",
        { description: "지원자에게 알림이 전송됐어요" }
      )
    } else {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error ?? "처리 중 오류가 발생했습니다")
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <p className="text-sm text-gray-400">지원서를 찾을 수 없습니다</p>
      </div>
    )
  }

  const { worker, job } = application
  const profile = worker.workerProfile

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => router.push(application ? `/employer/jobs/${application.job.id}` : "/employer")}
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="text-base font-bold text-gray-900">지원자 정보</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        {/* 공고 정보 */}
        <div className="bg-blue-50 rounded-2xl px-4 py-3">
          <p className="text-sm text-blue-600 font-medium">
            {job.companyName} · {job.category}
          </p>
          <p className="text-sm text-blue-500 mt-0.5">
            {job.dates[0]}{job.dates.length > 1 ? ` 외 ${job.dates.length - 1}일` : ""} · 필요 {job.headcount}명
          </p>
        </div>

        {/* 지원자 프로필 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-4">
            {worker.image ? (
              <Image src={worker.image} alt={worker.name ?? ""} width={56} height={56} className="rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="h-7 w-7 text-gray-400" />
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-gray-900">{worker.name ?? "이름 없음"}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                가입일 {new Date(worker.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </div>
          </div>

          {worker.phone && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">{worker.phone}</span>
            </div>
          )}

          {/* 근무 가능 날짜 */}
          {application.selectedDates.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-sm font-semibold text-gray-500 mb-2">근무 가능 날짜</p>
              <div className="flex flex-wrap gap-1.5">
                {[...application.selectedDates].sort().map((d) => {
                  const [, m, day] = d.split("-")
                  return (
                    <span key={d} className="text-sm font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
                      {Number(m)}/{Number(day)}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 간단 이력서 */}
        {profile ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              간단 이력서
            </h2>

            {/* 경력 수준 + 희망 조건 */}
            {(profile.experienceLevel || (profile.desiredRegions?.length ?? 0) > 0 || (profile.desiredCategories?.length ?? 0) > 0) && (
              <div className="flex flex-wrap gap-2">
                {profile.experienceLevel && (
                  <span className="text-sm font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                    경력 {profile.experienceLevel}
                  </span>
                )}
                {profile.desiredRegions?.map((r) => (
                  <span key={r} className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">📍 {r}</span>
                ))}
                {profile.desiredCategories?.map((c) => (
                  <span key={c} className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{c}</span>
                ))}
              </div>
            )}

            {profile.bio && (
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">자기소개</p>
                <p className="text-sm text-gray-800 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {profile.workHistory.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">경력</p>
                <ul className="space-y-1.5">
                  {profile.workHistory.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile.skills.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">보유 기술 / 자격</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-sm text-gray-400">이력서를 작성하지 않은 지원자입니다</p>
          </div>
        )}

        {/* 수락 / 거절 버튼 */}
        {application.status === "pending" ? (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => handleDecision("rejected")}
              disabled={submitting}
              variant="outline"
              className="h-14 rounded-2xl text-base font-semibold border-gray-200 text-gray-700"
            >
              <XCircle className="h-5 w-5 mr-2 text-red-400" />
              거절
            </Button>
            <Button
              onClick={() => handleDecision("accepted")}
              disabled={submitting}
              className="h-14 rounded-2xl text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              수락
            </Button>
          </div>
        ) : (
          <div className={`rounded-2xl p-4 text-center text-base font-semibold ${
            application.status === "accepted"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}>
            {application.status === "accepted" ? "✓ 수락한 지원자입니다" : "✗ 거절한 지원자입니다"}
          </div>
        )}
      </main>
    </div>
  )
}
