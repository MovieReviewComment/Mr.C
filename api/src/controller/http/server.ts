import express from 'express';
import http from 'http';
import requestIp from 'request-ip';
import { Logger } from 'winston';

import { DevV1Controller } from '@controller/http/dev/dev.v1.controller';
import { Middleware } from '@controller/http/middleware';
import { HttpConfig } from '@controller/http/types';

export class HttpServer {
  middleware: Middleware;
  server!: http.Server;

  constructor(
    private readonly logger: Logger,
    private readonly config: HttpConfig
  ) {
    this.middleware = new Middleware(this.logger);
  }

  public start = (): Promise<void> => {
    return new Promise((resolve) => {
      const app = express();
      app.use(requestIp.mw());
      app.use(this.middleware.accessLog);
      app.use('/api', this.getRouters());
      app.use(this.middleware.handleError);
      app.use(this.middleware.handleNotFoundRoute);

      this.server = app.listen(this.config.port, () => {
        this.logger.info(`HTTP server started on ${this.config.port}`);
        resolve();
      });
    });
  };

  public close = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.logger.info('HTTP server closed');
          resolve();
        }
      });
    });
  };

  private getRouters = (): express.Router[] => {
    const routers = [new DevV1Controller(this.logger).routes()];
    return routers;
  };
}
