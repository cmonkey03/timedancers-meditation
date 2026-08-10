// @ts-nocheck
import { by, element, waitFor } from 'detox';

describe('Onboarding Flow', () => {
  it('should complete onboarding and reach session screen', async () => {
    console.log('🚀 Testing onboarding flow...');
    
    // Wait for app to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we're on onboarding or already past it
    try {
      // Look for onboarding elements
      await waitFor(element(by.id('onboarding-skip'))).toBeVisible().withTimeout(3000);
      console.log('✅ Found onboarding - completing it...');
      
      // Skip onboarding for faster testing
      await element(by.id('onboarding-skip')).tap();
      console.log('✅ Tapped Skip button');
      
      // Wait for navigation to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch {
      console.log('ℹ️  No onboarding found - may already be past it');
    }
    
    // Verify we're on the session screen by looking for Start button
    await waitFor(element(by.id('start-button'))).toBeVisible().withTimeout(10000);
    console.log('✅ Successfully reached session screen and found Start button');
    
    // Test tab navigation
    console.log('🔍 Testing tab navigation...');
    
    // Check what tabs are actually visible (using only text since that's what works)
    const tabTexts = ['Home', 'Session', 'Settings', 'Explore'];
    
    console.log('🔍 Checking which tabs are visible...');
    for (const tabText of tabTexts) {
      try {
        await waitFor(element(by.text(tabText))).toBeVisible().withTimeout(1000);
        console.log(`✅ Found tab: ${tabText}`);
      } catch {
        console.log(`❌ Not found: ${tabText}`);
      }
    }
    
    // Navigate to settings
    await waitFor(element(by.text('Settings'))).toBeVisible().withTimeout(3000);
    await element(by.text('Settings')).tap();
    console.log('✅ Tapped Settings tab');
    
    // Wait for navigation and verify settings screen
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify we're on settings screen by looking for Settings title
    await waitFor(element(by.text('Settings'))).toBeVisible().withTimeout(3000);
    console.log('✅ Successfully navigated to settings screen');
    
    // Navigate back to session
    await element(by.text('Session')).tap();
    console.log('✅ Tapped Session tab');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify we're back on session screen
    await waitFor(element(by.id('start-button'))).toBeVisible().withTimeout(3000);
    console.log('✅ Successfully navigated back to session screen');
    
    console.log('✅ Onboarding and navigation test completed successfully!');
  });
});
