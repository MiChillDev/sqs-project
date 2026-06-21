import { BasePage } from "./base-page.ts";
import { type Page } from "@playwright/test";

export class LoginPage extends BasePage {
  readonly url = "/login";

  get usernameInput() {
    return this.page.getByTestId("username-input");
  }
  get passwordInput() {
    return this.page.getByTestId("password-input");
  }
  get submitButton() {
    return this.page.getByTestId("submit-login-button");
  }
  get errorBanner() {
    return this.page.getByTestId("login-error-banner");
  }
  get title() {
    return this.page.getByTestId("login-title");
  }
  get validationError() {
    return this.page.locator('[data-invalid="true"]').first();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async submitLogin() {
    await this.submitButton.click();
  }

  async getErrorMessage() {
    if (await this.errorBanner.isVisible())
      return this.errorBanner.textContent();
    return null;
  }

  async verifyTitle() {
    await this.title.waitFor({ state: "visible" });
  }

  async verifyValidationError() {
    await this.validationError.waitFor({ state: "visible" });
  }
}
