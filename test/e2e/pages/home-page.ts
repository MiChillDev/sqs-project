import { BasePage } from './base-page.ts';

export class HomePage extends BasePage {
  readonly url = '/';

  get homeHeading() { return this.page.getByTestId('home-heading'); }
  get goToJokesLink() { return this.page.getByTestId('go-to-jokes-link'); }

  async verifyWelcomeMessage() { await this.homeHeading.waitFor({ state: 'visible' }); }

  async clickGoToJokes() { await this.goToJokesLink.click(); }
}
