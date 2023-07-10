import { Tspec } from 'tspec';

import { DevV1Controller } from '@controller/http/dev/dev.v1.controller';

export type DevApiSpec = Tspec.DefineApiSpec<{
  basePath: '/api/v1/dev';
  security: 'jwt';
  tags: ['Development'];
  paths: {
    '/greeting': {
      post: {
        summary: 'Greeting';
        handler: typeof DevV1Controller.prototype.greeting;
      };
    };
  };
}>;
