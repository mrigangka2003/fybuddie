import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../utils/errors';
import { logger } from '../../config/logger';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    res.status(422).json({ success: false, message: 'Validation error', errors } satisfies ErrorResponse);
    return;
  }

  // Known operational errors
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error('Non-operational AppError', { message: err.message, stack: err.stack });
    }
    res.status(err.statusCode).json({ success: false, message: err.message } satisfies ErrorResponse);
    return;
  }

  // Unknown errors — don't leak internals
  logger.error('Unhandled error', { err });
  res.status(500).json({ success: false, message: 'Internal server error' } satisfies ErrorResponse);
}
