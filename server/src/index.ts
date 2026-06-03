import http from "http";
import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectMongo } from "./db/mongoose.js";
import { assignmentsRouter } from "./routes/assignments.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { attachWebSocketServer } from "./websocket/server.js";
import { startGenerationWorker } from "./workers/generation.worker.js";
import {
  isGeminiConfigured,
  validateGeminiApiKeyFormat,
} from "./services/llm/gemini.provider.js";

async function main() {
  await connectMongo();

  if (isGeminiConfigured()) {
    const keyWarning = validateGeminiApiKeyFormat(env.geminiApiKey);
    if (keyWarning) console.warn(`[config] ${keyWarning}`);
    console.log("[config] Gemini model: %s", env.geminiModel);
  } else {
    console.warn(
      "[config] GEMINI_API_KEY not set — question papers will use mock data unless OPENAI_API_KEY is set",
    );
  }

  const app = express();
  const server = http.createServer(app);

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/assignments", assignmentsRouter);

  app.use(errorHandler);

  attachWebSocketServer(server);
  startGenerationWorker();

  server.listen(env.port, () => {
    console.log(`[server] http://localhost:${env.port}`);
    console.log(`[server] ws://localhost:${env.port}/ws`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
