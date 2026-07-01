import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../config/logger';

function createClient(name: string): Redis {
  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: true,
    lazyConnect: true,
  });

  client.on('connect', () => logger.info(`Redis [${name}] connecting…`));
  client.on('ready', () => logger.info(`Redis [${name}] ready`));
  client.on('error', (err) => logger.error(`Redis [${name}] error`, err.message));
  client.on('close', () => logger.warn(`Redis [${name}] connection closed`));
  client.on('reconnecting', () => logger.warn(`Redis [${name}] reconnecting…`));

  return client;
}

// General-purpose client (caching, rate-limit store, etc.)
export const redisClient = createClient('general');

export async function connectRedis(): Promise<void> {
  await redisClient.connect();
}

export async function disconnectRedis(): Promise<void> {
  await redisClient.quit();
}
