// @ts-nocheck
import { element, by, waitFor } from 'detox';

describe('Meditation Flow', () => {
  it('should test meditation timer functionality', async () => {
    console.log('🧘 Testing meditation timer functionality...');
    
    // Wait for app to load and ensure we're on the meditate screen
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // We should already be on the meditate screen - just verify by looking for Start button
    await waitFor(element(by.id('start-button'))).toBeVisible().withTimeout(10000);
    console.log('✅ Meditate screen is visible and Start button found');
    
    // Start the timer
    await element(by.id('start-button')).tap();
    console.log('✅ Tapped Start button');
    
    // Wait for timer to start and UI to update
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Look for pause button (indicates timer started)
    await waitFor(element(by.id('pause-button'))).toBeVisible().withTimeout(8000);
    console.log('✅ Timer started successfully - found Pause button');
    
    // Test pause functionality
    await element(by.id('pause-button')).tap();
    console.log('✅ Paused timer');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Look for resume button
    await waitFor(element(by.id('resume-button'))).toBeVisible().withTimeout(5000);
    console.log('✅ Found Resume button');
    
    // Test resume functionality
    await element(by.id('resume-button')).tap();
    console.log('✅ Resumed timer');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Pause again to test cancel
    await waitFor(element(by.id('pause-button'))).toBeVisible().withTimeout(5000);
    await element(by.id('pause-button')).tap();
    console.log('✅ Paused timer again');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Cancel the timer
    await waitFor(element(by.id('cancel-button'))).toBeVisible().withTimeout(5000);
    await element(by.id('cancel-button')).tap();
    console.log('✅ Cancelled timer');
    
    // Wait for cancel animation and state reset
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verify we're back to start state
    await waitFor(element(by.id('start-button'))).toBeVisible().withTimeout(8000);
    console.log('✅ Back to start state');
    
    console.log('✅ Meditation timer test completed successfully!');
  });
});
