// @ts-nocheck
import { by, device, element, expect, waitFor } from 'detox';

describe('Onboarding to Meditate', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('completes onboarding and lands on Meditate', async () => {
    // Tap through onboarding "Next" 3 times then Done
    for (let i = 0; i < 3; i++) {
      // Using text matching from Next button
      await waitFor(element(by.text('Next'))).toBeVisible().withTimeout(5000);
      await element(by.text('Next')).tap();
    }

    // On last page, tap Next (or Done) to finish
    await waitFor(element(by.text('Next'))).toBeVisible().withTimeout(5000);
    await element(by.text('Next')).tap();

    // Should land on Meditate tab
    await waitFor(element(by.id('screen-meditate'))).toBeVisible().withTimeout(10000);
    await expect(element(by.id('screen-meditate'))).toBeVisible();
  });
});
