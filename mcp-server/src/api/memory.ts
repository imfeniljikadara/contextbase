import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import {
  storeContext,
  getContext,
  deleteContext,
  listContextKeys,
  updateContext,
  searchContext,
} from '../services/memoryService';
import { authMiddleware } from '../middleware/auth';

export const memoryRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authMiddleware);

  app.post('/', async (req, reply) => {
    const schema = z.object({
      key: z.string(),
      value: z.any(),
      ttl: z.number().optional(),
    });

    const data = schema.parse(req.body);
    const userId = (req as any).user.id;
    await storeContext(userId, data.key, data.value, data.ttl);
    reply.send({ success: true });
  });

  app.get('/:key', async (req, reply) => {
    const userId = (req as any).user.id;
    const { key } = req.params as any;
    const value = await getContext(userId, key);
    reply.send({ value });
  });

  app.patch('/:key', async (req, reply) => {
    const userId = (req as any).user.id;
    const { key } = req.params as any;
    const { value } = req.body as any;
    await updateContext(userId, key, value);
    reply.send({ success: true });
  });

  app.delete('/:key', async (req, reply) => {
    const userId = (req as any).user.id;
    const { key } = req.params as any;
    await deleteContext(userId, key);
    reply.send({ success: true });
  });

  app.get('/', async (req, reply) => {
    const userId = (req as any).user.id;
    const keys = await listContextKeys(userId);
    reply.send({ keys });
  });

  app.get('/search/:query', async (req, reply) => {
    const userId = (req as any).user.id;
    const { query } = req.params as any;
    const results = await searchContext(userId, query);
    reply.send({ results });
  });

  // new POST based DELETE endpoint, This is useful for some clients that don't support DELETE method or when the key is too long for a URL
  app.post('/delete', async (req, reply) => {
    const schema = z.object({
      key: z.string(),
    });
    const data = schema.parse(req.body);
    const userId = (req as any).user.id;
    await deleteContext(userId, data.key);
    reply.send({ success: true, message: 'Deleted via POST' });
  });
};