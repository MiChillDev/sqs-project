import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page.ts';
import { AdminPage } from '../pages/admin-page.ts';

const SEED_ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME;
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
if (!SEED_ADMIN_USERNAME || !SEED_ADMIN_PASSWORD) {
  throw new Error('SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD environment variables must be set for admin tests');
}

test.describe('Admin user flows', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(SEED_ADMIN_USERNAME, SEED_ADMIN_PASSWORD);
    const adminPage = new AdminPage(page);
    await adminPage.waitForUrl('**/admin');
  });

  test('login with valid admin credentials redirects to admin page', async ({ page }) => {
    const adminPage = new AdminPage(page);
    expect((await adminPage.getActiveTabLabel()).trim()).toBe('Fetch and save');
    await adminPage.clickCreateTab();
    await expect(adminPage.jokeContentTextarea).toBeVisible();
    await expect(adminPage.createJokeButton).toBeVisible();
    expect((await adminPage.getActiveTabLabel()).trim()).toBe('Create');
  });

  test('admin can create a new joke', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.clickCreateTab();
    await adminPage.createJoke('Test joke from E2E', `e2e-test-${Date.now()}`);
    const text = await adminPage.getCreatedJokeText();
    expect(text).toContain('Test joke from E2E');
    expect((await adminPage.getActiveTabLabel()).trim()).toBe('Create');
  });

  test('admin can fetch and save a source joke', async ({ page }) => {
    const adminPage = new AdminPage(page);
    expect((await adminPage.getActiveTabLabel()).trim()).toBe('Fetch and save');
    await adminPage.clickFetchSourceJoke();
    const sourceText = await adminPage.getSourceJokeText();
    expect(sourceText).toBeDefined();
    expect(sourceText!.length).toBeGreaterThan(0);
    await adminPage.clickSaveSourceJoke();
    const confirmation = await adminPage.getSaveConfirmation();
    expect(confirmation).toBeDefined();
    expect(confirmation!.length).toBeGreaterThan(0);
    expect((await adminPage.getActiveTabLabel()).trim()).toBe('Fetch and save');
  });

  test('admin can logout', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.logout();
    await adminPage.waitForUrl('**/login');
    await adminPage.verifyUnauthenticated();
    await expect(adminPage.userMenuLogin).toBeVisible();
  });

  test('admin tab stays active after creating a joke', async ({ page }) => {
    const adminPage = new AdminPage(page);
    await adminPage.clickCreateTab();
    await adminPage.createJoke('Tab persistence test joke', `tab-test-${Date.now()}`);
    expect((await adminPage.getActiveTabLabel()).trim()).toBe('Create');
  });
});
