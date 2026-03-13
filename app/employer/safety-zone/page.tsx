"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  Users, 
  AlertTriangle, 
  AlertCircle,
  ShieldCheck,
  Calculator,
  ArrowLeft,
  Building2,
  Clock
} from "lucide-react"

interface Worker {
  id: number
  name: string
  daysWorked: number
  hoursWorked: number
  hourlyWage: number
}

const workersData: Worker[] = [
  { id: 1, name: "김민수", daysWorked: 5, hoursWorked: 40, hourlyWage: 12000 },
  { id: 2, name: "이영희", daysWorked: 7, hoursWorked: 56, hourlyWage: 11500 },
  { id: 3, name: "박철수", daysWorked: 9, hoursWorked: 72, hourlyWage: 13000 },
  { id: 4, name: "정지은", daysWorked: 3, hoursWorked: 24, hourlyWage: 11000 },
  { id: 5, name: "최동욱", daysWorked: 8, hoursWorked: 64, hourlyWage: 12500 },
  { id: 6, name: "한소연", daysWorked: 6, hoursWorked: 48, hourlyWage: 11500 },
  { id: 7, name: "윤재호", daysWorked: 4, hoursWorked: 32, hourlyWage: 12000 },
  { id: 8, name: "강미경", daysWorked: 10, hoursWorked: 80, hourlyWage: 13500 },
  { id: 9, name: "오성민", daysWorked: 2, hoursWorked: 16, hourlyWage: 11000 },
  { id: 10, name: "서예진", daysWorked: 7, hoursWorked: 56, hourlyWage: 12000 },
]

function getStatus(days: number): { label: string; color: string; bgColor: string } {
  if (days >= 8) {
    return { label: "위험", color: "text-red-700", bgColor: "bg-red-100" }
  } else if (days >= 6) {
    return { label: "주의", color: "text-amber-700", bgColor: "bg-amber-100" }
  }
  return { label: "안전", color: "text-emerald-700", bgColor: "bg-emerald-100" }
}

function calculateInsurance(worker: Worker) {
  const monthlyWage = worker.hoursWorked * worker.hourlyWage
  
  // Korean social insurance rates (employer portion)
  const nationalPension = monthlyWage * 0.045 // 4.5%
  const healthInsurance = monthlyWage * 0.03545 // 3.545%
  const longTermCare = healthInsurance * 0.1227 // 12.27% of health insurance
  const employmentInsurance = monthlyWage * 0.009 // 0.9%
  const industrialAccident = monthlyWage * 0.016 // varies, ~1.6% average
  
  const total = nationalPension + healthInsurance + longTermCare + employmentInsurance + industrialAccident
  
  return {
    nationalPension: Math.round(nationalPension),
    healthInsurance: Math.round(healthInsurance),
    longTermCare: Math.round(longTermCare),
    employmentInsurance: Math.round(employmentInsurance),
    industrialAccident: Math.round(industrialAccident),
    total: Math.round(total),
    monthlyWage: monthlyWage
  }
}

