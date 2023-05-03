import { LogLevel, LogFormat } from '@src/logger/types';

export interface Config {
  env: string;
  http: ConfigHttp;
  logger: ConfigLogger;
}

export interface ConfigHttp {
  host: string;
  port: number;
}

export interface ConfigLogger {
  level: LogLevel;
  format: LogFormat;
}
