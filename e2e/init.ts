// @ts-nocheck
import { device } from 'detox';

beforeAll(async () => {
  console.log('Starting E2E test initialization...');
  
  // Set global E2E flag for the app to detect
  (global as any).__E2E__ = true;
  
  console.log('Launching app for E2E testing...');
  
  // Launch the app with clean state
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: 'YES' },
  });
  
  console.log('App launched, waiting for initialization...');
  
  // Give the app time to detect E2E mode and navigate
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  console.log('E2E initialization complete');
}, 60000);
