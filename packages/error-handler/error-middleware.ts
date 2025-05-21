import { Request, Response, NextFunction } from 'express';
import { AppError } from './index'; // adjust path as needed

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    console.log(`Error ${req.method} ${req.url} - ${err.message}`)
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.details && {details : err.details})
    });
  }

  console.error('Unexpected Error:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};
