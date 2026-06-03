import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  mongodbUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/vedaai"),
  redisUrl: required("REDIS_URL", "redis://127.0.0.1:6379"),
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  /** Comma-separated models tried if the primary hits quota/rate limits. */
  geminiModelFallbacks:
    process.env.GEMINI_MODEL_FALLBACKS ??
    "gemini-2.0-flash-lite,gemini-1.5-flash",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  schoolName:
    process.env.SCHOOL_NAME ?? "Delhi Public School, Sector-4, Bokaro",
  defaultSubject: process.env.DEFAULT_SUBJECT ?? "Science",
  defaultClass: process.env.DEFAULT_CLASS ?? "8th",
};
