import { expect, test } from "@playwright/test";

test.describe("/demo/api page", () => {
  test("health check button shows API status UP", async ({ page }) => {
    await page.goto("/demo/api");
    const healthBtn = page.getByTestId("health-check-btn");

    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes("/health") && resp.ok(),
      ),
      healthBtn.click(),
    ]);

    await healthBtn.click();
    const statusText = page.getByTestId("health-status");
    await expect(statusText).toBeVisible({ timeout: 5000 });
    await expect(statusText).toContainText("UP");
  });

  test.fixme("fetch joke button displays joke content", async ({ page }) => {
    await page.goto("/demo/api");
    const fetchBtn = page.getByTestId("fetch-joke-btn");
    await fetchBtn.click();
    const jokeContent = page.getByTestId("joke-content");
    await expect(jokeContent).toBeVisible({ timeout: 5000 });
    await expect(jokeContent).toContainText(/.+/);
  });
});
