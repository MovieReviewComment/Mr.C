import { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { Logger } from 'winston';

import {
  CustomError,
  InternalErrorType,
  NotFoundErrorType
} from '@controller/http/errors';

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

  public handleError = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let customError: CustomError;
    if (err instanceof CustomError) {
      customError = err;
    } else {
      customError = new CustomError(
        InternalErrorType.UNEXPECTED,
        'Unexpected error happened'
      );
    }

    this.respondError(customError, res);
  };

  public handleNotFoundRoute = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.respondError(
      new CustomError(
        NotFoundErrorType.ROUTE_NOT_FOUND,
        'No matching route found'
      ),
      res
    );
  };

  private respondError = (error: CustomError, res: Response) => {
    let statusCode = 500;
    if (error.type in NotFoundErrorType) {
      statusCode = 404;
    } else if (error.type in InternalErrorType) {
      statusCode = 500;
    }

    res.locals.error = error;
    res.status(statusCode);
    res.send({
      type: error.type,
      message: error.message
    });
  };
}
