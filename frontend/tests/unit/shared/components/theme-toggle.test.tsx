import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeToggle } from 'src/shared/components/theme-toggle';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
    const { container } = render(<ThemeToggle theme='light' onToggle={mockToggleTheme} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide-sun');
  });

  it('renders Moon icon in dark mode', () => {
    const { container } = render(<ThemeToggle theme='dark' onToggle={mockToggleTheme} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide-moon');
  });

  it('calls onToggle on click', async () => {
    const user = userEvent.setup();

    render(<ThemeToggle theme='light' onToggle={mockToggleTheme} />);

    const button = screen.getByRole('button', { name: 'Toggle theme' });
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });

  it.each(['light', 'dark'] as const)('has accessible label in %s mode', (theme) => {
    render(<ThemeToggle theme={theme} onToggle={mockToggleTheme} />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });
});
