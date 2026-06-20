import { BasePage } from './base-page.ts';
import { type Page } from '@playwright/test';

export class HomePage extends BasePage {
  readonly url = '/';

  constructor(page: Page) {
    super(page);
  }

  async verifyWelcomeMessage(): Promise<void> {
    await this.page.getByTestId('home-heading').waitFor({ state: 'visible' });
  }

  async clickGoToJokes(): Promise<void> {
    await this.page.getByTestId('go-to-jokes-link').click();
  }
}
