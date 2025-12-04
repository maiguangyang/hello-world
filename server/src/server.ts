/*
 * @Author: Marlon.M
 * @Email: maiguangyang@163.com
 * @Date: 2025-12-03 08:26:32
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { URL } from "node:url";
import { SERVER_CONFIG, SSE_PATH, POST_PATH } from "./config";
import { handleSseRequest, handlePostMessage } from "./http/handlers";

/**
 * Get port from environment or use default
 */
const portEnv = Number(process.env.PORT ?? SERVER_CONFIG.defaultPort);
const port = Number.isFinite(portEnv) ? portEnv : SERVER_CONFIG.defaultPort;

/**
 * Create HTTP server
 */
const httpServer = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    if (!req.url) {
      res.writeHead(400).end("Missing URL");
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    // Handle CORS preflight
    if (
      req.method === "OPTIONS" &&
      (url.pathname === SSE_PATH || url.pathname === POST_PATH)
    ) {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type",
      });
      res.end();
      return;
    }

    // Handle SSE connection
    if (req.method === "GET" && url.pathname === SSE_PATH) {
      await handleSseRequest(res);
      return;
    }

    // Handle POST messages
    if (req.method === "POST" && url.pathname === POST_PATH) {
      await handlePostMessage(req, res, url);
      return;
    }

    // 404 for unknown routes
    res.writeHead(404).end("Not Found");
  }
);

/**
 * Handle client errors
 */
httpServer.on("clientError", (err: Error, socket) => {
  console.error("HTTP client error", err);
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

/**
 * Start server
 */
httpServer.listen(port, () => {
  console.log(`${SERVER_CONFIG.name} v${SERVER_CONFIG.version} listening on http://localhost:${port}`);
  console.log(`  SSE stream: GET http://localhost:${port}${SSE_PATH}`);
  console.log(`  Message post endpoint: POST http://localhost:${port}${POST_PATH}?sessionId=...`);
});
