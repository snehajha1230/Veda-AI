"use client";

import { useCallback, useEffect, useRef } from "react";
import type { WebSocketMessage } from "@/types/assignment";
import { useGenerationStore } from "@/store/generationStore";
import { useAssignmentStore } from "@/store/assignmentStore";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000/ws";

interface UseWebSocketOptions {
  enabled?: boolean;
  onMessage?: (msg: WebSocketMessage) => void;
}

export function useWebSocket({ enabled = true, onMessage }: UseWebSocketOptions = {}) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSubscribeRef = useRef<string | null>(null);
  const {
    setStatus,
    setProgress,
    setMessage,
    setWsConnected,
    assignmentId,
  } = useGenerationStore();
  const setPaper = useAssignmentStore((s) => s.setPaper);

  const handleMessage = useCallback(
    (msg: WebSocketMessage) => {
      onMessage?.(msg);

      switch (msg.type) {
        case "job:queued":
          setStatus("queued");
          setMessage(msg.message ?? "Queued for generation…");
          break;
        case "job:progress":
          setStatus("processing");
          setProgress(msg.progress ?? 0);
          setMessage(msg.message ?? "Generating question paper…");
          break;
        case "job:completed": {
          setStatus("completed");
          setProgress(100);
          setMessage("Generation complete");
          const id = msg.assignmentId ?? assignmentId;
          if (id && msg.paper) setPaper(id, msg.paper);
          break;
        }
        case "job:failed":
          setStatus("failed");
          setMessage(msg.message ?? "Generation failed");
          break;
      }
    },
    [
      assignmentId,
      onMessage,
      setMessage,
      setPaper,
      setProgress,
      setStatus,
    ],
  );

  const sendSubscribe = useCallback((jobAssignmentId: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ type: "subscribe", assignmentId: jobAssignmentId }),
      );
      pendingSubscribeRef.current = null;
    } else {
      pendingSubscribeRef.current = jobAssignmentId;
    }
  }, []);

  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

    try {
      const ws = new WebSocket(WS_URL);
      socketRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        setMessage("Connected to generation service");
        if (pendingSubscribeRef.current) {
          sendSubscribe(pendingSubscribeRef.current);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string) as WebSocketMessage;
          handleMessage(data);
        } catch {
          /* ignore malformed payloads */
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        reconnectRef.current = setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        setWsConnected(false);
      };
    } catch {
      setWsConnected(false);
    }
  }, [enabled, handleMessage, sendSubscribe, setMessage, setWsConnected]);

  const disconnect = useCallback(() => {
    if (reconnectRef.current) clearTimeout(reconnectRef.current);
    socketRef.current?.close();
    socketRef.current = null;
    setWsConnected(false);
  }, [setWsConnected]);

  const subscribeToJob = useCallback(
    (jobAssignmentId: string) => {
      sendSubscribe(jobAssignmentId);
    },
    [sendSubscribe],
  );

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { subscribeToJob, disconnect, reconnect: connect };
}
