import type { Resource, ResourceTemplate, Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { PizzazWidget } from "../types.js";
import { readWidgetHtml } from "./loader.js";

/**
 * Generate widget metadata for MCP
 */
export function widgetMeta(widget: PizzazWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": true,
    "openai/resultCanProduceWidget": true,
  } as const;
}

/**
 * Widget definitions
 */
export const widgets: PizzazWidget[] = [
  {
    id: "pizza-list",
    title: "Show Pizza List",
    templateUri: "ui://widget/pizza-list.html",
    invoking: "Hand-tossing a list",
    invoked: "Served a fresh list",
    html: readWidgetHtml("index"),
    responseText: "Rendered a pizza list!",
  },
];

/**
 * Widget lookup maps
 */
export const widgetsById = new Map<string, PizzazWidget>();
export const widgetsByUri = new Map<string, PizzazWidget>();

widgets.forEach((widget) => {
  widgetsById.set(widget.id, widget);
  widgetsByUri.set(widget.templateUri, widget);
});

/**
 * Tool input schema
 */
export const toolInputSchema = {
  type: "object",
  properties: {
    pizzaTopping: {
      type: "string",
      description: "Topping to mention when rendering the widget.",
    },
  },
  required: ["pizzaTopping"],
  additionalProperties: false,
} as const;

/**
 * Tool input parser
 */
export const toolInputParser = z.object({
  pizzaTopping: z.string(),
});

/**
 * MCP tools list
 */
export const tools = widgets.map((widget) => ({
  name: widget.id,
  description: widget.title,
  inputSchema: toolInputSchema,
  title: widget.title,
  _meta: widgetMeta(widget),
  // To disable the approval prompt for the widgets
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
}));

/**
 * MCP resources list
 */
export const resources: Resource[] = widgets.map((widget) => ({
  uri: widget.templateUri,
  name: widget.title,
  description: `${widget.title} widget markup`,
  mimeType: "text/html+skybridge",
  _meta: widgetMeta(widget),
}));

/**
 * MCP resource templates list
 */
export const resourceTemplates: ResourceTemplate[] = widgets.map((widget) => ({
  uriTemplate: widget.templateUri,
  name: widget.title,
  description: `${widget.title} widget markup`,
  mimeType: "text/html+skybridge",
  _meta: widgetMeta(widget),
}));
