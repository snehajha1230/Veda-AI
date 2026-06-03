"use client";

import { PageHeader } from "@/components/layout/PageHeader";

export default function LibraryPage() {
  return (
    <div className="space-y-6 px-1 sm:px-0">
      <PageHeader
        title="My Library"
        subtitle="Saved question papers, rubrics, and teaching resources."
      />
      <div className="pop-out-panel flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-semibold text-zinc-900">Library coming soon</p>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          Store and reuse your best AI-generated materials across classes.
        </p>
      </div>
    </div>
  );
}
