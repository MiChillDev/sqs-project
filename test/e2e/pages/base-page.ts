import { type Page } from '@playwright/test';

export abstract class BasePage {
  abstract readonly url: string;

  constructor(protected readonly page: Page) {}

  get headerTitle() { return this.page.getByTestId('header-title'); }
  get themeToggle() { return this.page.getByTestId('theme-toggle'); }
  get languageToggle() { return this.page.getByTestId('language-toggle'); }
  get userMenuDropdown() { return this.page.getByTestId('user-menu-dropdown'); }
  get userMenuLogout() { return this.page.getByTestId('user-menu-logout'); }
  get userMenuLogin() { return this.page.getByTestId('user-menu-login'); }

  async navigate() { await this.page.goto(this.url); }

  async waitForUrl(pattern: string | RegExp) { await this.page.waitForURL(pattern); }

  async verifyHeader() { await this.headerTitle.waitFor({ state: 'visible' }); }

  async toggleDarkMode() { await this.themeToggle.click(); }

  async switchLanguage(lang: 'en' | 'de') {
    await this.languageToggle.click();
    await this.page.getByRole('menuitem', { name: lang === 'de' ? 'Deutsch' : 'English' }).click();
  }

  async logout() {
    await this.userMenuDropdown.click();
    await this.userMenuLogout.click();
    await this.userMenuLogin.waitFor({ state: 'visible' });
  }

  async verifyAuthenticated() { await this.userMenuDropdown.waitFor({ state: 'visible' }); }

  async verifyUnauthenticated() { await this.userMenuLogin.waitFor({ state: 'visible' }); }
}
