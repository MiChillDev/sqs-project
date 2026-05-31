import './mocks';
import {
  ApiError,
  afterEach,
  beforeEach,
  cleanup,
  describe,
  expect,
  it,
  mockAuthStorageClear,
  mockNavigate,
  mockSourceJokeQuery,
  NetworkError,
  renderComponent,
  resetMocks,
  screen,
  userEvent,
  waitFor,
} from './shared';

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

    mockSourceJokeQuery.refetch.mockResolvedValue({
      data: { content: 'A sourced joke!' },
      error: null,
    });

    renderComponent();

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

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockAuthStorageClear).not.toHaveBeenCalled();
    });
  });
});
