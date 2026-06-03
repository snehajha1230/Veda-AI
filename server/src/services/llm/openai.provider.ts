import OpenAI from "openai";
import { env } from "../../config/env.js";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (!env.openaiApiKey) return null;
  if (!client) client = new OpenAI({ apiKey: env.openaiApiKey });
  return client;
}

export function isOpenAIConfigured(): boolean {
  return Boolean(env.openaiApiKey);
}

/** Same chat-completions + JSON contract as Gemini provider. */
export async function generateJsonWithOpenAI(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) throw new Error("OpenAI API key not configured");

  const response = await openai.chat.completions.create({
    model: env.openaiModel,
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenAI");
  return content;
}
