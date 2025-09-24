// @ts-nocheck
import { by, element, expect, waitFor } from 'detox';

describe('Settings Flow', () => {
  beforeEach(async () => {
    // Navigate to settings tab
    try {
      // Try to find and tap the settings tab
      await waitFor(element(by.text('Settings'))).toBeVisible().withTimeout(5000);
      await element(by.text('Settings')).tap();
    } catch {
      // Alternative: try to find settings by accessibility label or other identifier
      // This might need adjustment based on the actual tab implementation
      await waitFor(element(by.label('Settings'))).toBeVisible().withTimeout(5000);
      await element(by.label('Settings')).tap();
    }
    
    // Wait for settings screen to load
    await waitFor(element(by.id('screen-settings'))).toBeVisible().withTimeout(5000);
  });

  it('should display all settings sections', async () => {
    // Verify main settings sections are visible
    await expect(element(by.text('Settings'))).toBeVisible();
    await expect(element(by.text('Theme'))).toBeVisible();
    await expect(element(by.text('Alerts'))).toBeVisible();
    await expect(element(by.text('Daily Reminder'))).toBeVisible();
    await expect(element(by.text('Reset to defaults'))).toBeVisible();
  });

  it('should allow theme switching', async () => {
    // Verify theme options are visible
    await expect(element(by.text('Theme'))).toBeVisible();
    await expect(element(by.text('Choose your preferred appearance theme.'))).toBeVisible();
    
    // Test theme switching using testIDs
    await waitFor(element(by.id('theme-system'))).toBeVisible().withTimeout(5000);
    await waitFor(element(by.id('theme-light'))).toBeVisible().withTimeout(5000);
    await waitFor(element(by.id('theme-dark'))).toBeVisible().withTimeout(5000);
    
    // Switch to light theme
    await element(by.id('theme-light')).tap();
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for theme change
    
    // Switch to dark theme
    await element(by.id('theme-dark')).tap();
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for theme change
    
    // Switch back to system theme
    await element(by.id('theme-system')).tap();
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for theme change
  });

  it('should allow alert mode configuration', async () => {
    // Verify alerts section is visible
    await expect(element(by.text('Alerts'))).toBeVisible();
    await expect(element(by.text('Choose how the app alerts you throughout your session.'))).toBeVisible();
    
    // Test selecting different alert modes using testIDs
    await waitFor(element(by.id('alert-mode-chime'))).toBeVisible().withTimeout(5000);
    await waitFor(element(by.id('alert-mode-chime_haptic'))).toBeVisible().withTimeout(5000);
    await waitFor(element(by.id('alert-mode-haptic'))).toBeVisible().withTimeout(5000);
    await waitFor(element(by.id('alert-mode-silent'))).toBeVisible().withTimeout(5000);
    
    // Test selecting different alert modes
    await element(by.id('alert-mode-chime_haptic')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await element(by.id('alert-mode-haptic')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await element(by.id('alert-mode-silent')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Switch back to Chime
    await element(by.id('alert-mode-chime')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test the alert test button
    await waitFor(element(by.id('test-alert-button'))).toBeVisible().withTimeout(5000);
    await element(by.id('test-alert-button')).tap();
    
    // Verify and test background alerts toggle
    await expect(element(by.text('Play alerts in background'))).toBeVisible();
    await waitFor(element(by.id('background-alerts-switch'))).toBeVisible().withTimeout(5000);
    
    // Toggle the switch (assuming it starts as enabled)
    await element(by.id('background-alerts-switch')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Toggle it back
    await element(by.id('background-alerts-switch')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  it('should allow daily reminder configuration', async () => {
    // Verify daily reminder section is visible
    await expect(element(by.text('Daily Reminder'))).toBeVisible();
    await expect(element(by.text('Schedule a local notification (24-hour).'))).toBeVisible();
    
    // Test daily reminder switch
    await waitFor(element(by.id('daily-reminder-switch'))).toBeVisible().withTimeout(5000);
    await waitFor(element(by.id('daily-reminder-time-button'))).toBeVisible().withTimeout(5000);
    
    // Toggle the daily reminder switch
    await element(by.id('daily-reminder-switch')).tap();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for async operations
    
    // Try to tap the time button (should be enabled now)
    await element(by.id('daily-reminder-time-button')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Note: Time picker modal testing would require additional setup
    // For now, we'll just verify the button interaction
    
    // Toggle the switch back off
    await element(by.id('daily-reminder-switch')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  it('should reset settings to defaults', async () => {
    // First, change some settings
    await element(by.id('theme-dark')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await element(by.id('alert-mode-silent')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Reset to defaults
    await waitFor(element(by.id('reset-defaults-button'))).toBeVisible().withTimeout(5000);
    await element(by.id('reset-defaults-button')).tap();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for reset
    
    // Verify settings are reset (system theme should be selected)
    // Note: Visual verification of reset state would require checking selected states
    // This would need additional testIDs or accessibility labels on selected states
  });

  it('should navigate back to meditation from settings', async () => {
    // Navigate back to meditate tab
    try {
      await waitFor(element(by.text('Meditate'))).toBeVisible().withTimeout(5000);
      await element(by.text('Meditate')).tap();
    } catch {
      // Alternative navigation method if needed
      await waitFor(element(by.label('Meditate'))).toBeVisible().withTimeout(5000);
      await element(by.label('Meditate')).tap();
    }
    
    // Verify we're back on the meditation screen
    await waitFor(element(by.id('screen-meditate'))).toBeVisible().withTimeout(5000);
    await expect(element(by.id('screen-meditate'))).toBeVisible();
    await expect(element(by.text('Start'))).toBeVisible();
  });
});
