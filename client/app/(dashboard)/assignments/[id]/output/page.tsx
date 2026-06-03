"use client";

import { useEffect, useCallback, use } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AIResponseHeader } from "@/components/output/AIResponseHeader";
import { ExamPaper } from "@/components/output/ExamPaper";
import { AnswerKey } from "@/components/output/AnswerKey";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useGenerationStore } from "@/store/generationStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import { fetchPaper, regenerateAssignment } from "@/lib/api";

export default function OutputPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const getPaper = useAssignmentStore((s) => s.getPaper);
  const setPaper = useAssignmentStore((s) => s.setPaper);
  const { subscribeToJob } = useWebSocket();
  const generationMessage = useGenerationStore((s) => s.message);
  const generationStatus = useGenerationStore((s) => s.status);
  const progress = useGenerationStore((s) => s.progress);
  const setStatus = useGenerationStore((s) => s.setStatus);
  const setProgress = useGenerationStore((s) => s.setProgress);
  const setMessage = useGenerationStore((s) => s.setMessage);

  const paper = getPaper(id);
  const isLoading =
    generationStatus === "queued" || generationStatus === "processing";

  const loadPaper = useCallback(async () => {
    try {
      const fetched = await fetchPaper(id);
      setPaper(id, fetched);
    } catch {
      /* not ready yet */
    }
  }, [id, setPaper]);

  useEffect(() => {
    subscribeToJob(id);
  }, [id, subscribeToJob]);

  useEffect(() => {
    if (generationStatus === "completed" && !paper) {
      void loadPaper();
    }
  }, [generationStatus, paper, loadPaper]);

  const displayPaper = paper;

  const handleRegenerate = async () => {
    setStatus("queued");
    setProgress(0);
    setMessage("Regenerating…");
    try {
      await regenerateAssignment(id);
      subscribeToJob(id);
    } catch (err) {
      setStatus("failed");
      setMessage(
        err instanceof Error ? err.message : "Regeneration failed",
      );
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-1 pb-8 sm:px-0">
      <div className="no-print space-y-6">
        <PageHeader
          title="Generated Question Paper"
          subtitle="Review, download, or regenerate your AI output."
        />

        <AIResponseHeader
          message={
            generationMessage ||
            "Your customized question paper is being prepared."
          }
          onDownload={displayPaper ? handleDownload : undefined}
          onRegenerate={handleRegenerate}
        />

        {isLoading && (
          <div className="pop-out-panel flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
            <p className="text-sm text-zinc-600">
              {generationMessage || "Generating your question paper…"}
            </p>
            {progress > 0 && (
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full bg-zinc-900 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {generationStatus === "failed" && !displayPaper && (
          <p className="text-center text-sm text-red-600">
            Generation failed. Try regenerating.
          </p>
        )}
      </div>

      {displayPaper && !isLoading && (
        <>
          <ExamPaper paper={displayPaper} />
          <AnswerKey paper={displayPaper} />
        </>
      )}
    </div>
  );
}
