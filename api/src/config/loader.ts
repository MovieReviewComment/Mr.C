import convict from 'convict';
import convict_format_with_validator from 'convict-format-with-validator';
import { config as envLoad } from 'dotenv';
import * as yaml from 'js-yaml';

interface ServerConfig {
  env: string;
  http: HttpConfig;
}

interface HttpConfig {
  host: string;
  port: number;
}

export function load(path: string): Config {
  try {
    envLoad();
    const config = jsYaml.load(readFileSync(path, 'utf-8')) as Config;
    return {
      env: process.env.ENV ? process.env.ENV : config.env,
      server: {
        host: process.env.HOST ? process.env.HOST : config.server.host,
        port: process.env.PORT ? process.env.PORT : config.server.port
      }
    };
  } catch (e) {
    throw new Error('failed to load config');
  }
}
