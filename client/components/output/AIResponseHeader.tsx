"use client";

import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AIResponseHeaderProps {
  message: string;
  onRegenerate?: () => void;
  onDownload?: () => void;
}

export function AIResponseHeader({
  message,
  onRegenerate,
  onDownload,
}: AIResponseHeaderProps) {
  return (
    <div className="rounded-2xl bg-zinc-800 px-5 py-4 text-white shadow-md sm:px-6 sm:py-5">
      <p className="text-sm leading-relaxed text-zinc-100 sm:text-base">
        {message}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="border-zinc-500 bg-transparent text-white hover:bg-zinc-700"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
          Download as PDF
        </Button>
        {onRegenerate && (
          <Button
            variant="ghost"
            className="text-zinc-200 hover:bg-zinc-700 hover:text-white"
            onClick={onRegenerate}
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        )}
      </div>
    </div>
  );
}
