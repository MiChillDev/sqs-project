import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/home-page.ts";
import { JokePage } from "../pages/joke-page.ts";

test.describe("Home page", () => {
  test("displays welcome message", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyWelcomeMessage();
    await expect(homePage.homeHeading).toBeVisible();
  });

  test("navigates to jokes page", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.clickGoToJokes();

    const jokePage = new JokePage(page);
    await jokePage.waitForUrl("**/jokes");
    await jokePage.verifyHeading();
  });
});
