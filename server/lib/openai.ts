import fetch from "cross-fetch";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function getAIReply(messages: ChatMessage[]) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || JSON.stringify(data));

    return String(data?.choices?.[0]?.message?.content ?? "");
  } catch (err) {
    throw new Error(`OpenAI request failed: ${err?.message ?? err}`);
  }
}