import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db/postgres';
import { authMiddleware } from '../middleware/auth';

export const logsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authMiddleware);

  app.get('/', async (req, reply) => {
    const userId = (req as any).user.id;

    const logs = await prisma.log.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    const formatted = logs.map(log => ({
      action: log.action,
      key: log.key,
      time: new Date(log.timestamp).toLocaleString(),
    }));

    return reply.send({
      userId,
      count: logs.length,
      logs: formatted,
    });
  });
};