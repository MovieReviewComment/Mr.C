import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

export class Middleware {
  constructor(public logger: Logger) {}

  public accessLog = (req: Request, res: Response, next: NextFunction) => {
    const start = new Date().getTime();
    res.on('finish', () => {
      const end = new Date().getTime();
      this.logger.http('Access log', {
        method: req.method,
        url: req.originalUrl,
        addr: req.clientIp,
        proto: `${req.protocol}/${req.httpVersion}`,
        contentLength: req.headers['content-length'],
        userAgent: req.headers['user-agent'],
        statusCode: res.statusCode,
        bodyBytes: res.getHeader('Content-Length'),
        elapsedMs: end - start,
        contentType: res.getHeader('Content-Type')?.toString().split(';')[0],
        error: res.locals.error?.message
      });
    });

    next();
  };
}
