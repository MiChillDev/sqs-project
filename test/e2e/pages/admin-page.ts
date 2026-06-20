import { BasePage } from './base-page.ts';
import { type Page } from '@playwright/test';

export class AdminPage extends BasePage {
  readonly url = '/admin';

  constructor(page: Page) {
    super(page);
  }

  async createJoke(content: string, externalId?: string): Promise<void> {
    await this.page.getByTestId('joke-content-textarea').fill(content);
    if (externalId) {
      await this.page.getByTestId('joke-external-id-input').fill(externalId);
    }
    await this.page.getByTestId('create-joke-button').click();
  }

  async getCreatedJokeText(): Promise<string | null> {
    const el = this.page.getByTestId('create-joke-success');
    await el.waitFor({ state: 'visible' });
    return el.textContent();
  }

  async clickFetchSourceJoke(): Promise<void> {
    await this.page.getByTestId('fetch-source-joke-button').click();
    await this.page.getByTestId('source-joke-content').waitFor({ state: 'visible' });
  }

  async clickSaveSourceJoke(): Promise<void> {
    await this.page.getByTestId('save-source-joke-button').click();
  }

  async getSourceJokeText(): Promise<string | null> {
    const el = this.page.getByTestId('source-joke-content');
    await el.waitFor({ state: 'visible' });
    return el.textContent();
  }

  async getSaveConfirmation(): Promise<string | null> {
    const el = this.page.getByTestId('save-success-message');
    await el.waitFor({ state: 'visible' });
    return el.textContent();
  }
}
