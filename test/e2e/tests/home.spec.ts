import { expect, test } from '@playwright/test';

test.describe('/ page', () => {
  test('renders the home page heading', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'SQS Frontend' })).toBeVisible();
  });

  test('renders the home page description', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('some paragraph')).toBeVisible();
  });

  test('renders the site header', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'SQS Preparation' })).toBeVisible();
  });
});
