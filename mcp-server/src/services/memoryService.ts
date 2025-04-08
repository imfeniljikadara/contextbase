import { logAction } from './logService';
import redis from '../db/redis';

export async function storeContext(userId: string, key: string, value: any, ttl?: number) {
  const namespacedKey = `${userId}:${key}`;
  await redis.set(namespacedKey, JSON.stringify(value));
  if (ttl) await redis.expire(namespacedKey, ttl);
  await logAction(userId, 'create', key);
}

export async function getContext(userId: string, key: string) {
  const namespacedKey = `${userId}:${key}`;
  const value = await redis.get(namespacedKey);
  return value ? JSON.parse(value) : null;
}

export async function updateContext(userId: string, key: string, newValue: any) {
  const namespacedKey = `${userId}:${key}`;
  const exists = await redis.exists(namespacedKey);
  if (exists) await redis.set(namespacedKey, JSON.stringify(newValue));
  else throw new Error('Context not found');
  await logAction(userId, 'update', key);
}

export async function deleteContext(userId: string, key: string) {
  const namespacedKey = `${userId}:${key}`;
  await redis.del(namespacedKey);
  await logAction(userId, 'delete', key);
}

export async function listContextKeys(userId: string): Promise<string[]> {
  const keys = await redis.keys(`${userId}:*`);
  return keys.map((k) => k.split(':')[1]);
}

export async function searchContext(userId: string, query: string) {
  const keys = await redis.keys(`${userId}:*`);
  const results: { key: string; value: any }[] = [];

  for (const key of keys) {
    const value = await redis.get(key);
    if (value?.toLowerCase().includes(query.toLowerCase())) {
      results.push({ key: key.split(':')[1], value: JSON.parse(value) });
    }
  }

  return results;
}
