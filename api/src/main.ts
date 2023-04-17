import { LogFormat } from './config/enum';
import * as logger from './logger/logger';

function main() {
  const loggerFormat: logger.loggerFormat = { format: LogFormat.TEXT };
  logger.initialize(loggerFormat);
  logger.L().info('Hello World %s', 'From Mr.C');
}

if (require.main === module) {
  main();
}
