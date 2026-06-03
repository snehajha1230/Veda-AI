import { Queue } from "bullmq";
import { env } from "../config/env.js";
import type { GenerationJobData } from "../types/index.js";

const connection = { url: env.redisUrl };

export const GENERATION_QUEUE_NAME = "question-paper-generation";

export const generationQueue = new Queue<GenerationJobData>(
  GENERATION_QUEUE_NAME,
  { connection },
);

export async function enqueueGeneration(
  assignmentId: string,
): Promise<string> {
  const job = await generationQueue.add(
    "generate",
    { assignmentId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  );
  return job.id ?? assignmentId;
}
