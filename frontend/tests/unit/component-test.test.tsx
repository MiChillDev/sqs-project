import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import componentTestRoute from '@/app/routes/component-test';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() },
}));

describe('ComponentTestPage', () => {
  const Component = componentTestRoute.options.component;

  afterEach(() => {
    cleanup();
  });

  it('renders the page heading', () => {
    render(<Component />);
    expect(screen.getByText('Component Library Test')).toBeInTheDocument();
  });

  it('renders all button variants', () => {
    render(<Component />);
    expect(screen.getAllByText('Default').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Destructive')).toBeInTheDocument();
    expect(screen.getByText('Outline')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Ghost')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('renders card components', () => {
    render(<Component />);
    expect(screen.getByText('Simple Card')).toBeInTheDocument();
    expect(screen.getByText('Card with Action')).toBeInTheDocument();
    expect(screen.getByText('Header Action')).toBeInTheDocument();
  });

  it('renders form with name, email, and message inputs', () => {
    render(<Component />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<Component />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument();
    });
  });

  it('renders reset button', () => {
    render(<Component />);
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('clears values and errors when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Message')).toHaveValue('');
  });

  it('marks invalid fields with aria-invalid after validation error', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByRole('button', { name: /Submit/ }));
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('renders error messages with role="alert" for screen readers', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByRole('button', { name: /Submit/ }));
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });

  it('does NOT show toast on validation failure', async () => {
    const user = userEvent.setup();
    render(<Component />);
    await user.click(screen.getByRole('button', { name: /Submit/ }));
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
    const { toast } = await import('sonner');
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
