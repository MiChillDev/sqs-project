import { type Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  abstract readonly url: string;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitForUrl(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  async verifyHeader(): Promise<void> {
    await this.page.getByTestId('header-title').waitFor({ state: 'visible' });
  }

  async toggleDarkMode(): Promise<void> {
    await this.page.getByTestId('theme-toggle').click();
  }

  async switchLanguage(lang: 'en' | 'de'): Promise<void> {
    await this.page.getByTestId('language-toggle').click();
    const label = lang === 'de' ? 'Deutsch' : 'English';
    await this.page.getByRole('menuitem', { name: label }).click();
  }

  private async openUserMenu(): Promise<void> {
    await this.page.getByTestId('user-menu-dropdown').click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.page.getByTestId('user-menu-logout').click();
    await this.page.getByTestId('user-menu-login').waitFor({ state: 'visible' });
  }

  async verifyAuthenticated(): Promise<void> {
    await this.page.getByTestId('user-menu-dropdown').waitFor({ state: 'visible' });
  }

  async verifyUnauthenticated(): Promise<void> {
    await this.page.getByTestId('user-menu-login').waitFor({ state: 'visible' });
  }
}
