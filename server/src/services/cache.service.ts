import { redis } from "../redis/client.js";
import type { JobState, QuestionPaper } from "../types/index.js";

const JOB_TTL = 60 * 60 * 24; // 24h
const PAPER_TTL = 60 * 60 * 6;

function jobKey(id: string) {
  return `job:${id}:state`;
}

function paperKey(id: string) {
  return `cache:paper:${id}`;
}

export async function setJobState(
  assignmentId: string,
  state: JobState,
): Promise<void> {
  await redis.set(jobKey(assignmentId), JSON.stringify(state), "EX", JOB_TTL);
}

export async function getJobState(
  assignmentId: string,
): Promise<JobState | null> {
  const raw = await redis.get(jobKey(assignmentId));
  return raw ? (JSON.parse(raw) as JobState) : null;
}

export async function cachePaper(
  assignmentId: string,
  paper: QuestionPaper,
): Promise<void> {
  await redis.set(paperKey(assignmentId), JSON.stringify(paper), "EX", PAPER_TTL);
}

export async function getCachedPaper(
  assignmentId: string,
): Promise<QuestionPaper | null> {
  const raw = await redis.get(paperKey(assignmentId));
  return raw ? (JSON.parse(raw) as QuestionPaper) : null;
}
