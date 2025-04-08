import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = payload;
  } catch (err) {
    reply.status(401).send({ error: 'Invalid token' });
  }
}
