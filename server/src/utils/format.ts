import type { IAssignment } from "../models/Assignment.js";

export function formatAssignedOn(date: Date = new Date()): string {
  const d = date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function toClientAssignment(doc: IAssignment) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    assignedOn: doc.assignedOn,
    dueDate: doc.dueDate,
    status: doc.status,
    subject: doc.subject,
    className: doc.className,
    questionTypes: doc.questionTypes,
    additionalInfo: doc.additionalInfo,
    fileName: doc.fileName,
    questionPaper: doc.questionPaper,
    errorMessage: doc.errorMessage,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
