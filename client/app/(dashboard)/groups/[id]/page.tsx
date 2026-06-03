"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Copy,
  FileText,
  Megaphone,
  Paperclip,
  Users,
} from "lucide-react";
import { getClassroomById } from "@/lib/mock-dashboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const tabs = ["Stream", "Classwork", "People"] as const;

export default function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const classroom = getClassroomById(id);

  if (!classroom) notFound();

  return (
    <div className="space-y-4 px-1 sm:px-0">
      <div className="pop-out-panel overflow-hidden">
        <div
          className={cn(
            "bg-gradient-to-br px-6 py-8 text-white sm:px-8 sm:py-10",
            classroom.theme,
          )}
        >
          <p className="text-sm font-medium text-white/80">{classroom.subject}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{classroom.name}</h1>
          <p className="mt-1 text-white/90">{classroom.section}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {classroom.studentCount} students
            </span>
            <span className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1 font-mono text-xs backdrop-blur-sm">
              {classroom.roomCode}
              <button
                type="button"
                onClick={() => void navigator.clipboard?.writeText(classroom.roomCode)}
                className="rounded p-0.5 hover:bg-white/20"
                aria-label="Copy class code"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </span>
          </div>
        </div>

        <nav className="flex gap-1 border-t border-zinc-100 px-4">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={cn(
                "border-b-2 px-4 py-3 text-sm font-medium transition",
                i === 0
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-700",
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="pop-out-panel p-4 sm:p-5">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-200 text-sm font-bold text-amber-900">
            JD
          </span>
          <div className="flex-1 rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3">
            <p className="text-sm text-zinc-400">
              Share something with your class…
            </p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className="text-xs py-1.5 px-3">
                Announcement
              </Button>
              <Button variant="ghost" className="text-xs py-1.5 px-3">
                <Paperclip className="h-3 w-3" />
                Attachment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ul className="space-y-4">
        <li className="pop-out-panel p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white">
              <Megaphone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-900">John Doe</p>
              <p className="text-xs text-zinc-500">Posted yesterday</p>
              <p className="mt-2 text-sm text-zinc-700">
                Reminder: Unit test on {classroom.subject} is scheduled for next
                Friday. Please review chapters 4–6.
              </p>
            </div>
          </div>
        </li>

        <li className="pop-out-panel p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <FileText className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-900">
                Quiz on Electricity
              </p>
              <p className="text-xs text-zinc-500">Due 21 Jun · Assignment</p>
              <p className="mt-2 text-sm text-zinc-600">
                Complete the short-answer section. AI-generated rubric attached.
              </p>
              <Link
                href="/assignments"
                className="mt-3 inline-block text-sm font-medium text-zinc-900 underline"
              >
                View assignment
              </Link>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
