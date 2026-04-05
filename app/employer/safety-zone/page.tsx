"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Users,
  AlertTriangle,
  AlertCircle,
  Building2,
  ArrowLeft,
  Shield,
  Calculator,
  Clock,
  DollarSign,
  CheckCircle,
} from "lucide-react"

// Types
interface Worker {
  id: number
  name: string
  daysWorked: number
  hoursWorked: number
  hourlyRate: number
}

// Mock data for workers this month
const workersData: Worker[] = [
  { id: 1, name: "김민수", daysWorked: 5, hoursWorked: 42, hourlyRate: 12000 },
  { id: 2, name: "이영희", daysWorked: 7, hoursWorked: 56, hourlyRate: 11500 },
  { id: 3, name: "박철수", daysWorked: 8, hoursWorked: 68, hourlyRate: 13000 },
  { id: 4, name: "정지은", daysWorked: 3, hoursWorked: 24, hourlyRate: 11000 },
  { id: 5, name: "최동욱", daysWorked: 6, hoursWorked: 48, hourlyRate: 12500 },
  { id: 6, name: "한미영", daysWorked: 9, hoursWorked: 76, hourlyRate: 12000 },
  { id: 7, name: "오성호", daysWorked: 4, hoursWorked: 32, hourlyRate: 11500 },
  { id: 8, name: "장은비", daysWorked: 10, hoursWorked: 85, hourlyRate: 13500 },
  { id: 9, name: "윤재현", daysWorked: 7, hoursWorked: 58, hourlyRate: 12000 },
  { id: 10, name: "배수진", daysWorked: 2, hoursWorked: 16, hourlyRate: 11000 },
]

// Insurance calculation constants (Korean social insurance rates)
const INSURANCE_RATES = {
  nationalPension: 0.045, // 국민연금 4.5% (employer portion)
  healthInsurance: 0.03545, // 건강보험 3.545% (employer portion)
  longTermCare: 0.004591, // 장기요양보험 (calculated from health insurance)
  employmentInsurance: 0.009, // 고용보험 0.9%
  industrialAccident: 0.014, // 산재보험 (varies by industry, using manufacturing average)
}

function getWorkerStatus(daysWorked: number): "safe" | "warning" | "critical" {
  if (daysWorked >= 8) return "critical"
  if (daysWorked >= 6) return "warning"
  return "safe"
}

function getStatusBadge(status: "safe" | "warning" | "critical") {
  switch (status) {
    case "safe":
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
          <CheckCircle className="h-4 w-4" />
          안전
        </span>
      )
    case "warning":
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
          <AlertTriangle className="h-4 w-4" />
          주의
        </span>
      )
    case "critical":
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
          <AlertCircle className="h-4 w-4" />
          위험
        </span>
      )
  }
}

function calculateMonthlyInsuranceCost(worker: Worker) {
  const monthlyWage = worker.hoursWorked * worker.hourlyRate

  const nationalPension = monthlyWage * INSURANCE_RATES.nationalPension
  const healthInsurance = monthlyWage * INSURANCE_RATES.healthInsurance
  const longTermCare = healthInsurance * (INSURANCE_RATES.longTermCare / INSURANCE_RATES.healthInsurance)
  const employmentInsurance = monthlyWage * INSURANCE_RATES.employmentInsurance
  const industrialAccident = monthlyWage * INSURANCE_RATES.industrialAccident

  return {
    monthlyWage,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    industrialAccident,
    total: nationalPension + healthInsurance + longTermCare + employmentInsurance + industrialAccident
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Math.round(amount))
}

