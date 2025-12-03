import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { SERVER_CONFIG } from "../config.js";
import {
  handleCallTool,
  handleListResourceTemplates,
  handleListResources,
  handleListTools,
  handleReadResource,
} from "./handlers.js";

/**
 * Create and configure MCP server instance
 */
export function createMcpServer(): Server {
  const server = new Server(
    {
      name: SERVER_CONFIG.name,
      version: SERVER_CONFIG.version,
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // Register request handlers
  server.setRequestHandler(ListResourcesRequestSchema, handleListResources);
  server.setRequestHandler(ReadResourceRequestSchema, handleReadResource);
  server.setRequestHandler(
    ListResourceTemplatesRequestSchema,
    handleListResourceTemplates
  );
  server.setRequestHandler(ListToolsRequestSchema, handleListTools);
  server.setRequestHandler(CallToolRequestSchema, handleCallTool);

  return server;
}
