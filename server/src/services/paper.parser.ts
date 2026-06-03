import { randomUUID } from "crypto";
import { z } from "zod";
import { env } from "../config/env.js";
import type { QuestionPaper, QuestionTypeOption } from "../types/index.js";
import {
  normalizeMcqOptions,
  sanitizeQuestionText,
} from "../lib/sanitize-question.js";
import {
  sectionInstruction,
  sectionTitle,
} from "../lib/section-instructions.js";

const rawQuestionSchema = z.object({
  text: z.string(),
  options: z.array(z.string()).optional(),
});

const rawPaperSchema = z.object({
  schoolName: z.string().optional(),
  subject: z.string(),
  className: z.string(),
  timeAllowed: z.string().optional(),
  maximumMarks: z.number().optional(),
  generalInstructions: z.string().optional(),
  sections: z.array(
    z.object({
      letter: z.string(),
      title: z.string(),
      instruction: z.string(),
      questions: z.array(rawQuestionSchema),
    }),
  ),
  answerKey: z.array(
    z.object({
      questionNumber: z.number().int().positive(),
      answer: z.string(),
    }),
  ),
});

export function parsePaperFromLLM(
  raw: string,
  fallback: {
    subject: string;
    className: string;
    maximumMarks: number;
    questionTypes?: { type: QuestionTypeOption; marksPerQuestion: number }[];
  },
): QuestionPaper {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  const jsonStr =
    jsonStart >= 0 && jsonEnd > jsonStart
      ? cleaned.slice(jsonStart, jsonEnd + 1)
      : cleaned;

  const parsed = rawPaperSchema.parse(JSON.parse(jsonStr));

  let questionNumber = 0;
  const sections = parsed.sections.map((section, sIdx) => {
    const qt = fallback.questionTypes?.[sIdx];
    const isMcq =
      section.title.toLowerCase().includes("multiple choice") ||
      qt?.type === "multiple_choice";

    const instruction =
      qt != null
        ? sectionInstruction(qt.type, qt.marksPerQuestion)
        : section.instruction;

    const title =
      qt != null ? sectionTitle(qt.type) : section.title;

    return {
      id: randomUUID(),
      letter: section.letter,
      title,
      instruction,
      questions: section.questions.map((q) => {
        questionNumber += 1;
        const text = sanitizeQuestionText(q.text);
        const options = isMcq
          ? normalizeMcqOptions(q.options)
          : undefined;

        return {
          id: randomUUID(),
          number: questionNumber,
          text,
          options,
          marks: qt?.marksPerQuestion ?? 1,
        };
      }),
    };
  });

  return {
    schoolName: parsed.schoolName ?? env.schoolName,
    subject: fallback.subject || parsed.subject,
    className: fallback.className || parsed.className,
    timeAllowed: parsed.timeAllowed ?? "45 minutes",
    maximumMarks: parsed.maximumMarks ?? fallback.maximumMarks,
    generalInstructions:
      parsed.generalInstructions ??
      "All questions are compulsory unless stated otherwise.",
    sections,
    answerKey: parsed.answerKey,
  };
}
