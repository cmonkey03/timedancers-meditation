// @ts-nocheck
import { device } from 'detox';

beforeAll(async () => {
  console.log('Starting E2E test initialization...');
  
  // Don't uninstall/reinstall - this might be causing the reboots
  console.log('Launching app without reinstall...');
  
  // Launch the app with minimal configuration
  await device.launchApp({
    newInstance: false, // Don't force new instance
    permissions: { notifications: 'YES' },
  });
  
  console.log('App launched, waiting for stability...');
  
  // Give the app time to fully initialize
  await new Promise(resolve => setTimeout(resolve, 15000));
  
  console.log('E2E initialization complete');
}, 60000);
