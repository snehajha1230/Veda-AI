export type LibraryResourceType =
  | "question_paper"
  | "rubric"
  | "lesson_plan"
  | "worksheet";

export interface LibraryItem {
  id: string;
  title: string;
  type: LibraryResourceType;
  subject: string;
  className: string;
  savedOn: string;
}
