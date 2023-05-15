import express from 'express';
import http from 'http';
import { Logger } from 'winston';

import { HttpConfig } from '@src/controller/http/types';

import { DevV1Controller } from '@controller/http/dev/dev.v1.controller';

export class HttpServer {
  server!: http.Server;

  constructor(
    private readonly logger: Logger,
    private readonly config: HttpConfig
  ) {}

  public start = (): Promise<void> => {
    return new Promise((resolve) => {
      const app = express();
      app.use('/api', this.getRouters());
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
