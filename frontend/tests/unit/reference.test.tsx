import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import referenceRoute from '@/app/routes/reference';

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

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

function ReferencePage() {
  const Component = referenceRoute.options.component;
  if (!Component) throw new Error('Route component missing');
  return <Component />;
}

describe('ReferencePage', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the heading', () => {
    render(<ReferencePage />);
    expect(screen.getByRole('heading', { name: /Reference Implementation/ })).toBeInTheDocument();
  });

  it('renders name and email inputs', () => {
    render(<ReferencePage />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<ReferencePage />);
    await user.click(screen.getByRole('button', { name: /Submit/ }));
    expect(screen.getByText(/Name must be at least 2 characters/)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
  });

  it('renders the simulate error button', () => {
    render(<ReferencePage />);
    expect(screen.getByRole('button', { name: /Simulate Error/ })).toBeInTheDocument();
  });

  it('renders the theme toggle', () => {
    render(<ReferencePage />);
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
  });

  it('shows no validation errors on initial page load', () => {
    render(<ReferencePage />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows error after focusing and blurring an empty field', async () => {
    const user = userEvent.setup();
    render(<ReferencePage />);
    const nameInput = screen.getByLabelText('Name');
    await user.click(nameInput);
    await user.tab();
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/)).toBeInTheDocument();
    });
  });

  it('clears error when user enters valid input after blur', async () => {
    const user = userEvent.setup();
    render(<ReferencePage />);
    const nameInput = screen.getByLabelText('Name');
    await user.click(nameInput);
    await user.tab();
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/)).toBeInTheDocument();
    });
    await user.click(nameInput);
    await user.keyboard('John');
    await waitFor(() => {
      expect(screen.queryByText(/Name must be at least 2 characters/)).not.toBeInTheDocument();
    });
  });

  it('marks invalid fields with aria-invalid after validation error', async () => {
    const user = userEvent.setup();
    render(<ReferencePage />);
    await user.click(screen.getByRole('button', { name: /Submit/ }));
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('renders error messages with role="alert" for screen readers', async () => {
    const user = userEvent.setup();
    render(<ReferencePage />);
    await user.click(screen.getByRole('button', { name: /Submit/ }));
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });

  it('does NOT show toast on validation failure', async () => {
    const user = userEvent.setup();
    render(<ReferencePage />);
    await user.click(screen.getByRole('button', { name: /Submit/ }));
    await waitFor(() => {
      expect(screen.getByText(/must be at least/i)).toBeInTheDocument();
    });
    const { toast } = await import('sonner');
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
