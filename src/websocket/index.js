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

      ws.user = payload;

      console.log(`WebSocket connected: ${payload.role} ${payload.id}`);

      ws.send(
        JSON.stringify({
          event: "connected",
          data: {
            message: `${payload.role} WebSocket connected`,
          },
        }),
      );

      ws.on("close", () => {
        console.log(`WebSocket disconnected: ${payload.role} ${payload.id}`);
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

export function broadcastToUser(userId, event, data) {
  if (!wss) return;

  const message = JSON.stringify({
    event,
    data,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1 && String(client.user?.id) === String(userId)) {
      client.send(message);
    }
  });
}
