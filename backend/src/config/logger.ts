import { env } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const activeLevel: LogLevel = env.NODE_ENV === 'production' ? 'info' : 'debug';

function log(level: LogLevel, message: string, meta?: unknown): void {
  if (LEVELS[level] < LEVELS[activeLevel]) return;

  const entry = {
    level,
    time: new Date().toISOString(),
    msg: message,
    ...(meta !== undefined ? { meta } : {}),
  };

  const output = JSON.stringify(entry);

  if (level === 'error') {
    console.error(output);
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  debug: (msg: string, meta?: unknown) => log('debug', msg, meta),
  info: (msg: string, meta?: unknown) => log('info', msg, meta),
  warn: (msg: string, meta?: unknown) => log('warn', msg, meta),
  error: (msg: string, meta?: unknown) => log('error', msg, meta),
};
