import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

// 일용근로소득세 계산 (한국 세법)
// 과세표준 = 일급 - 150,000원 (근로소득공제)
// 원천징수세액 = 과세표준 × 6% × (1 - 55%) = × 2.7%
// 지방소득세 = 원천징수세액 × 10%
function calcTax(dailyPay: number) {
  const taxable = Math.max(0, dailyPay - 150000)
  const incomeTax = Math.floor(taxable * 0.027)
  const localTax = Math.floor(incomeTax * 0.1)
  return { taxable, incomeTax, localTax, total: incomeTax + localTax }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "employer") {
    return NextResponse.json({ error: "권한이 없습니다" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const download = searchParams.get("download") // "tax" | "withholding" | "work" | "statement"
  const year = Number(searchParams.get("year") ?? new Date().getFullYear())
  const month = Number(searchParams.get("month") ?? new Date().getMonth() + 1)

  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month, 0, 23, 59, 59)

  // 이번 달 내 공고 + 지원자 조회
  const jobs = await prisma.jobPosting.findMany({
    where: {
      employerId: session.user.id,
      createdAt: { gte: startOfMonth, lte: endOfMonth },
    },
    include: {
      applications: {
        where: { status: "accepted" },
        include: { worker: { select: { id: true, name: true } } },
      },
    },
    orderBy: { date: "asc" },
  })

  // 근로자별 집계
  const workerMap = new Map<string, {
    name: string
    days: number
    totalPay: number
    incomeTax: number
    localTax: number
    totalTax: number
    jobs: { date: string; pay: number; incomeTax: number; localTax: number }[]
  }>()

  for (const job of jobs) {
    for (const app of job.applications) {
      const wId = app.worker.id
      const tax = calcTax(job.payAmount)
      if (!workerMap.has(wId)) {
        workerMap.set(wId, { name: app.worker.name ?? "이름없음", days: 0, totalPay: 0, incomeTax: 0, localTax: 0, totalTax: 0, jobs: [] })
      }
      const w = workerMap.get(wId)!
      w.days += 1
      w.totalPay += job.payAmount
      w.incomeTax += tax.incomeTax
      w.localTax += tax.localTax
      w.totalTax += tax.total
      w.jobs.push({ date: job.date, pay: job.payAmount, incomeTax: tax.incomeTax, localTax: tax.localTax })
    }
  }

  const workers = Array.from(workerMap.entries()).map(([id, v]) => ({ id, ...v }))

  const totalPay = workers.reduce((s, w) => s + w.totalPay, 0)
  const totalIncomeTax = workers.reduce((s, w) => s + w.incomeTax, 0)
  const totalLocalTax = workers.reduce((s, w) => s + w.localTax, 0)
  const totalTax = workers.reduce((s, w) => s + w.totalTax, 0)

  // 근로내용확인신고서 XML 다운로드 (근로복지공단 토탈서비스 EDI용)
  if (download === "work_xml") {
    const ym = `${year}${String(month).padStart(2, "0")}`
    const xmlLines = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<근로내용확인신고서>`,
      `  <신고기관>일손매칭</신고기관>`,
      `  <신고년도>${year}</신고년도>`,
      `  <신고월>${String(month).padStart(2, "0")}</신고월>`,
      `  <신고기한>${year}년 ${month + 1 > 12 ? 1 : month + 1}월 15일</신고기한>`,
      `  <총인원>${workers.length}</총인원>`,
      `  <근로자목록>`,
      ...workers.flatMap(w => [
        `    <근로자>`,
        `      <성명>${w.name}</성명>`,
        `      <근무일수>${w.days}</근무일수>`,
        `      <총지급액>${w.totalPay}</총지급액>`,
        `      <소득세>${w.incomeTax}</소득세>`,
        `      <지방소득세>${w.localTax}</지방소득세>`,
        `      <근무일자목록>`,
        ...w.jobs.map(j => `        <근무일자>${j.date}</근무일자>`),
        `      </근무일자목록>`,
        `    </근로자>`,
      ]),
      `  </근로자목록>`,
      `</근로내용확인신고서>`,
    ]
    const filename = `근로내용확인신고서_${ym}.xml`
    return new NextResponse(xmlLines.join("\n"), {
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    })
  }

  // 엑셀 다운로드
  if (download) {
    const wb = XLSX.utils.book_new()

    if (download === "tax" || download === "all") {
      // 세금계산 내역
      const taxRows = [
        ["성명", "근무일수", "총지급액", "원천징수세액", "지방소득세", "합계세액"],
        ...workers.map(w => [w.name, w.days, w.totalPay, w.incomeTax, w.localTax, w.totalTax]),
        ["합계", workers.reduce((s, w) => s + w.days, 0), totalPay, totalIncomeTax, totalLocalTax, totalTax],
      ]
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(taxRows), "세금계산내역")
    }

    if (download === "statement" || download === "all") {
      // 일용근로소득 지급명세서
      const stmtRows = [
        ["[일용근로소득 지급명세서]"],
        [`신고기간: ${year}년 ${month}월`],
        [],
        ["일련번호", "성명", "근무일수", "총지급액", "소득세", "지방소득세", "차감지급액"],
        ...workers.map((w, i) => [
          i + 1, w.name, w.days, w.totalPay, w.incomeTax, w.localTax, w.totalPay - w.totalTax
        ]),
        [],
        ["합계", "", workers.reduce((s, w) => s + w.days, 0), totalPay, totalIncomeTax, totalLocalTax, totalPay - totalTax],
      ]
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(stmtRows), "지급명세서")
    }

    if (download === "withholding" || download === "all") {
      // 원천징수이행상황신고서
      const whRows = [
        ["[원천징수이행상황신고서]"],
        [`신고기간: ${year}년 ${month}월`],
        [`신고기한: ${year}년 ${month + 1 > 12 ? 1 : month + 1}월 10일`],
        [],
        ["소득구분", "인원", "총지급액", "소득세", "지방소득세", "납부세액"],
        ["일용근로소득(A03)", workers.length, totalPay, totalIncomeTax, totalLocalTax, totalTax],
        [],
        ["※ 홈택스 원천세 신고 메뉴에서 위 내용을 입력하여 제출하세요"],
      ]
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(whRows), "원천징수신고서")
    }

    if (download === "work" || download === "all") {
      // 근로내용확인신고서 (all에는 엑셀 버전 포함)
      const workRows = [
        ["[근로내용확인신고서]"],
        [`신고기간: ${year}년 ${month}월`],
        [`신고기한: ${year}년 ${month + 1 > 12 ? 1 : month + 1}월 15일`],
        [],
        ["성명", "근무일수", "총지급액", "근무날짜 목록"],
        ...workers.map(w => [
          w.name, w.days, w.totalPay,
          w.jobs.map(j => j.date).join(", ")
        ]),
        [],
        ["※ 근로복지공단 토탈서비스(total.kcomwel.or.kr)에 XML 업로드하세요"],
      ]
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(workRows), "근로내용확인신고서")
    }

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
    const filename = download === "all"
      ? `일손매칭_세금자료_${year}${String(month).padStart(2, "0")}.xlsx`
      : `${download}_${year}${String(month).padStart(2, "0")}.xlsx`

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    })
  }

  // JSON 응답 (미리보기용)
  return NextResponse.json({
    year, month,
    summary: {
      workerCount: workers.length,
      totalPay,
      totalIncomeTax,
      totalLocalTax,
      totalTax,
      netPay: totalPay - totalTax,
    },
    workers,
    deadlines: {
      withholding: `${year}년 ${month + 1 > 12 ? 1 : month + 1}월 10일 (원천징수이행상황신고서)`,
      work: `${year}년 ${month + 1 > 12 ? 1 : month + 1}월 15일 (근로내용확인신고서)`,
      statement: `${Math.ceil(month / 3) * 3 + 1 > 12 ? (year + 1) + "년 1월" : year + "년 " + (Math.ceil(month / 3) * 3 + 1) + "월"} 말일 (지급명세서)`,
    },
  })
}
