import { expect, test } from '@playwright/test';

test.describe('/ page', () => {
  test('renders the home page heading', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
  });

  test('renders the link to the jokes page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Go to Jokes' })).toBeVisible();
  });

  test('renders the site header', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Chuck Norris Jokes' })).toBeVisible();
  });
});
