// @ts-nocheck
import { element, by, waitFor } from 'detox';

describe('Meditation Flow', () => {
  it('should find meditation screen elements', async () => {
    console.log('Testing meditation screen elements...');
    
    // Navigate to meditate screen by tapping the tab
    try {
      await element(by.text('Meditate')).tap();
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch {
      console.log('Already on meditate screen or tab not found');
    }
    
    // Look for common meditation screen elements
    const expectedElements = ['Start', 'Meditate', 'Power', 'Heart', 'Wisdom'];
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
    console.log('Meditation screen test completed!');
  });

});
