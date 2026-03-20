"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Send, Sparkles, CheckCircle2 } from "lucide-react"

// ─────────────────────────────────────────────
// 나중에 AI 연동 시 이 파일 대신 아래 주석 참고:
// app/api/ai-posting/route.ts 활성화 후
// sendMessage 함수를 API 호출로 교체하면 됩니다.
// ─────────────────────────────────────────────

interface Message {
  role: "user" | "assistant"
  content: string
}

interface PostingData {
  task: string
  count: string
  datetime: string
  pay: string
  location: string
}

type Step = "task" | "count" | "datetime" | "pay" | "location" | "done"

const STEPS: Record<Step, { question: string; next: Step | null; field: keyof PostingData | null }> = {
  task:     { question: "어떤 작업이 필요하신가요?\n(예: 단순 조립, 포장, 물류 이동 등)", next: "count",    field: "task" },
  count:    { question: "몇 명이 필요하신가요?",                                               next: "datetime", field: "count" },
  datetime: { question: "언제 필요하신가요?\n(날짜와 근무 시간을 알려주세요)",                   next: "pay",      field: "datetime" },
  pay:      { question: "급여는 얼마로 하실 건가요?\n(시급 또는 일당)",                          next: "location", field: "pay" },
  location: { question: "작업 위치는 어디인가요?",                                              next: "done",     field: "location" },
  done:     { question: "",                                                                    next: null,       field: null },
}

function buildSummary(data: PostingData): string {
  return `📋 **공고 초안**

작업 내용: ${data.task}
필요 인원: ${data.count}
날짜 / 시간: ${data.datetime}
급여: ${data.pay}
위치: ${data.location}

이 내용으로 공고를 등록할까요? ✅`
}

interface AiPostingChatProps {
  onClose: () => void
}

export default function AiPostingChat({ onClose }: AiPostingChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [step, setStep] = useState<Step>("task")
  const [posting, setPosting] = useState<Partial<PostingData>>({})
  const [done, setDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // 첫 인사 메시지
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `안녕하세요! 어떤 인력이 급하게 필요하신가요? 😊\n\n${STEPS.task.question}`,
      },
    ])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || done) return

    const userText = input.trim()
    setInput("")

    const currentStep = STEPS[step]
    const updatedPosting = { ...posting, [currentStep.field!]: userText }
    setPosting(updatedPosting)

    const userMsg: Message = { role: "user", content: userText }

    if (currentStep.next === "done") {
      const summary = buildSummary(updatedPosting as PostingData)
      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: "assistant", content: summary },
      ])
      setStep("done")
      setDone(true)
    } else {
      const nextStep = currentStep.next!
      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: "assistant", content: STEPS[nextStep].question },
      ])
      setStep(nextStep)
    }
  }

  const handleRegister = () => {
    // TODO: 실제 공고 등록 API 연결 (/api/jobs POST)
    alert("공고가 등록되었습니다! (개발 중)")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 챗 패널 */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[600px]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">AI 공고 등록</p>
              <p className="text-xs text-gray-400">대화로 간편하게</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* 진행 단계 표시 */}
        <div className="px-5 pt-3 flex gap-1.5">
          {(["task", "count", "datetime", "pay", "location"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < (["task","count","datetime","pay","location"] as Step[]).indexOf(step) || done
                  ? "bg-blue-600"
                  : s === step
                  ? "bg-blue-300"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* 공고 등록 버튼 */}
        {done && (
          <div className="px-4 pb-2">
            <Button
              onClick={handleRegister}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-11 font-semibold"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              공고 등록하기
            </Button>
          </div>
        )}

        {/* 입력창 */}
        <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={done ? "등록이 완료되었습니다" : "답변을 입력하세요..."}
              disabled={done}
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={!input.trim() || done}
              size="icon"
              className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-500 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
