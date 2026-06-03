export type QuestionTypeOption =
  | "multiple_choice"
  | "short_questions"
  | "diagram_graph"
  | "numerical_problems"
  | "long_answer"
  | "fill_in_blanks";

export type Difficulty = "easy" | "moderate" | "hard";

export type AssignmentStatus = "draft" | "generating" | "ready" | "failed";

export interface QuestionTypeInput {
  type: QuestionTypeOption;
  count: number;
  marksPerQuestion: number;
}

export interface CreateAssignmentBody {
  title?: string;
  dueDate: string;
  questionTypes: QuestionTypeInput[];
  additionalInfo?: string;
  subject?: string;
  className?: string;
}

export interface Question {
  id: string;
  number: number;
  text: string;
  /** MCQ only — four options, each rendered on its own line */
  options?: string[];
  /** Internal scoring weight; not shown on the exam paper */
  marks: number;
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

export type WebSocketEventType =
  | "job:queued"
  | "job:progress"
  | "job:completed"
  | "job:failed";

export interface WebSocketPayload {
  type: WebSocketEventType;
  assignmentId: string;
  progress?: number;
  message?: string;
  paper?: QuestionPaper;
}

export interface GenerationJobData {
  assignmentId: string;
}

export interface JobState {
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  message: string;
  updatedAt: string;
}
