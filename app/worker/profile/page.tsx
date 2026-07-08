"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Plus, X, User, MapPin, Factory, Award, Briefcase, FileText, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const REGIONS = ["서울", "경기", "인천", "부산", "대구", "대전", "광주", "충북", "충남", "경북", "경남", "전북", "전남", "강원", "제주"]
const CATEGORIES = ["제조/생산", "물류/창고", "식품/음료", "건설/현장", "서비스/기타"]
const EXPERIENCE_LEVELS = ["신입", "1년 미만", "1~3년", "3~5년", "5년 이상"]
const SKILL_OPTIONS = [
  "지게차 자격증", "용접", "프레스", "CNC/선반", "품질검사", "포장/조립",
  "식품제조", "전기 작업", "운전면허 1종", "크레인/호이스트", "도장", "재고관리",
]

export default function WorkerProfilePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [bio, setBio] = useState("")
  const [workHistory, setWorkHistory] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [desiredRegions, setDesiredRegions] = useState<string[]>([])
  const [desiredCategories, setDesiredCategories] = useState<string[]>([])
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null)
  const [newWork, setNewWork] = useState("")
  const [customSkill, setCustomSkill] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/worker/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data) return
        setBio(data.bio ?? "")
        setWorkHistory(data.workHistory ?? [])
        setSkills(data.skills ?? [])
        setDesiredRegions(data.desiredRegions ?? [])
        setDesiredCategories(data.desiredCategories ?? [])
        setExperienceLevel(data.experienceLevel ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // 이력서 완성도 (실제 구직사이트 스타일)
  const sections = [
    desiredRegions.length > 0,
    desiredCategories.length > 0,
    experienceLevel !== null,
    skills.length > 0,
    workHistory.length > 0,
    bio.trim().length > 0,
  ]
  const completion = Math.round((sections.filter(Boolean).length / sections.length) * 100)

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch("/api/worker/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio, workHistory, skills, desiredRegions, desiredCategories, experienceLevel }),
    }).catch(() => null)
    setSaving(false)
    if (res?.ok) {
      toast.success("이력서가 저장됐어요", { description: "지원할 때 사장님에게 함께 전달됩니다" })
    } else {
      toast.error("저장에 실패했습니다. 다시 시도해주세요")
    }
  }

  const addWork = () => {
    const v = newWork.trim()
    if (v) { setWorkHistory((prev) => [...prev, v]); setNewWork("") }
  }

  const addCustomSkill = () => {
    const v = customSkill.trim()
    if (v && !skills.includes(v)) { setSkills((prev) => [...prev, v]); setCustomSkill("") }
  }

  const chipClass = (selected: boolean) =>
    `min-h-[42px] px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
      selected
        ? "border-blue-500 bg-blue-50 text-blue-700"
        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
    }`

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-28">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button onClick={() => router.push("/worker")} className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="text-base font-bold text-gray-900">내 이력서</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        {/* 완성도 카드 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">{(session?.user?.name ?? "?").charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-900">{session?.user?.name ?? "이름 없음"}</p>
              <p className="text-xs text-gray-400">이력서가 완성될수록 합격 확률이 올라가요</p>
            </div>
            <span className={`text-lg font-bold ${completion >= 80 ? "text-emerald-600" : completion >= 50 ? "text-blue-600" : "text-amber-600"}`}>
              {completion}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${completion >= 80 ? "bg-emerald-500" : completion >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : (
          <>
            {/* 희망 근무 지역 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-bold text-gray-900">희망 근무 지역</p>
                {desiredRegions.length > 0 && <Check className="h-4 w-4 text-emerald-500 ml-auto" />}
              </div>
              <p className="text-xs text-gray-400 mb-3">복수 선택 가능</p>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <button key={r} onClick={() => toggle(desiredRegions, setDesiredRegions, r)} className={chipClass(desiredRegions.includes(r))}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 희망 업종 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Factory className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-bold text-gray-900">희망 업종</p>
                {desiredCategories.length > 0 && <Check className="h-4 w-4 text-emerald-500 ml-auto" />}
              </div>
              <p className="text-xs text-gray-400 mb-3">복수 선택 가능</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => toggle(desiredCategories, setDesiredCategories, c)} className={chipClass(desiredCategories.includes(c))}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 경력 수준 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-bold text-gray-900">제조현장 경력</p>
                {experienceLevel && <Check className="h-4 w-4 text-emerald-500 ml-auto" />}
              </div>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_LEVELS.map((lv) => (
                  <button key={lv} onClick={() => setExperienceLevel(experienceLevel === lv ? null : lv)} className={chipClass(experienceLevel === lv)}>
                    {lv}
                  </button>
                ))}
              </div>
            </div>

            {/* 보유 기술/자격 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-bold text-gray-900">보유 기술 / 자격</p>
                {skills.length > 0 && <Check className="h-4 w-4 text-emerald-500 ml-auto" />}
              </div>
              <p className="text-xs text-gray-400 mb-3">해당하는 항목을 선택하거나 직접 추가하세요</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {SKILL_OPTIONS.map((s) => (
                  <button key={s} onClick={() => toggle(skills, setSkills, s)} className={chipClass(skills.includes(s))}>
                    {skills.includes(s) && <span className="mr-1">✓</span>}{s}
                  </button>
                ))}
                {/* 직접 추가한 스킬 */}
                {skills.filter((s) => !SKILL_OPTIONS.includes(s)).map((s) => (
                  <button key={s} onClick={() => setSkills((prev) => prev.filter((v) => v !== s))}
                    className="min-h-[42px] px-3.5 py-2 rounded-xl text-sm font-medium border border-blue-500 bg-blue-50 text-blue-700 flex items-center gap-1">
                    {s} <X className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                  placeholder="직접 입력 (예: 사출성형)"
                  className="flex-1 text-sm border border-dashed border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button onClick={addCustomSkill} className="px-3 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 경력 사항 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-bold text-gray-900">경력 사항</p>
                {workHistory.length > 0 && <Check className="h-4 w-4 text-emerald-500 ml-auto" />}
              </div>
              <p className="text-xs text-gray-400 mb-3">회사명 · 담당 업무 · 근무 기간 순으로 적어주세요</p>
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
                  placeholder="예: 대성정밀 · 프레스 보조 · 2년"
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

            {/* 자기소개 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-bold text-gray-900">자기소개</p>
                {bio.trim().length > 0 && <Check className="h-4 w-4 text-emerald-500 ml-auto" />}
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="예: 성실하게 오래 일할 곳을 찾고 있습니다. 물류창고에서 2년간 일했고 몸 쓰는 일에 자신 있습니다."
                rows={4}
                className="w-full text-sm text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </>
        )}
      </main>

      {/* 하단 고정 저장 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full h-14 rounded-2xl text-base font-semibold bg-blue-600 hover:bg-blue-500 text-white"
          >
            {saving ? "저장 중..." : "이력서 저장"}
          </Button>
        </div>
      </div>
    </div>
  )
}
