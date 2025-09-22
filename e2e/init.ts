// @ts-nocheck
import { device } from 'detox';

beforeAll(async () => {
  // Detox 20: lifecycle handled by custom Jest env; just launch app with desired permissions
  // Ensure clean install so onboarding screens are shown
  await device.uninstallApp();
  await device.installApp();
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: 'YES' },
  });
});
