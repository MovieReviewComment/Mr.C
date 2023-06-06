import { Request, Response, Router } from 'express';
import express from 'express';
import { Express } from 'express-serve-static-core';
import http from 'http';
import request from 'supertest';
import { Logger } from 'winston';

import { MethodNotAllowedErrorType } from '@src/controller/http/errors';
import { methodNotAllowed } from '@src/controller/http/handler';
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

    router.route(`${prefix}/test`).get(this.respond).all(methodNotAllowed);

    return router;
  }

  private respond = (req: Request, res: Response) => {
    res.send({
      message: `The ${req.method} for the "${req.originalUrl}" route is allowed`
    });
  };
}

describe('Test handler', () => {
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

  it('should 200 when GET method for the route is allowed', async () => {
    const expectedResponse = {
      message: `The GET for the "${baseUrl}/test" route is allowed`
    };
    const response = await request(testHttpServer.app).get(`${baseUrl}/test`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should 405 when POST method for the route is not allowed', async () => {
    const expectedResponse = {
      type: MethodNotAllowedErrorType.METHOD_NOT_ALLOWED,
      message: `The POST for the "${baseUrl}/test" route is not allowed`
    };
    const response = await request(testHttpServer.app).post(`${baseUrl}/test`);
    expect(response.status).toEqual(405);
    expect(response.body).toStrictEqual(expectedResponse);
  });
});
