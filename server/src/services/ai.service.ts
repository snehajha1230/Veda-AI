import { env } from "../config/env.js";
import type { IAssignment } from "../models/Assignment.js";
import type { QuestionPaper } from "../types/index.js";
import { buildGenerationPrompt } from "./prompt.builder.js";
import { generateMockPaper } from "./mock.generator.js";
import { parsePaperFromLLM } from "./paper.parser.js";
import {
  generateQuestionPaperJson as generateWithGemini,
  isGeminiConfigured,
} from "./llm/gemini.provider.js";
import {
  generateJsonWithOpenAI,
  isOpenAIConfigured,
} from "./llm/openai.provider.js";

const SYSTEM_PROMPT =
  "You are an experienced school teacher setting a formal exam. Write standalone exam questions that test syllabus concepts directly — definitions, calculations, diagrams, reasoning, and applications. Never write reading-comprehension passages, never quote long blocks from the source, never say 'according to the material'. MCQ options go in a separate array (four per question). Marks appear only in section instructions.";

async function callLLM(
  userPrompt: string,
  assignment: IAssignment,
): Promise<string> {
  const errors: string[] = [];

  if (isGeminiConfigured()) {
    try {
      console.log(
        "[ai] generating from source with Gemini (%s), file=%s",
        env.geminiModel,
        assignment.fileName ?? "none",
      );
      return await generateWithGemini(userPrompt, assignment);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn("[ai] Gemini failed:", message);
      errors.push(`Gemini: ${message}`);
    }
  }

  if (isOpenAIConfigured()) {
    try {
      console.log("[ai] generating with OpenAI (%s)", env.openaiModel);
      return await generateJsonWithOpenAI(SYSTEM_PROMPT, userPrompt);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn("[ai] OpenAI failed:", message);
      errors.push(`OpenAI: ${message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" | "));
  }

  throw new Error("No LLM API key configured");
}

export async function generateQuestionPaper(
  assignment: IAssignment,
): Promise<QuestionPaper> {
  const maximumMarks = assignment.questionTypes.reduce(
    (s, q) => s + q.count * q.marksPerQuestion,
    0,
  );
  const fallback = {
    subject: assignment.subject,
    className: assignment.className,
    maximumMarks,
    questionTypes: assignment.questionTypes,
  };

  if (!assignment.fileText?.trim()) {
    console.warn("[ai] no source text on assignment — using mock");
    return generateMockPaper(assignment);
  }

  if (!isGeminiConfigured() && !isOpenAIConfigured()) {
    console.log("[ai] no API key — mock generator using source excerpts");
    return generateMockPaper(assignment);
  }

  const prompt = buildGenerationPrompt(assignment);
  const content = await callLLM(prompt, assignment);
  return parsePaperFromLLM(content, fallback);
}
