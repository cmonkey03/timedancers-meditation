// @ts-nocheck
import { init, cleanup, device } from 'detox';

beforeAll(async () => {
  // Use default config resolved by Detox CLI
  await init(undefined, { launchApp: false });
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: 'YES' },
  });
});

afterAll(async () => {
  await cleanup();
});
