import type { QuestionPaper } from "@/types/assignment";
import { QuestionItem } from "./QuestionItem";

interface ExamPaperProps {
  paper: QuestionPaper;
}

export function ExamPaper({ paper }: ExamPaperProps) {
  return (
    <div
      id="question-paper"
      className="question-paper-print mx-auto max-w-3xl rounded-sm border border-zinc-200 bg-white px-6 py-8 shadow-lg sm:px-10 sm:py-12 print:mx-0 print:max-w-none print:border-0 print:px-0 print:py-0 print:shadow-none"
    >
      <div className="border-b border-zinc-200 pb-6 text-center">
        <h1 className="text-lg font-bold uppercase tracking-wide text-zinc-900 sm:text-xl">
          {paper.schoolName}
        </h1>
        <p className="mt-2 text-base font-semibold text-zinc-800">
          Subject: {paper.subject}
        </p>
        <p className="text-base font-semibold text-zinc-800">
          Class: {paper.className}
        </p>
      </div>

      <div className="mt-4 flex flex-col justify-between gap-2 border-b border-zinc-100 pb-4 text-sm sm:flex-row">
        <span>
          <strong>Time Allowed:</strong> {paper.timeAllowed}
        </span>
        <span>
          <strong>Maximum Marks:</strong> {paper.maximumMarks}
        </span>
      </div>

      <p className="mt-4 text-center text-sm italic text-zinc-600">
        {paper.generalInstructions}
      </p>

      <section className="mt-8 space-y-4 border-b border-zinc-100 pb-6 text-sm">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <label className="flex min-w-[140px] flex-1 items-end gap-2">
            <span className="font-medium">Name:</span>
            <span className="flex-1 border-b border-zinc-400" />
          </label>
          <label className="flex min-w-[140px] flex-1 items-end gap-2">
            <span className="font-medium">Roll Number:</span>
            <span className="flex-1 border-b border-zinc-400" />
          </label>
        </div>
        <label className="flex items-end gap-2">
          <span className="font-medium">Class: {paper.className} Section:</span>
          <span className="max-w-[200px] flex-1 border-b border-zinc-400" />
        </label>
      </section>

      {paper.sections.map((section) => (
        <section key={section.id} className="mt-8">
          <h2 className="text-center text-base font-bold uppercase text-zinc-900">
            Section {section.letter}
          </h2>
          <h3 className="mt-4 text-sm font-bold text-zinc-900">
            {section.title}
          </h3>
          <p className="mt-1 text-sm text-zinc-700">{section.instruction}</p>

          <ol className="mt-6 list-none space-y-6">
            {section.questions.map((q) => (
              <QuestionItem key={q.id} question={q} />
            ))}
          </ol>
        </section>
      ))}

      <p className="mt-10 text-center text-sm font-medium text-zinc-500">
        *** End of Question Paper ***
      </p>
    </div>
  );
}
