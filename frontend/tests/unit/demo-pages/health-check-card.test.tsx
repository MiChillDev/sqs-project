import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import demoApiRoute from 'src/app/routes/demo-api';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createWrapper, mockFetch, mockFetchPending, t } from './test-utils';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t, i18n: { language: 'en' } }),
}));

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    message: vi.fn(),
  }),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe('DemoApiPage', () => {
  const Component = demoApiRoute.options.component as ComponentType;

  describe('HealthCheckCard', () => {
    it('renders the health check card with title and description', () => {
      render(<Component />, { wrapper: createWrapper() });
      expect(screen.getByText(t('connectivityTest.title'))).toBeInTheDocument();
      expect(screen.getByText(t('connectivityTest.description'))).toBeInTheDocument();
    });

    it('renders the test connection button', () => {
      render(<Component />, { wrapper: createWrapper() });
      const btn = screen.getByTestId('health-check-btn');
      expect(btn).toHaveTextContent(t('connectivityTest.testButton'));
      expect(btn).not.toBeDisabled();
    });

    it('disables button and shows testing text while fetching', async () => {
      mockFetchPending();
      const user = userEvent.setup();
      render(<Component />, { wrapper: createWrapper() });

      await user.click(screen.getByTestId('health-check-btn'));

      const btn = screen.getByTestId('health-check-btn');
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent(t('connectivityTest.testing'));
    });

    it('shows health status on successful check', async () => {
      const user = userEvent.setup();
      mockFetch({ status: 'UP', message: 'All systems operational' });
      render(<Component />, { wrapper: createWrapper() });

      await user.click(screen.getByTestId('health-check-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('health-status')).toBeInTheDocument();
      });
      expect(screen.getByTestId('health-status')).toHaveTextContent('UP');
    });

    it('shows error text when health check fails', async () => {
      const user = userEvent.setup();
      mockFetch(null, false);
      render(<Component />, { wrapper: createWrapper() });

      await user.click(screen.getByTestId('health-check-btn'));

      await waitFor(() => {
        expect(screen.getByText(t('connectivityTest.error'))).toBeInTheDocument();
      });
    });

    it('calls toast.success after a successful health check', async () => {
      const user = userEvent.setup();
      mockFetch({ status: 'UP' });
      render(<Component />, { wrapper: createWrapper() });

      await user.click(screen.getByTestId('health-check-btn'));

      const { toast } = await import('sonner');
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(t('connectivityTest.toastTitle'), {
          description: t('connectivityTest.toastDescription'),
        });
      });
    });

    it('does not show toast when health check fails', async () => {
      const user = userEvent.setup();
      mockFetch(null, false);
      render(<Component />, { wrapper: createWrapper() });

      await user.click(screen.getByTestId('health-check-btn'));

      await waitFor(() => {
        expect(screen.getByText(t('connectivityTest.error'))).toBeInTheDocument();
      });
      const { toast } = await import('sonner');
      expect(toast.success).not.toHaveBeenCalled();
    });
  });
});
