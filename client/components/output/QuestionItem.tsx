import type { Question } from "@/types/assignment";

export function QuestionItem({ question }: { question: Question }) {
  return (
    <li className="text-sm leading-relaxed text-zinc-800">
      <p>
        <span className="font-medium">{question.number}. </span>
        {question.text}
      </p>
      {question.options && question.options.length > 0 && (
        <ul className="mt-2 ml-6 list-none space-y-1.5">
          {question.options.map((opt, i) => (
            <li key={i} className="text-zinc-700">
              {opt}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
