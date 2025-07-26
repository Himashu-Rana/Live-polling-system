import path from "path";
import { createServer } from "./index";
import express from "express";

const server = createServer();
const port = process.env.PORT || 3001;

// In production, serve the built SPA files - we need to get the Express app from the server
// Since our createServer returns an HTTP server with an Express app attached,
// we'll need to modify our approach or access the Express app directly

server.listen(port, () => {
  console.log(`🚀 Live Polling System server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`🔗 Socket.io: WebSocket connections enabled`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  server.close(() => {
    process.exit(0);
  });
});
