/// <reference types="vitest/globals" />

import { render } from '@testing-library/react';

import { I18nWatcher } from '@/shared/components/i18n-watcher';

const mockChangeLanguage = vi.fn();
const mockI18n = {
  language: 'en',
  changeLanguage: mockChangeLanguage,
};
const mockT = vi.fn((key: string) => key);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: mockI18n,
  }),
}));

describe('I18nWatcher', () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
    mockT.mockClear();
    mockT.mockImplementation((key: string) => key);
    mockI18n.language = 'en';
    document.documentElement.lang = '';
    document.title = '';
  });

  it('sets document.documentElement.lang to "en" on initial render', () => {
    mockI18n.language = 'en';

    render(<I18nWatcher />);

    expect(document.documentElement.lang).toBe('en');
  });

  it('updates lang to "de" when language changes', () => {
    mockI18n.language = 'en';
    const { rerender } = render(<I18nWatcher />);

    expect(document.documentElement.lang).toBe('en');

    mockI18n.language = 'de';
    rerender(<I18nWatcher />);

    expect(document.documentElement.lang).toBe('de');
  });

  it('sets document.title to translated value', () => {
    mockT.mockImplementation((key: string) => {
      if (key === 'app.documentTitle') return 'SQS Preparation';
      return key;
    });

    render(<I18nWatcher />);

    expect(document.title).toBe('SQS Preparation');
  });

  it('returns null (renders nothing)', () => {
    const { container } = render(<I18nWatcher />);

    expect(container.firstChild).toBeNull();
  });
});
