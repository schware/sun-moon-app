const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-5";

const SUMMARY_SYSTEM_PROMPT = `당신은 회의록을 정리하는 어시스턴트입니다.
주어진 회의 녹취록/메모를 아래 Markdown 형식의 한국어 요약으로 변환하세요.
형식 이외의 설명은 절대 덧붙이지 마세요.

# 회의 요약

## 참석자
- (파악 가능하면 나열, 불가하면 "명시되지 않음")

## 논의 내용
- 핵심 논의 사항을 불릿으로 정리

## 결정 사항
- 합의되거나 결정된 내용

## 액션 아이템
- [ ] 담당자와 할 일 (파악되는 경우 담당자 표기)
`;

export async function summarizeMeeting(
  apiKey: string,
  transcript: string
): Promise<string> {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      system: SUMMARY_SYSTEM_PROMPT,
      messages: [{ role: "user", content: transcript }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Claude 요약 실패 (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}
