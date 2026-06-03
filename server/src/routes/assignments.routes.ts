import { Router } from "express";
import fs from "fs";
import { Assignment } from "../models/Assignment.js";
import { upload } from "../middleware/upload.js";
import { extractSourceMaterial } from "../services/file-extraction.service.js";
import { createAssignmentSchema } from "../validators/assignment.validator.js";
import { enqueueGeneration } from "../queues/generation.queue.js";
import { formatAssignedOn, toClientAssignment } from "../utils/format.js";
import { getCachedPaper, getJobState } from "../services/cache.service.js";
import { setJobState } from "../services/cache.service.js";
import { broadcast } from "../websocket/broadcaster.js";

export const assignmentsRouter = Router();

assignmentsRouter.get("/", async (_req, res, next) => {
  try {
    const docs = await Assignment.find().sort({ createdAt: -1 }).limit(100);
    res.json({ assignments: docs.map(toClientAssignment) });
  } catch (e) {
    next(e);
  }
});

assignmentsRouter.get("/:id", async (req, res, next) => {
  try {
    const doc = await Assignment.findById(req.params.id);
    if (!doc) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }
    const jobState = await getJobState(req.params.id);
    res.json({ assignment: toClientAssignment(doc), jobState });
  } catch (e) {
    next(e);
  }
});

assignmentsRouter.get("/:id/paper", async (req, res, next) => {
  try {
    const doc = await Assignment.findById(req.params.id);
    if (!doc) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }
    const paper =
      doc.questionPaper ?? (await getCachedPaper(req.params.id)) ?? null;
    if (!paper) {
      res.status(404).json({ error: "Question paper not ready" });
      return;
    }
    res.json({ paper });
  } catch (e) {
    next(e);
  }
});

assignmentsRouter.post(
  "/",
  upload.single("file"),
  async (req, res, next) => {
    try {
      const parsed = createAssignmentSchema.parse({
        ...req.body,
        questionTypes: req.body.questionTypes,
      });

      if (!req.file) {
        res.status(400).json({
          error:
            "Source file is required. Upload PDF, TXT, or an image of your study material.",
        });
        return;
      }

      const extracted = await extractSourceMaterial(
        req.file.path,
        req.file.originalname,
        req.file.mimetype,
      );

      const assignment = await Assignment.create({
        title: parsed.title ?? "New Assignment",
        assignedOn: formatAssignedOn(),
        dueDate: parsed.dueDate,
        status: "generating",
        subject: parsed.subject,
        className: parsed.className,
        questionTypes: parsed.questionTypes,
        additionalInfo: parsed.additionalInfo ?? "",
        fileName: extracted.fileName,
        fileMimeType: extracted.mimeType,
        fileStoragePath: req.file.path,
        fileText: extracted.text,
        sourceExtractionMethod: extracted.extractionMethod,
      });

      const assignmentId = assignment._id.toString();
      const jobId = await enqueueGeneration(assignmentId);

      assignment.jobId = jobId;
      await assignment.save();

      await setJobState(assignmentId, {
        status: "queued",
        progress: 0,
        message: "Waiting in queue…",
        updatedAt: new Date().toISOString(),
      });

      broadcast({
        type: "job:queued",
        assignmentId,
        progress: 0,
        message: "Waiting in queue…",
      });

      res.status(201).json({
        assignment: toClientAssignment(assignment),
        assignmentId,
      });
    } catch (e) {
      next(e);
    }
  },
);

assignmentsRouter.post("/:id/regenerate", async (req, res, next) => {
  try {
    const doc = await Assignment.findById(req.params.id);
    if (!doc) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }

    doc.status = "generating";
    doc.errorMessage = undefined;
    doc.questionPaper = undefined;
    await doc.save();

    const assignmentId = doc._id.toString();
    const jobId = await enqueueGeneration(assignmentId);
    doc.jobId = jobId;
    await doc.save();

    await setJobState(assignmentId, {
      status: "queued",
      progress: 0,
      message: "Regeneration queued…",
      updatedAt: new Date().toISOString(),
    });

    broadcast({
      type: "job:queued",
      assignmentId,
      message: "Regeneration queued…",
    });

    res.json({ assignment: toClientAssignment(doc), assignmentId });
  } catch (e) {
    next(e);
  }
});

assignmentsRouter.delete("/:id", async (req, res, next) => {
  try {
    const doc = await Assignment.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});
