import { redirect } from "next/navigation"

// 공고 목록이 홈(/)으로 승격되면서 기존 /jobs 링크 호환용 리다이렉트
export default function JobsRedirect() {
  redirect("/")
}
