import { BasePage } from './base-page.ts';

export class AdminPage extends BasePage {
  readonly url = '/admin';

  get jokeContentTextarea() { return this.page.getByTestId('joke-content-textarea'); }
  get jokeExternalIdInput() { return this.page.getByTestId('joke-external-id-input'); }
  get createJokeButton() { return this.page.getByTestId('create-joke-button'); }
  get createJokeSuccess() { return this.page.getByTestId('create-joke-success'); }
  get fetchSourceJokeButton() { return this.page.getByTestId('fetch-source-joke-button'); }
  get sourceJokeContent() { return this.page.getByTestId('source-joke-content'); }
  get saveSourceJokeButton() { return this.page.getByTestId('save-source-joke-button'); }
  get saveSuccessMessage() { return this.page.getByTestId('save-success-message'); }

  async clickCreateTab() {
    await this.page.getByRole('tab', { name: 'Create' }).click();
  }

  async getActiveTabLabel() {
    const tab = this.page.getByRole('tab', { selected: true });
    return (await tab.textContent()) ?? '';
  }

  async createJoke(content: string, externalId?: string) {
    await this.jokeContentTextarea.fill(content);
    if (externalId) await this.jokeExternalIdInput.fill(externalId);
    await this.createJokeButton.click();
  }

  async getCreatedJokeText() {
    await this.createJokeSuccess.waitFor({ state: 'visible' });
    return this.createJokeSuccess.textContent();
  }

  async clickFetchSourceJoke() {
    await this.fetchSourceJokeButton.click();
    await this.sourceJokeContent.waitFor({ state: 'visible' });
  }

  async clickSaveSourceJoke() { await this.saveSourceJokeButton.click(); }

  async getSourceJokeText() {
    await this.sourceJokeContent.waitFor({ state: 'visible' });
    return this.sourceJokeContent.textContent();
  }

  async getSaveConfirmation() {
    await this.saveSuccessMessage.waitFor({ state: 'visible' });
    return this.saveSuccessMessage.textContent();
  }
}
