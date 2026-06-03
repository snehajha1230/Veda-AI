import { Worker } from "bullmq";
import { env } from "../config/env.js";
import { Assignment } from "../models/Assignment.js";
import { GENERATION_QUEUE_NAME } from "../queues/generation.queue.js";
import type { GenerationJobData } from "../types/index.js";
import { setJobState, cachePaper } from "../services/cache.service.js";
import { generateQuestionPaper } from "../services/ai.service.js";
import { broadcast } from "../websocket/broadcaster.js";

function notify(
  assignmentId: string,
  payload: Omit<Parameters<typeof broadcast>[0], "assignmentId">,
) {
  broadcast({ assignmentId, ...payload });
}

export function startGenerationWorker(): Worker<GenerationJobData> {
  const worker = new Worker<GenerationJobData>(
    GENERATION_QUEUE_NAME,
    async (job) => {
      const { assignmentId } = job.data;

      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) throw new Error("Assignment not found");

      const updateProgress = async (progress: number, message: string) => {
        await setJobState(assignmentId, {
          status: "processing",
          progress,
          message,
          updatedAt: new Date().toISOString(),
        });
        notify(assignmentId, {
          type: "job:progress",
          progress,
          message,
        });
      };

      await setJobState(assignmentId, {
        status: "queued",
        progress: 5,
        message: "Job queued",
        updatedAt: new Date().toISOString(),
      });
      notify(assignmentId, {
        type: "job:queued",
        progress: 5,
        message: "Queued for generation…",
      });

      await updateProgress(15, "Reading uploaded study material…");
      await updateProgress(30, "Building questions from your file…");
      await updateProgress(55, "Generating question paper with AI…");

      const paper = await generateQuestionPaper(assignment);

      await updateProgress(80, "Saving question paper…");

      assignment.questionPaper = paper;
      assignment.status = "ready";
      assignment.errorMessage = undefined;
      await assignment.save();

      await cachePaper(assignmentId, paper);

      await setJobState(assignmentId, {
        status: "completed",
        progress: 100,
        message: "Generation complete",
        updatedAt: new Date().toISOString(),
      });

      notify(assignmentId, {
        type: "job:completed",
        progress: 100,
        message: "Generation complete",
        paper,
      });

      return { success: true };
    },
    {
      connection: { url: env.redisUrl },
      concurrency: 2,
    },
  );

  worker.on("failed", async (job, err) => {
    const assignmentId = job?.data.assignmentId;
    if (!assignmentId) return;

    const message = err.message ?? "Generation failed";

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "failed",
      errorMessage: message,
    });

    await setJobState(assignmentId, {
      status: "failed",
      progress: 0,
      message,
      updatedAt: new Date().toISOString(),
    });

    notify(assignmentId, {
      type: "job:failed",
      message,
    });
  });

  worker.on("ready", () => console.log("[worker] generation worker ready"));

  return worker;
}
