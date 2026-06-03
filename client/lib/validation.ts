import type { AssignmentFormData, QuestionTypeRow } from "@/types/assignment";

export interface FormErrors {
  subject?: string;
  className?: string;
  dueDate?: string;
  questionTypes?: string;
  rows?: Record<string, { count?: string; marksPerQuestion?: string }>;
  additionalInfo?: string;
  file?: string;
}

const DATE_PATTERN = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

export function validateDueDate(value: string): string | undefined {
  if (!value.trim()) return "Due date is required";
  if (!DATE_PATTERN.test(value.trim())) {
    return "Use DD-MM-YYYY format";
  }
  const [day, month, year] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "Enter a valid date";
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return "Due date cannot be in the past";
  return undefined;
}

export function validateQuestionRow(row: QuestionTypeRow): {
  count?: string;
  marksPerQuestion?: string;
} {
  const errors: { count?: string; marksPerQuestion?: string } = {};
  if (!Number.isFinite(row.count) || row.count <= 0) {
    errors.count = "Must be at least 1";
  }
  if (!Number.isFinite(row.marksPerQuestion) || row.marksPerQuestion <= 0) {
    errors.marksPerQuestion = "Must be at least 1";
  }
  return errors;
}

export function validateAssignmentForm(data: AssignmentFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.subject.trim()) {
    errors.subject = "Subject is required";
  } else if (data.subject.trim().length > 100) {
    errors.subject = "Subject must be 100 characters or fewer";
  }

  if (!data.className.trim()) {
    errors.className = "Class is required";
  } else if (data.className.trim().length > 50) {
    errors.className = "Class must be 50 characters or fewer";
  }

  const dueDateError = validateDueDate(data.dueDate);
  if (dueDateError) errors.dueDate = dueDateError;

  if (data.questionTypes.length === 0) {
    errors.questionTypes = "Add at least one question type";
  } else {
    const rowErrors: FormErrors["rows"] = {};
    let hasRowError = false;
    for (const row of data.questionTypes) {
      const rowErr = validateQuestionRow(row);
      if (Object.keys(rowErr).length > 0) {
        rowErrors[row.id] = rowErr;
        hasRowError = true;
      }
    }
    if (hasRowError) errors.rows = rowErrors;
  }

  if (!data.file) {
    errors.file =
      "Upload study material (PDF, TXT, or photo) — questions are generated from your file";
  } else {
    const allowed = [
      "application/pdf",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];
    const maxSize = 10 * 1024 * 1024;
    if (!allowed.includes(data.file.type)) {
      errors.file = "Upload PDF, text, JPEG, or PNG (max 10MB)";
    } else if (data.file.size > maxSize) {
      errors.file = "File must be 10MB or smaller";
    }
  }

  return errors;
}

export function hasFormErrors(errors: FormErrors): boolean {
  return (
    Boolean(errors.subject) ||
    Boolean(errors.className) ||
    Boolean(errors.dueDate) ||
    Boolean(errors.questionTypes) ||
    Boolean(errors.file) ||
    Boolean(errors.rows && Object.keys(errors.rows).length > 0)
  );
}
