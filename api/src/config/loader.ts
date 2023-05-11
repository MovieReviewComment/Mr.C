import { Config, ConfigHttp, ConfigLogger } from '@src/config/types';
import { LoggerConfig } from '@src/logger/types';
import config from 'config';

export function configLoad(): Config {
  try {
    return {
      env: config.get<string>('env'),
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
