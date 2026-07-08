// 사업자등록번호 검증 유틸
// 1) 체크섬 검증 (오프라인, 국세청 발급 규칙)
// 2) 국세청 사업자등록 상태조회 API (NTS_API_KEY 설정 시)

export function normalizeBusinessNumber(input: string): string {
  return input.replace(/[^0-9]/g, "")
}

// 국세청 사업자등록번호 체크섬 검증 (10자리)
export function isValidBusinessNumberFormat(bn: string): boolean {
  const digits = normalizeBusinessNumber(bn)
  if (!/^\d{10}$/.test(digits)) return false

  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * weights[i]
  }
  sum += Math.floor((Number(digits[8]) * 5) / 10)
  const check = (10 - (sum % 10)) % 10
  return check === Number(digits[9])
}

export type BusinessVerifyResult = {
  valid: boolean
  statusCode?: string // "01" 계속사업자 | "02" 휴업자 | "03" 폐업자
  statusLabel?: string
  taxType?: string
  source: "nts" | "checksum"
  message: string
}

const STATUS_LABELS: Record<string, string> = {
  "01": "계속사업자",
  "02": "휴업자",
  "03": "폐업자",
}

// 국세청 상태조회 API 호출 (키 없으면 체크섬 결과만 반환)
export async function verifyBusinessNumber(bn: string): Promise<BusinessVerifyResult> {
  const digits = normalizeBusinessNumber(bn)

  if (!isValidBusinessNumberFormat(digits)) {
    return {
      valid: false,
      source: "checksum",
      message: "올바른 사업자등록번호 형식이 아닙니다",
    }
  }

  const apiKey = process.env.NTS_API_KEY
  if (!apiKey) {
    // API 키 미설정: 체크섬 통과만으로 검증 처리
    return {
      valid: true,
      source: "checksum",
      message: "사업자등록번호 형식이 확인되었습니다",
    }
  }

  try {
    const res = await fetch(
      `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ b_no: [digits] }),
        signal: AbortSignal.timeout(8000),
      }
    )

    if (!res.ok) {
      // 국세청 API 장애 시 체크섬 통과로 폴백 (가입 차단 방지)
      return {
        valid: true,
        source: "checksum",
        message: "사업자등록번호 형식이 확인되었습니다 (상태조회 일시 불가)",
      }
    }

    const data = await res.json()
    const info = data?.data?.[0]

    if (!info || !info.b_stt_cd) {
      return {
        valid: false,
        source: "nts",
        message: "국세청에 등록되지 않은 사업자등록번호입니다",
      }
    }

    const statusCode = info.b_stt_cd as string
    const statusLabel = STATUS_LABELS[statusCode] ?? info.b_stt ?? "알 수 없음"

    if (statusCode !== "01") {
      return {
        valid: false,
        statusCode,
        statusLabel,
        taxType: info.tax_type,
        source: "nts",
        message: `${statusLabel} 상태의 사업자등록번호입니다. 영업 중인 사업자만 가입할 수 있습니다`,
      }
    }

    return {
      valid: true,
      statusCode,
      statusLabel,
      taxType: info.tax_type,
      source: "nts",
      message: "국세청 확인이 완료된 사업자입니다",
    }
  } catch {
    // 네트워크/타임아웃: 체크섬 통과로 폴백
    return {
      valid: true,
      source: "checksum",
      message: "사업자등록번호 형식이 확인되었습니다 (상태조회 일시 불가)",
    }
  }
}
