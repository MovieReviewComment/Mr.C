import { Request, Response, Router } from 'express';

import { methodNotAllowed } from '@controller/http/handler';

export class HealthController {
  routes(): Router {
    const router: Router = Router();

    router.route(`/liveness`).get(this.checkLiveness).all(methodNotAllowed);
    return router;
  }

  private checkLiveness = (req: Request, res: Response) => {
    res.send({ message: 'OK' });
  };
}
