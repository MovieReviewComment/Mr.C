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
      env: config.util.getEnv('NODE_ENV'),
      http: config.get<HttpConfig>('http')
    };
  } catch (e) {
    throw new Error(`failed to load config error: ${e}`);
  }
}
