import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("[error]", err);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((i) => i.message),
    });
    return;
  }

  const message = err.message ?? "Internal server error";
  const status = message.includes("not found") ? 404 : 500;
  res.status(status).json({ error: message });
}
