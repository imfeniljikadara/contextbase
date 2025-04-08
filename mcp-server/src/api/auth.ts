import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authRoutes: FastifyPluginAsync = async (app) => {
  // Signup Route
  app.post('/signup', async (req, reply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const data = schema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });

    if (existing) {
      return reply.status(400).send({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });

    return reply.send({ success: true, user: { id: user.id, email: user.email } });
  });

  // Login Route
  app.post('/login', async (req, reply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const data = schema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return reply.send({ token });
  });
};
