import { BasePage } from './base-page.ts';

export class JokePage extends BasePage {
  readonly url = '/jokes';

  get jokeHeading() { return this.page.getByTestId('joke-heading'); }
  get fetchJokeButton() { return this.page.getByTestId('fetch-joke-button'); }
  get jokeContent() { return this.page.getByTestId('joke-content'); }
  get jokeCounter() { return this.page.getByTestId('joke-counter'); }

  async verifyHeading() { await this.jokeHeading.waitFor({ state: 'visible' }); }

  async clickFetchJoke() { await this.fetchJokeButton.click(); }

  async getJokeText() {
    await this.jokeContent.waitFor({ state: 'visible' });
    return this.jokeContent.textContent();
  }

  async getJokeCount() {
    await this.jokeCounter.waitFor({ state: 'visible' });
    const text = await this.jokeCounter.textContent();
    return parseInt(text ?? '0', 10);
  }
}
