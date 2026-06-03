import mongoose, { Schema, type Document, type Types } from "mongoose";
import type {
  AssignmentStatus,
  QuestionPaper,
  QuestionTypeInput,
} from "../types/index.js";

export interface IAssignment extends Document {
  _id: Types.ObjectId;
  title: string;
  assignedOn: string;
  dueDate: string;
  status: AssignmentStatus;
  subject: string;
  className: string;
  questionTypes: QuestionTypeInput[];
  additionalInfo: string;
  fileName?: string;
  fileMimeType?: string;
  fileStoragePath?: string;
  fileText?: string;
  sourceExtractionMethod?: string;
  questionPaper?: QuestionPaper;
  jobId?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const questionTypeSchema = new Schema(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    assignedOn: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "generating", "ready", "failed"],
      default: "generating",
    },
    subject: { type: String, default: "Science" },
    className: { type: String, default: "8th" },
    questionTypes: { type: [questionTypeSchema], required: true },
    additionalInfo: { type: String, default: "" },
    fileName: String,
    fileMimeType: String,
    fileStoragePath: String,
    fileText: String,
    sourceExtractionMethod: String,
    questionPaper: { type: Schema.Types.Mixed },
    jobId: String,
    errorMessage: String,
  },
  { timestamps: true },
);

export const Assignment =
  mongoose.models.Assignment ??
  mongoose.model<IAssignment>("Assignment", assignmentSchema);
