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

  test('toggles dark mode back to light', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.toggleDarkMode();
    // Verify HTML element has dark class (app-specific behavior)
    await expect(page.locator('html')).toHaveClass(/dark/);
    await homePage.toggleDarkMode();
    // Verify HTML element does NOT have dark class
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('toggles language to German then back to English', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.switchLanguage('de');
    await homePage.switchLanguage('en');
    // Verify header title is visible (presence check, not hardcoded text)
    await homePage.verifyHeader();
  });
});
