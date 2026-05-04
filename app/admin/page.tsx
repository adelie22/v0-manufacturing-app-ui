"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const ADMIN_EMAIL = "fredhwan2@gmail.com"

type Reservation = {
  id: string
  name: string | null
  phone: string
  role: string
  createdAt: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (session?.user?.email !== ADMIN_EMAIL) {
      router.replace("/")
      return
    }
    fetch("/api/admin/reservations")
      .then((r) => r.json())
      .then(setReservations)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session, status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    )
  }

  const employers = reservations.filter((r) => r.role === "employer")
  const workers = reservations.filter((r) => r.role === "worker")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">사전예약 관리</h1>
        <p className="text-sm text-gray-500 mb-8">총 {reservations.length}명 예약</p>

        {/* 요약 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">사장님</p>
            <p className="text-3xl font-bold text-blue-600">{employers.length}명</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-sm text-gray-500 mb-1">구직자</p>
            <p className="text-3xl font-bold text-emerald-600">{workers.length}명</p>
          </div>
        </div>

        {/* 목록 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold text-gray-500">이름</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">전화번호</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">구분</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">신청일</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
                    아직 예약자가 없습니다
                  </td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-900">{r.name ?? "-"}</td>
                    <td className="px-5 py-3 text-gray-900 font-medium">{r.phone}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        r.role === "employer"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {r.role === "employer" ? "사장님" : "구직자"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
