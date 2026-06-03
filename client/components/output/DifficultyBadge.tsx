import type { Difficulty } from "@/types/assignment";
import { cn } from "@/lib/utils";

const styles: Record<Difficulty, string> = {
  easy: "text-emerald-700",
  moderate: "text-amber-700",
  hard: "text-red-700",
};

const labels: Record<Difficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Challenging",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={cn("font-semibold", styles[difficulty])}>
      [{labels[difficulty]}]
    </span>
  );
}
