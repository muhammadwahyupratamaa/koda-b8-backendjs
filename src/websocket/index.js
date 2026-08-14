import { WebSocketServer } from "ws";
import libJwt from "../lib/jwt.js";

let wss;

export function initWebSocket(server) {
  wss = new WebSocketServer({
    server,
  });

  wss.on("connection", (ws, req) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const token = url.searchParams.get("token");

      if (!token) {
        ws.close(1008, "Unauthorized");
        return;
      }

      const payload = libJwt.verify(token);

      if (payload.role !== "admin") {
        ws.close(1008, "Forbidden");
        return;
      }

      ws.user = payload;

      console.log(`Admin WebSocket connected: ${payload.id}`);

      ws.send(
        JSON.stringify({
          event: "connected",
          data: {
            message: "Admin WebSocket connected",
          },
        }),
      );

      ws.on("close", () => {
        console.log(`Admin WebSocket disconnected: ${payload.id}`);
      });
    } catch (error) {
      console.error("WebSocket authentication failed:", error.message);
      ws.close(1008, "Unauthorized");
    }
  });

  console.log("WebSocket server running");
}

export function broadcast(event, data) {
  if (!wss) return;

  const message = JSON.stringify({
    event,
    data,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1 && client.user?.role === "admin") {
      client.send(message);
    }
  });
}
