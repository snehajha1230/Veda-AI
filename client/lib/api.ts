import type { Assignment, QuestionPaper } from "@/types/assignment";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export interface ApiAssignment extends Assignment {
  subject?: string;
  className?: string;
  questionPaper?: QuestionPaper;
  errorMessage?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string; details?: string[] };
  if (!res.ok) {
    const msg =
      data.error ??
      (Array.isArray(data.details) ? data.details.join(", ") : res.statusText);
    throw new Error(msg);
  }
  return data;
}

export async function fetchAssignments(): Promise<ApiAssignment[]> {
  const data = await handleResponse<{ assignments: ApiAssignment[] }>(
    await fetch(`${API_BASE}/assignments`, { cache: "no-store" }),
  );
  return data.assignments;
}

export async function fetchAssignment(id: string) {
  return handleResponse<{
    assignment: ApiAssignment;
    jobState?: { status: string; progress: number; message: string };
  }>(await fetch(`${API_BASE}/assignments/${id}`, { cache: "no-store" }));
}

export async function fetchPaper(id: string): Promise<QuestionPaper> {
  const data = await handleResponse<{ paper: QuestionPaper }>(
    await fetch(`${API_BASE}/assignments/${id}/paper`, { cache: "no-store" }),
  );
  return data.paper;
}

export async function createAssignment(formData: FormData): Promise<{
  assignment: ApiAssignment;
  assignmentId: string;
}> {
  return handleResponse(
    await fetch(`${API_BASE}/assignments`, {
      method: "POST",
      body: formData,
    }),
  );
}

export async function regenerateAssignment(id: string) {
  return handleResponse<{ assignment: ApiAssignment; assignmentId: string }>(
    await fetch(`${API_BASE}/assignments/${id}/regenerate`, {
      method: "POST",
    }),
  );
}

export async function deleteAssignment(id: string): Promise<void> {
  await handleResponse(
    await fetch(`${API_BASE}/assignments/${id}`, { method: "DELETE" }),
  );
}

export function mapApiToAssignment(a: ApiAssignment): Assignment {
  return {
    id: a.id,
    title: a.title,
    assignedOn: a.assignedOn,
    dueDate: a.dueDate,
    status: a.status,
  };
}
