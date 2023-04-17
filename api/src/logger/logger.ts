import { LogFormat } from '../config/enum';
import {
  LoggerOptions,
  Logger,
  LeveledLogMethod,
  createLogger,
  format,
  transports
} from 'winston';

export type loggerFormat = {
  format: LogFormat;
};

type customLogger = Logger &
  Record<keyof (typeof customLogLevelOption)['levels'], LeveledLogMethod>;

const customLogLevelOption = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  }
};
