/*
 * @Author: Marlon.M
 * @Email: maiguangyang@163.com
 * @Date: 2025-12-03 19:31:12
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Server configuration
 */
export const SERVER_CONFIG = {
  name: "hello-world",
  version: "0.1.0",
  defaultPort: 8000,
} as const;

/**
 * Directory paths
 */
export const ROOT_DIR = path.resolve(__dirname, "..", "..");
export const ASSETS_DIR = path.resolve(ROOT_DIR, "web", "dist");

/**
 * SSE endpoint paths
 */
export const SSE_PATH = "/mcp";
export const POST_PATH = "/mcp/messages";
