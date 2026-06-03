import fs from "fs";
import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { env } from "../../config/env.js";
import type { IAssignment } from "../../models/Assignment.js";
import { canAttachSourceFile } from "../../utils/mime.js";

let genAI: GoogleGenerativeAI | null = null;
let cachedApiKey = "";

const DEFAULT_MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
];

export function getGeminiClient(): GoogleGenerativeAI | null {
  if (!env.geminiApiKey) return null;
  if (!genAI || cachedApiKey !== env.geminiApiKey) {
    genAI = new GoogleGenerativeAI(env.geminiApiKey);
    cachedApiKey = env.geminiApiKey;
  }
  return genAI;
}

export function isGeminiConfigured(): boolean {
  return Boolean(env.geminiApiKey);
}

/** Warn at startup if the key does not look like an AI Studio key. */
export function validateGeminiApiKeyFormat(key: string): string | null {
  if (!key.trim()) return null;
  if (key.startsWith("AIza")) return null;
  if (key.startsWith("AQ.")) {
    return (
      "GEMINI_API_KEY looks like a Google Cloud token, not an AI Studio key. " +
      "Create a key at https://aistudio.google.com/apikey — it should start with AIza..."
    );
  }
  return (
    "GEMINI_API_KEY may be invalid. AI Studio keys usually start with AIza... " +
    "Get one at https://aistudio.google.com/apikey"
  );
}

function isQuotaOrRateLimitError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("429") ||
    msg.includes("Too Many Requests") ||
    msg.includes("quota") ||
    msg.includes("Quota exceeded")
  );
}

function parseRetryDelayMs(err: unknown): number | null {
  const msg = err instanceof Error ? err.message : String(err);
  const match = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
  if (match) return Math.ceil(parseFloat(match[1]) * 1000);
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function modelCandidates(): string[] {
  const primary = env.geminiModel.trim();
  const configured = env.geminiModelFallbacks
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  const fallbacks =
    configured.length > 0 ? configured : DEFAULT_MODEL_FALLBACKS;
  return [...new Set([primary, ...fallbacks])];
}

function formatGeminiError(err: unknown, model: string): Error {
  const base = err instanceof Error ? err.message : String(err);

  if (isQuotaOrRateLimitError(err)) {
    return new Error(
      `Gemini quota exceeded for model "${model}". ` +
        "Check billing at https://ai.dev/rate-limit or try a different GEMINI_MODEL " +
        `(e.g. gemini-2.5-flash). Original: ${base}`,
    );
  }

  if (base.includes("API key not valid") || base.includes("API_KEY_INVALID")) {
    return new Error(
      "Invalid GEMINI_API_KEY. Create a new key at https://aistudio.google.com/apikey " +
        "(must start with AIza...) and restart the server after updating server/.env",
    );
  }

  return err instanceof Error ? err : new Error(base);
}

const SYSTEM_PROMPT =
  "You are a school teacher writing a real exam paper in JSON. Questions must come from the syllabus you were given. Write naturally — never say 'according to the material' or label difficulty. MCQ options go in a separate array, four per question. Marks only in section instructions.";

function buildContentParts(
  userPrompt: string,
  assignment?: IAssignment,
): Part[] {
  const parts: Part[] = [{ text: userPrompt }];

  if (
    assignment?.fileStoragePath &&
    assignment.fileMimeType &&
    fs.existsSync(assignment.fileStoragePath) &&
    canAttachSourceFile(assignment.fileMimeType)
  ) {
    const data = fs.readFileSync(assignment.fileStoragePath).toString("base64");
    parts.push({
      inlineData: {
        mimeType: assignment.fileMimeType,
        data,
      },
    });
    parts.unshift({
      text: "The attached file is the syllabus you have taught. You know this content completely. Write exam questions as a teacher would — from this syllabus only.",
    });
  }

  return parts;
}

async function generateWithModel(
  modelName: string,
  systemPrompt: string,
  userPrompt: string,
  assignment?: IAssignment,
): Promise<string> {
  const client = getGeminiClient();
  if (!client) throw new Error("Gemini API key not configured");

  const model = client.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.6,
      responseMimeType: "application/json",
    },
  });

  const parts = buildContentParts(userPrompt, assignment);
  const result = await model.generateContent(parts);
  const content = result.response.text();
  if (!content?.trim()) throw new Error("Empty response from Gemini");
  return content;
}

export async function generateJsonWithGemini(
  systemPrompt: string,
  userPrompt: string,
  assignment?: IAssignment,
): Promise<string> {
  const models = modelCandidates();
  let lastError: Error | undefined;

  for (const modelName of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (attempt === 0 && modelName !== env.geminiModel) {
          console.log("[gemini] trying fallback model: %s", modelName);
        }
        return await generateWithModel(
          modelName,
          systemPrompt,
          userPrompt,
          assignment,
        );
      } catch (err) {
        lastError = formatGeminiError(err, modelName);

        if (isQuotaOrRateLimitError(err) && attempt < 2) {
          const delay =
            parseRetryDelayMs(err) ?? Math.min(30_000, 2_000 * 2 ** attempt);
          console.warn(
            "[gemini] rate limited on %s, retrying in %dms (attempt %d/3)",
            modelName,
            delay,
            attempt + 1,
          );
          await sleep(delay);
          continue;
        }

        if (isQuotaOrRateLimitError(err)) {
          console.warn(
            "[gemini] quota/rate limit on %s — trying next model",
            modelName,
          );
        }
        break;
      }
    }
  }

  throw (
    lastError ??
    new Error("Gemini generation failed after trying all configured models")
  );
}

export async function generateQuestionPaperJson(
  userPrompt: string,
  assignment?: IAssignment,
): Promise<string> {
  return generateJsonWithGemini(SYSTEM_PROMPT, userPrompt, assignment);
}