export default function SafetyZoneDashboard() {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate summary stats
  const totalWorkers = workersData.length
  const warningWorkers = workersData.filter(w => getWorkerStatus(w.daysWorked) === "warning").length
  const criticalWorkers = workersData.filter(w => getWorkerStatus(w.daysWorked) === "critical").length

  const handleWorkerClick = (worker: Worker) => {
    if (getWorkerStatus(worker.daysWorked) === "critical") {
      setSelectedWorker(worker)
      setIsModalOpen(true)
    }
  }

  const insuranceCost = selectedWorker ? calculateMonthlyInsuranceCost(selectedWorker) : null

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/employer"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <span className="sr-only">뒤로가기</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold text-gray-900">Safety Zone 모니터</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* 페이지 설명 */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">근무일수 기반 4대 보험 관리</h1>
          <p className="text-sm text-gray-500 mt-1">월별 근무 현황을 확인하고 보험 가입 대상을 관리하세요</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Workers */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-500">총 근무 인원</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalWorkers}<span className="text-base font-medium text-gray-500 ml-1">명</span></p>
          </div>

          {/* Warning Workers */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-600">주의 (6-7일)</p>
            </div>
            <p className="text-3xl font-bold text-amber-600">{warningWorkers}<span className="text-base font-medium text-amber-500 ml-1">명</span></p>
          </div>

          {/* Critical Workers */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-600">위험 (8일+)</p>
            </div>
            <p className="text-3xl font-bold text-red-600">{criticalWorkers}<span className="text-base font-medium text-red-500 ml-1">명</span></p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">4대 보험 가입 기준 안내</h3>
              <p className="text-sm text-gray-500 mt-1">
                월 8일 이상 또는 월 60시간 이상 근무 시 4대 보험 의무 가입 대상입니다.
                위험 상태의 근로자는 탭하여 예상 보험료를 확인하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Workers List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">이번 달 근무 현황</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            근로자별 근무일수 및 시간을 확인하세요. 위험 상태를 탭하면 보험료 계산기가 열립니다.
          </p>

          <div className="space-y-3">
            {workersData.map((worker) => {
              const status = getWorkerStatus(worker.daysWorked)
              const isCritical = status === "critical"

              return (
                <button
                  key={worker.id}
                  type="button"
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    isCritical
                      ? "border-red-200 bg-red-50/50 hover:bg-red-50 active:bg-red-100 cursor-pointer"
                      : status === "warning"
                      ? "border-amber-200 bg-amber-50/30"
                      : "border-gray-100 bg-gray-50/50"
                  }`}
                  onClick={() => isCritical && handleWorkerClick(worker)}
                  disabled={!isCritical}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-gray-900">{worker.name}</span>
                    {getStatusBadge(status)}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-sm text-gray-500">근무일수</span>
                      <p className="text-sm font-medium text-gray-900">{worker.daysWorked}일</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">근무시간</span>
                      <p className="text-sm font-medium text-gray-900">{worker.hoursWorked}시간</p>
                    </div>
                  </div>
                  {isCritical && (
                    <div className="mt-3 flex items-center gap-2 text-red-600 text-sm font-medium">
                      <Calculator className="h-4 w-4" />
                      <span>탭하여 보험료 확인</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-gray-600">안전 (5일 이하)</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">주의 (6-7일)</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">위험 (8일 이상)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Insurance Calculator Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2 text-gray-900">
              <Calculator className="h-5 w-5 text-gray-600" />
              보험료 계산기
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {selectedWorker?.name}님의 예상 사업주 부담 4대 보험료
            </DialogDescription>
          </DialogHeader>

          {insuranceCost && selectedWorker && (
            <div className="space-y-4 py-4">
              {/* Worker Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">근무일수</span>
                  <span className="font-medium text-gray-900">{selectedWorker.daysWorked}일</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">근무시간</span>
                  <span className="font-medium text-gray-900">{selectedWorker.hoursWorked}시간</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">시급</span>
                  <span className="font-medium text-gray-900">{formatCurrency(selectedWorker.hourlyRate)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">예상 월급</span>
                    <span className="font-bold text-gray-900">{formatCurrency(insuranceCost.monthlyWage)}</span>
                  </div>
                </div>
              </div>

              {/* Insurance Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  사업주 부담 보험료
                </h4>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">국민연금 (4.5%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(insuranceCost.nationalPension)}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">건강보험 (3.545%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(insuranceCost.healthInsurance)}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">장기요양보험</span>
                    <span className="font-medium text-gray-900">{formatCurrency(insuranceCost.longTermCare)}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">고용보험 (0.9%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(insuranceCost.employmentInsurance)}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">산재보험 (1.4%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(insuranceCost.industrialAccident)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-red-700">총 예상 보험료</span>
                    <span className="text-xl font-bold text-red-700">{formatCurrency(insuranceCost.total)}</span>
                  </div>
                  <p className="text-sm text-red-600 mt-2">
                    * 실제 보험료는 신고 기준에 따라 달라질 수 있습니다
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 h-14 rounded-2xl border-0"
            >
              닫기
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl font-semibold"
              onClick={() => setIsModalOpen(false)}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
