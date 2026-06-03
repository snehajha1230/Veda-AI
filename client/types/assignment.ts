export type QuestionTypeOption =
  | "multiple_choice"
  | "short_questions"
  | "diagram_graph"
  | "numerical_problems"
  | "long_answer"
  | "fill_in_blanks";

export type Difficulty = "easy" | "moderate" | "hard";

export type GenerationStatus =
  | "idle"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export interface QuestionTypeRow {
  id: string;
  type: QuestionTypeOption;
  count: number;
  marksPerQuestion: number;
}

export interface AssignmentFormData {
  file: File | null;
  subject: string;
  className: string;
  dueDate: string;
  questionTypes: QuestionTypeRow[];
  additionalInfo: string;
  title: string;
}

export interface Assignment {
  id: string;
  title: string;
  assignedOn: string;
  dueDate: string;
  status: "draft" | "generating" | "ready" | "failed";
  formData?: AssignmentFormData;
}

export interface Question {
  id: string;
  number: number;
  text: string;
  /** MCQ: four options, each shown on its own line */
  options?: string[];
  marks?: number;
  difficulty?: Difficulty;
}

export interface PaperSection {
  id: string;
  letter: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export interface QuestionPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  generalInstructions: string;
  sections: PaperSection[];
  answerKey: { questionNumber: number; answer: string }[];
}

export interface WebSocketMessage {
  type: "job:queued" | "job:progress" | "job:completed" | "job:failed";
  assignmentId?: string;
  progress?: number;
  message?: string;
  paper?: QuestionPaper;
}
