import Redis from 'ioredis';

console.log('Redis config:', {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT), // this is likely the issue
});

export default redis;

export async function connectRedis() {
  redis.on('connect', () => console.log('Redis connected'));
  redis.on('error', (err) => console.error('Redis error:', err));
}