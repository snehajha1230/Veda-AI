"use client";

import { Plus, X } from "lucide-react";
import { QUESTION_TYPE_LABELS, QUESTION_TYPE_OPTIONS } from "@/lib/constants";
import type { FormErrors } from "@/lib/validation";
import type { QuestionTypeRow } from "@/types/assignment";
import { StepperInput } from "./StepperInput";
import { cn } from "@/lib/utils";

interface QuestionTypeRowsProps {
  rows: QuestionTypeRow[];
  errors?: FormErrors;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<QuestionTypeRow>) => void;
}

export function QuestionTypeRows({
  rows,
  errors,
  onAdd,
  onRemove,
  onUpdate,
}: QuestionTypeRowsProps) {
  return (
    <div>
      <div className="hidden overflow-hidden rounded-xl border border-zinc-200 lg:block">
        <div className="grid grid-cols-[1fr_140px_140px_40px] gap-4 border-b border-zinc-100 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <span>Question Type</span>
          <span>No. of Questions</span>
          <span>Marks</span>
          <span />
        </div>
        {rows.map((row) => {
          const rowErr = errors?.rows?.[row.id];
          return (
            <div
              key={row.id}
              className="grid grid-cols-[1fr_140px_140px_40px] items-center gap-4 border-b border-zinc-100 px-4 py-3 last:border-0"
            >
              <select
                value={row.type}
                onChange={(e) =>
                  onUpdate(row.id, {
                    type: e.target.value as QuestionTypeRow["type"],
                  })
                }
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 focus:border-zinc-400 focus:outline-none"
              >
                {QUESTION_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {QUESTION_TYPE_LABELS[opt]}
                  </option>
                ))}
              </select>
              <StepperInput
                value={row.count}
                onChange={(count) => onUpdate(row.id, { count })}
                error={rowErr?.count}
              />
              <StepperInput
                value={row.marksPerQuestion}
                onChange={(marksPerQuestion) =>
                  onUpdate(row.id, { marksPerQuestion })
                }
                error={rowErr?.marksPerQuestion}
              />
              <button
                type="button"
                onClick={() => onRemove(row.id)}
                disabled={rows.length <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30"
                aria-label="Remove row"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 lg:hidden">
        {rows.map((row) => {
          const rowErr = errors?.rows?.[row.id];
          return (
            <div
              key={row.id}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4"
            >
              <div className="flex items-start gap-2">
                <select
                  value={row.type}
                  onChange={(e) =>
                    onUpdate(row.id, {
                      type: e.target.value as QuestionTypeRow["type"],
                    })
                  }
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm"
                >
                  {QUESTION_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {QUESTION_TYPE_LABELS[opt]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onRemove(row.id)}
                  disabled={rows.length <= 1}
                  className="rounded-lg p-2 text-zinc-400 disabled:opacity-30"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <StepperInput
                  label="No. of Questions"
                  value={row.count}
                  onChange={(count) => onUpdate(row.id, { count })}
                  error={rowErr?.count}
                />
                <StepperInput
                  label="Marks"
                  value={row.marksPerQuestion}
                  onChange={(marksPerQuestion) =>
                    onUpdate(row.id, { marksPerQuestion })
                  }
                  error={rowErr?.marksPerQuestion}
                />
              </div>
            </div>
          );
        })}
      </div>

      {errors?.questionTypes && (
        <p className="mt-2 text-sm text-red-600">{errors.questionTypes}</p>
      )}

      <button
        type="button"
        onClick={onAdd}
        className={cn(
          "mt-4 flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-white",
        )}
      >
        <Plus className="h-4 w-4" />
        Add Question Type
      </button>
    </div>
  );
}
