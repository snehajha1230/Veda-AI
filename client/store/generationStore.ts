"use client";

import { create } from "zustand";
import type { GenerationStatus } from "@/types/assignment";

interface GenerationState {
  status: GenerationStatus;
  progress: number;
  message: string;
  assignmentId: string | null;
  wsConnected: boolean;

  setStatus: (status: GenerationStatus) => void;
  setProgress: (progress: number) => void;
  setMessage: (message: string) => void;
  setAssignmentId: (id: string | null) => void;
  setWsConnected: (connected: boolean) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  status: "idle",
  progress: 0,
  message: "",
  assignmentId: null,
  wsConnected: false,

  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setMessage: (message) => set({ message }),
  setAssignmentId: (assignmentId) => set({ assignmentId }),
  setWsConnected: (wsConnected) => set({ wsConnected }),
  reset: () =>
    set({
      status: "idle",
      progress: 0,
      message: "",
      assignmentId: null,
    }),
}));
