import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page.ts';
import { AdminPage } from '../pages/admin-page.ts';

const SEED_ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME;
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
if (!SEED_ADMIN_USERNAME || !SEED_ADMIN_PASSWORD) {
  throw new Error('SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD environment variables must be set for admin tests');
}

test.describe('Login page', () => {
  test('displays login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.verifyTitle();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('shows validation errors on empty submission', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.submitLogin();
    await loginPage.verifyValidationError();
  });

  test('redirects to admin on successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(SEED_ADMIN_USERNAME, SEED_ADMIN_PASSWORD);
    const adminPage = new AdminPage(page);
    await adminPage.waitForUrl('**/admin');
    await expect(adminPage.userMenuDropdown).toBeVisible();
    expect((await adminPage.getActiveTabLabel()).trim()).toBe('Fetch and save');
  });

  test('shows error on wrong username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('nonexistent-user', SEED_ADMIN_PASSWORD);
    await loginPage.errorBanner.waitFor({ state: 'visible', timeout: 10000 });
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toBeTruthy();
  });

  test('shows error banner content', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('bad-user', 'bad-password');
    await loginPage.errorBanner.waitFor({ state: 'visible', timeout: 10000 });
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toBeTruthy();
  });
});

