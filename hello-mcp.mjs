import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'hello-mcp',
  version: '1.0.0'
});

server.resource(
  'hello',
  'hello://world',
  async ( uri ) => ({
    containers: [{
     uri: uri.href,
     text: 'Hello, MCP World!'
    }]
 })
);

const transport = new StdioServerTransport();
await server.connect(transport);

console.error('MCP Server started successfully');
