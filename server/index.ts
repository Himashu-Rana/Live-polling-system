import "dotenv/config";
import express from "express";
import { createServer as createHttpServer } from "http";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { setupSocket } from "./socket";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createExpressApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}

export function createServer() {
  const app = createExpressApp();
  const server = createHttpServer(app);

  // Setup Socket.io
  setupSocket(server);

 const possiblePaths = [
    resolve(__dirname, "../spa"),           // Production build (dist/server/ -> dist/spa/)
    resolve(__dirname, "../dist/spa"),      // Development (server/ -> dist/spa/)
    resolve(__dirname, "../../dist/spa")    // Fallback
  ];
  
  let distPath = possiblePaths[0]; // default
  
  // Find the path that actually exists
 
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      distPath = path;
      break;
    }
  }
  
  console.log("🔍 Using distPath:", distPath);
  app.use(express.static(distPath));

  // Handle React Router - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }

    res.sendFile(resolve(distPath, "index.html"));
  });

  return server;
}

// Export express app for Vite dev server
export function createApp() {
  return createExpressApp();
}
