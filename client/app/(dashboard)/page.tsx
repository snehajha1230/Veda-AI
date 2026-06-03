"use client";

import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/home/StatCard";
import { ScheduleTimeline } from "@/components/home/ScheduleTimeline";
import { UpcomingList } from "@/components/home/UpcomingList";
import { QuickActions } from "@/components/home/QuickActions";
import { TODAY_SCHEDULE, UPCOMING_ITEMS, CLASSROOMS } from "@/lib/mock-dashboard";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const totalStudents = CLASSROOMS.reduce((s, c) => s + c.studentCount, 0);

  return (
    <div className="space-y-6 px-1 sm:px-0">
      <PageHeader
        title="Good afternoon, John"
        subtitle="Here's what's happening across your classes today."
        action={
          <Link href="/assignments/create">
            <Button className="shadow-md">+ New assignment</Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total students"
          value={totalStudents}
          icon={Users}
          trend="+12 this term"
          accent="bg-gradient-to-br from-blue-600 to-indigo-600"
        />
        <StatCard
          label="Active classes"
          value={CLASSROOMS.length}
          icon={GraduationCap}
          accent="bg-gradient-to-br from-emerald-600 to-teal-600"
        />
        <StatCard
          label="Assignments due"
          value={7}
          icon={ClipboardList}
          trend="2 due tomorrow"
          accent="bg-gradient-to-br from-orange-500 to-amber-600"
        />
        <StatCard
          label="Pending reviews"
          value={14}
          icon={BookOpen}
          accent="bg-gradient-to-br from-violet-600 to-purple-600"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ScheduleTimeline items={TODAY_SCHEDULE} />
        </div>
        <div className="space-y-4">
          <QuickActions />
          <UpcomingList items={UPCOMING_ITEMS.slice(0, 4)} />
        </div>
      </div>

      <div className="pop-out-panel p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Recent activity</h2>
          <Link
            href="/groups"
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
          >
            All classes
          </Link>
        </div>
        <ul className="mt-4 space-y-3">
          {[
            "12 submissions graded for Quiz on Electricity",
            "New announcement posted in Grade 8 Science",
            "Room code shared with Grade 5 English parents",
            "AI question paper generated for Grade 10 Math",
          ].map((text, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-700"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-400" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
