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

  it('opens menu on button click and shows language options', async () => {
    const user = userEvent.setup();

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });

  it('current language is marked disabled with checkmark', async () => {
    const user = userEvent.setup();
    mockI18n.language = 'en';

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    const englishItem = screen.getByText('English').closest('[role="menuitem"]');
    expect(englishItem).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('selecting a different language calls changeLanguage', async () => {
    const user = userEvent.setup();
    mockI18n.language = 'en';

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    const deutschItem = screen.getByText('Deutsch');
    await user.click(deutschItem);

    expect(mockChangeLanguage).toHaveBeenCalledOnce();
    expect(mockChangeLanguage).toHaveBeenCalledWith('de');
  });

  it('selecting the current language does not call changeLanguage', async () => {
    const user = userEvent.setup();
    mockI18n.language = 'en';

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    const englishItem = screen.getByText('English');
    await user.click(englishItem);

    expect(mockChangeLanguage).not.toHaveBeenCalled();
  });

  it('works when current language is German', async () => {
    const user = userEvent.setup();
    mockI18n.language = 'de';

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    const germanItem = screen.getByText('Deutsch').closest('[role="menuitem"]');
    expect(germanItem).toHaveAttribute('aria-disabled', 'true');

    const englishItem = screen.getByText('English');
    await user.click(englishItem);

    expect(mockChangeLanguage).toHaveBeenCalledOnce();
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('button shows visible focus indicator when focused', async () => {
    const user = userEvent.setup();

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    await user.tab();

    expect(button).toHaveFocus();
  });

  it('Enter key opens the menu', async () => {
    const user = userEvent.setup();

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });

  it('Space key opens the menu', async () => {
    const user = userEvent.setup();

    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard(' ');

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
  });
});
