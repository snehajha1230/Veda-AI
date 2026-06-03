"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  Home,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/assignments", label: "Tasks", icon: ClipboardList },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/toolkit", label: "AI", icon: Sparkles },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="no-print fixed bottom-3 left-3 right-3 z-40 lg:hidden">
      <div className="pop-out-panel flex items-center justify-around px-1 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/assignments"
              ? pathname.startsWith("/assignments")
              : href === "/groups"
                ? pathname.startsWith("/groups")
                : pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition",
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:text-zinc-800",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
