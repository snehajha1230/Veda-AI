import Link from "next/link";
import { AlertCircle, Calendar, FileText, GraduationCap } from "lucide-react";
import type { UpcomingItem } from "@/types/classroom";
import { cn } from "@/lib/utils";

const icons = {
  assignment: FileText,
  exam: GraduationCap,
  event: Calendar,
};

export function UpcomingList({ items }: { items: UpcomingItem[] }) {
  return (
    <div className="pop-out-panel p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Upcoming</h2>
        <Link
          href="/assignments"
          className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
        >
          View all
        </Link>
      </div>

      <ul className="mt-4 divide-y divide-zinc-100">
        {items.map((item) => {
          const Icon = icons[item.type];
          return (
            <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  item.urgent
                    ? "bg-red-50 text-red-600"
                    : "bg-zinc-100 text-zinc-600",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {item.title}
                </p>
                <p className="text-xs text-zinc-500">{item.classroomName}</p>
                <p
                  className={cn(
                    "mt-0.5 flex items-center gap-1 text-xs font-medium",
                    item.urgent ? "text-red-600" : "text-zinc-500",
                  )}
                >
                  {item.urgent && <AlertCircle className="h-3 w-3" />}
                  {item.dueLabel}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
