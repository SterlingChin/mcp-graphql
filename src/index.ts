import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fetch from 'node-fetch';

const GraphQLIntrospectionQuery = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
      }
    }
  }
`;

interface GraphQLSchema {
  queryType: { name: string };
  mutationType?: { name: string };
  subscriptionType?: { name: string };
  types: any[];
  directives: any[];
}

class GraphQLMCPServer extends McpServer {
  private schema: GraphQLSchema | null = null;
  private transport: StdioServerTransport;
  private graphqlEndpoint: string = 'https://graphql.org/graphql';

  constructor(endpoint?: string) {
    super({
      name: 'graphql-mcp',
      version: '1.0.0',
      description: 'MCP server for GraphQL endpoints with introspection capabilities',
      capabilities: {
        resources: {},
        tools: {},
      },
    });
    
    if (endpoint) {
      this.graphqlEndpoint = endpoint;
    }
    
    this.transport = new StdioServerTransport();
  }

  async initialize(): Promise<void> {
    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: GraphQLIntrospectionQuery,
        }),
      });
      
      const result = await response.json() as any;
      this.schema = result.data.__schema;
      console.error('Successfully introspected GraphQL schema');
    } catch (error) {
      console.error('Failed to introspect GraphQL schema:', error);
      throw error;
    }
  }

  async start(): Promise<void> {
    await super.connect(this.transport);
    console.error('MCP server connected to transport');
  }
}

// Create and start the server
const server = new GraphQLMCPServer();

// Register a tool for executing GraphQL queries
server.tool(
  'execute-query',
  'Execute a GraphQL query against the endpoint',
  {
    query: z.string().describe('The GraphQL query to execute'),
    variables: z.record(z.any()).optional().describe('Optional variables for the query'),
  },
  async ({ query, variables }) => {
    try {
      const response = await fetch('https://graphql.org/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: variables || {},
        }),
      });
      
      const result = await response.json() as any;
      
      if (result.errors) {
        return {
          content: [{
            type: 'text',
            text: `GraphQL Error: ${JSON.stringify(result.errors, null, 2)}`,
          }],
        };
      }
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result.data, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        content: [{
          type: 'text',
          text: `Error executing query: ${error.message}`,
        }],
      };
    }
  }
);

server.initialize().then(() => {
  server.start();
  console.error('MCP server started');
}).catch(error => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});