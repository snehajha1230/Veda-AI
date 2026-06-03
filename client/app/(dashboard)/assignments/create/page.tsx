"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { CreateAssignmentForm } from "@/components/create-assignment/CreateAssignmentForm";

export default function CreateAssignmentPage() {
  return (
    <div className="space-y-6 px-1 pb-8 sm:px-0">
      <PageHeader
        title="Create Assignment"
        subtitle="Set up a new assignment for your students."
      />
      <div className="max-w-4xl">
        <CreateAssignmentForm />
      </div>
    </div>
  );
}
