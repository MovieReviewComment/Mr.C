import { Request, Response, Router } from 'express';
import express from 'express';
import { Express } from 'express-serve-static-core';
import http from 'http';
import request from 'supertest';
import { Logger } from 'winston';

import {
  CustomError,
  InternalErrorType,
  NotFoundErrorType
} from '@src/controller/http/errors';
import { Middleware } from '@src/controller/http/middleware';

class TestHttpServer {
  middleware: Middleware;
  server!: http.Server;
  app!: Express;

  constructor(private readonly logger: Logger) {
    this.middleware = new Middleware(this.logger);
  }

  public start = (): Promise<void> => {
    return new Promise((resolve) => {
      this.app = express();
      this.app.use('/api', this.getRouters());
      this.app.use(this.middleware.handleError);
      this.app.use(this.middleware.handleNotFoundRoute);

      this.server = this.app.listen(0, () => {
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
          resolve();
        }
      });
    });
  };

  private getRouters = (): express.Router[] => {
    const routers = [new TestController(this.logger).routes()];
    return routers;
  };
}

class TestController {
  constructor(public logger: Logger) {}

  routes(): Router {
    const router: Router = Router();
    const prefix = '/v1/dev';

    router.post(`${prefix}/throwSyncCustomError`, this.throwSyncCustomError);
    router.post(`${prefix}/throwAsyncCustomError`, this.throwAsyncCustomError);
    router.post(`${prefix}/throwSyncError`, this.throwSyncError);
    router.post(`${prefix}/throwAsyncError`, this.throwAsyncError);
    return router;
  }

  private throwSyncCustomError = (req: Request, res: Response) => {
    throw new CustomError(
      InternalErrorType.UNEXPECTED,
      'Error from throwSyncCustomError'
    );
  };

  private throwAsyncCustomError = async (req: Request, res: Response) => {
    throw new CustomError(
      InternalErrorType.UNEXPECTED,
      'Error from throwAsyncCustomError'
    );
  };

  private throwSyncError = (req: Request, res: Response) => {
    throw new Error('Error from throwSyncError');
  };

  private throwAsyncError = async (req: Request, res: Response) => {
    throw new Error('Error from throwAsyncError');
  };
}

describe('Test middleware', () => {
  let mockLogger: Partial<Logger>;
  let testHttpServer: TestHttpServer;
  let baseUrl: string;

  beforeAll(async () => {
    mockLogger = {};
    testHttpServer = new TestHttpServer(mockLogger as Logger);
    baseUrl = '/api/v1/dev';
    await testHttpServer.start();
  });

  afterAll(async () => {
    await testHttpServer.close();
  });

  it('should 500 when sync handle func throw InternalErrorType custom error', async () => {
    const response = await request(testHttpServer.app).post(
      `${baseUrl}/throwSyncCustomError`
    );
    expect(response.status).toEqual(500);
    expect(response.body).toStrictEqual({
      type: InternalErrorType.UNEXPECTED,
      message: 'Error from throwSyncCustomError'
    });
  });

  it('should 500 when async handle func throw InternalErrorType custom error', async () => {
    const response = await request(testHttpServer.app).post(
      `${baseUrl}/throwAsyncCustomError`
    );
    expect(response.status).toEqual(500);
    expect(response.body).toStrictEqual({
      type: InternalErrorType.UNEXPECTED,
      message: 'Error from throwAsyncCustomError'
    });
  });

  it('should 500 when sync handle func throw raw error', async () => {
    const response = await request(testHttpServer.app).post(
      `${baseUrl}/throwSyncError`
    );
    expect(response.status).toEqual(500);
    expect(response.body).toStrictEqual({
      type: InternalErrorType.UNEXPECTED,
      message: 'Unexpected error happened'
    });
  });

  it('should 500 when async handle func throw raw error', async () => {
    const response = await request(testHttpServer.app).post(
      `${baseUrl}/throwAsyncError`
    );
    expect(response.status).toEqual(500);
    expect(response.body).toStrictEqual({
      type: InternalErrorType.UNEXPECTED,
      message: 'Unexpected error happened'
    });
  });

  it('should 404 when no matching route found', async () => {
    const response = await request(testHttpServer.app).post(
      `${baseUrl}/wrongPath`
    );
    expect(response.status).toEqual(404);
    expect(response.body).toStrictEqual({
      type: NotFoundErrorType.ROUTE_NOT_FOUND,
      message: 'No matching route found'
    });
  });
});
