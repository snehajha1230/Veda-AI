import { randomUUID } from "crypto";
import { env } from "../config/env.js";
import {
  sectionInstruction,
  sectionTitle,
} from "../lib/section-instructions.js";
import { sanitizeQuestionText } from "../lib/sanitize-question.js";
import type { IAssignment } from "../models/Assignment.js";
import type { QuestionPaper, QuestionTypeInput } from "../types/index.js";

function sourceSnippets(text: string, count: number): string[] {
  const sentences = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 200);

  if (sentences.length === 0) {
    const words = text.split(/\s+/).filter(Boolean);
    const chunkSize = Math.max(10, Math.floor(words.length / Math.max(count, 1)));
    return Array.from({ length: count }, (_, i) => {
      const start = i * chunkSize;
      return words.slice(start, start + chunkSize).join(" ") || text.slice(0, 150);
    });
  }

  return Array.from(
    { length: count },
    (_, i) => sentences[i % sentences.length],
  );
}

function buildMcqFromSnippet(snippet: string, index: number) {
  const topic = snippet.slice(0, 80).replace(/\s+/g, " ").trim();
  const text = sanitizeQuestionText(
    `Which of the following is correct regarding: ${topic}?`,
  );
  const correct = `a) ${snippet.slice(0, 60)}…`;
  const distractors = [
    `b) An unrelated process not covered in this unit`,
    `c) The opposite effect to what the chapter describes`,
    `d) A definition from a different topic in ${index % 2 === 0 ? "another" : "a previous"} chapter`,
  ];
  return {
    text,
    options: [correct, ...distractors],
    answer: "a) — see chapter content",
  };
}

function buildShortFromSnippet(snippet: string) {
  const core = snippet.split(/[,;:]/)[0]?.trim() || snippet.slice(0, 60);
  return {
    text: sanitizeQuestionText(`Explain: ${core}.`),
    answer: snippet.slice(0, 120),
  };
}

export function generateMockPaper(assignment: IAssignment): QuestionPaper {
  const sections: QuestionPaper["sections"] = [];
  const answerKey: QuestionPaper["answerKey"] = [];
  let globalNumber = 0;
  const sectionLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const source = assignment.fileText?.trim() ?? "";
  const snippets = sourceSnippets(source, 40);

  assignment.questionTypes.forEach((qt: QuestionTypeInput, sIdx) => {
    const questions = Array.from({ length: qt.count }, (_, i) => {
      globalNumber += 1;
      const snippet = snippets[(globalNumber - 1) % snippets.length] || assignment.subject;

      let text: string;
      let options: string[] | undefined;

      if (qt.type === "multiple_choice") {
        const mcq = buildMcqFromSnippet(snippet, i);
        text = mcq.text;
        options = mcq.options;
        answerKey.push({ questionNumber: globalNumber, answer: mcq.answer });
      } else {
        const short = buildShortFromSnippet(snippet);
        text = short.text;
        answerKey.push({
          questionNumber: globalNumber,
          answer: short.answer,
        });
      }

      return {
        id: randomUUID(),
        number: globalNumber,
        text,
        options,
        marks: qt.marksPerQuestion,
      };
    });

    sections.push({
      id: randomUUID(),
      letter: sectionLetters[sIdx] ?? String(sIdx + 1),
      title: sectionTitle(qt.type),
      instruction: sectionInstruction(qt.type, qt.marksPerQuestion),
      questions,
    });
  });

  const maximumMarks = assignment.questionTypes.reduce(
    (s, q) => s + q.count * q.marksPerQuestion,
    0,
  );

  return {
    schoolName: env.schoolName,
    subject: assignment.subject,
    className: assignment.className,
    timeAllowed: `${Math.max(1, Math.ceil(maximumMarks / 20)) * 45} minutes`,
    maximumMarks,
    generalInstructions:
      "All questions are compulsory unless stated otherwise.",
    sections,
    answerKey,
  };
}
