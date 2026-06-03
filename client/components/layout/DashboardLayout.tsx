"use client";

import { PopOutSidebar } from "./PopOutSidebar";
import { PopOutNavbar } from "./PopOutNavbar";
import { MobileBottomNav } from "./MobileBottomNav";

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#ececee]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-3 p-3 sm:gap-4 sm:p-4">
        <PopOutSidebar />

        <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-4">
          <PopOutNavbar />
          <main className="mt-3 flex-1 sm:mt-4">{children}</main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
