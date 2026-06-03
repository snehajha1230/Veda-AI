import { WebSocketServer, type WebSocket } from "ws";
import type { Server } from "http";
import {
  registerClient,
  unregisterClient,
  subscribeClient,
} from "./broadcaster.js";

export function attachWebSocketServer(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    registerClient(ws);

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString()) as {
          type?: string;
          assignmentId?: string;
        };
        if (msg.type === "subscribe" && msg.assignmentId) {
          subscribeClient(ws, msg.assignmentId);
        }
      } catch {
        /* ignore */
      }
    });

    ws.on("close", () => unregisterClient(ws));
  });

  console.log("[ws] listening on /ws");
  return wss;
}
