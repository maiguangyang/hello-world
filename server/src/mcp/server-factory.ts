/*
 * @Author: Marlon.M
 * @Email: maiguangyang@163.com
 * @Date: 2025-12-03 19:31:44
 */
import { Server } from "@modelcontextprotocol/sdk/server/index";
import {
  CallToolRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types";
import { SERVER_CONFIG } from "../config";
import {
  handleCallTool,
  handleListResourceTemplates,
  handleListResources,
  handleListTools,
  handleReadResource,
} from "./handlers";

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
