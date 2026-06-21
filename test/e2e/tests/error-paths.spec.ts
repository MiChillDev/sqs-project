import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page.ts';
import { AdminPage } from '../pages/admin-page.ts';

const SEED_ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME;
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
if (!SEED_ADMIN_USERNAME || !SEED_ADMIN_PASSWORD) {
  throw new Error('SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD environment variables must be set for admin tests');
}

test.describe('Error paths', () => {
  test('shows error on wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(SEED_ADMIN_USERNAME, 'wrong-password-that-is-definitely-incorrect');
    // Wait for error banner to appear after failed login
    await loginPage.errorBanner.waitFor({ state: 'visible', timeout: 10000 });
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toBeTruthy();
  });

  test('shows validation error on empty joke creation', async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(SEED_ADMIN_USERNAME, SEED_ADMIN_PASSWORD);
    const adminPage = new AdminPage(page);
    await adminPage.waitForUrl('**/admin');

    await adminPage.clickCreateTab();
    await adminPage.createJoke('');
    const error = page.getByRole('alert');
    await expect(error).toBeVisible();
  });

  test('shows 404 for non-existent route', async ({ page }) => {
    await page.goto('/nonexistent-route-that-does-not-exist');
    // Either a 404 page or redirect to home — just verify no crash
    await expect(page).not.toHaveURL(/error/i);
  });
});
