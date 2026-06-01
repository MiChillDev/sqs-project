import { expect, test } from "@playwright/test";

test.describe("/demo page", () => {
	test("page loads and shows heading", async ({ page }) => {
		await page.goto("/demo");
		const heading = page.getByTestId("demo-heading");
		await expect(heading).toBeVisible();
	});

	test("clicking default button shows a toast notification", async ({
		page,
	}) => {
		await page.goto("/demo");
		const button = page.getByTestId("btn-default");
		await button.click();
		const toast = page.getByRole("status");
		await expect(toast).toBeVisible({ timeout: 5000 });
	});
});
