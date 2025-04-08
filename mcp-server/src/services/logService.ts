import { prisma } from '../db/postgres';

export async function logAction(userId: string, action: string, key: string) {
  try {
    await prisma.log.create({
      data: {
        userId,
        action,
        key,
      },
    });
  } catch (err) {
    console.error('❌ Failed to log action:', err);
  }
}