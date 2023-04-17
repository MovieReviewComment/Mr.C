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

let logger: customLogger;

export function initialize(config: loggerFormat) {
  let loggerOption: LoggerOptions;
  if (config.format === LogFormat.JSON) {
    loggerOption = jsonLoggerConfig();
  } else {
    loggerOption = textLoggerConfig();
  }
  logger = createLogger(loggerOption) as customLogger;
}

export function L(): customLogger {
  return logger;
}

function textLoggerConfig(): LoggerOptions {
  return {
    levels: customLogLevelOption.levels,
    level: 'info',
    format: format.combine(
      format.splat(),
      format.simple(),
      format.timestamp(),
      format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}][${level}]: ${message}`;
      })
    ),
    transports: [new transports.Console()]
  };
}

function jsonLoggerConfig(): LoggerOptions {
  return {
    levels: customLogLevelOption.levels,
    level: 'info',
    format: format.combine(format.splat(), format.timestamp(), format.json()),
    transports: [new transports.Console()]
  };
}
