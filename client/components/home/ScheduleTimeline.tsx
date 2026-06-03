import Link from "next/link";
import { Coffee, MapPin, Users, Video } from "lucide-react";
import type { ScheduleItem } from "@/types/classroom";
import { cn } from "@/lib/utils";

const typeStyles: Record<
  ScheduleItem["type"],
  { dot: string; icon?: React.ReactNode }
> = {
  class: { dot: "bg-emerald-500" },
  meeting: { dot: "bg-violet-500" },
  break: { dot: "bg-zinc-300" },
};

export function ScheduleTimeline({ items }: { items: ScheduleItem[] }) {
  return (
    <div className="pop-out-panel p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-zinc-900">Today&apos;s Schedule</h2>
      <p className="mt-0.5 text-sm text-zinc-500">Wednesday, 3 June 2026</p>

      <ul className="mt-6 space-y-0">
        {items.map((item, i) => (
          <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {i < items.length - 1 && (
              <span
                className="absolute left-[7px] top-4 h-full w-px bg-zinc-200"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white",
                typeStyles[item.type].dot,
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p
                  className={cn(
                    "font-medium text-zinc-900",
                    item.type === "break" && "text-zinc-500",
                  )}
                >
                  {item.title}
                </p>
                <span className="shrink-0 text-xs font-medium text-zinc-500">
                  {item.time}
                  {item.endTime && ` – ${item.endTime}`}
                </span>
              </div>
              {item.location && (
                <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                  {item.type === "meeting" && item.location.includes("Meet") ? (
                    <Video className="h-3 w-3" />
                  ) : item.type === "break" ? (
                    <Coffee className="h-3 w-3" />
                  ) : (
                    <MapPin className="h-3 w-3" />
                  )}
                  {item.location}
                </p>
              )}
              {item.classroomId && (
                <Link
                  href={`/groups/${item.classroomId}`}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-zinc-700 hover:underline"
                >
                  <Users className="h-3 w-3" />
                  Open class
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
