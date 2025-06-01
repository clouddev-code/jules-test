import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import fetch from 'node-fetch';

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

server.resource(
  'url-fetch',
  'url-fetch://<url>',
  async (uri, params) => {
    const urlToFetch = decodeURIComponent(params.url);
    try {
      // Validate the URL structure
      new URL(urlToFetch);
    } catch (error) {
      return {
        containers: [{
          uri: uri.href,
          text: `Invalid URL provided: ${error.message}`
        }]
      };
    }

    try {
      const response = await fetch(urlToFetch);
      if (!response.ok) {
        return {
          containers: [{
            uri: uri.href,
            text: `Error fetching URL: ${response.status} ${response.statusText}`
          }]
        };
      }
      const textContent = await response.text();
      return {
        containers: [{
          uri: uri.href,
          text: textContent
        }]
      };
    } catch (error) {
      return {
        containers: [{
          uri: uri.href,
          text: `Error fetching URL: ${error.message}`
        }]
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

console.error('MCP Server started successfully');
