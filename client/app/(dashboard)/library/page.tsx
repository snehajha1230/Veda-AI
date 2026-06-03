"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LibraryItemCard } from "@/components/library/LibraryItemCard";
import { LIBRARY_ITEMS } from "@/lib/mock-library";
import type { LibraryResourceType } from "@/types/library";
import { cn } from "@/lib/utils";

const filters: { value: "all" | LibraryResourceType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "question_paper", label: "Question papers" },
  { value: "rubric", label: "Rubrics" },
  { value: "worksheet", label: "Worksheets" },
  { value: "lesson_plan", label: "Lesson plans" },
];

export default function LibraryPage() {
  const [filter, setFilter] = useState<"all" | LibraryResourceType>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? LIBRARY_ITEMS
        : LIBRARY_ITEMS.filter((item) => item.type === filter),
    [filter],
  );

  return (
    <div className="space-y-6 px-1 sm:px-0">
      <PageHeader
        title="My Library"
        subtitle="Saved question papers, rubrics, and teaching resources."
      />

      <div className="flex flex-wrap gap-2">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition",
              filter === value
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((item) => (
          <LibraryItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
