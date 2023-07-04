import { Request, Response, Router } from 'express';

import { methodNotAllowed } from '@controller/http/handler';

export class HealthController {
  public routes = (): Router => {
    const router: Router = Router();

    router.route(`/liveness`).get(this.checkLiveness).all(methodNotAllowed);
    return router;
  };

  public checkLiveness = (req: Request, res: Response<{ message: string }>) => {
    res.send({ message: 'OK' });
  };
}
