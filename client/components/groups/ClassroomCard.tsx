import Link from "next/link";
import { Copy, MoreVertical, Users } from "lucide-react";
import type { Classroom } from "@/types/classroom";
import { cn } from "@/lib/utils";

interface ClassroomCardProps {
  classroom: Classroom;
}

export function ClassroomCard({ classroom }: ClassroomCardProps) {
  return (
    <Link
      href={`/groups/${classroom.id}`}
      className="pop-out-panel group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgb(0,0,0,0.1)]"
    >
      <div
        className={cn(
          "h-28 bg-gradient-to-br px-4 py-3 text-white sm:h-32",
          classroom.theme,
        )}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-white/80">
              {classroom.subject}
            </p>
            <h3 className="mt-1 truncate text-lg font-bold leading-tight">
              {classroom.name}
            </h3>
            <p className="text-sm text-white/90">{classroom.section}</p>
          </div>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="rounded-lg p-1 opacity-0 transition group-hover:opacity-100 hover:bg-white/20"
            aria-label="Class options"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4 text-sm text-zinc-600">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {classroom.studentCount} students
          </span>
          <span>{classroom.assignmentCount} assignments</span>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
          <span className="font-mono text-xs text-zinc-600">
            {classroom.roomCode}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              void navigator.clipboard?.writeText(classroom.roomCode);
            }}
            className="flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-zinc-900"
          >
            <Copy className="h-3 w-3" />
            Copy code
          </button>
        </div>
      </div>
    </Link>
  );
}
