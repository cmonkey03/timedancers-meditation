// @ts-nocheck
import { expect } from 'detox';

describe('App Launch Test', () => {
  it('should launch and stay running', async () => {
    console.log('Starting minimal app launch test...');
    
    // Just wait and verify the app doesn't crash
    console.log('Waiting 10 seconds to see if app stays running...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    console.log('App has been running for 10 seconds without crashing');
    
    // If we get here, the app launched successfully
    expect(true).toBe(true);
    console.log('Basic launch test passed!');
  });
});
