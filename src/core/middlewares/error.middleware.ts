import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if ('statusCode' in err && typeof err.statusCode === 'number') {
    const { statusCode, message, ...rest } = err;
    res.status(statusCode).json({
      success: false,
      error: message,
      ...rest,
    });

    return;
  }

  logger.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });

  return;
};
