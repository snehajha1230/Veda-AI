import type { QuestionTypeOption } from "@/types/assignment";

export const QUESTION_TYPE_LABELS: Record<QuestionTypeOption, string> = {
  multiple_choice: "Multiple Choice Questions",
  short_questions: "Short Questions",
  diagram_graph: "Diagram/Graph-Based Questions",
  numerical_problems: "Numerical Problems",
  long_answer: "Long Answer Questions",
  fill_in_blanks: "Fill in the Blanks",
};

export const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  "multiple_choice",
  "short_questions",
  "diagram_graph",
  "numerical_problems",
  "long_answer",
  "fill_in_blanks",
];

export const SCHOOL_NAME = "Delhi Public School, Sector-4, Bokaro";
export const SCHOOL_SHORT = "Delhi Public School, Bokaro Steel City";

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/assignments", label: "Assignments", icon: "assignments" as const },
  { href: "/groups", label: "My Groups", icon: "groups" as const },
  { href: "/toolkit", label: "AI Teacher's Toolkit", icon: "toolkit" as const },
  { href: "/library", label: "My Library", icon: "library" as const },
];

export const MOBILE_NAV_ITEMS = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/assignments", label: "Assignments", icon: "assignments" as const },
  { href: "/library", label: "Library", icon: "library" as const },
  { href: "/toolkit", label: "AI Toolkit", icon: "toolkit" as const },
];
