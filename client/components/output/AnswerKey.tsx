import type { QuestionPaper } from "@/types/assignment";

export function AnswerKey({ paper }: { paper: QuestionPaper }) {
  return (
    <div className="no-print mx-auto mt-8 max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-zinc-900">Answer Key</h3>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-700">
        {paper.answerKey.map((item) => (
          <li key={item.questionNumber}>
            <span className="font-medium">Q{item.questionNumber}:</span>{" "}
            {item.answer}
          </li>
        ))}
      </ol>
    </div>
  );
}
