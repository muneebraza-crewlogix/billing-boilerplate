// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '@/config/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  // Log the full error
  logger.error(`${req.method} ${req.originalUrl} → ${status}`, {
    message: err.message,
    stack: err.stack,
  });

  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
}
