import Link from "next/link";
import { ClipboardPlus, Sparkles, Users } from "lucide-react";

const actions = [
  {
    href: "/assignments/create",
    label: "Create Assignment",
    icon: ClipboardPlus,
    desc: "AI-powered question paper",
  },
  {
    href: "/groups",
    label: "My Classes",
    icon: Users,
    desc: "6 active classrooms",
  },
  {
    href: "/toolkit",
    label: "AI Toolkit",
    icon: Sparkles,
    desc: "Generate & refine content",
  },
];

export function QuickActions() {
  return (
    <div className="pop-out-panel p-5">
      <h2 className="text-sm font-semibold text-zinc-900">Quick actions</h2>
      <div className="mt-3 grid gap-2">
        {actions.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 px-3 py-3 transition hover:border-zinc-200 hover:bg-white hover:shadow-sm"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-zinc-900">{label}</p>
              <p className="text-xs text-zinc-500">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
