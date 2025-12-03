import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import type { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

/**
 * Widget definition interface
 */
export interface PizzazWidget {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  responseText: string;
}

/**
 * SSE session record
 */
export interface SessionRecord {
  server: Server;
  transport: SSEServerTransport;
}
