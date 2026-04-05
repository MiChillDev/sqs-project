/// <reference types="vitest/globals" />

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeToggle } from '@/shared/components/theme-toggle';

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

    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });

  it('has accessible label in light mode', () => {
    render(<ThemeToggle theme="light" onToggle={mockToggleTheme} />);

    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('has accessible label in dark mode', () => {
    render(<ThemeToggle theme="dark" onToggle={mockToggleTheme} />);

    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('calls onToggle when in dark mode', async () => {
    const user = userEvent.setup();

    render(<ThemeToggle theme="dark" onToggle={mockToggleTheme} />);

    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });
});
