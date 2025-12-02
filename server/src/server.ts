/*
 * @Author: Marlon.M
 * @Email: maiguangyang@163.com
 * @Date: 2025-12-02 14:15:16
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import http from 'http';
import type { IncomingMessage, ServerResponse } from 'http';
import { fileURLToPath, URL } from 'url';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url); // 获取当前模块的绝对路径
const __dirname = dirname(__filename);  // 获取当前文件所在的目录

// 计算目标文件的路径
const filePath = join(__dirname, '../../web', 'dist', 'index.html');

const HTML = readFileSync(filePath, 'utf8');

/** 服务器配置常量 */
const SERVER_CONFIG = {
  name: 'hello-mcp-server',
  defaultPort: 3000,
  version: "1.0.0"
} as const;

/** Add 工具的输入参数接口 */
interface AddToolArguments {
  a: number;
  b: number;
}

/** 健康检查响应接口 */
interface HealthCheckResponse {
  status: 'ok' | 'error';
  server: string;
  version: string;
}

/** 错误响应接口 */
interface ErrorResponse {
  error: string;
}

// 创建 MCP 服务器实例
const server = new McpServer(
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


// 注册 ui://widget/kanban-board.html 资源
server.registerResource(
  'hello-world-widget',
  'ui://widget/hello-world.html',
  {
    description: '一个简单的问候消息',
    mimeType: 'text/html+skybridge',
  },
  async (uri) => {
    return {
      contents: [
        {
          uri: uri.toString(),
          mimeType: 'text/html+skybridge',
          text: HTML.trim(),
        },
      ],
    };
  }
);

// 注册动态资源模板
server.registerResource(
  'hello-world-template', // 资源名称
  new ResourceTemplate(
    'hello-world://{id}', // URI 模板，{id} 是变量
    { list: undefined } // list 回调，如果不需要列出所有可能的资源，可以传 undefined
  ),
  {
    description: '用户个人资料',
    mimeType: "text/html+skybridge",
  },
  // 读取回调：注意这里多了一个 variables 参数
  async (uri, variables) => {
    return {
      contents: [
        {
          uri: uri.toString(),
          mimeType: "text/html+skybridge",
          text: HTML.trim(),
        },
      ],
    };
  }
);

// 注册 add 工具
server.registerTool(
  'hello-world',
  {
    description: 'show hello world',
    inputSchema: {},
    _meta: { "openai/outputTemplate": "ui://widget/hello-world.html" },
  },
  async () => {
    return {
      content: [
        {
          type: 'text',
          text: `Hello World`,
        },
      ],
    };
  }
);

// 创建传输层(使用无状态模式)
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined, // 无状态模式
});

/**
 * 处理 HTTP 请求
 */
async function handleHttpRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const url: URL = new URL(req.url!, `http://${req.headers.host}`);

  // 处理 MCP 端点 (支持 POST 和 GET)
  if (url.pathname === '/mcp' || url.pathname === '/sse') {
    console.error(`新的 MCP 请求来自: ${req.socket.remoteAddress}`);

    // 使用 StreamableHTTPServerTransport 处理请求
    await transport.handleRequest(req, res);
    return;
  }

  // 处理健康检查端点
  if (url.pathname === '/health') {
    const response: HealthCheckResponse = {
      status: 'ok',
      server: SERVER_CONFIG.name,
      version: SERVER_CONFIG.version,
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
    return;
  }

  // 处理根路径
  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hello MCP Server</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>🚀 Hello MCP Server</h1>
        <p>MCP 服务器正在运行中</p>
        <ul>
          <li><strong>MCP 端点:</strong> <a href="/mcp">/mcp</a> (POST/GET)</li>
          <li><strong>SSE 端点:</strong> <a href="/sse">/sse</a> (兼容旧版)</li>
          <li><strong>健康检查:</strong> <a href="/health">/health</a></li>
        </ul>
        <h2>可用功能</h2>
        <ul>
          <li><strong>工具:</strong> add (将两个数字相加)</li>
          <li><strong>资源:</strong> ui://widget/kanban-board.html (问候消息)</li>
        </ul>
      </body>
      </html>
    `);
    return;
  }

  // 404 处理
  const errorResponse: ErrorResponse = { error: 'Not Found' };
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(errorResponse));
}

/**
 * 启动服务器
 */
async function main(): Promise<void> {
  const PORT: number = Number(process.env.PORT) || SERVER_CONFIG.defaultPort;

  // 连接服务器到传输层
  await server.connect(transport);
  console.error('✅ MCP 服务器已连接到传输层');

  const httpServer: http.Server = http.createServer(
    async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      try {
        await handleHttpRequest(req, res);
      } catch (error) {
        console.error('请求处理错误:', error);
        if (!res.headersSent) {
          const errorResponse: ErrorResponse = {
            error: error instanceof Error ? error.message : 'Internal Server Error',
          };
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(errorResponse));
        }
      }
    }
  );

  httpServer.listen(PORT, (): void => {
    console.error(`🚀 MCP 服务器已启动`);
    console.error(`- HTTP 服务器: http://localhost:${PORT}`);
    console.error(`- MCP 端点: http://localhost:${PORT}/mcp`);
    console.error(`- SSE 端点: http://localhost:${PORT}/sse (兼容旧版)`);
    console.error(`- 健康检查: http://localhost:${PORT}/health`);
  });
}

// 启动服务器并处理错误
main().catch((error: unknown): void => {
  console.error('服务器错误:', error);
  process.exit(1);
});
