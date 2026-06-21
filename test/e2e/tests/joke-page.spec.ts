import { test, expect } from '@playwright/test';
import { JokePage } from '../pages/joke-page.ts';

test.describe('Joke page', () => {
  test('displays heading and fetch button', async ({ page }) => {
    const jokePage = new JokePage(page);
    await jokePage.navigate();
    await jokePage.verifyHeading();
    await expect(jokePage.fetchJokeButton).toBeVisible();
  });

  test('fetches a random joke on button click', async ({ page }) => {
    const jokePage = new JokePage(page);
    await jokePage.navigate();
    await jokePage.clickFetchJoke();
    const jokeText = await jokePage.getJokeText();
    expect(jokeText).toBeDefined();
    expect(jokeText!.length).toBeGreaterThan(5);
  });

  test('counter increments after fetching a joke', async ({ page }) => {
    const jokePage = new JokePage(page);
    await jokePage.navigate();
    const initialCount = await jokePage.getJokeCount();
    await jokePage.clickFetchJoke();
    await jokePage.getJokeText(); // wait for joke to appear
    const newCount = await jokePage.getJokeCount();
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
