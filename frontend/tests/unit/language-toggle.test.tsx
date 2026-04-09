/// <reference types="vitest/globals" />

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LanguageToggle } from '@/shared/components/language-toggle';

const mockChangeLanguage = vi.fn();
const mockI18n = {
  language: 'en',
  changeLanguage: mockChangeLanguage,
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: mockI18n,
  }),
}));

describe('LanguageToggle', () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
    mockI18n.language = 'en';
  });

  it('renders Languages icon', () => {
    const { container } = render(<LanguageToggle />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide-languages');
  });

  it('click calls changeLanguage with "de" when English', async () => {
    const user = userEvent.setup();
    mockI18n.language = 'en';

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockChangeLanguage).toHaveBeenCalledOnce();
    expect(mockChangeLanguage).toHaveBeenCalledWith('de');
  });

  it('click calls changeLanguage with "en" when German', async () => {
    const user = userEvent.setup();
    mockI18n.language = 'de';

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockChangeLanguage).toHaveBeenCalledOnce();
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('aria-label is "Switch to German" in English mode', () => {
    mockI18n.language = 'en';

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to German');
  });

  it('aria-label is "Switch to English" in German mode', () => {
    mockI18n.language = 'de';

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to English');
  });

  it('button shows visible focus indicator when focused', async () => {
    const user = userEvent.setup();

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await user.tab();

    expect(button).toHaveFocus();
  });

  it('Enter key activates toggle', async () => {
    const user = userEvent.setup();

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');

    expect(mockChangeLanguage).toHaveBeenCalledOnce();
  });

  it('Space key activates toggle', async () => {
    const user = userEvent.setup();

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard(' ');

    expect(mockChangeLanguage).toHaveBeenCalledOnce();
  });
});
