"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
          안전
        </Badge>
      )
    case "warning":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
          주의
        </Badge>
      )
    case "critical":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
          위험
        </Badge>
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-800 text-white px-4 py-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/employer" 
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-base">대시보드로 돌아가기</span>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-slate-700 flex items-center justify-center">
                <Shield className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Safety Zone 모니터</h1>
                <p className="text-slate-300 text-base">근무일수 기반 4대 보험 가입 관리</p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-lg font-medium">청주제조(주)</p>
              <p className="text-slate-300 text-base">2024년 3월</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Workers */}
          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader className="pb-2">
              <CardDescription className="text-base text-slate-600">총 근무 인원</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl md:text-5xl font-bold text-slate-800">{totalWorkers}</span>
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="h-7 w-7 text-slate-600" />
                </div>
              </div>
              <p className="text-base text-slate-500 mt-1">명 (이번 달)</p>
            </CardContent>
          </Card>

          {/* Warning Workers */}
          <Card className="border-2 border-amber-200 shadow-md bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-base text-amber-700">주의 (6-7일)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl md:text-5xl font-bold text-amber-600">{warningWorkers}</span>
                <div className="h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-7 w-7 text-amber-600" />
                </div>
              </div>
              <p className="text-base text-amber-600 mt-1">명</p>
            </CardContent>
          </Card>

          {/* Critical Workers */}
          <Card className="border-2 border-red-200 shadow-md bg-red-50/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-base text-red-700">위험 (8일 이상)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl md:text-5xl font-bold text-red-600">{criticalWorkers}</span>
                <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-7 w-7 text-red-600" />
                </div>
              </div>
              <p className="text-base text-red-600 mt-1">명 (보험 가입 필요)</p>
            </CardContent>
          </Card>
        </section>

        {/* Info Banner */}
        <section>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 md:p-5">
            <div className="flex gap-3">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">4대 보험 가입 기준 안내</h3>
                <p className="text-base text-blue-700 mt-1">
                  월 8일 이상 또는 월 60시간 이상 근무 시 4대 보험 의무 가입 대상입니다.
                  위험 상태의 근로자는 클릭하여 예상 보험료를 확인하세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workers Table */}
        <section>
          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl flex items-center gap-3 text-slate-800">
                <Clock className="h-6 w-6" />
                이번 달 근무 현황
              </CardTitle>
              <CardDescription className="text-base">
                근로자별 근무일수 및 시간을 확인하세요. 위험 상태를 클릭하면 보험료 계산기가 열립니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {workersData.map((worker) => {
                  const status = getWorkerStatus(worker.daysWorked)
                  const isCritical = status === "critical"
                  
                  return (
                    <div
                      key={worker.id}
                      className={`p-4 rounded-xl border-2 ${
                        isCritical 
                          ? "border-red-200 bg-red-50/50 cursor-pointer active:bg-red-100" 
                          : status === "warning"
                          ? "border-amber-200 bg-amber-50/30"
                          : "border-slate-200 bg-white"
                      }`}
                      onClick={() => isCritical && handleWorkerClick(worker)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-slate-800">{worker.name}</span>
                        {getStatusBadge(status)}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-base">
                        <div>
                          <span className="text-slate-500">근무일수</span>
                          <p className="font-medium text-slate-800">{worker.daysWorked}일</p>
                        </div>
                        <div>
                          <span className="text-slate-500">근무시간</span>
                          <p className="font-medium text-slate-800">{worker.hoursWorked}시간</p>
                        </div>
                      </div>
                      {isCritical && (
                        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                          <Calculator className="h-4 w-4" />
                          <span>탭하여 보험료 확인</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-base font-semibold text-slate-700">이름</TableHead>
                      <TableHead className="text-base font-semibold text-slate-700 text-center">근무일수</TableHead>
                      <TableHead className="text-base font-semibold text-slate-700 text-center">근무시간</TableHead>
                      <TableHead className="text-base font-semibold text-slate-700 text-center">상태</TableHead>
                      <TableHead className="text-base font-semibold text-slate-700 text-center">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workersData.map((worker) => {
                      const status = getWorkerStatus(worker.daysWorked)
                      const isCritical = status === "critical"
                      
                      return (
                        <TableRow 
                          key={worker.id}
                          className={`border-slate-200 ${
                            isCritical ? "bg-red-50/50" : status === "warning" ? "bg-amber-50/30" : ""
                          }`}
                        >
                          <TableCell className="text-base font-medium text-slate-800">
                            {worker.name}
                          </TableCell>
                          <TableCell className="text-base text-slate-700 text-center">
                            {worker.daysWorked}일
                          </TableCell>
                          <TableCell className="text-base text-slate-700 text-center">
                            {worker.hoursWorked}시간
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(status)}
                          </TableCell>
                          <TableCell className="text-center">
                            {isCritical ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleWorkerClick(worker)}
                              >
                                <Calculator className="h-4 w-4 mr-2" />
                                보험료 계산
                              </Button>
                            ) : (
                              <span className="text-slate-400 text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Legend */}
        <section>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 p-4 bg-white rounded-xl border-2 border-slate-200">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
              <span className="text-base text-slate-600">안전 (5일 이하)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-amber-500"></div>
              <span className="text-base text-slate-600">주의 (6-7일)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <span className="text-base text-slate-600">위험 (8일 이상)</span>
            </div>
          </div>
        </section>
      </main>

      {/* Insurance Calculator Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-slate-800">
              <Calculator className="h-6 w-6 text-slate-600" />
              보험료 계산기
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedWorker?.name}님의 예상 사업주 부담 4대 보험료
            </DialogDescription>
          </DialogHeader>
          
          {insuranceCost && selectedWorker && (
            <div className="space-y-4 py-4">
              {/* Worker Info */}
              <div className="bg-slate-100 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-slate-600">근무일수</span>
                  <span className="font-medium text-slate-800">{selectedWorker.daysWorked}일</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-slate-600">근무시간</span>
                  <span className="font-medium text-slate-800">{selectedWorker.hoursWorked}시간</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-slate-600">시급</span>
                  <span className="font-medium text-slate-800">{formatCurrency(selectedWorker.hourlyRate)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <div className="flex justify-between text-base">
                    <span className="text-slate-600">예상 월급</span>
                    <span className="font-bold text-slate-800">{formatCurrency(insuranceCost.monthlyWage)}</span>
                  </div>
                </div>
              </div>

              {/* Insurance Breakdown */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  사업주 부담 보험료
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-base py-2 border-b border-slate-100">
                    <span className="text-slate-600">국민연금 (4.5%)</span>
                    <span className="font-medium text-slate-800">{formatCurrency(insuranceCost.nationalPension)}</span>
                  </div>
                  <div className="flex justify-between text-base py-2 border-b border-slate-100">
                    <span className="text-slate-600">건강보험 (3.545%)</span>
                    <span className="font-medium text-slate-800">{formatCurrency(insuranceCost.healthInsurance)}</span>
                  </div>
                  <div className="flex justify-between text-base py-2 border-b border-slate-100">
                    <span className="text-slate-600">장기요양보험</span>
                    <span className="font-medium text-slate-800">{formatCurrency(insuranceCost.longTermCare)}</span>
                  </div>
                  <div className="flex justify-between text-base py-2 border-b border-slate-100">
                    <span className="text-slate-600">고용보험 (0.9%)</span>
                    <span className="font-medium text-slate-800">{formatCurrency(insuranceCost.employmentInsurance)}</span>
                  </div>
                  <div className="flex justify-between text-base py-2 border-b border-slate-100">
                    <span className="text-slate-600">산재보험 (1.4%)</span>
                    <span className="font-medium text-slate-800">{formatCurrency(insuranceCost.industrialAccident)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-red-700">총 예상 보험료</span>
                    <span className="text-2xl font-bold text-red-700">{formatCurrency(insuranceCost.total)}</span>
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
              className="flex-1 border-slate-300 text-slate-700"
            >
              닫기
            </Button>
            <Button
              className="flex-1 bg-slate-700 hover:bg-slate-800 text-white"
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
