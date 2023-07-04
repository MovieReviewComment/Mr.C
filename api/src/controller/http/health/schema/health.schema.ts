import { Tspec } from 'tspec';

import { HealthController } from '@controller/http/health/health.controller';

export type HealthApiSpec = Tspec.DefineApiSpec<{
  basePath: '/healthz';
  tags: ['Health Checks'];
  paths: {
    '/liveness': {
      get: {
        summary: 'Check for liveness';
        handler: typeof HealthController.prototype.checkLiveness;
      };
    };
  };
}>;
