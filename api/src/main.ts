import {
  buildHttpConfig,
  buildLoggerConfig,
  configLoad
} from '@src/config/loader';
import { loggerInitialize } from '@src/logger/logger';

import { HttpServer } from '@controller/http/server';

async function main() {
  let config;
  try {
    config = configLoad();
  } catch (e) {
    console.error(`${e}`);
    process.exit(1);
  }

  const logger = loggerInitialize(buildLoggerConfig(config));
  const httpServer = new HttpServer(logger, buildHttpConfig(config));
  await httpServer.start();
  await httpServer.close();
  logger.info('Server shutdowned');
}

if (require.main === module) {
  main();
}
