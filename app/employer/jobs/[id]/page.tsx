"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft, Trash2, User, ChevronRight,
  MapPin, Clock, Users, Banknote, CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type Application = {
  id: string
  status: string
  createdAt: string
  worker: {
    id: string
    name: string | null
    image: string | null
    workerProfile: { bio: string | null } | null
  }
}

type Job = {
  id: string
  companyName: string
  category: string
  location: string
  dates: string[]
  startTime: string
  endTime: string
  headcount: number
  payType: string
  payAmount: number
  instantPay: boolean
  pickup: boolean
  description: string | null
  tasks: string[]
  status: string
  createdAt: string
  _count: { applications: number }
  applications: Application[]
}

const STATUS_LABEL: Record<string, string> = {
  pending: "검토중",
  accepted: "수락",
  rejected: "거절",
}
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    fetch(`/api/employer/jobs/${id}`)
      .then((r) => r.json())
      .then(setJob)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    const res = await fetch(`/api/employer/jobs/${id}`, { method: "DELETE" })
    if (res.ok) router.replace("/employer")
    else setDeleting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <p className="text-sm text-gray-400">공고를 찾을 수 없습니다</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-10">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/employer")} className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">공고 상세</h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors ${
            confirmDelete
              ? "bg-red-600 text-white hover:bg-red-500"
              : "text-red-500 hover:bg-red-50"
          }`}
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? "삭제 중..." : confirmDelete ? "정말 삭제" : "삭제"}
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        {/* 공고 기본 정보 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-xl font-bold text-gray-900">{job.companyName}</h2>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              job.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
            }`}>
              {job.status === "active" ? "모집중" : "마감"}
            </span>
          </div>
          <p className="text-sm text-blue-600 font-medium mb-4">{job.category}</p>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              {job.location}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <CalendarDays className="h-4 w-4 text-gray-400 flex-shrink-0" />
              {job.dates.join(", ")}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              {job.startTime} ~ {job.endTime}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
              필요 {job.headcount}명
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Banknote className="h-4 w-4 text-gray-400 flex-shrink-0" />
              {job.payType === "daily" ? "일급" : "시급"}{" "}
              {job.payAmount.toLocaleString()}원
              {job.instantPay && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">당일지급</span>
              )}
            </div>
          </div>

          {job.tasks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-sm font-semibold text-gray-500 mb-2">작업 내용</p>
              <div className="flex flex-wrap gap-2">
                {job.tasks.map((t, i) => (
                  <span key={i} className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          )}

          {job.description && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-sm font-semibold text-gray-500 mb-1">상세 내용</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          )}
        </div>

        {/* 지원자 목록 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">지원자</h3>
            <span className="text-sm font-medium text-gray-400">{job._count.applications}명</span>
          </div>

          {job.applications.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">아직 지원자가 없습니다</p>
          ) : (
            <div className="space-y-1">
              {job.applications.map((app) => (
                <Link key={app.id} href={`/employer/applications/${app.id}`}>
                  <div className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      {app.worker.image ? (
                        <Image
                          src={app.worker.image}
                          alt={app.worker.name ?? ""}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{app.worker.name ?? "이름 없음"}</p>
                        {app.worker.workerProfile?.bio && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">
                            {app.worker.workerProfile.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[app.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {STATUS_LABEL[app.status] ?? app.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
