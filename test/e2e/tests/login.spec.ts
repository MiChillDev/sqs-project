import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page.ts';

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
});

