import type { WebSocket } from "ws";
import type { WebSocketPayload } from "../types/index.js";

const clients = new Map<WebSocket, Set<string>>();

export function registerClient(ws: WebSocket): void {
  clients.set(ws, new Set());
}

export function unregisterClient(ws: WebSocket): void {
  clients.delete(ws);
}

export function subscribeClient(ws: WebSocket, assignmentId: string): void {
  const subs = clients.get(ws);
  if (subs) subs.add(assignmentId);
}

export function broadcast(payload: WebSocketPayload): void {
  const message = JSON.stringify(payload);
  for (const [ws, subs] of clients) {
    if (ws.readyState === ws.OPEN && subs.has(payload.assignmentId)) {
      ws.send(message);
    }
  }
}

export function broadcastAll(payload: WebSocketPayload): void {
  const message = JSON.stringify(payload);
  for (const [ws] of clients) {
    if (ws.readyState === ws.OPEN) ws.send(message);
  }
}
