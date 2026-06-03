"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Assignment,
  AssignmentFormData,
  QuestionPaper,
  QuestionTypeRow,
} from "@/types/assignment";
import { SAMPLE_ASSIGNMENTS } from "@/lib/mock-data";
import { QUESTION_TYPE_OPTIONS } from "@/lib/constants";

function createRow(type = QUESTION_TYPE_OPTIONS[0]): QuestionTypeRow {
  return {
    id: crypto.randomUUID(),
    type,
    count: 1,
    marksPerQuestion: 1,
  };
}

const defaultForm: AssignmentFormData = {
  file: null,
  subject: "",
  className: "",
  dueDate: "",
  questionTypes: [
    createRow("multiple_choice"),
    createRow("short_questions"),
    createRow("diagram_graph"),
    createRow("numerical_problems"),
  ],
  additionalInfo: "",
  title: "New Assignment",
};

interface AssignmentState {
  assignments: Assignment[];
  useEmptyState: boolean;
  form: AssignmentFormData;
  currentAssignmentId: string | null;
  papers: Record<string, QuestionPaper>;
  searchQuery: string;
  filterBy: string;

  setUseEmptyState: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilterBy: (filter: string) => void;
  setFormField: <K extends keyof AssignmentFormData>(
    key: K,
    value: AssignmentFormData[K],
  ) => void;
  addQuestionRow: () => void;
  removeQuestionRow: (id: string) => void;
  updateQuestionRow: (id: string, patch: Partial<QuestionTypeRow>) => void;
  resetForm: () => void;
  setAssignments: (assignments: Assignment[]) => void;
  addAssignment: (assignment: Assignment) => void;
  removeAssignment: (id: string) => void;
  setPaper: (assignmentId: string, paper: QuestionPaper) => void;
  getPaper: (assignmentId: string) => QuestionPaper | undefined;
  loadSampleAssignments: () => void;
}

export const useAssignmentStore = create<AssignmentState>()(
  persist(
    (set, get) => ({
      assignments: [],
      useEmptyState: false,
      form: { ...defaultForm, questionTypes: defaultForm.questionTypes.map((r) => ({ ...r, id: crypto.randomUUID() })) },
      currentAssignmentId: null,
      papers: {},
      searchQuery: "",
      filterBy: "all",

      setUseEmptyState: (value) => set({ useEmptyState: value }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterBy: (filter) => set({ filterBy: filter }),

      setFormField: (key, value) =>
        set((state) => ({ form: { ...state.form, [key]: value } })),

      addQuestionRow: () =>
        set((state) => ({
          form: {
            ...state.form,
            questionTypes: [...state.form.questionTypes, createRow()],
          },
        })),

      removeQuestionRow: (id) =>
        set((state) => ({
          form: {
            ...state.form,
            questionTypes: state.form.questionTypes.filter((r) => r.id !== id),
          },
        })),

      updateQuestionRow: (id, patch) =>
        set((state) => ({
          form: {
            ...state.form,
            questionTypes: state.form.questionTypes.map((r) =>
              r.id === id ? { ...r, ...patch } : r,
            ),
          },
        })),

      resetForm: () =>
        set({
          form: {
            ...defaultForm,
            questionTypes: defaultForm.questionTypes.map((r) => ({
              ...r,
              id: crypto.randomUUID(),
            })),
          },
        }),

      setAssignments: (assignments) => set({ assignments, useEmptyState: false }),

      addAssignment: (assignment) =>
        set((state) => ({
          assignments: [
            assignment,
            ...state.assignments.filter((a) => a.id !== assignment.id),
          ],
          currentAssignmentId: assignment.id,
          useEmptyState: false,
        })),

      removeAssignment: (id) =>
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== id),
        })),

      setPaper: (assignmentId, paper) =>
        set((state) => ({
          papers: { ...state.papers, [assignmentId]: paper },
        })),

      getPaper: (assignmentId) => get().papers[assignmentId],

      loadSampleAssignments: () =>
        set({ assignments: SAMPLE_ASSIGNMENTS, useEmptyState: false }),
    }),
    {
      name: "vedaai-assignments",
      partialize: (state) => ({
        assignments: state.assignments,
        papers: state.papers,
        useEmptyState: state.useEmptyState,
      }),
    },
  ),
);

export function computeTotals(rows: QuestionTypeRow[]) {
  return rows.reduce(
    (acc, row) => ({
      questions: acc.questions + row.count,
      marks: acc.marks + row.count * row.marksPerQuestion,
    }),
    { questions: 0, marks: 0 },
  );
}
