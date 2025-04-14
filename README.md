# ContextBase (MCP Server)

ContextBase – A Model Context Protocol (MCP) server for AI agents, assistants, and apps which store, retrieve, and manage per-user context using a simple API.

## Features

- **Authentication System**: Secure user authentication using JWT and bcrypt
- **Memory Management**: API endpoints for storing and retrieving memory data
- **Logging System**: Comprehensive logging of user actions
- **Modern Tech Stack**: Built with TypeScript, Fastify, Prisma ORM
- **Database Integration**: PostgreSQL for persistent storage
- **Caching**: Redis for high-performance caching

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Redis
- Docker and Docker Compose (optional, for containerized deployment)

## Installation

1. Clone the repository
   ```
   git clone https://github.com/imfeniljikadara/contextbase.git
   cd mcp
   ```

2. Install dependencies
   ```
   cd mcp-server
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the `mcp-server` directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/mcp
   REDIS_HOST=localhost
   REDIS_PORT=6379
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Run database migrations
   ```
   npx prisma migrate dev
   ```

5. Start the server
   ```
   npm start
   ```

   Or using Docker:
   ```
   docker-compose up
   ```

## API Endpoints

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login and get JWT token

- **Memory**
  - `GET /api/memory` - Get all memories
  - `POST /api/memory` - Create a new memory
  - `GET /api/memory/:id` - Get a specific memory
  - `PUT /api/memory/:id` - Update a memory
  - `DELETE /api/memory/:id` - Delete a memory

- **Logs**
  - `GET /api/logs` - Get user action logs

## Development

- Run in development mode:
  ```
  npm run dev
  ```

- Run tests:
  ```
  npm test
  ```

## Project Structure

```
mcp-server/
├── prisma/              # Database schema and migrations
├── src/
│   ├── api/             # API routes and controllers
│   ├── config/          # Configuration files
│   ├── db/              # Database connections (PostgreSQL, Redis)
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── scripts/             # Helper scripts
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

## License

MIT
