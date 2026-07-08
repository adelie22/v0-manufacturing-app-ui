import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "개인정보처리방침 - 다잇다" }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <h1 className="text-base font-bold text-gray-900">개인정보처리방침</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">1. 수집하는 개인정보 항목</h2>
            <p>
              회사는 회원가입 및 서비스 제공을 위해 다음 정보를 수집합니다:
              이름, 이메일, 전화번호, 소셜 로그인 식별자(구글·카카오·네이버),
              (구인회원) 사업자등록번호·상호명, (구직회원) 이력서에 기재한 경력·기술 정보.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">2. 개인정보의 이용 목적</h2>
            <p>
              회원 관리, 구인·구직 매칭 서비스 제공, 지원 및 채용 결과 알림 발송,
              사업자등록 상태 확인(국세청 API), 서비스 개선을 위한 통계 분석에 이용됩니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">3. 개인정보의 제공</h2>
            <p>
              구직회원이 공고에 지원하면 이름, 연락처, 이력서 정보가 해당 공고의
              구인회원에게 제공됩니다. 그 외 제3자 제공은 법령에 근거한 경우로 한정됩니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">4. 보유 및 파기</h2>
            <p>
              개인정보는 회원 탈퇴 시 지체 없이 파기됩니다. 단, 관계 법령에 따라
              보존이 필요한 경우 해당 기간 동안 보관 후 파기합니다.
            </p>
          </section>
          <p className="text-xs text-gray-400 pt-2">
            본 방침은 서비스 정식 출시 전 초안이며, 정식 출시 시점에 개정·공지될 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  )
}
