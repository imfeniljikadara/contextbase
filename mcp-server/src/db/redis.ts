import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT);
const redisPassword = process.env.REDIS_PASSWORD;

console.log('Redis config:', {
  host: redisHost,
  port: redisPort,
});

// Validate environment early
if (!redisHost || isNaN(redisPort)) {
  throw new Error('Missing or invalid Redis configuration');
}

// Connect Redis safely
const redis = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: {},
  maxRetriesPerRequest: 5,
  retryStrategy(times) {
    if (times >= 5) return null; // stop retrying after 5 attempts
    return Math.min(times * 500, 3000); // retry delay
  },
});

let hasConnected = false;

redis.on('connect', () => {
  if (!hasConnected) {
    console.log('Redis connected');
    hasConnected = true;
  }
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message);
});

export default redis;

export async function connectRedis() {
  try {
    await redis.ping(); // Check connection
    console.log('Redis ping successful');
  } catch (err: any) {
    console.error('Redis ping failed:', err.message);
    process.exit(1); // Hard exit on startup failure
  }
}
