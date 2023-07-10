import config from 'config';

import {
  Config,
  ConfigHttp,
  ConfigLogger,
  ConfigTimeout
} from '@src/config/types';
import { HttpConfig } from '@src/controller/http/types';
import { LoggerConfig } from '@src/logger/types';

export function configLoad(): Config {
  try {
    return {
      env: config.get<string>('env'),
      timeout: config.get<ConfigTimeout>('timeout'),
      http: config.get<ConfigHttp>('http'),
      logger: config.get<ConfigLogger>('logger')
    };
  } catch (e) {
    throw new Error(`failed to load config error: ${e}`);
  }
}

export function buildLoggerConfig(config: Config): LoggerConfig {
  return {
    deployment: config.env,
    level: config.logger.level,
    format: config.logger.format
  };
}

export function buildHttpConfig(config: Config): HttpConfig {
  return {
    env: config.env,
    host: config.http.host,
    port: config.http.port
  };
}
