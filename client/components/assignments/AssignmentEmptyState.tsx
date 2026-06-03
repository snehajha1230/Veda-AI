"use client";

import Link from "next/link";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AssignmentEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-zinc-100" />
        <FileSearch className="relative h-16 w-16 text-zinc-400" strokeWidth={1.25} />
      </div>
      <h2 className="text-xl font-semibold text-zinc-900">No assignments yet</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let
        AI assist with grading.
      </p>
      <Link href="/assignments/create" className="mt-8">
        <Button className="px-8 py-3 text-base">
          + Create Your First Assignment
        </Button>
      </Link>
    </div>
  );
}
