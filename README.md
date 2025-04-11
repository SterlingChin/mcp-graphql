# GraphQL MCP Server

A Model Context Protocol (MCP) server for GraphQL endpoints with introspection capabilities. This server allows AI models to interact with GraphQL APIs by providing schema introspection and query execution.

## Features

- GraphQL schema introspection
- Execute GraphQL queries with variables
- Communicate using the Model Context Protocol

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/graphql-mcp-server.git
cd graphql-mcp-server

# Install dependencies
npm install
```

## Usage

```bash
# create the MCP server
npm run build

```

To use in Claude Desktop, follow the instructions found here: [Model Context Protocol Desktop Users](https://modelcontextprotocol.io/quickstart/user)

## Configuration

By default, the server connects to the Star Wars GraphQL endpoint at `https://graphql.org/graphql`. To change this endpoint, modify the URLs in the `src/index.js` file.

## License

MIT 