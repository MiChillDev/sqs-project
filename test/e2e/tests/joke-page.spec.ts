import { expect, test } from '@playwright/test';

test.describe('/jokes page', () => {
  test('renders the page heading', async ({ page }) => {
    await page.goto('/jokes');

    await expect(
      page.getByRole('heading', { name: 'Get your Chuck Norris joke!' }),
    ).toBeVisible();
  });

  test('shows placeholder text before fetching', async ({ page }) => {
    await page.goto('/jokes');

    await expect(page.getByText('Click the button to fetch a joke!')).toBeVisible();
  });

  test('renders the fetch joke button', async ({ page }) => {
    await page.goto('/jokes');

    await expect(page.getByRole('button', { name: 'Fetch Joke' })).toBeVisible();
  });

  test('renders the site header on joke page', async ({ page }) => {
    await page.goto('/jokes');

    await expect(page.getByRole('heading', { name: 'SQS Preparation' })).toBeVisible();
  });
});
