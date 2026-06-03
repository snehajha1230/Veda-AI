import Link from "next/link";
import { cn } from "@/lib/utils";

export function VedaLogo({ className }: { className?: string }) {
  return (
    <Link href="/assignments" className={cn("flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white">
        V
      </span>
      <span className="text-lg font-semibold tracking-tight text-zinc-900">
        VedaAI
      </span>
    </Link>
  );
}
