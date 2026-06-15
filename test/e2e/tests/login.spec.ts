import { expect, test } from '@playwright/test';

test.describe('/login page', () => {
  test('renders the login heading', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('[data-slot="card-title"]').first()).toBeVisible();
    await expect(page.locator('[data-slot="card-title"]').first()).toHaveText('Sign in');
  });

  test('renders username and password fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('renders the sign in button', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('shows validation errors when submitting empty form', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('This field is required.')).toHaveCount(2);
  });

  test('renders the site header on login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('link', { name: 'Chuck Norris Jokes' })).toBeVisible();
  });
});
