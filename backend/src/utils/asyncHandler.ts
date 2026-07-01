import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFn = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps an async route handler so any thrown error is forwarded to Express's
 * next() error handler instead of causing an unhandled promise rejection.
 *
 * Typed as `any` on request params/body/query so strongly-typed controller
 * functions can be passed in without fighting Express's ParamsDictionary.
 */
export function asyncHandler(fn: AsyncFn) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: Request<any, any, any, any>, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
