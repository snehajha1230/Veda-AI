"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Mic } from "lucide-react";
import {
  computeTotals,
  useAssignmentStore,
} from "@/store/assignmentStore";
import { useGenerationStore } from "@/store/generationStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import {
  hasFormErrors,
  validateAssignmentForm,
  type FormErrors,
} from "@/lib/validation";
import { createAssignment, mapApiToAssignment } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { FileUploadZone } from "./FileUploadZone";
import { QuestionTypeRows } from "./QuestionTypeRows";

export function CreateAssignmentForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    form,
    setFormField,
    addQuestionRow,
    removeQuestionRow,
    updateQuestionRow,
    addAssignment,
  } = useAssignmentStore();

  const { setAssignmentId, setStatus, reset: resetGeneration } =
    useGenerationStore();
  const { subscribeToJob } = useWebSocket();

  const totals = computeTotals(form.questionTypes);

  const handleSubmit = async () => {
    setTouched(true);
    setSubmitError(null);
    const validationErrors = validateAssignmentForm(form);
    setErrors(validationErrors);
    if (hasFormErrors(validationErrors)) return;

    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("title", form.title || "New Assignment");
      body.append("subject", form.subject.trim());
      body.append("className", form.className.trim());
      body.append("dueDate", form.dueDate);
      body.append(
        "questionTypes",
        JSON.stringify(
          form.questionTypes.map(({ type, count, marksPerQuestion }) => ({
            type,
            count,
            marksPerQuestion,
          })),
        ),
      );
      if (form.additionalInfo) {
        body.append("additionalInfo", form.additionalInfo);
      }
      if (!form.file) {
        setSubmitError("Please upload study material first.");
        setSubmitting(false);
        return;
      }
      body.append("file", form.file);

      const { assignment, assignmentId } = await createAssignment(body);

      addAssignment(mapApiToAssignment(assignment));
      resetGeneration();
      setAssignmentId(assignmentId);
      setStatus("queued");
      subscribeToJob(assignmentId);
      router.push(`/assignments/${assignmentId}/output`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create assignment",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pop-out-panel p-5 sm:p-8">
      <div className="mb-8 flex items-center gap-2">
        <div className="h-0.5 flex-1 bg-zinc-200">
          <div className="h-full w-1/4 rounded-full bg-emerald-500" />
        </div>
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        <div className="h-0.5 flex-[3] bg-zinc-200" />
      </div>

      <section>
        <h2 className="text-sm font-semibold text-zinc-900">
          Step 1 — Source material
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Upload the content you want questions from (notes, PDF chapter, or
          photos of pages).
        </p>

        <div className="mt-4">
          <FileUploadZone
            file={form.file}
            onFileChange={(file) => setFormField("file", file)}
            error={touched ? errors.file : undefined}
          />
        </div>

        <h2 className="mt-8 text-sm font-semibold text-zinc-900">
          Step 2 — Paper format &amp; schedule
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-zinc-700">Subject</label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={form.subject}
              onChange={(e) => setFormField("subject", e.target.value)}
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm shadow-sm focus:outline-none ${
                touched && errors.subject
                  ? "border-red-400"
                  : "border-zinc-200 focus:border-zinc-400"
              }`}
            />
            {touched && errors.subject && (
              <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Class</label>
            <input
              type="text"
              placeholder="e.g. 10th"
              value={form.className}
              onChange={(e) => setFormField("className", e.target.value)}
              className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm shadow-sm focus:outline-none ${
                touched && errors.className
                  ? "border-red-400"
                  : "border-zinc-200 focus:border-zinc-400"
              }`}
            />
            {touched && errors.className && (
              <p className="mt-1 text-xs text-red-600">{errors.className}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-zinc-700">Due Date</label>
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="DD-MM-YYYY"
              value={form.dueDate}
              onChange={(e) => setFormField("dueDate", e.target.value)}
              className={`w-full rounded-xl border bg-white py-3 pl-4 pr-12 text-sm shadow-sm focus:outline-none ${
                touched && errors.dueDate
                  ? "border-red-400"
                  : "border-zinc-200 focus:border-zinc-400"
              }`}
            />
            <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </div>
          {touched && errors.dueDate && (
            <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>
          )}
        </div>

        <div className="mt-8">
          <QuestionTypeRows
            rows={form.questionTypes}
            errors={touched ? errors : undefined}
            onAdd={addQuestionRow}
            onRemove={removeQuestionRow}
            onUpdate={updateQuestionRow}
          />
          <div className="mt-4 flex flex-col items-end gap-1 text-sm text-zinc-600 sm:flex-row sm:justify-end sm:gap-6">
            <span>
              Total Questions:{" "}
              <strong className="text-zinc-900">{totals.questions}</strong>
            </span>
            <span>
              Total Marks:{" "}
              <strong className="text-zinc-900">{totals.marks}</strong>
            </span>
          </div>
        </div>

        <div className="mt-8">
          <label className="text-sm font-medium text-zinc-700">
            Additional Information{" "}
            <span className="font-normal text-zinc-500">
              (For better output)
            </span>
          </label>
          <div className="relative mt-2">
            <textarea
              rows={4}
              placeholder="e.g. Generate a question paper for 3 hour exam duration..."
              value={form.additionalInfo}
              onChange={(e) => setFormField("additionalInfo", e.target.value)}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-sm shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none"
            />
            <button
              type="button"
              className="absolute bottom-3 right-3 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {submitError && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <Link href="/assignments" className="flex justify-center">
          <Button variant="outline" className="min-w-[140px]">
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
        </Link>
        <Button
          className="min-w-[140px]"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
