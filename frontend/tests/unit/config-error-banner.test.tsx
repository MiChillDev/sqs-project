import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfigErrorBanner } from '@/shared/components/config-error-banner';

describe('ConfigErrorBanner', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it('renders banner when VITE_API_BASE_URL is undefined', () => {
    vi.stubEnv('VITE_API_BASE_URL', undefined);
    render(<ConfigErrorBanner />);
    expect(screen.getByText(/VITE_API_BASE_URL is not set/)).toBeInTheDocument();
  });

  it('renders banner when VITE_API_BASE_URL is empty string', () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    render(<ConfigErrorBanner />);
    expect(screen.getByText(/VITE_API_BASE_URL is not set/)).toBeInTheDocument();
  });

  it('hides banner when VITE_API_BASE_URL is set to a valid value', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000');
    render(<ConfigErrorBanner />);
    expect(screen.queryByText(/VITE_API_BASE_URL is not set/)).not.toBeInTheDocument();
  });

  it('dismisses banner on button click', () => {
    vi.stubEnv('VITE_API_BASE_URL', undefined);
    render(<ConfigErrorBanner />);
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    fireEvent.click(dismissButton);
    expect(screen.queryByText(/VITE_API_BASE_URL is not set/)).not.toBeInTheDocument();
  });

  it('banner stays hidden after dismiss', () => {
    vi.stubEnv('VITE_API_BASE_URL', undefined);
    render(<ConfigErrorBanner />);
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    fireEvent.click(dismissButton);
    expect(screen.queryByText(/VITE_API_BASE_URL is not set/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
  });
});
