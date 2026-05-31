import { afterEach, beforeEach, describe, expect, it } from './shared';
import {
  resetMocks,
  renderComponent,
  screen,
  waitFor,
  userEvent,
  cleanup,
  ApiError,
  NetworkError,
  mockCreateJokeMutation,
  mockSourceJokeQuery,
  mockAuthStorageClear,
  mockNavigate,
} from './shared';

describe('AdminPage — integration flows', () => {
  beforeEach(resetMocks);
  afterEach(cleanup);

  describe('Full admin page rendering with sections', () => {
    it('renders all sections: heading, JokeCreationSection, SourceJokeSection', () => {
      renderComponent();

      expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();

      expect(screen.getAllByText('Create Joke').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByLabelText('Content')).toBeInTheDocument();
      expect(screen.getByLabelText('External ID')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Joke' })).toBeInTheDocument();

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

      await user.type(screen.getByLabelText('Content'), 'Chuck Norris can divide by zero.');
      await user.type(screen.getByLabelText('External ID'), 'ext-1');

      await user.click(screen.getByRole('button', { name: 'Create Joke' }));

      await waitFor(() => {
        expect(screen.getByText('Chuck Norris can divide by zero.')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Content')).toHaveValue('');
    });
  });

  describe('Complete source joke fetch → display flow', () => {
    it('fetches and displays a source joke', async () => {
      const user = userEvent.setup();

      mockSourceJokeQuery.refetch.mockResolvedValue({
        data: { content: 'Chuck Norris uses ribbed lightbulbs.' },
        error: null,
      });

      renderComponent();

      await user.click(screen.getByRole('button', { name: 'Fetch Source Joke' }));

      mockSourceJokeQuery.data = { content: 'Chuck Norris uses ribbed lightbulbs.' };
      mockSourceJokeQuery.isFetching = false;

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
