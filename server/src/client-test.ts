/*
 * @Author: Marlon.M
 * @Email: maiguangyang@163.com
 * @Date: 2025-12-02 14:52:00
 */

/**
 * MCP SSE 客户端示例
 * 演示如何连接到 MCP 服务器的 SSE 端点
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import type {
  ListToolsResult,
  CompatibilityCallToolResult,
  ListResourcesResult,
  ReadResourceResult,
} from '@modelcontextprotocol/sdk/types.js';

/** 客户端配置 */
const CLIENT_CONFIG = {
  name: 'mcp-test-client',
  version: '1.0.0',
  defaultServerUrl: 'http://localhost:3000/sse',
} as const;

/**
 * 主函数：演示 MCP 客户端功能
 */
async function main(): Promise<void> {
  const serverUrl: string = process.env.SERVER_URL || CLIENT_CONFIG.defaultServerUrl;

  console.log(`正在连接到 MCP 服务器: ${serverUrl}`);

  // 创建客户端
  const client: Client = new Client(
    {
      name: CLIENT_CONFIG.name,
      version: CLIENT_CONFIG.version,
    },
    {
      capabilities: {},
    }
  );

  // 创建 SSE 传输
  const transport: SSEClientTransport = new SSEClientTransport(new URL(serverUrl));

  // 连接到服务器
  await client.connect(transport);
  console.log('✅ 已成功连接到 MCP 服务器\n');

  // 列出可用工具
  console.log('📋 列出可用工具:');
  const tools: ListToolsResult = await client.listTools();
  console.log(JSON.stringify(tools, null, 2));
  console.log('');

  // 调用 add 工具
  console.log('🔧 调用 add 工具 (5 + 3):');
  const result: CompatibilityCallToolResult = await client.callTool({
    name: 'add',
    arguments: {
      a: 5,
      b: 3,
    },
  });
  console.log(JSON.stringify(result, null, 2));
  console.log('');

  // 列出资源
  console.log('📚 列出可用资源:');
  const resources: ListResourcesResult = await client.listResources();
  console.log(JSON.stringify(resources, null, 2));
  console.log('');

  // 读取资源
  console.log('📖 读取 hello://greeting 资源:');
  const resource: ReadResourceResult = await client.readResource({
    uri: 'hello://greeting',
  });
  console.log(JSON.stringify(resource, null, 2));
  console.log('');

  console.log('✅ 测试完成！');

  // 关闭连接
  await client.close();
  process.exit(0);
}

// 启动测试并处理错误
main().catch((error: unknown): void => {
  console.error('❌ 错误:', error);
  process.exit(1);
});
