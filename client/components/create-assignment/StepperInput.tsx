"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  error?: string;
  label?: string;
}

export function StepperInput({
  value,
  onChange,
  min = 1,
  max = 99,
  error,
  label,
}: StepperInputProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div>
      {label && (
        <span className="mb-1 block text-xs font-medium text-zinc-500 lg:hidden">
          {label}
        </span>
      )}
      <div
        className={cn(
          "flex items-center rounded-xl border bg-white",
          error ? "border-red-400" : "border-zinc-200",
        )}
      >
        <button
          type="button"
          onClick={decrement}
          className="flex h-10 w-10 items-center justify-center text-zinc-500 hover:bg-zinc-50"
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
          }}
          className="h-10 w-12 border-x border-zinc-200 text-center text-sm font-medium text-zinc-900 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={increment}
          className="flex h-10 w-10 items-center justify-center text-zinc-500 hover:bg-zinc-50"
          aria-label="Increase"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
