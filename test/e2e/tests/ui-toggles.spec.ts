import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page.ts';

test.describe('UI toggles', () => {
  test('toggles dark mode', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.toggleDarkMode();
    // Verify HTML element has dark class (app-specific behavior)
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('toggles language to German', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.switchLanguage('de');
    // Verify header title is visible (presence check, not hardcoded text)
    await homePage.verifyHeader();
  });
});