export default function SafetyZonePage() {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const totalWorkers = workersData.length
  const warningWorkers = workersData.filter(w => w.daysWorked >= 6 && w.daysWorked <= 7).length
  const criticalWorkers = workersData.filter(w => w.daysWorked >= 8).length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  const handleWorkerClick = (worker: Worker) => {
    if (worker.daysWorked >= 8) {
      setSelectedWorker(worker)
      setIsModalOpen(true)
    }
  }

  const insurance = selectedWorker ? calculateInsurance(selectedWorker) : null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-800 text-white px-4 py-5 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/employer" 
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 text-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            대시보드로 돌아가기
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-9 w-9" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">안전 구역 모니터</h1>
                <p className="text-slate-300 text-base md:text-lg">일용직 근무일수 관리</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-lg font-medium">2024년 3월</p>
              <p className="text-slate-300 text-base">월간 현황</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader className="pb-3">
              <CardDescription className="text-lg text-slate-600">전체 근무자</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-5xl md:text-6xl font-bold text-slate-800">{totalWorkers}</span>
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="h-9 w-9 text-slate-600" />
                </div>
              </div>
              <p className="text-lg text-slate-500 mt-2">명</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 shadow-md bg-amber-50">
            <CardHeader className="pb-3">
              <CardDescription className="text-lg text-amber-700">주의 (6-7일)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-5xl md:text-6xl font-bold text-amber-600">{warningWorkers}</span>
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-9 w-9 text-amber-600" />
                </div>
              </div>
              <p className="text-lg text-amber-600 mt-2">명</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 shadow-md bg-red-50">
            <CardHeader className="pb-3">
              <CardDescription className="text-lg text-red-700">위험 (8일 이상)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-5xl md:text-6xl font-bold text-red-600">{criticalWorkers}</span>
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-9 w-9 text-red-600" />
                </div>
              </div>
              <p className="text-lg text-red-600 mt-2">명 - 4대보험 적용 대상</p>
            </CardContent>
          </Card>
        </section>

        {/* Workers Table */}
        <section>
          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-3 text-slate-800">
                <Clock className="h-8 w-8" />
                근무자 현황
              </CardTitle>
              <CardDescription className="text-lg">
                8일 이상 근무자 클릭 시 보험료 계산기가 열립니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {workersData.map((worker) => {
                  const status = getStatus(worker.daysWorked)
                  return (
                    <div
                      key={worker.id}
                      onClick={() => handleWorkerClick(worker)}
                      className={`p-4 rounded-xl border-2 ${
                        worker.daysWorked >= 8 
                          ? "border-red-200 bg-red-50 cursor-pointer active:bg-red-100" 
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-semibold text-slate-800">{worker.name}</span>
                        <Badge className={`text-base px-3 py-1 ${status.bgColor} ${status.color}`}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-base">
                        <div>
                          <span className="text-slate-500">근무일수</span>
                          <p className="text-lg font-medium text-slate-800">{worker.daysWorked}일</p>
                        </div>
                        <div>
                          <span className="text-slate-500">근무시간</span>
                          <p className="text-lg font-medium text-slate-800">{worker.hoursWorked}시간</p>
                        </div>
                      </div>
                      {worker.daysWorked >= 8 && (
                        <div className="mt-3 flex items-center gap-2 text-red-600">
                          <Calculator className="h-5 w-5" />
                          <span className="text-base">보험료 계산하기</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-4 px-4 text-lg font-semibold text-slate-600">이름</th>
                      <th className="text-center py-4 px-4 text-lg font-semibold text-slate-600">근무일수</th>
                      <th className="text-center py-4 px-4 text-lg font-semibold text-slate-600">근무시간</th>
                      <th className="text-center py-4 px-4 text-lg font-semibold text-slate-600">상태</th>
                      <th className="text-center py-4 px-4 text-lg font-semibold text-slate-600">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workersData.map((worker) => {
                      const status = getStatus(worker.daysWorked)
                      return (
                        <tr 
                          key={worker.id} 
                          className={`border-b border-slate-100 ${
                            worker.daysWorked >= 8 
                              ? "bg-red-50 hover:bg-red-100" 
                              : worker.daysWorked >= 6 
                                ? "bg-amber-50 hover:bg-amber-100" 
                                : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="py-4 px-4 text-xl font-medium text-slate-800">{worker.name}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`text-xl font-bold ${
                              worker.daysWorked >= 8 
                                ? "text-red-600" 
                                : worker.daysWorked >= 6 
                                  ? "text-amber-600" 
                                  : "text-slate-800"
                            }`}>
                              {worker.daysWorked}일
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-xl text-slate-800">{worker.hoursWorked}시간</td>
                          <td className="py-4 px-4 text-center">
                            <Badge className={`text-base px-4 py-1 ${status.bgColor} ${status.color}`}>
                              {status.label}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {worker.daysWorked >= 8 ? (
                              <Button
                                variant="outline"
                                size="lg"
                                onClick={() => handleWorkerClick(worker)}
                                className="border-red-300 text-red-600 hover:bg-red-100"
                              >
                                <Calculator className="h-5 w-5 mr-2" />
                                보험료 계산
                              </Button>
                            ) : (
                              <span className="text-slate-400 text-base">-</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Info Card */}
        <section>
          <Card className="border-2 border-blue-200 bg-blue-50 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">4대보험 적용 기준 안내</h3>
                  <p className="text-lg text-blue-700 leading-relaxed">
                    일용직 근로자가 월 8일 이상 근무하거나, 월 60시간 이상 근무할 경우 
                    4대보험(국민연금, 건강보험, 고용보험, 산재보험) 가입 의무가 발생합니다. 
                    사업주는 해당 보험료의 일부를 부담해야 합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Insurance Calculator Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <Calculator className="h-7 w-7 text-slate-700" />
              4대보험 비용 계산
            </DialogTitle>
            <DialogDescription className="text-lg">
              {selectedWorker?.name}님의 예상 사업주 부담 보험료
            </DialogDescription>
          </DialogHeader>
          
          {insurance && selectedWorker && (
            <div className="space-y-6 pt-4">
              {/* Worker Info */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-base">
                  <div>
                    <span className="text-slate-500">근무일수</span>
                    <p className="text-lg font-semibold text-slate-800">{selectedWorker.daysWorked}일</p>
                  </div>
                  <div>
                    <span className="text-slate-500">근무시간</span>
                    <p className="text-lg font-semibold text-slate-800">{selectedWorker.hoursWorked}시간</p>
                  </div>
                  <div>
                    <span className="text-slate-500">시급</span>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(selectedWorker.hourlyWage)}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">월 급여 (예상)</span>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(insurance.monthlyWage)}</p>
                  </div>
                </div>
              </div>

              {/* Insurance Breakdown */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-slate-700">사업주 부담 보험료 내역</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-base text-slate-600">국민연금 (4.5%)</span>
                    <span className="text-lg font-medium text-slate-800">{formatCurrency(insurance.nationalPension)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-base text-slate-600">건강보험 (3.545%)</span>
                    <span className="text-lg font-medium text-slate-800">{formatCurrency(insurance.healthInsurance)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-base text-slate-600">장기요양보험</span>
                    <span className="text-lg font-medium text-slate-800">{formatCurrency(insurance.longTermCare)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-base text-slate-600">고용보험 (0.9%)</span>
                    <span className="text-lg font-medium text-slate-800">{formatCurrency(insurance.employmentInsurance)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-base text-slate-600">산재보험 (~1.6%)</span>
                    <span className="text-lg font-medium text-slate-800">{formatCurrency(insurance.industrialAccident)}</span>
                  </div>
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center py-4 bg-red-50 rounded-xl px-4 border-2 border-red-200">
                  <span className="text-xl font-semibold text-red-700">총 사업주 부담액</span>
                  <span className="text-2xl font-bold text-red-600">{formatCurrency(insurance.total)}</span>
                </div>
              </div>

              <p className="text-sm text-slate-500 text-center">
                * 실제 보험료는 업종, 사업장 규모 등에 따라 달라질 수 있습니다.
              </p>

              <Button 
                className="w-full h-14 text-lg bg-slate-700 hover:bg-slate-800 text-white"
                onClick={() => setIsModalOpen(false)}
              >
                확인
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
