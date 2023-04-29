import config from 'config';

interface Config {
  env: string;
  http: HttpConfig;
}

interface HttpConfig {
  host: string;
  port: number;
}

export function load(): Config {
  try {
    return {
      env: config.get<string>('env'),
      http: config.get<HttpConfig>('http')
    };
  } catch (e) {
    throw new Error(`failed to load config error: ${e}`);
  }
}
