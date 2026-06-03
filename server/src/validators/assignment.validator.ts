import { z } from "zod";

const questionTypeSchema = z.object({
  type: z.enum([
    "multiple_choice",
    "short_questions",
    "diagram_graph",
    "numerical_problems",
    "long_answer",
    "fill_in_blanks",
  ]),
  count: z.coerce.number().int().min(1).max(50),
  marksPerQuestion: z.coerce.number().int().min(1).max(100),
});

export const createAssignmentSchema = z.object({
  title: z.string().max(200).optional(),
  dueDate: z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, {
      message: "dueDate must be DD-MM-YYYY",
    }),
  questionTypes: z.preprocess(
    (val) => {
      if (typeof val === "string") return JSON.parse(val) as unknown;
      return val;
    },
    z.array(questionTypeSchema).min(1),
  ),
  additionalInfo: z.string().max(5000).optional(),
  subject: z.string().trim().min(1).max(100),
  className: z.string().trim().min(1).max(50),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
