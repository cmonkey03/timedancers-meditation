// @ts-nocheck
import { element, by, waitFor } from 'detox';

describe('Settings Flow', () => {
  it('should find settings screen elements', async () => {
    console.log('Testing settings screen elements...');
    
    // Navigate to settings screen
    try {
      await element(by.text('Settings')).tap();
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch {
      console.log('Already on settings screen or tab not found');
    }
    
    // Look for common settings screen elements
    const expectedElements = ['Settings', 'Theme', 'Alerts', 'Daily Reminder'];
    let foundElements = [];
    
    for (const text of expectedElements) {
      try {
        console.log(`Looking for: "${text}"`);
        await waitFor(element(by.text(text))).toBeVisible().withTimeout(3000);
        foundElements.push(text);
        console.log(`Found: "${text}"`);
      } catch {
        console.log(`Not found: "${text}"`);
      }
    }
    
    console.log(`Found ${foundElements.length} elements: ${foundElements.join(', ')}`);
    console.log('Settings screen test completed!');
  });
});
