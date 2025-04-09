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
  console.log('JWT Secret:', process.env.JWT_SECRET ? '[loaded]' : '[missing]');
  console.log('PostgreSQL:', process.env.DATABASE_URL || '[missing]');
  console.log('Redis:', {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });
  console.log('Server Port:', process.env.PORT || 3000);
  console.log('-----------------------------------');

  await connectDB();
  await connectRedis();
  registerRoutes(app);

  await app.register(cors, {
    origin: "*", //You can restrict this later if needed
  });

  await app.listen({
    port: Number(process.env.PORT) || 3000,
    host: '0.0.0.0', //Required for Render
  });

  console.log('Your ContextBase is running!');
}

startServer();
