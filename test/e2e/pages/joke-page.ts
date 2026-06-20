import { BasePage } from './base-page.ts';
import { type Page } from '@playwright/test';

export class JokePage extends BasePage {
  readonly url = '/jokes';

  constructor(page: Page) {
    super(page);
  }

  async verifyHeading(): Promise<void> {
    await this.page.getByTestId('joke-heading').waitFor({ state: 'visible' });
  }

  async clickFetchJoke(): Promise<void> {
    await this.page.getByTestId('fetch-joke-button').click();
  }

  // Returns Promise<string | null> — consistent with other text-getters
  async getJokeText(): Promise<string | null> {
    const el = this.page.getByTestId('joke-content');
    await el.waitFor({ state: 'visible' });
    return el.textContent();
  }

  async getJokeCount(): Promise<number> {
    const el = this.page.getByTestId('joke-counter');
    await el.waitFor({ state: 'visible' });
    const text = await el.textContent();
    return parseInt(text ?? '0', 10);
  }
}
