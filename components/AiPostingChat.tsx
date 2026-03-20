"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Send, Sparkles, CheckCircle2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AiPostingChatProps {
  onClose: () => void
}

export default function AiPostingChat({ onClose }: AiPostingChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [postingReady, setPostingReady] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // 첫 메시지 자동 시작
  useEffect(() => {
    sendMessage(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async (userText: string | null) => {
    const newMessages: Message[] = userText
      ? [...messages, { role: "user", content: userText }]
      : []

    if (userText) setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai-posting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      const aiText: string = data.message ?? "오류가 발생했습니다"

      const isReady = aiText.includes("[POSTING_READY]")
      const cleanText = aiText.replace("[POSTING_READY]", "").trim()

      setMessages((prev) => [...prev, { role: "assistant", content: cleanText }])
      if (isReady) setPostingReady(true)
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "연결 오류가 발생했습니다. 다시 시도해주세요." }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    sendMessage(input.trim())
  }

  const handleRegister = () => {
    // TODO: 실제 공고 등록 API 연결
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
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
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

          {loading && (
            <div className="flex justify-start">
              <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* 공고 등록 버튼 (초안 완성 시) */}
        {postingReady && (
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
              placeholder="메시지를 입력하세요..."
              disabled={loading}
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
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
