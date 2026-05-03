import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ConfigErrorBanner } from 'src/shared/components/config-error-banner';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('ConfigErrorBanner', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
  });

  it('never renders in dev mode', () => {
    render(<ConfigErrorBanner />);
    expect(screen.queryByText(/VITE_API_BASE_URL is not set/)).not.toBeInTheDocument();
  });

  describe('in production', () => {
    beforeEach(() => {
      vi.stubEnv('PROD', true);
    });

    afterEach(() => {
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

    it('hides banner when VITE_API_BASE_URL is set', () => {
      vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000');
      render(<ConfigErrorBanner />);
      expect(screen.queryByText(/VITE_API_BASE_URL is not set/)).not.toBeInTheDocument();
    });

    it('dismisses banner on button click', () => {
      vi.stubEnv('VITE_API_BASE_URL', undefined);
      render(<ConfigErrorBanner />);
      fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
      expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
    });
  });
});
