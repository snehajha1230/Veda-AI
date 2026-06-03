"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssignmentCard } from "@/components/assignments/AssignmentCard";
import { AssignmentEmptyState } from "@/components/assignments/AssignmentEmptyState";
import { AssignmentsToolbar } from "@/components/assignments/AssignmentsToolbar";
import { useAssignmentStore } from "@/store/assignmentStore";
import { Button } from "@/components/ui/Button";
import {
  deleteAssignment,
  fetchAssignments,
  mapApiToAssignment,
} from "@/lib/api";

export default function AssignmentsPage() {
  const {
    assignments,
    useEmptyState,
    searchQuery,
    filterBy,
    removeAssignment,
    loadSampleAssignments,
    setUseEmptyState,
    setAssignments,
    setPaper,
  } = useAssignmentStore();

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchAssignments();
        if (cancelled) return;
        setAssignments(list.map(mapApiToAssignment));
        for (const a of list) {
          if (a.questionPaper) setPaper(a.id, a.questionPaper);
        }
        setApiError(null);
      } catch (err) {
        if (!cancelled) {
          setApiError(
            err instanceof Error ? err.message : "Could not load assignments",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setAssignments, setPaper]);

  const filtered = assignments.filter((a) => {
    const matchesSearch = a.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterBy === "all" ? true : a.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const showEmpty =
    !loading && (useEmptyState || assignments.length === 0);

  const handleDelete = async (id: string) => {
    try {
      await deleteAssignment(id);
      removeAssignment(id);
    } catch {
      removeAssignment(id);
    }
  };

  return (
    <div className="space-y-6 px-1 pb-8 sm:px-0">
      <PageHeader
        title="Assignments"
        subtitle="Manage and create assignments for your classes."
        statusDot
        action={
          <div className="hidden gap-2 sm:flex">
            <Button
              variant="outline"
              className="text-xs"
              onClick={() => setUseEmptyState(true)}
            >
              Preview empty
            </Button>
            <Button
              variant="outline"
              className="text-xs"
              onClick={loadSampleAssignments}
            >
              Load samples
            </Button>
          </div>
        }
      />

      {apiError && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          API: {apiError}. Start the backend with MongoDB and Redis running.
        </p>
      )}

      {loading ? (
        <div className="pop-out-panel flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        </div>
      ) : showEmpty ? (
        <div className="pop-out-panel">
          <AssignmentEmptyState />
        </div>
      ) : (
        <>
          <div className="pop-out-panel p-4">
            <AssignmentsToolbar />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {!showEmpty && !loading && (
        <div className="fixed bottom-24 left-1/2 z-20 -translate-x-1/2 lg:bottom-8">
          <Link href="/assignments/create">
            <Button className="shadow-lg">
              <Plus className="h-4 w-4" />
              Create Assignment
            </Button>
          </Link>
        </div>
      )}

      {showEmpty && !loading && (
        <div className="fixed bottom-24 right-6 z-20 lg:hidden">
          <Link
            href="/assignments/create"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg"
            aria-label="Create assignment"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
