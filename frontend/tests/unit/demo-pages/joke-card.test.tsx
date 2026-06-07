import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import demoApiRoute from 'src/app/routes/demo-api';
import { describe, expect, it, vi } from 'vitest';
import { createWrapper, mockFetch, t } from './test-utils';

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

describe('DemoApiPage', () => {
  const Component = demoApiRoute.options.component as ComponentType;

  describe('JokeCard', () => {
    it('renders joke card with fetch button in initial state', () => {
      render(<Component />, { wrapper: createWrapper() });
      expect(screen.getByText(t('jokePreview.title'))).toBeInTheDocument();
      const btn = screen.getByTestId('fetch-joke-btn');
      expect(btn).toHaveTextContent(t('jokePreview.fetchButton'));
      expect(btn).not.toBeDisabled();
    });

    it('shows joke content after successful fetch', async () => {
      const user = userEvent.setup();
      mockFetch({ id: '1', externalId: 'ext', content: 'A funny joke', status: 'UP' });
      render(<Component />, { wrapper: createWrapper() });

      await user.click(screen.getByTestId('fetch-joke-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('joke-content')).toHaveTextContent('A funny joke');
      });
      expect(screen.getByTestId('fetch-joke-btn')).toHaveTextContent(
        t('jokePreview.refetchButton')
      );
    });

    it('shows error message when joke fetch fails', async () => {
      const user = userEvent.setup();
      mockFetch(null, false);
      render(<Component />, { wrapper: createWrapper() });

      await user.click(screen.getByTestId('fetch-joke-btn'));

      await waitFor(() => {
        expect(screen.getByText(t('jokePreview.error'))).toBeInTheDocument();
      });
    });
  });
});
