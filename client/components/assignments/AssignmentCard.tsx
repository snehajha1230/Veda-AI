"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MoreVertical, Trash2 } from "lucide-react";
import type { Assignment } from "@/types/assignment";
interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (id: string) => void;
}

export function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <article className="pop-out-panel relative p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgb(0,0,0,0.1)]">
      <div className="absolute right-4 top-4" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          aria-label="Assignment actions"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 z-10 min-w-[160px] overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
            <Link
              href={`/assignments/${assignment.id}/output`}
              className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              onClick={() => setMenuOpen(false)}
            >
              View Assignment
            </Link>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                onDelete(assignment.id);
                setMenuOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      <h3 className="pr-8 text-base font-semibold text-zinc-900">
        {assignment.title}
      </h3>
      <p className="mt-3 text-sm text-zinc-500">
        Assigned on: {assignment.assignedOn}
      </p>
      <p className="mt-1 text-sm">
        <span className="text-zinc-500">Due: </span>
        <span className="font-semibold text-zinc-900">{assignment.dueDate}</span>
      </p>
    </article>
  );
}
