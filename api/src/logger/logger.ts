import { LoggerConfig, LogFormat } from '@src/logger/types';
import {
  LoggerOptions,
  Logger,
  createLogger,
  format,
  transports
} from 'winston';

// The available log levels are described in the link below.
// https://github.com/winstonjs/winston#logging-levels
export function loggerInitialize(config: LoggerConfig): Logger {
  let loggerOption: LoggerOptions;
  try {
    if (config.format === LogFormat.JSON) {
      loggerOption = getJsonLoggerOption(config);
    } else {
      loggerOption = getTextLoggerOption(config);
    }
    return createLogger(loggerOption);
  } catch (e) {
    throw Error('failed to initialze logger');
  }
}

function getTextLoggerOption(config: LoggerConfig): LoggerOptions {
  return {
    level: config.level,
    defaultMeta: {
      deployment: config.deployment
    },
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ level, message, timestamp, ...metadata }) => {
        let msg = `[${timestamp}][${level}]: ${message} `;
        if (metadata) {
          msg += JSON.stringify(metadata);
        }
        return msg;
      })
    ),
    transports: [new transports.Console()]
  };
}

function getJsonLoggerOption(config: LoggerConfig): LoggerOptions {
  return {
    level: config.level,
    defaultMeta: {
      deployment: config.deployment
    },
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.json()
    ),
    transports: [new transports.Console()]
  };
}
