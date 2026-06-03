"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Home,
  Library,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { VedaLogo } from "./VedaLogo";
import { cn } from "@/lib/utils";
import { SCHOOL_SHORT } from "@/lib/constants";
import { useUIStore } from "@/store/uiStore";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/groups", label: "My Groups", icon: Users },
  { href: "/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/toolkit", label: "AI Teacher's Toolkit", icon: Sparkles },
  { href: "/library", label: "My Library", icon: Library },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <VedaLogo />

      <Link
        href="/assignments/create"
        onClick={onNavigate}
        className="mt-6 flex items-center justify-center gap-2 rounded-full border-2 border-transparent bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-zinc-800"
        style={{
          backgroundImage:
            "linear-gradient(#18181b, #18181b), linear-gradient(135deg, #f97316, #ec4899)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          border: "2px solid transparent",
        }}
      >
        + AI Teacher&apos;s Toolkit
      </Link>

      <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
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
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50",
                active && "bg-zinc-100 text-zinc-900 shadow-sm",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-zinc-100 pt-4">
        <Link
          href="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 shadow-inner">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xs font-bold text-red-700 shadow-sm">
            DPS
          </div>
          <p className="min-w-0 truncate text-xs font-semibold text-zinc-900">
            {SCHOOL_SHORT}
          </p>
        </div>
      </div>
    </>
  );
}

export function PopOutSidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Desktop floating sidebar */}
      <aside
        className={cn(
          "no-print pop-out-panel hidden w-[248px] shrink-0 flex-col p-5 lg:flex",
          "sticky top-4 h-[calc(100vh-2rem)] self-start",
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "no-print pop-out-panel fixed left-4 top-4 z-50 flex h-[calc(100vh-2rem)] w-[min(280px,calc(100vw-2rem))] flex-col p-5 transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]",
        )}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent onNavigate={() => setSidebarOpen(false)} />
      </aside>
    </>
  );
}
