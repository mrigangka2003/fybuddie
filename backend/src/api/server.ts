import http from 'http';
import app from './app';
import { connectDB, disconnectDB } from '../db/client';
import { connectRedis, disconnectRedis } from '../redis/client';
import { env } from '../config/env';
import { logger } from '../config/logger';

const server = http.createServer(app);

async function start(): Promise<void> {
  // Establish connections before accepting traffic
  await connectDB();
  await connectRedis();

  server.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Shutting down gracefully…`);

  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  await Promise.all([disconnectDB(), disconnectRedis()]);

  logger.info('Shutdown complete');
  process.exit(0);
}

// ── Graceful shutdown hooks ─────────────────────────────────────────────────
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

// ── Uncaught errors — log and exit so container restarts ────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err.message);
  process.exit(1);
});

start().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});

export { server };
