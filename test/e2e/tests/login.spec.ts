import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page.ts';

test.describe('Login page', () => {
  test('displays login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.verifyTitle();
    await expect(page.getByTestId('username-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('submit-login-button')).toBeVisible();
  });

  test('shows validation errors on empty submission', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.submitLogin();
    // Verify validation errors appear (field-level or form-level)
    await expect(page.locator('[data-invalid="true"]').first()).toBeVisible();
  });
});
