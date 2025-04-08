import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import { registerRoutes } from './api';
import { connectDB } from './db/postgres';
import { connectRedis } from './db/redis';
import cors from '@fastify/cors';

const app = Fastify();

async function startServer() {
  console.log('ContextBase Config:');
  console.log('JWT Secret:', process.env.JWT_SECRET ? '[loaded ✅]' : '[missing ❌]');
  console.log('PostgreSQL:', process.env.DATABASE_URL || '[missing ❌]');
  console.log('Redis:', {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });
  console.log('Server Port:', process.env.PORT || 3000);
  console.log('-----------------------------------');

  await connectDB();
  await connectRedis();
  registerRoutes(app);

  app.listen({ port: Number(process.env.PORT) || 3000 }, () => {
    console.log('Your ContextBase is running!');
  });

  await app.register(cors, {
    origin: "*", // or "http://localhost:3001" for stricter config
  });
}

startServer();
