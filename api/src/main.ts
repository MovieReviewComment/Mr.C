import * as logger from './logger/logger';
import { LogFormat } from './config/enum';

function main() {
  const loggerFormat: logger.loggerFormat = { format: LogFormat.TEXT };
  logger.initialize(loggerFormat);
  logger.L().info('Hello World %s', 'From Mr.C');
}

if (require.main === module) {
  main();
}