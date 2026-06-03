"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";
import { VedaLogo } from "./VedaLogo";
import { useUIStore } from "@/store/uiStore";

function pageTitle(pathname: string): string {
  if (pathname === "/") return "Home";
  if (pathname.startsWith("/groups/")) return "Classroom";
  if (pathname === "/groups") return "My Groups";
  if (pathname.includes("/create")) return "Create Assignment";
  if (pathname.includes("/output")) return "Question Paper";
  if (pathname.startsWith("/assignments")) return "Assignments";
  if (pathname === "/library") return "My Library";
  if (pathname === "/toolkit") return "AI Toolkit";
  return "VedaAI";
}

function backHref(pathname: string): string | null {
  if (pathname.includes("/assignments/") && pathname !== "/assignments") {
    return pathname.includes("/output") ? "/assignments" : "/assignments";
  }
  if (pathname.startsWith("/groups/") && pathname !== "/groups") {
    return "/groups";
  }
  if (pathname === "/assignments/create") return "/assignments";
  return null;
}

export function PopOutNavbar() {
  const pathname = usePathname();
  const { toggleSidebar } = useUIStore();
  const title = pageTitle(pathname);
  const back = backHref(pathname);
  const showSearch = pathname === "/" || pathname === "/groups";

  return (
    <header className="no-print pop-out-panel sticky top-0 z-40 flex items-center gap-3 px-4 py-3 sm:px-5">
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-700 shadow-sm transition hover:bg-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {back ? (
        <Link
          href={back}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-700 shadow-sm transition hover:bg-white"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      ) : (
        <div className="hidden shrink-0 lg:block">
          <VedaLogo />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-900">{title}</p>
        <p className="hidden truncate text-xs text-zinc-500 sm:block">
          Delhi Public School, Bokaro
        </p>
      </div>

      {showSearch && (
        <div className="relative hidden max-w-xs flex-1 sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Search classes, assignments…"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 py-2 pl-9 pr-3 text-sm placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:outline-none"
          />
        </div>
      )}

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-600 shadow-sm transition hover:bg-white"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <button
          type="button"
          className="hidden items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50 py-1.5 pl-1.5 pr-3 shadow-sm transition hover:bg-white sm:flex"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-200 to-orange-200 text-xs font-bold text-amber-900">
            JD
          </span>
          <span className="text-sm font-medium text-zinc-800">John Doe</span>
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        </button>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-orange-200 text-xs font-bold text-amber-900 sm:hidden">
          JD
        </span>
      </div>
    </header>
  );
}
