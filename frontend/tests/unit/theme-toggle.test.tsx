/// <reference types="vitest/globals" />

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeToggle } from '@/shared/components/theme-toggle';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'app.toggleTheme': 'Toggle theme',
      };
      return translations[key] ?? key;
    },
    i18n: { language: 'en' },
  }),
}));

const mockToggleTheme = vi.fn();

beforeEach(() => {
  mockToggleTheme.mockClear();
});

describe('ThemeToggle', () => {
  it('renders Sun icon in light mode', () => {
    const { container } = render(<ThemeToggle theme="light" onToggle={mockToggleTheme} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide-sun');
  });

  it('renders Moon icon in dark mode', () => {
    const { container } = render(<ThemeToggle theme="dark" onToggle={mockToggleTheme} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide-moon');
  });

  it('calls onToggle on click', async () => {
    const user = userEvent.setup();

    render(<ThemeToggle theme="light" onToggle={mockToggleTheme} />);

    const button = screen.getByRole('button', { name: 'Toggle theme' });
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });

  it('has accessible label in light mode', () => {
    render(<ThemeToggle theme="light" onToggle={mockToggleTheme} />);

    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });

  it('has accessible label in dark mode', () => {
    render(<ThemeToggle theme="dark" onToggle={mockToggleTheme} />);

    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });

  it('calls onToggle when in dark mode', async () => {
    const user = userEvent.setup();

    render(<ThemeToggle theme="dark" onToggle={mockToggleTheme} />);

    const button = screen.getByRole('button', { name: 'Toggle theme' });
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });
});
