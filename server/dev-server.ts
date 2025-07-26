import { createServer } from "./index";

const server = createServer();
const port = 3000;

server.listen(port, () => {
  console.log(`🚀 Live Polling System running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`📡 Socket.io WebSocket connections enabled`);
  console.log(`🔧 API endpoints available at http://localhost:${port}/api`);
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
