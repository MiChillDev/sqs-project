import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page.ts';
import { AdminPage } from '../pages/admin-page.ts';

const SEED_ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME;
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
if (!SEED_ADMIN_USERNAME || !SEED_ADMIN_PASSWORD) {
  throw new Error('SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD environment variables must be set for admin tests');
}

test.describe('Admin user happy paths', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(SEED_ADMIN_USERNAME, SEED_ADMIN_PASSWORD);
    const adminPage = new AdminPage(page);
    await adminPage.waitForUrl('**/admin');
  });

  test('login with valid admin credentials redirects to admin page', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await expect(page.getByTestId('joke-content-textarea')).toBeVisible();
    await expect(page.getByTestId('create-joke-button')).toBeVisible();
  });

  test('admin can create a new joke', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.createJoke('Test joke from E2E', 'e2e-test-1');
    const text = await adminPage.getCreatedJokeText();
    expect(text).toContain('Test joke from E2E');
  });

  test('admin can fetch and save a source joke', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.clickFetchSourceJoke();
    const sourceText = await adminPage.getSourceJokeText();
    expect(sourceText).toBeDefined();
    expect(sourceText!.length).toBeGreaterThan(0);
    await adminPage.clickSaveSourceJoke();
    const confirmation = await adminPage.getSaveConfirmation();
    expect(confirmation).toBeDefined();
    expect(confirmation!.length).toBeGreaterThan(0);
  });

  test('admin can logout', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.logout();
    await adminPage.waitForUrl('**/login');
    await adminPage.verifyUnauthenticated();
    await expect(page.getByTestId('user-menu-login')).toBeVisible();
  });
});
