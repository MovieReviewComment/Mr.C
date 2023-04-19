import { load } from './config/loader';

function main() {
  const configPath = './src/config/default.yaml';
  try {
    const config = load(configPath);
    console.log(config);
  } catch (e) {
    if (e instanceof Error) {
      console.error(`error: ${e.message}`);
    }
  }
}

if (require.main === module) {
  main();
}
