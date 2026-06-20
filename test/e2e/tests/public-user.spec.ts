import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page.ts';
import { JokePage } from '../pages/joke-page.ts';

test.describe('Public user flows', () => {
  test('can view welcome page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyWelcomeMessage();
  });

  test('can navigate to jokes page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.clickGoToJokes();
    const jokePage = new JokePage(page);
    await jokePage.waitForUrl('**/jokes');
    await jokePage.verifyHeading();
  });

  test('is redirected to login when visiting admin', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL('**/login?redirect=%2Fadmin');
    await expect(page.getByTestId('login-title')).toBeVisible();
  });
});
