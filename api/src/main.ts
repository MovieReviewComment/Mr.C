import { load } from '@src/config/loader';

function main() {
  try {
    const config = load();
    console.log(config);
  } catch (e) {
    if (e instanceof Error) {
      console.error(`${e.message}`);
    }
  }
}

if (require.main === module) {
  main();
}
