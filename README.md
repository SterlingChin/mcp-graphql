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
# Start the server
npm start

# For development with auto-reload
npm run dev
```

## Development

This project is built with TypeScript. To build the project:

```bash
npm run build
```

## Configuration

By default, the server connects to the GraphQL endpoint at `https://graphql.org/graphql`. To change this endpoint, modify the URLs in the `src/index.js` file.

## License

MIT 