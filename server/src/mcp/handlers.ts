/*
 * @Author: Marlon.M
 * @Email: maiguangyang@163.com
 * @Date: 2025-12-03 19:31:40
 */
import type {
  CallToolRequest,
  ListResourceTemplatesRequest,
  ListResourcesRequest,
  ListToolsRequest,
  ReadResourceRequest,
} from "@modelcontextprotocol/sdk/types";
import {
  resources,
  resourceTemplates,
  tools,
  toolInputParser,
  widgetsById,
  widgetsByUri,
  widgetMeta,
} from "../widgets/index";

/**
 * Handle resources/list request
 */
export async function handleListResources(_request: ListResourcesRequest) {
  return { resources };
}

/**
 * Handle resources/read request
 */
export async function handleReadResource(request: ReadResourceRequest) {
  const widget = widgetsByUri.get(request.params.uri);

  if (!widget) {
    throw new Error(`Unknown resource: ${request.params.uri}`);
  }

  return {
    contents: [
      {
        uri: widget.templateUri,
        mimeType: "text/html+skybridge",
        text: widget.html,
        _meta: widgetMeta(widget),
      },
    ],
  };
}

/**
 * Handle resources/templates/list request
 */
export async function handleListResourceTemplates(
  _request: ListResourceTemplatesRequest
) {
  return {
    resourceTemplates: [], // Return empty array since we don't use resource templates
  };
}

/**
 * Handle tools/list request
 */
export async function handleListTools(_request: ListToolsRequest) {
  return { tools };
}

/**
 * Handle tools/call request
 */
export async function handleCallTool(request: CallToolRequest) {
  const widget = widgetsById.get(request.params.name);

  if (!widget) {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const args = toolInputParser.parse(request.params.arguments ?? {});

  return {
    content: [
      {
        type: "text" as const,
        text: widget.responseText,
      },
    ],
    structuredContent: {
      pizzaTopping: args.pizzaTopping,
    },
    _meta: widgetMeta(widget),
  };
}
