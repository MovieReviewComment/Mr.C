import { load } from '../../src/config/loader';
import config from 'config';

describe('Test config loader', () => {
  it('should loading configurations from a test.yaml file is correct', () => {
    expect(load()).toStrictEqual({
      env: 'test',
      http: { host: '127.0.0.1', port: 10100 }
    });
  });

  it('should loading configurations from a test.yaml and does not overriden by env variable', () => {
    const config = load();
    process.env.env = 'production';
    expect(config.env).not.toEqual('production');
  });

  it('should throw error when config.get() throw error', () => {
    jest.spyOn(config, 'get').mockImplementationOnce(() => {
      throw new Error('');
    });
    expect(() => {
      load();
    }).toThrow();
  });
});
