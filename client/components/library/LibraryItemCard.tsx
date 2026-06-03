import {
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
} from "lucide-react";
import type { LibraryItem, LibraryResourceType } from "@/types/library";
import { cn } from "@/lib/utils";

const typeLabels: Record<LibraryResourceType, string> = {
  question_paper: "Question paper",
  rubric: "Rubric",
  lesson_plan: "Lesson plan",
  worksheet: "Worksheet",
};

const typeIcons: Record<
  LibraryResourceType,
  typeof FileText
> = {
  question_paper: FileText,
  rubric: ClipboardList,
  lesson_plan: GraduationCap,
  worksheet: BookOpen,
};

export function LibraryItemCard({ item }: { item: LibraryItem }) {
  const Icon = typeIcons[item.type];

  return (
    <article className="pop-out-panel p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgb(0,0,0,0.1)]">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {typeLabels[item.type]}
          </p>
          <h3 className="mt-1 text-base font-semibold text-zinc-900">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            {item.subject} · {item.className}
          </p>
          <p className="mt-1 text-sm text-zinc-500">Saved on {item.savedOn}</p>
        </div>
      </div>
    </article>
  );
}
