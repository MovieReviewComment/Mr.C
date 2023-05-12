import { buildLoggerConfig, configLoad } from '@src/config/loader';
import { loggerInitialize } from '@src/logger/logger';

function main() {
  let config;
  try {
    config = configLoad();
  } catch (e) {
    console.error(`${e}`);
    process.exit(1);
  }

  const logger = loggerInitialize(buildLoggerConfig(config));
  logger.info('Hello World!');
}

if (require.main === module) {
  main();
}
