import { Router } from 'express';
import { Logger } from 'winston';

import { GreetingV1Request } from '@controller/http/dev/request/dev.v1.request';
import { GreetingV1Response } from '@controller/http/dev/response/dev.v1.response';

export class DevV1Controller {
  constructor(public logger: Logger) {}

  routes(): Router {
    const router: Router = Router();
    const prefix = '/v1/dev';

    router.post(`${prefix}/greeting`, this.greeting);
    this.logger.info('Hello from dev controller');
    return router;
  }

  private greeting = (req: GreetingV1Request, res: GreetingV1Response) => {
    res.send({ message: 'Hello World!' });
  };
}
