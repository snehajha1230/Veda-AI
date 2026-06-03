import type { QuestionTypeOption } from "../types/index.js";

const TITLES: Record<QuestionTypeOption, string> = {
  multiple_choice: "Multiple Choice Questions",
  short_questions: "Short Answer Questions",
  diagram_graph: "Diagram/Graph-Based Questions",
  numerical_problems: "Numerical Problems",
  long_answer: "Long Answer Questions",
  fill_in_blanks: "Fill in the Blanks",
};

export function sectionTitle(type: QuestionTypeOption): string {
  return TITLES[type] ?? "Questions";
}

export function sectionInstruction(
  type: QuestionTypeOption,
  marksPerQuestion: number,
): string {
  const m = marksPerQuestion;
  const markLabel = m === 1 ? "1 mark" : `${m} marks`;

  switch (type) {
    case "multiple_choice":
      return `Choose the correct option. Each question carries ${markLabel}.`;
    case "short_questions":
      return `Attempt all questions. Each question carries ${markLabel}.`;
    case "diagram_graph":
      return `Answer the following. Each question carries ${markLabel}.`;
    case "numerical_problems":
      return `Solve the following. Show all working. Each question carries ${markLabel}.`;
    case "long_answer":
      return `Answer in brief. Each question carries ${markLabel}.`;
    case "fill_in_blanks":
      return `Fill in the blanks. Each question carries ${markLabel}.`;
    default:
      return `Attempt all questions. Each question carries ${markLabel}.`;
  }
}
