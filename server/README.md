# Hello MCP Server

一个使用 `@modelcontextprotocol/sdk` 实现的 MCP 服务器，支持 **SSE (Server-Sent Events)** 传输方式。

## 功能

这个 MCP 服务器提供了以下功能：

### 工具 (Tools)

- **add**: 将两个数字相加
  - 参数: `a` (number), `b` (number)
  - 返回: 两数之和的文本描述

### 资源 (Resources)

- **hello://greeting**: 一个简单的问候消息资源

## 启动服务器

```bash
# 使用 yarn
yarn start

# 或使用 npm
npm start

# 自定义端口
PORT=8080 yarn start
```

服务器启动后，会在以下端点提供服务：

- **主页**: `http://localhost:3000/` - 服务器信息页面
- **SSE 端点**: `http://localhost:3000/sse` - MCP 协议通信端点
- **健康检查**: `http://localhost:3000/health` - 服务器状态检查

## 外部访问

### 通过 HTTP 访问

服务器使用 **SSE (Server-Sent Events)** 传输方式，可以通过 HTTP 协议进行外部访问：

```bash
# 测试健康检查
curl http://localhost:3000/health

# 访问主页
open http://localhost:3000
```

### MCP 客户端连接

支持 MCP 协议的客户端可以连接到 SSE 端点：

```
http://localhost:3000/sse
```

### 测试 SSE 连接

```bash
# 使用 curl 测试 SSE 连接
curl -N http://localhost:3000/sse
```

## 配置 Claude Desktop (可选)

如果需要在 Claude Desktop 中使用，在 `~/Library/Application Support/Claude/claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "hello-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "/Users/marlon.m/ai/app/hello-word/server/src/server.ts"
      ],
      "env": {
        "PORT": "3000"
      }
    }
  }
}
```

## 远程访问

### 通过网络访问

1. 确保防火墙允许端口 3000
2. 获取本机 IP 地址：
   ```bash
   ipconfig getifaddr en0
   ```
3. 其他设备可通过 `http://<your-ip>:3000/sse` 访问

### 部署到云服务器

可以部署到任何支持 Node.js 的云服务器（如 AWS、GCP、Azure、Vercel 等），通过公网 URL 访问。

## 使用示例

启动服务器后，MCP 客户端可以：

1. **列出可用工具**: 查看 `add` 工具
2. **调用工具**: 使用 `add` 工具计算两个数字的和
3. **列出资源**: 查看 `hello://greeting` 资源
4. **读取资源**: 获取问候消息内容

## 项目结构

```
server/
├── src/
│   └── server.ts       # MCP 服务器实现 (SSE 传输)
├── dist/               # 编译输出目录
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
└── README.md          # 本文档
```

## 技术栈

- **TypeScript**: 类型安全的 JavaScript
- **@modelcontextprotocol/sdk**: MCP 官方 SDK
- **SSE (Server-Sent Events)**: HTTP 流式传输协议
- **Node.js HTTP 服务器**: 内置 HTTP 模块
- **tsx**: TypeScript 执行器

## 扩展

你可以通过以下方式扩展这个服务器：

1. **添加更多工具**: 在 `ListToolsRequestSchema` 和 `CallToolRequestSchema` 中注册新工具
2. **添加更多资源**: 在 `ListResourcesRequestSchema` 和 `ReadResourceRequestSchema` 中注册新资源
3. **添加提示词 (Prompts)**: 使用 `ListPromptsRequestSchema` 和 `GetPromptRequestSchema`
4. **添加 CORS 支持**: 允许跨域请求
5. **添加身份验证**: 保护 MCP 端点安全

## 传输方式对比

| 方式 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **stdio** | 本地进程通信 | 简单、快速 | 无法远程访问 |
| **SSE** | HTTP 可访问 | 可远程访问、标准 HTTP | 单向通信（服务端→客户端） |
| **WebSocket** | 需要双向通信 | 双向实时通信 | 更复杂 |

当前实现使用 **SSE** 方式，支持通过 HTTP 协议进行外部访问，适合需要远程访问的场景。
