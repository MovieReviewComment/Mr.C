export enum LogFormat {
  JSON = 'json',
  TEXT = 'text'
}

export type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

export interface LoggerConfig {
  deployment: string;
  level: LogLevel;
  format: LogFormat;
}
