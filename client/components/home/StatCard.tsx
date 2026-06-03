import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "bg-zinc-900",
}: StatCardProps) {
  return (
    <div className="pop-out-panel flex items-start gap-4 p-5">
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md",
          accent,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-900">{value}</p>
        <p className="text-sm text-zinc-500">{label}</p>
        {trend && (
          <p className="mt-1 text-xs font-medium text-emerald-600">{trend}</p>
        )}
      </div>
    </div>
  );
}
