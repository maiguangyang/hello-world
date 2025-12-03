import type { IncomingMessage, ServerResponse } from "node:http";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { POST_PATH } from "../config.js";
import { createMcpServer } from "../mcp/server-factory.js";
import { addSession, getSession, removeSession } from "./session-manager.js";

/**
 * Handle SSE connection request (GET /mcp)
 */
export async function handleSseRequest(res: ServerResponse): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const server = createMcpServer();
  const transport = new SSEServerTransport(POST_PATH, res);
  const sessionId = transport.sessionId;

  addSession(sessionId, { server, transport });

  transport.onclose = async () => {
    removeSession(sessionId);
    // Don't call server.close() here as it creates infinite recursion
    // The transport is already being closed, which will clean up the server
  };

  transport.onerror = (error) => {
    console.error("SSE transport error", error);
  };

  try {
    await server.connect(transport);
  } catch (error) {
    removeSession(sessionId);
    console.error("Failed to start SSE session", error);
    if (!res.headersSent) {
      res.writeHead(500).end("Failed to establish SSE connection");
    }
  }
}

/**
 * Handle POST message request (POST /mcp/messages)
 */
export async function handlePostMessage(
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    res.writeHead(400).end("Missing sessionId query parameter");
    return;
  }

  const session = getSession(sessionId);

  if (!session) {
    res.writeHead(404).end("Unknown session");
    return;
  }

  try {
    await session.transport.handlePostMessage(req, res);
  } catch (error) {
    console.error("Failed to process message", error);
    if (!res.headersSent) {
      res.writeHead(500).end("Failed to process message");
    }
  }
}
