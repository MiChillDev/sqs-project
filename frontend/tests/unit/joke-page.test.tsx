import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import jokeRoute from 'src/app/routes/joke-page';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import enTranslation from '../../public/locales/en/translation.json';

// -----------------------------
// MOCKS
// -----------------------------

const refetchMock = vi.fn();

type MockQuery = {
  data?: {
    content: string;
  };
  isError: boolean;
  isSuccess: boolean;
  isFetching: boolean;
  refetch: typeof refetchMock;
};

const mockQuery: MockQuery = {
  data: undefined,
  isError: false,
  isSuccess: false,
  isFetching: false,
  refetch: refetchMock,
};

vi.mock('src/shared/api/hooks', () => ({
  useRandomJoke: () => mockQuery,
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
  const Component = jokeRoute.options.component as ComponentType;
  return render(<Component />);
}

function resetMockQuery() {
  mockQuery.data = undefined;
  mockQuery.isError = false;
  mockQuery.isSuccess = false;
  mockQuery.isFetching = false;
  refetchMock.mockReset();
}

function getTranslation(key: string, translations: Record<string, unknown>): string {
  const result = key.split('.').reduce<unknown>((obj, part) => {
    if (obj && typeof obj === 'object' && part in obj) {
      return (obj as Record<string, unknown>)[part];
    }

    return undefined;
  }, translations);

  return typeof result === 'string' ? result : key;
}

function mockSuccessfulRefetch(content = 'Funny joke') {
  refetchMock.mockImplementationOnce(async () => {
    mockQuery.isError = false;
    mockQuery.isSuccess = true;
    mockQuery.data = { content };

    return {
      status: 'success' as const,
      data: mockQuery.data,
    };
  });
}

function mockFailedRefetch() {
  refetchMock.mockImplementationOnce(async () => {
    mockQuery.isError = true;
    mockQuery.isSuccess = false;
    mockQuery.data = undefined;

    return {
      status: 'error' as const,
    };
  });
}

// -----------------------------
// TESTS
// -----------------------------

describe('JokePage', () => {
  beforeEach(() => {
    vi.useRealTimers();
    resetMockQuery();
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

  it('renders error message when the query is in error state', () => {
    mockQuery.isError = true;

    renderComponent();

    expect(screen.getByText(enTranslation.jokePage.error)).toBeInTheDocument();
    expect(screen.queryByText(enTranslation.jokePage.placeholder)).not.toBeInTheDocument();
  });

  it('renders empty state when the query succeeds with empty content', () => {
    mockQuery.isSuccess = true;
    mockQuery.data = {
      content: '',
    };

    renderComponent();

    expect(screen.getByText(enTranslation.jokePage.empty)).toBeInTheDocument();
    expect(screen.getByText(enTranslation.jokePage.placeholder)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: enTranslation.jokePage.refetchButton,
      })
    ).toBeInTheDocument();
  });

  it('renders refetch button after success', () => {
    mockQuery.isSuccess = true;
    mockQuery.data = {
      content: 'Another joke',
    };

    renderComponent();

    expect(
      screen.getByRole('button', {
        name: enTranslation.jokePage.refetchButton,
      })
    ).toBeInTheDocument();
  });

  it('disables button while fetching', () => {
    mockQuery.isFetching = true;

    renderComponent();

    expect(
      screen.getByRole('button', {
        name: enTranslation.jokePage.fetchButton,
      })
    ).toBeDisabled();
  });

  it('fetches and displays joke successfully', async () => {
    const user = userEvent.setup();
    mockSuccessfulRefetch('Funny joke');

    renderComponent();

    await user.click(
      screen.getByRole('button', {
        name: enTranslation.jokePage.fetchButton,
      })
    );

    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('Funny joke')).toBeInTheDocument();
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
    mockFailedRefetch();

    renderComponent();

    await user.click(
      screen.getByRole('button', {
        name: enTranslation.jokePage.fetchButton,
      })
    );

    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText(enTranslation.jokePage.error)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('does not increment counter when a successful fetch returns an empty joke', async () => {
    const user = userEvent.setup();
    mockQuery.refetch.mockImplementationOnce(async () => {
      mockQuery.isError = false;
      mockQuery.isSuccess = true;
      mockQuery.data = {
        content: '',
      };

      return {
        status: 'success' as const,
        data: mockQuery.data,
      };
    });

    renderComponent();

    await user.click(
      screen.getByRole('button', {
        name: enTranslation.jokePage.fetchButton,
      })
    );

    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText(enTranslation.jokePage.empty)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('applies animation classes while fetching', async () => {
    const user = userEvent.setup();

    let resolvePromise: ((value: { status: string }) => void) | undefined;

    mockQuery.refetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    const { container } = renderComponent();

    await user.click(
      screen.getByRole('button', {
        name: enTranslation.jokePage.fetchButton,
      })
    );

    expect(container.querySelector('.scale-95')).toBeInTheDocument();

    if (!resolvePromise) {
      throw new Error('resolvePromise not initialized');
    }

    resolvePromise({
      status: 'success',
    });

    await waitFor(() => {
      expect(container.querySelector('.scale-100')).toBeInTheDocument();
    });
  });
});
