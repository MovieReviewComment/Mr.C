import { configLoad, buildLoggerConfig } from '@src/config/loader';
import config from 'config';

describe('Test config loader', () => {
  it('should load valid configurations from a test.yaml', () => {
    expect(configLoad()).toStrictEqual({
      env: 'test',
      http: { host: '127.0.0.1', port: 10100 },
      logger: { level: 'silly', format: 'text' }
    });
  });

  it('should not override fields by env variable', () => {
    process.env.env = 'production';
    const config = configLoad();
    expect(config.env).not.toEqual('production');
  });

  it('should throw error when config.get() throw error', () => {
    jest.spyOn(config, 'get').mockImplementationOnce(() => {
      throw new Error('');
    });
    expect(() => {
      configLoad();
    }).toThrow();
  });
});

describe('Test build logger config', () => {
  it('should build valid logger config from a test.yaml', () => {
    expect(buildLoggerConfig(configLoad())).toStrictEqual({
      deployment: 'test',
      level: 'silly',
      format: 'text'
    });
  });
});
