import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "이용약관 - 다잇다" }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <h1 className="text-base font-bold text-gray-900">이용약관</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">제1조 (목적)</h2>
            <p>
              이 약관은 다잇다(이하 &quot;회사&quot;)가 제공하는 구인구직 매칭 서비스(이하 &quot;서비스&quot;)의
              이용 조건 및 절차, 회사와 회원 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">제2조 (정의)</h2>
            <p>
              &quot;구인회원(사장님)&quot;은 인력 채용을 목적으로 서비스를 이용하는 사업자 회원을,
              &quot;구직회원&quot;은 일자리를 구할 목적으로 서비스를 이용하는 회원을 말합니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">제3조 (서비스의 성격)</h2>
            <p>
              회사는 구인회원과 구직회원 간의 매칭 기회를 제공하는 플랫폼이며,
              근로계약의 당사자가 아닙니다. 근로조건, 임금 지급 등 근로관계에 관한 사항은
              구인회원과 구직회원 간에 직접 결정되며 그 책임도 당사자에게 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">제4조 (회원가입 및 사업자 인증)</h2>
            <p>
              구인회원은 가입 시 사업자등록번호 인증을 완료해야 하며, 휴업·폐업 상태의
              사업자는 공고를 등록할 수 없습니다. 허위 정보로 가입한 경우 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">제5조 (금지행위)</h2>
            <p>
              허위 공고 등록, 타인 정보 도용, 서비스 외 목적의 개인정보 수집·이용 등의 행위는 금지되며,
              위반 시 회원 자격이 정지 또는 상실될 수 있습니다.
            </p>
          </section>
          <p className="text-xs text-gray-400 pt-2">
            본 약관은 서비스 정식 출시 전 초안이며, 정식 출시 시점에 개정·공지될 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  )
}
