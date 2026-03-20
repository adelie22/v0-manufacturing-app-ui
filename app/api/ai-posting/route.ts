import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic()

const SYSTEM_PROMPT = `당신은 일손매칭 플랫폼의 AI 공고 등록 도우미입니다. 사장님이 구인 공고를 빠르게 등록할 수 있도록 돕습니다.

다음 5가지 정보를 자연스러운 대화로 수집하세요:
1. 작업 내용 (예: 단순 조립, 포장, 물류 등)
2. 필요 인원 (명수)
3. 날짜 및 시간 (언제, 몇 시부터 몇 시까지)
4. 급여 (시급 또는 일당)
5. 작업 위치

규칙:
- 처음엔 "안녕하세요! 어떤 인력이 급하게 필요하신가요? 한 마디로 알려주시면 제가 도와드릴게요 😊" 로 시작하세요
- 한 번에 한 가지씩만 질문하세요
- 사장님 말투에 맞게 친근하고 간결하게 답하세요
- 모든 정보가 수집되면 마지막에 아래 형식으로 공고 초안을 보여주세요:

---
📋 **공고 초안**

**작업 내용**: [내용]
**필요 인원**: [명]
**날짜/시간**: [날짜, 시간]
**급여**: [금액]
**위치**: [장소]

이 내용으로 공고를 등록할까요? ✅
---

공고 초안을 보여줄 때는 반드시 메시지 끝에 정확히 \`[POSTING_READY]\` 를 붙여주세요.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages,
    })

    const content = response.content[0]
    if (content.type !== "text") {
      return NextResponse.json({ error: "Invalid response" }, { status: 500 })
    }

    return NextResponse.json({ message: content.text })
  } catch (error) {
    console.error("AI posting error:", error)
    return NextResponse.json({ error: "AI 서버 오류가 발생했습니다" }, { status: 500 })
  }
}
