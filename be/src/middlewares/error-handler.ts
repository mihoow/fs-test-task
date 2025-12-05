import { Request, Response, NextFunction } from 'express';
import { AppError } from '../interfaces/error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.status).json({
      message: err.message || 'Internal Server Error',
    });

    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
}
