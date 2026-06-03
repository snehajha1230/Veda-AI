"use client";

import { useCallback, useState } from "react";
import { CloudUpload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}

export function FileUploadZone({
  file,
  onFileChange,
  error,
}: FileUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      onFileChange(files[0]);
    },
    [onFileChange],
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 transition",
          dragOver
            ? "border-emerald-400 bg-emerald-50/50"
            : error
              ? "border-red-300 bg-red-50/30"
              : file
                ? "border-emerald-300 bg-emerald-50/30"
                : "border-zinc-200 bg-zinc-50/50",
        )}
      >
        {file ? (
          <FileText className="mb-3 h-10 w-10 text-emerald-600" strokeWidth={1.5} />
        ) : (
          <CloudUpload className="mb-3 h-10 w-10 text-zinc-400" strokeWidth={1.5} />
        )}
        <p className="text-center text-sm font-medium text-zinc-700">
          {file
            ? "Source material ready"
            : "Upload your chapter, notes, or textbook pages"}
        </p>
        <p className="mt-1 max-w-sm text-center text-xs text-zinc-500">
          Questions will be generated <strong>from this file</strong> in the
          format you choose below (PDF, TXT, or photo up to 10MB)
        </p>
        <label className="mt-4 cursor-pointer rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
          {file ? "Change file" : "Browse Files"}
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.txt,.png,.jpg,.jpeg,application/pdf,text/plain,image/*"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
        {file && (
          <p className="mt-3 text-xs font-medium text-zinc-600">
            {file.name} ({(file.size / 1024).toFixed(0)} KB)
            <button
              type="button"
              className="ml-2 text-red-600 underline"
              onClick={() => onFileChange(null)}
            >
              Remove
            </button>
          </p>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
