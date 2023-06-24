import express from 'express';
import http from 'http';
import { Logger } from 'winston';

import { DevV1Controller } from '@controller/http/dev/dev.v1.controller';
import { HealthController } from '@controller/http/health/health.controller';
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
      app.disable('x-powered-by');
      app.set('trust proxy', 0);
      app.use('/api', this.middleware.accessLog);
      app.use('/api', this.getApiRouters());
      app.use('/healthz', this.getHealthRouters());
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

  private getApiRouters = (): express.Router[] => {
    const routers = [new DevV1Controller(this.logger).routes()];
    return routers;
  };

  private getHealthRouters = (): express.Router[] => {
    const routers = [new HealthController().routes()];
    return routers;
  };
}
