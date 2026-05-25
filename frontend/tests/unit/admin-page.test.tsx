import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { ApiError, NetworkError } from 'src/shared/api/api-error';
import type { AuthStorageValue } from 'src/shared/lib/auth-storage';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import enTranslation from '../../public/locales/en/translation.json';

// -----------------------------
// HOISTED MOCKS
// -----------------------------

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

const { mockAuthStorageClear, mockAuthStorageGet } = vi.hoisted(() => ({
  mockAuthStorageClear: vi.fn(),
  mockAuthStorageGet: vi.fn<() => AuthStorageValue | null>(() => ({
    token: 'valid-token',
    expiresAt: '2099-06-25T10:30:00',
  })),
}));

const mockCreateJokeMutation = {
  mutate: vi.fn(),
  isPending: false,
};

const mockSourceJokeQuery = {
  refetch: vi.fn(),
  isFetching: false,
  data: undefined as { content: string } | undefined,
  error: null as Error | null,
};

// -----------------------------
// MOCKS
// -----------------------------

vi.mock('src/shared/lib/auth-storage', () => ({
  authStorage: {
    get: mockAuthStorageGet,
    set: vi.fn(),
    clear: mockAuthStorageClear,
  },
}));

vi.mock('src/shared/api/hooks', () => ({
  useCreateJoke: () => mockCreateJokeMutation,
  useSourceJoke: () => mockSourceJokeQuery,
}));

// -----------------------------
// HELPERS
// -----------------------------

function getTranslation(key: string, translations: Record<string, unknown>): string {
  const result = key.split('.').reduce<unknown>((obj, part) => {
    if (obj && typeof obj === 'object' && part in obj) {
      return (obj as Record<string, unknown>)[part];
    }
    return undefined;
  }, translations);
  return typeof result === 'string' ? result : key;
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => getTranslation(key, enTranslation),
    i18n: { language: 'en' },
  }),
}));

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

import adminRoute from 'src/app/routes/admin';

function renderComponent() {
  const Component = adminRoute.options.component as ComponentType;
  return render(<Component />);
}

function resetMocks() {
  mockCreateJokeMutation.mutate = vi.fn();
  mockCreateJokeMutation.isPending = false;
  mockSourceJokeQuery.refetch = vi.fn();
  mockSourceJokeQuery.isFetching = false;
  mockSourceJokeQuery.data = undefined;
  mockSourceJokeQuery.error = null;
  mockNavigate.mockReset();
  mockAuthStorageClear.mockReset();
}

// -----------------------------
// TESTS
// -----------------------------

describe('AdminPage', () => {
  beforeEach(resetMocks);
  afterEach(cleanup);

  it('route /admin is defined and has beforeLoad set', () => {
    expect(adminRoute.options.beforeLoad).toBeDefined();
  });

  it('renders "Admin" heading', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
  });

  it('page layout uses max-w-200 p-8 class', () => {
    const { container } = renderComponent();
    const rootDiv = container.firstElementChild;
    expect(rootDiv).toHaveClass('max-w-200');
    expect(rootDiv).toHaveClass('p-8');
  });

  it('renders section headings for Create Joke and Fetch Source Joke', () => {
    renderComponent();
    // CardTitle renders as a div with data-slot="card-title";
    // both section names also appear on buttons, so multiple elements match
    expect(screen.getAllByText('Create Joke').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Fetch Source Joke').length).toBeGreaterThanOrEqual(2);
  });
});

