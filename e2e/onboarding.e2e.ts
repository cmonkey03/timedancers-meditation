// @ts-nocheck
import { by, element, expect, waitFor } from 'detox';

describe('Onboarding to Meditate', () => {
  // App is launched in e2e/init.ts with desired permissions

  it('completes onboarding and lands on Meditate', async () => {
    const tapNext = async () => {
      // Try by testID
      try {
        await waitFor(element(by.id('onboarding-next'))).toBeVisible().withTimeout(12000);
        await element(by.id('onboarding-next')).tap();
        return;
      } catch {
        // Fallback: try by text
        try {
          await waitFor(element(by.text('Next'))).toBeVisible().withTimeout(8000);
          await element(by.text('Next')).tap();
          return;
        } catch {
          // Fallback: try by accessibility label
          await waitFor(element(by.label('onboarding-next'))).toBeVisible().withTimeout(8000);
          await element(by.label('onboarding-next')).tap();
        }
      }
    };

    // Tap through onboarding Next buttons
    for (let i = 0; i < 4; i++) {
      try {
        await tapNext();
      } catch {
        // As a fallback, swipe left on the onboarding container
        await waitFor(element(by.id('onboarding'))).toBeVisible().withTimeout(8000);
        await element(by.id('onboarding')).swipe('left', 'slow', 0.85);
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // add a 1-second delay
    }

    // Finish onboarding with Done button
    try {
      await waitFor(element(by.id('onboarding-done'))).toBeVisible().withTimeout(12000);
      await element(by.id('onboarding-done')).tap();
    } catch {
      try {
        await waitFor(element(by.text('Done'))).toBeVisible().withTimeout(8000);
        await element(by.text('Done')).tap();
      } catch {
        // Final fallback: try one more swipe and re-check
        await waitFor(element(by.id('onboarding'))).toBeVisible().withTimeout(8000);
        await element(by.id('onboarding')).swipe('left', 'slow', 0.85);
        await new Promise(resolve => setTimeout(resolve, 1000)); // add a 1-second delay
        await waitFor(element(by.id('onboarding-done'))).toBeVisible().withTimeout(8000);
        await element(by.id('onboarding-done')).tap();
      }
    }

    // Should land on Meditate tab
    await waitFor(element(by.id('screen-meditate'))).toBeVisible().withTimeout(15000);
    await expect(element(by.id('screen-meditate'))).toBeVisible();
  });
});
