"use client";

import { ChevronDown, Search } from "lucide-react";
import { useAssignmentStore } from "@/store/assignmentStore";

export function AssignmentsToolbar() {
  const { searchQuery, filterBy, setSearchQuery, setFilterBy } =
    useAssignmentStore();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-zinc-600">Filter By</label>
        <div className="relative">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="appearance-none rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-8 text-sm text-zinc-800 shadow-sm focus:border-zinc-400 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="ready">Ready</option>
            <option value="generating">Generating</option>
            <option value="draft">Draft</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      <div className="relative flex-1 sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          placeholder="Search Assignment"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
