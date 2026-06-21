import { BasePage } from './base-page.ts';
import { type Page } from '@playwright/test';

export class LoginPage extends BasePage {
  readonly url = '/login';

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submitLogin();
  }

  async fillUsername(value: string): Promise<void> {
    await this.page.getByTestId('username-input').fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.page.getByTestId('password-input').fill(value);
  }

  async submitLogin(): Promise<void> {
    await this.page.getByTestId('submit-login-button').click();
  }

  // Returns Promise<string | null> — consistent return type
  async getErrorMessage(): Promise<string | null> {
    const el = this.page.getByTestId('login-error-banner');
    if (await el.isVisible()) {
      return el.textContent();
    }
    return null;
  }

  async verifyTitle(): Promise<void> {
    await this.page.getByTestId('login-title').waitFor({ state: 'visible' });
  }
}
