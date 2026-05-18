import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import jokeRoute from 'src/app/routes/joke-page';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
  refetch: ReturnType<typeof vi.fn>;
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

function getTranslation(key: string, translations: Record<string, unknown>): string {
  const result = key.split('.').reduce<unknown>((obj, part) => {
    if (obj && typeof obj === 'object' && part in obj) {
      return (obj as Record<string, unknown>)[part];
    }

    return undefined;
  }, translations);

  return typeof result === 'string' ? result : key;
}

// -----------------------------
// TESTS
// -----------------------------

describe('JokePage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();

    mockQuery.data = undefined;
    mockQuery.isError = false;
    mockQuery.isSuccess = false;
    mockQuery.isFetching = false;
  });

  it('renders placeholder initially', () => {
    renderComponent();

    expect(screen.getByText(enTranslation.jokePage.placeholder)).toBeInTheDocument();
  });

  it('renders heading', () => {
    renderComponent();

    expect(screen.getByText(enTranslation.jokePage.heading)).toBeInTheDocument();
  });

  it('renders fetch button initially', () => {
    renderComponent();

    expect(
      screen.getByRole('button', {
        name: enTranslation.jokePage.fetchButton,
      })
    ).toBeInTheDocument();
  });

  it('fetches and displays joke successfully', async () => {
    mockQuery.refetch.mockResolvedValue({
      status: 'success',
    });

    mockQuery.isSuccess = true;
    mockQuery.data = {
      content: 'Funny joke',
    };

    renderComponent();

    const button = screen.getByRole('button');

    await userEvent.click(button);

    await waitFor(() => {
      expect(mockQuery.refetch).toHaveBeenCalled();
    });

    expect(screen.getByText('Funny joke')).toBeInTheDocument();
  });

  it('renders error message', () => {
    mockQuery.isError = true;

    renderComponent();

    expect(screen.getByText(enTranslation.jokePage.error)).toBeInTheDocument();
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

  it('renders fetching button text while loading', () => {
    mockQuery.isFetching = true;

    renderComponent();

    expect(
      screen.getByRole('button', {
        name: enTranslation.jokePage.fetching,
      })
    ).toBeInTheDocument();
  });

  it('disables button while fetching', () => {
    mockQuery.isFetching = true;

    renderComponent();

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('increments counter after successful fetch', async () => {
    mockQuery.refetch.mockResolvedValue({
      status: 'success',
    });

    renderComponent();

    expect(screen.getByText('0')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('does not increment counter on failed fetch', async () => {
    mockQuery.refetch.mockResolvedValue({
      status: 'error',
    });

    renderComponent();

    await userEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  it('applies animation classes while fetching', async () => {
    let resolvePromise: ((value: { status: string }) => void) | undefined;

    mockQuery.refetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    const { container } = renderComponent();

    await userEvent.click(screen.getByRole('button'));

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
