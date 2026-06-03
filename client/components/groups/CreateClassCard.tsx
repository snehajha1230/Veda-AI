import { Plus } from "lucide-react";

export function CreateClassCard() {
  return (
    <button
      type="button"
      className="pop-out-panel flex min-h-[220px] flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-6 text-zinc-500 transition hover:border-zinc-400 hover:bg-white hover:text-zinc-700"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-white">
        <Plus className="h-6 w-6" />
      </span>
      <span className="text-sm font-semibold">Create class</span>
      <span className="max-w-[200px] text-center text-xs">
        Add a new classroom for your students
      </span>
    </button>
  );
}
