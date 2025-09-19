import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../utils';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  logRequest(req.method, req.path);
  next();
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('❌ 服务器错误:', err.message);

  if (!res.headersSent) {
    res.status(500).json({
      error: {
        message: err.message || '内部服务器错误',
        type: 'server_error'
      }
    });
  }
}