describe('JokeCreationSection', () => {
  beforeEach(resetMocks);
  afterEach(cleanup);

  it('renders content textarea, external ID input, and submit button', () => {
    renderComponent();

    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByLabelText('External ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Joke' })).toBeInTheDocument();
  });

  it('submits valid form → calls mutate with form data', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText('Content'), 'A funny joke');
    await user.type(screen.getByLabelText('External ID'), 'ext-123');
    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    await waitFor(() => {
      expect(mockCreateJokeMutation.mutate).toHaveBeenCalledWith(
        { content: 'A funny joke', externalId: 'ext-123' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });
  });

  it('submits with empty externalId when field is left blank', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText('Content'), 'A funny joke');
    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    await waitFor(() => {
      expect(mockCreateJokeMutation.mutate).toHaveBeenCalledWith(
        { content: 'A funny joke', externalId: '' },
        expect.any(Object)
      );
    });
  });

  it('displays created joke content on success', async () => {
    const user = userEvent.setup();

    mockCreateJokeMutation.mutate.mockImplementation(
      (_vars: unknown, opts?: { onSuccess?: (data: unknown) => void }) => {
        opts?.onSuccess?.({ id: '1', externalId: 'ext-1', content: 'Created joke text!' });
      }
    );

    renderComponent();

    await user.type(screen.getByLabelText('Content'), 'A funny joke');
    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    await waitFor(() => {
      expect(screen.getByText('Created joke text!')).toBeInTheDocument();
    });
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();

    mockCreateJokeMutation.mutate.mockImplementation(
      (_vars: unknown, opts?: { onSuccess?: (data: unknown) => void }) => {
        opts?.onSuccess?.({ id: '1', externalId: 'ext-1', content: 'Joke' });
      }
    );

    renderComponent();

    await user.type(screen.getByLabelText('Content'), 'A funny joke');
    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Content')).toHaveValue('');
    });
  });

  it('displays server error message on ApiError 500', async () => {
    const user = userEvent.setup();

    mockCreateJokeMutation.mutate.mockImplementation(
      (_vars: unknown, opts?: { onError?: (e: Error) => void }) => {
        opts?.onError?.(new ApiError(500, 'Server Error', {}));
      }
    );

    renderComponent();

    await user.type(screen.getByLabelText('Content'), 'A funny joke');
    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    });
  });

  it('displays network error message on NetworkError', async () => {
    const user = userEvent.setup();

    mockCreateJokeMutation.mutate.mockImplementation(
      (_vars: unknown, opts?: { onError?: (e: Error) => void }) => {
        opts?.onError?.(new NetworkError(new Error('Failed')));
      }
    );

    renderComponent();

    await user.type(screen.getByLabelText('Content'), 'A funny joke');
    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Unable to connect');
    });
  });

  it('clears auth and redirects to /login on 401', async () => {
    const user = userEvent.setup();

    mockCreateJokeMutation.mutate.mockImplementation(
      (_vars: unknown, opts?: { onError?: (e: Error) => void }) => {
        opts?.onError?.(new ApiError(401, 'Unauthorized', {}));
      }
    );

    renderComponent();

    await user.type(screen.getByLabelText('Content'), 'A funny joke');
    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    await waitFor(() => {
      expect(mockAuthStorageClear).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login', search: { redirect: '/admin' } });
    });
  });

  it('shows "Submitting..." and disables button while pending', () => {
    mockCreateJokeMutation.isPending = true;

    renderComponent();

    const button = screen.getByRole('button', { name: 'Submitting...' });
    expect(button).toBeDisabled();
  });

  it('does not submit when content is empty (schema validation)', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    // mutate must not be called due to validation failure
    expect(mockCreateJokeMutation.mutate).not.toHaveBeenCalled();
  });

  it('shows retry button on non-401 error', async () => {
    const user = userEvent.setup();

    mockCreateJokeMutation.mutate.mockImplementation(
      (_vars: unknown, opts?: { onError?: (e: Error) => void }) => {
        opts?.onError?.(new ApiError(500, 'Server Error', {}));
      }
    );

    renderComponent();

    await user.type(screen.getByLabelText('Content'), 'A funny joke');
    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  it('retry button resubmits the form data', async () => {
    const user = userEvent.setup();

    mockCreateJokeMutation.mutate.mockImplementation(
      (_vars: unknown, opts?: { onError?: (e: Error) => void }) => {
        opts?.onError?.(new NetworkError(new Error('Failed')));
      }
    );

    renderComponent();

    await user.type(screen.getByLabelText('Content'), 'A funny joke');
    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    const retryButton = await screen.findByRole('button', { name: 'Retry' });
    expect(mockCreateJokeMutation.mutate).toHaveBeenCalledTimes(1);

    await user.click(retryButton);

    expect(mockCreateJokeMutation.mutate).toHaveBeenCalledTimes(2);
    // The retry should resubmit with the same content
    expect(mockCreateJokeMutation.mutate).toHaveBeenLastCalledWith(
      { content: 'A funny joke', externalId: '' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('no retry button on 401 error (redirect instead)', async () => {
    const user = userEvent.setup();

    mockCreateJokeMutation.mutate.mockImplementation(
      (_vars: unknown, opts?: { onError?: (e: Error) => void }) => {
        opts?.onError?.(new ApiError(401, 'Unauthorized', {}));
      }
    );

    renderComponent();

    await user.type(screen.getByLabelText('Content'), 'A funny joke');
    await user.click(screen.getByRole('button', { name: 'Create Joke' }));

    await waitFor(() => {
      expect(mockAuthStorageClear).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login', search: { redirect: '/admin' } });
    });

    // Retry button should NOT appear on 401
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  describe('edge case: network failure preserves token (no redirect)', () => {
    it('does NOT redirect on NetworkError', async () => {
      const user = userEvent.setup();

      mockCreateJokeMutation.mutate.mockImplementation(
        (_vars: unknown, opts?: { onError?: (e: Error) => void }) => {
          opts?.onError?.(new NetworkError(new Error('Failed')));
        }
      );

      renderComponent();

      await user.type(screen.getByLabelText('Content'), 'A funny joke');
      await user.click(screen.getByRole('button', { name: 'Create Joke' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Should NOT redirect on network error — token may still be valid
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockAuthStorageClear).not.toHaveBeenCalled();
    });
  });
});

describe('SourceJokeSection', () => {
  beforeEach(resetMocks);
  afterEach(cleanup);

  it('renders fetch button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'Fetch Source Joke' })).toBeInTheDocument();
  });

  it('triggers refetch on button click', async () => {
    const user = userEvent.setup();
    mockSourceJokeQuery.refetch.mockResolvedValue({ data: undefined, error: null });

    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Fetch Source Joke' }));

    expect(mockSourceJokeQuery.refetch).toHaveBeenCalledOnce();
  });

  it('displays joke content on successful fetch', async () => {
    mockSourceJokeQuery.data = { content: 'A sourced joke!' };
    mockSourceJokeQuery.isFetching = false;

    // Set up refetch to resolve with the data
    mockSourceJokeQuery.refetch.mockResolvedValue({
      data: { content: 'A sourced joke!' },
      error: null,
    });

    renderComponent();

    // data is already set via mock, so it shows immediately
    expect(screen.getByText('A sourced joke!')).toBeInTheDocument();
  });

  it('clears auth and redirects to /login on 401 error', async () => {
    const user = userEvent.setup();
    const unauthError = new ApiError(401, 'Unauthorized', {});

    mockSourceJokeQuery.refetch.mockResolvedValue({
      data: undefined,
      error: unauthError,
    });

    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Fetch Source Joke' }));

    await waitFor(() => {
      expect(mockAuthStorageClear).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login', search: { redirect: '/admin' } });
    });
  });

  it('shows error message and retry button on network error', async () => {
    const user = userEvent.setup();
    const netError = new NetworkError(new Error('Failed'));

    mockSourceJokeQuery.refetch.mockResolvedValue({
      data: undefined,
      error: netError,
    });

    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Fetch Source Joke' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Unable to connect');
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  it('retry button triggers another refetch', async () => {
    const user = userEvent.setup();
    const netError = new NetworkError(new Error('Failed'));

    mockSourceJokeQuery.refetch.mockResolvedValue({
      data: undefined,
      error: netError,
    });

    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Fetch Source Joke' }));

    const retryButton = await screen.findByRole('button', { name: 'Retry' });

    mockSourceJokeQuery.refetch.mockResolvedValue({ data: undefined, error: null });
    await user.click(retryButton);

    // refetch should be called twice: once for initial fetch, once for retry
    expect(mockSourceJokeQuery.refetch).toHaveBeenCalledTimes(2);
  });

  it('shows "Fetching..." and disables button while loading', () => {
    mockSourceJokeQuery.isFetching = true;

    renderComponent();

    const button = screen.getByRole('button', { name: 'Fetching...' });
    expect(button).toBeDisabled();
  });

  it('does NOT redirect on non-401 ApiError', async () => {
    const user = userEvent.setup();
    const serverError = new ApiError(500, 'Server Error', {});

    mockSourceJokeQuery.refetch.mockResolvedValue({
      data: undefined,
      error: serverError,
    });

    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Fetch Source Joke' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    });

    // should NOT redirect
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  describe('edge case: network failure preserves token (no redirect)', () => {
    it('does NOT redirect on NetworkError in source joke fetch', async () => {
      const user = userEvent.setup();
      const netError = new NetworkError(new Error('Failed'));

      mockSourceJokeQuery.refetch.mockResolvedValue({
        data: undefined,
        error: netError,
      });

      renderComponent();

      await user.click(screen.getByRole('button', { name: 'Fetch Source Joke' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Should NOT redirect on network error
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockAuthStorageClear).not.toHaveBeenCalled();
    });
  });
});

// -----------------------------------------------
// T4.1: Integration / End-to-end flow tests
// -----------------------------------------------

describe('AdminPage — integration flows', () => {
  beforeEach(resetMocks);
  afterEach(cleanup);

  describe('Full admin page rendering with sections', () => {
    it('renders all sections: heading, JokeCreationSection, SourceJokeSection', () => {
      renderComponent();

      expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();

      // JokeCreationSection — card title (div) and form elements
      expect(screen.getAllByText('Create Joke').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByLabelText('Content')).toBeInTheDocument();
      expect(screen.getByLabelText('External ID')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Joke' })).toBeInTheDocument();

      // SourceJokeSection — card title (div) and button
      expect(screen.getAllByText('Fetch Source Joke').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByRole('button', { name: 'Fetch Source Joke' })).toBeInTheDocument();
    });
  });

  describe('Complete create joke → success → display flow', () => {
    it('fully creates a joke and displays the result', async () => {
      const user = userEvent.setup();

      mockCreateJokeMutation.mutate.mockImplementation(
        (_vars: unknown, opts?: { onSuccess?: (data: unknown) => void }) => {
          opts?.onSuccess?.({
            id: '1',
            externalId: 'ext-1',
            content: 'Chuck Norris can divide by zero.',
          });
        }
      );

      renderComponent();

      // Fill in form
      await user.type(screen.getByLabelText('Content'), 'Chuck Norris can divide by zero.');
      await user.type(screen.getByLabelText('External ID'), 'ext-1');

      // Submit
      await user.click(screen.getByRole('button', { name: 'Create Joke' }));

      // Verify success display
      await waitFor(() => {
        expect(screen.getByText('Chuck Norris can divide by zero.')).toBeInTheDocument();
      });

      // Form should be reset
      expect(screen.getByLabelText('Content')).toHaveValue('');
    });
  });

  describe('Complete source joke fetch → display flow', () => {
    it('fetches and displays a source joke', async () => {
      const user = userEvent.setup();

      // Set up refetch to return joke data
      mockSourceJokeQuery.refetch.mockResolvedValue({
        data: { content: 'Chuck Norris uses ribbed lightbulbs.' },
        error: null,
      });

      renderComponent();

      await user.click(screen.getByRole('button', { name: 'Fetch Source Joke' }));

      // After refetch resolves, the mock needs to have data set
      // In real usage, the query hook would update data after successful refetch
      // For this test, we manually set data to simulate the query cache update
      mockSourceJokeQuery.data = { content: 'Chuck Norris uses ribbed lightbulbs.' };
      mockSourceJokeQuery.isFetching = false;

      // Re-render to reflect the new data state
      cleanup();
      renderComponent();

      expect(screen.getByText('Chuck Norris uses ribbed lightbulbs.')).toBeInTheDocument();
    });
  });

  describe('401 handling flow — API call fails with 401', () => {
    it('clears token and redirects when joke creation returns 401', async () => {
      const user = userEvent.setup();

      mockCreateJokeMutation.mutate.mockImplementation(
        (_vars: unknown, opts?: { onError?: (e: Error) => void }) => {
          opts?.onError?.(new ApiError(401, 'Unauthorized', {}));
        }
      );

      renderComponent();

      await user.type(screen.getByLabelText('Content'), 'A joke');
      await user.click(screen.getByRole('button', { name: 'Create Joke' }));

      await waitFor(() => {
        expect(mockAuthStorageClear).toHaveBeenCalledOnce();
        expect(mockNavigate).toHaveBeenCalledWith({
          to: '/login',
          search: { redirect: '/admin' },
        });
      });
    });
  });

  describe('Network failure flow — error with retry, no redirect', () => {
    it('shows error and retry, does NOT redirect on network failure in joke creation', async () => {
      const user = userEvent.setup();

      mockCreateJokeMutation.mutate.mockImplementation(
        (_vars: unknown, opts?: { onError?: (e: Error) => void }) => {
          opts?.onError?.(new NetworkError(new Error('Offline')));
        }
      );

      renderComponent();

      await user.type(screen.getByLabelText('Content'), 'A joke');
      await user.click(screen.getByRole('button', { name: 'Create Joke' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
      });

      // Token must NOT be cleared; must NOT redirect
      expect(mockAuthStorageClear).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Double-submit prevention (joke creation)', () => {
    it('disables submit button while joke creation is pending', () => {
      mockCreateJokeMutation.isPending = true;

      renderComponent();

      const button = screen.getByRole('button', { name: 'Submitting...' });
      expect(button).toBeDisabled();
    });
  });

  describe('Double-submit prevention (source joke)', () => {
    it('disables button while source joke fetch is pending', () => {
      mockSourceJokeQuery.isFetching = true;

      renderComponent();

      const button = screen.getByRole('button', { name: 'Fetching...' });
      expect(button).toBeDisabled();
    });
  });
});
