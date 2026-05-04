"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WorkerProfilePage() {
  const router = useRouter()
  const [bio, setBio] = useState("")
  const [workHistory, setWorkHistory] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [newWork, setNewWork] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/worker/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data) return
        setBio(data.bio ?? "")
        setWorkHistory(data.workHistory ?? [])
        setSkills(data.skills ?? [])
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch("/api/worker/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio, workHistory, skills }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addWork = () => {
    const v = newWork.trim()
    if (v) { setWorkHistory((prev) => [...prev, v]); setNewWork("") }
  }

  const addSkill = () => {
    const v = newSkill.trim()
    if (v) { setSkills((prev) => [...prev, v]); setNewSkill("") }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-10">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="text-base font-bold text-gray-900">내 이력서</h1>
        <span className="text-xs text-gray-400 ml-1">(선택)</span>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        <p className="text-sm text-gray-500">
          이력서를 작성하면 사장님이 지원자를 더 잘 파악할 수 있어요. 작성하지 않아도 지원은 가능합니다.
        </p>

        {/* 자기소개 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="text-sm font-semibold text-gray-900 block mb-2">자기소개</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="간단히 본인을 소개해 주세요"
            rows={4}
            className="w-full text-sm text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* 경력 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="text-sm font-semibold text-gray-900 block mb-3">경력</label>
          <div className="space-y-2 mb-3">
            {workHistory.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                <span className="text-sm text-gray-800 flex-1">{item}</span>
                <button
                  onClick={() => setWorkHistory((prev) => prev.filter((_, j) => j !== i))}
                  className="p-1 rounded-lg hover:bg-gray-200"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newWork}
              onChange={(e) => setNewWork(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addWork()}
              placeholder="예: 현대모비스 2년, 물류창고 상하차 6개월"
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={addWork}
              className="flex items-center gap-1 px-3 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              추가
            </button>
          </div>
        </div>

        {/* 기술/자격 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="text-sm font-semibold text-gray-900 block mb-3">보유 기술 / 자격증</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">
                {skill}
                <button
                  onClick={() => setSkills((prev) => prev.filter((_, j) => j !== i))}
                  className="hover:text-blue-900"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="예: 지게차 운전, 용접, 식품제조"
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={addSkill}
              className="flex items-center gap-1 px-3 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              추가
            </button>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-14 rounded-2xl text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white"
        >
          {saved ? "저장됐어요 ✓" : saving ? "저장 중..." : "이력서 저장"}
        </Button>
      </main>
    </div>
  )
}
