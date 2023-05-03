import { LogFormat } from '@src/config/enum';
import config from 'config';

export interface Config {
  env: string;
  http: HttpConfig;
  logger: LoggerConfig;
}

interface HttpConfig {
  host: string;
  port: number;
}
export interface LoggerConfig {
  format: LogFormat;
}

export function configLoad(): Config {
  try {
    return {
      env: config.get<string>('env'),
      http: config.get<HttpConfig>('http'),
      logger: config.get<LoggerConfig>('logger')
    };
  } catch (e) {
    throw new Error(`failed to load config error: ${e}`);
  }
}
