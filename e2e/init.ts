// @ts-nocheck
import { device, element, by, waitFor } from 'detox';

beforeAll(async () => {
  // Detox 20: lifecycle handled by custom Jest env; just launch app with desired permissions
  // Ensure clean install so onboarding screens are shown
  
  // First, make sure Expo Go is not running
  try {
    await device.terminateApp('host.exp.Exponent');
  } catch {
    // Ignore if Expo Go is not installed
  }
  
  await device.uninstallApp();
  await device.installApp();
  
  // Launch the app and wait for it to be ready
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: 'YES' },
    launchArgs: {},
    url: undefined, // Explicitly avoid any URL-based launching
  });
  
  // Wait for the app to fully load before proceeding with tests
  // This prevents the app from falling back to Expo Go
  
  // First, give the app time to fully initialize (critical for Expo apps)
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  // Then try to wait for a UI element to confirm the app is ready
  try {
    await waitFor(element(by.id('onboarding'))).toBeVisible().withTimeout(10000);
  } catch {
    // If onboarding not found, wait a bit more for the app to settle
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}, 60000); // Increase timeout to 60 seconds
