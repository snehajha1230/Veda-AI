import type { IAssignment } from "../models/Assignment.js";
import {
  sectionInstruction,
  sectionTitle,
} from "../lib/section-instructions.js";

const QUESTION_STYLE_BY_TYPE: Record<string, string> = {
  multiple_choice:
    "Standalone MCQs testing facts, definitions, formulas, or reasoning. Example: 'Which gas is released during photosynthesis?' — NOT 'Which sentence from the passage is correct?'",
  short_questions:
    "Direct short-answer prompts: Define, State, Name, List, Distinguish, Give reasons. Example: 'Define evaporation.' — NOT 'Explain the following sentence: ...'",
  diagram_graph:
    "Ask students to draw, label, or interpret a diagram/graph from the syllabus. Example: 'Draw and label the structure of a plant cell.'",
  numerical_problems:
    "Real numerical problems with given data and units. Example: 'A car travels 120 km in 2 hours. Find its average speed.'",
  long_answer:
    "Multi-part descriptive questions on syllabus topics. Example: 'Explain the water cycle with a labelled diagram.'",
  fill_in_blanks:
    "Sentences with ONE blank testing a key term from the syllabus. Example: 'The process by which plants make food is called ______.'",
};

export function buildGenerationPrompt(assignment: IAssignment): string {
  const sectionSpecs = assignment.questionTypes.map((qt, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const styleGuide =
      QUESTION_STYLE_BY_TYPE[qt.type] ??
      "Direct exam questions on syllabus topics — no passages or quoted excerpts.";
    return `Section ${letter} — ${sectionTitle(qt.type)}
  - Question type: ${qt.type}
  - Count: ${qt.count} questions
  - Section title (use exactly): "${sectionTitle(qt.type)}"
  - Section instruction (use exactly): "${sectionInstruction(qt.type, qt.marksPerQuestion)}"
  - Style: ${styleGuide}
  - For multiple_choice: each question MUST include "options" array with exactly 4 strings (a), b), c), d) prefixes added by you). Question "text" is ONLY the stem — do NOT put options inside "text".`;
  });

  const totalQuestions = assignment.questionTypes.reduce(
    (s, q) => s + q.count,
    0,
  );
  const totalMarks = assignment.questionTypes.reduce(
    (s, q) => s + q.count * q.marksPerQuestion,
    0,
  );

  const sourceBlock = assignment.fileText
    ? `
=== SYLLABUS / SOURCE CONTENT (you have mastered this as the classroom teacher) ===
${assignment.fileText}
=== END OF SYLLABUS ===
`
    : "";

  return `You are a school teacher. You have thoroughly studied and internalised all knowledge in the syllabus/PDF below. You are now setting a formal exam question paper for your students.

Subject: ${assignment.subject} (use exactly this value in JSON "subject" field)
Class: ${assignment.className} (use exactly this value in JSON "className" field)
Maximum marks: ${totalMarks}
Total questions: ${totalQuestions}

${sourceBlock}

Paper sections to create (in this order):
${sectionSpecs.join("\n\n")}

${assignment.additionalInfo ? `Teacher's notes: ${assignment.additionalInfo}` : ""}

STRICT WRITING RULES:
1. Every question must be a REAL exam question — standalone, direct, and answerable without reading a passage first.
2. FORBIDDEN formats (never use these):
   - Reading comprehension passages followed by questions
   - "Read the following and answer..."
   - Quoting a paragraph/sentence from the source and asking "Explain the above"
   - "Which of the following is correct regarding: [copied text snippet]?"
   - Referencing "the material", "the document", "the PDF", or "the uploaded file"
3. USE syllabus content as background knowledge only — questions should test concepts, not quote the source verbatim.
4. Do NOT include difficulty labels (easy/moderate/hard) anywhere.
5. Do NOT show marks on individual questions — marks appear ONLY in the section instruction line.
6. Multiple choice: "text" = question stem only; "options" = exactly 4 plausible choices (one correct, three reasonable distractors from the same topic).
7. Questions must be exam-ready: clear, unambiguous, age-appropriate for class ${assignment.className}.
8. Use proper terminology from the syllabus (names, formulas, definitions taught in the chapter).
9. Vary question stems (Define, Calculate, Draw, Compare, Why, How, Name, State, etc.) — do not repeat the same pattern.
10. Answer key: one entry per question with the correct answer (for MCQ: "a", "b", "c", or "d" plus brief justification).

Return ONLY valid JSON (no markdown):
{
  "schoolName": "string",
  "subject": "string",
  "className": "string",
  "timeAllowed": "string",
  "maximumMarks": ${totalMarks},
  "generalInstructions": "All questions are compulsory unless stated otherwise.",
  "sections": [
    {
      "letter": "A",
      "title": "exact section title",
      "instruction": "exact instruction with marks per question for the section",
      "questions": [
        {
          "text": "question stem only",
          "options": ["a) ...", "b) ...", "c) ...", "d) ..."]
        }
      ]
    }
  ],
  "answerKey": [{ "questionNumber": 1, "answer": "..." }]
}

Note: "options" field is REQUIRED for multiple_choice sections only; omit "options" for other section types.`;
}
