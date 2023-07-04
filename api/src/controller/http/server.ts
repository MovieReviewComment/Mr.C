import express from 'express';
import { Express } from 'express-serve-static-core';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import { Tspec, TspecDocsMiddleware } from 'tspec';
import { Logger } from 'winston';

import apiSpecification from '@root/generate/openapi.json';

import { DevV1Controller } from '@controller/http/dev/dev.v1.controller';
import { HealthController } from '@controller/http/health/health.controller';
import { Middleware } from '@controller/http/middleware';
import { HttpConfig } from '@controller/http/types';

export class HttpServer {
  middleware: Middleware;
  server!: http.Server;
  app!: Express;

  constructor(
    private readonly logger: Logger,
    private readonly config: HttpConfig
  ) {
    this.middleware = new Middleware(this.logger);
  }

  public start = async (): Promise<void> => {
    this.app = express();
    this.app.disable('x-powered-by');
    this.app.set('trust proxy', 0);
    this.app.use('/api', this.middleware.accessLog);
    this.app.use('/api', this.getApiRouters());
    this.app.use('/healthz', this.getHealthRouters());
    await this.buildApiDocument();
    this.app.use(this.middleware.handleError);
    this.app.use(this.middleware.handleNotFoundRoute);

    this.server = this.app.listen(this.config.port, () => {
      this.logger.info(`HTTP server started on ${this.config.port}`);
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

  private buildApiDocument = async (): Promise<void> => {
    if (this.config.env !== 'prod') {
      const apiDocumentOptions: Tspec.GenerateParams = {
        specPathGlobs: ['src/**/*.ts'],
        tsconfigPath: './tsconfig.json',
        outputPath: './generate/openapi.json',
        specVersion: 3,
        openapi: {
          title: 'Mr.C API',
          version: '1.0.0',
          securityDefinitions: {
            jwt: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        },
        debug: false,
        ignoreErrors: false
      };
      this.app.use('/docs', await TspecDocsMiddleware(apiDocumentOptions));
    } else {
      this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpecification));
    }
  };
}
