"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClassroomCard } from "@/components/groups/ClassroomCard";
import { CreateClassCard } from "@/components/groups/CreateClassCard";
import { CLASSROOMS } from "@/lib/mock-dashboard";
import { cn } from "@/lib/utils";

export default function GroupsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6 px-1 sm:px-0">
      <PageHeader
        title="My Groups"
        subtitle="Manage your classrooms — like Google Classroom, organized by subject and section."
        action={
          <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "rounded-lg p-2 transition",
                view === "grid"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-50",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "rounded-lg p-2 transition",
                view === "list"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-50",
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        }
      />

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CLASSROOMS.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} />
          ))}
          <CreateClassCard />
        </div>
      ) : (
        <div className="space-y-3">
          {CLASSROOMS.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} />
          ))}
          <CreateClassCard />
        </div>
      )}
    </div>
  );
}
