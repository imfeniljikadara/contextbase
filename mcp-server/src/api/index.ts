import { FastifyInstance } from 'fastify';
import { memoryRoutes } from './memory';
import { authRoutes } from './auth';
import { logsRoutes } from './logs';

export function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(memoryRoutes, { prefix: '/api/memory' });
  app.register(logsRoutes, { prefix: '/api/logs' });
}
