import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import jokeRoute from 'src/app/routes/joke-page';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import enTranslation from '../../public/locales/en/translation.json';
import { getTranslation } from './shared/translation-helper';

// -----------------------------
// MOCKS
// -----------------------------

const { fetchApiMock } = vi.hoisted(() => ({
  fetchApiMock: vi.fn(),
}));

vi.mock('src/shared/api/api', () => ({
  fetchApi: fetchApiMock,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => getTranslation(key, enTranslation),
  }),
}));

vi.mock('src/shared/components/animations/confetti', () => ({
  Confetti: ({ trigger }: { trigger: boolean }) => (
    <div data-testid='confetti'>{String(trigger)}</div>
  ),
}));

// -----------------------------
// HELPERS
// -----------------------------

function renderComponent() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Component = jokeRoute.options.component as ComponentType;
  return render(
    <QueryClientProvider client={queryClient}>
      <Component />
    </QueryClientProvider>
  );
}

function mockSuccessfulFetch(content: string | null = 'Funny joke') {
  fetchApiMock.mockResolvedValueOnce(
    content === null
      ? {
          id: null,
          externalId: null,
          content: null,
        }
      : {
          id: '550e8400-e29b-41d4-a716-446655440000',
          externalId: 'test-external-id',
          content,
        }
  );
}

function mockFailedFetch() {
  fetchApiMock.mockRejectedValueOnce(new Error('fail'));
}

// -----------------------------
// TESTS
// -----------------------------

describe('JokePage', () => {
  beforeEach(() => {
    vi.useRealTimers();
    fetchApiMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders heading', () => {
    renderComponent();

    expect(screen.getByText(enTranslation.jokePage.heading)).toBeInTheDocument();
  });

  it('renders placeholder initially', () => {
    renderComponent();

    expect(screen.getByText(enTranslation.jokePage.placeholder)).toBeInTheDocument();
  });

  it('renders fetch button initially', () => {
    renderComponent();

    expect(
      screen.getByRole('button', {
        name: enTranslation.jokePage.fetchButton,
      })
    ).toBeInTheDocument();
  });

  it('renders no joke on mount', () => {
    renderComponent();

    expect(screen.queryByText(enTranslation.jokePage.error)).not.toBeInTheDocument();
    expect(screen.getByText(enTranslation.jokePage.placeholder)).toBeInTheDocument();
  });

  it('shows error after failed fetch', async () => {
    const user = userEvent.setup();
    mockFailedFetch();

    renderComponent();

    await user.click(screen.getByRole('button', { name: enTranslation.jokePage.fetchButton }));

    await waitFor(() => {
      expect(screen.getByText(enTranslation.jokePage.error)).toBeInTheDocument();
    });

    expect(screen.queryByText(enTranslation.jokePage.placeholder)).not.toBeInTheDocument();
  });

  it('shows empty message when fetch returns an empty joke DTO', async () => {
    const user = userEvent.setup();
    mockSuccessfulFetch(null);

    renderComponent();

    await user.click(screen.getByRole('button', { name: enTranslation.jokePage.fetchButton }));

    await waitFor(() => {
      expect(screen.getByText(enTranslation.jokePage.empty)).toBeInTheDocument();
    });

    expect(screen.queryByText(enTranslation.jokePage.placeholder)).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: enTranslation.jokePage.refetchButton,
      })
    ).toBeInTheDocument();
  });

  it('renders refetch button after success', async () => {
    const user = userEvent.setup();
    mockSuccessfulFetch('Another joke');

    renderComponent();

    await user.click(screen.getByRole('button', { name: enTranslation.jokePage.fetchButton }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: enTranslation.jokePage.refetchButton,
        })
      ).toBeInTheDocument();
    });
  });

  it('disables button while fetching', async () => {
    const user = userEvent.setup();

    let resolvePromise: ((value: { content: string }) => void) | undefined;
    fetchApiMock.mockReturnValueOnce(
      new Promise<{ content: string }>((resolve) => {
        resolvePromise = resolve;
      })
    );

    renderComponent();

    await user.click(screen.getByRole('button', { name: enTranslation.jokePage.fetchButton }));

    expect(screen.getByRole('button', { name: enTranslation.jokePage.fetchButton })).toBeDisabled();

    if (!resolvePromise) throw new Error('resolvePromise not set');
    resolvePromise({ content: 'ok' });

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: enTranslation.jokePage.refetchButton,
        })
      ).toBeInTheDocument();
    });
  });

  it('fetches and displays joke successfully', async () => {
    const user = userEvent.setup();
    mockSuccessfulFetch('Funny joke');

    renderComponent();

    await user.click(screen.getByRole('button', { name: enTranslation.jokePage.fetchButton }));

    await waitFor(() => {
      expect(screen.getByText('Funny joke')).toBeInTheDocument();
    });

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: enTranslation.jokePage.refetchButton,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText(enTranslation.jokePage.placeholder)).not.toBeInTheDocument();
  });

  it('does not increment counter on failed fetch', async () => {
    const user = userEvent.setup();
    mockFailedFetch();

    renderComponent();

    await user.click(screen.getByRole('button', { name: enTranslation.jokePage.fetchButton }));

    await waitFor(() => {
      expect(screen.getByText(enTranslation.jokePage.error)).toBeInTheDocument();
    });

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('does not increment counter when fetch returns an empty joke', async () => {
    const user = userEvent.setup();
    mockSuccessfulFetch(null);

    renderComponent();

    await user.click(screen.getByRole('button', { name: enTranslation.jokePage.fetchButton }));

    await waitFor(() => {
      expect(screen.getByText(enTranslation.jokePage.empty)).toBeInTheDocument();
    });

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('applies animation classes while fetching', async () => {
    const user = userEvent.setup();

    let resolvePromise: ((value: { content: string }) => void) | undefined;
    fetchApiMock.mockReturnValueOnce(
      new Promise<{ content: string }>((resolve) => {
        resolvePromise = resolve;
      })
    );

    const { container } = renderComponent();

    await user.click(screen.getByRole('button', { name: enTranslation.jokePage.fetchButton }));

    expect(container.querySelector('.scale-95')).toBeInTheDocument();

    if (!resolvePromise) throw new Error('resolvePromise not initialized');
    resolvePromise({ content: 'ok' });

    await waitFor(() => {
      expect(container.querySelector('.scale-100')).toBeInTheDocument();
    });
  });
});
