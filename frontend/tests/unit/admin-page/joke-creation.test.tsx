import './mocks';
import {
  ApiError,
  describe,
  expect,
  fillJokeFormAndSubmit,
  it,
  mockAuthStorageClear,
  mockCreateJokeMutation,
  mockJokeMutationError,
  mockJokeMutationSuccess,
  mockNavigate,
  NetworkError,
  renderComponent,
  screen,
  setupAdminTests,
  userEvent,
  waitFor,
} from './shared';

describe('JokeCreationSection', () => {
  setupAdminTests();

  it('renders content textarea, external ID input, and submit button', () => {
    renderComponent();

    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByLabelText('External ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Joke' })).toBeInTheDocument();
  });

  it('submits valid form → calls mutate with form data', async () => {
    renderComponent();

    await fillJokeFormAndSubmit('A funny joke', 'ext-123');

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
    renderComponent();

    await fillJokeFormAndSubmit('A funny joke');

    await waitFor(() => {
      expect(mockCreateJokeMutation.mutate).toHaveBeenCalledWith(
        { content: 'A funny joke', externalId: '' },
        expect.any(Object)
      );
    });
  });

  it('displays created joke content on success', async () => {
    mockJokeMutationSuccess({ id: '1', externalId: 'ext-1', content: 'Created joke text!' });

    renderComponent();

    await fillJokeFormAndSubmit('A funny joke');

    await waitFor(() => {
      expect(screen.getByText('Created joke text!')).toBeInTheDocument();
    });
  });

  it('clears form after successful submission', async () => {
    mockJokeMutationSuccess({ id: '1', externalId: 'ext-1', content: 'Joke' });

    renderComponent();

    await fillJokeFormAndSubmit('A funny joke');

    await waitFor(() => {
      expect(screen.getByLabelText('Content')).toHaveValue('');
    });
  });

  it('displays server error message on ApiError 500', async () => {
    mockJokeMutationError(new ApiError(500, 'Server Error', {}));

    renderComponent();

    await fillJokeFormAndSubmit('A funny joke');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    });
  });

  it('displays network error message on NetworkError', async () => {
    mockJokeMutationError(new NetworkError(new Error('Failed')));

    renderComponent();

    await fillJokeFormAndSubmit('A funny joke');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Unable to connect');
    });
  });

  it('clears auth and redirects to /login on 401', async () => {
    mockJokeMutationError(new ApiError(401, 'Unauthorized', {}));

    renderComponent();

    await fillJokeFormAndSubmit('A funny joke');

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

    expect(mockCreateJokeMutation.mutate).not.toHaveBeenCalled();
  });

  it('shows retry button on non-401 error', async () => {
    mockJokeMutationError(new ApiError(500, 'Server Error', {}));

    renderComponent();

    await fillJokeFormAndSubmit('A funny joke');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  it('retry button resubmits the form data', async () => {
    mockJokeMutationError(new NetworkError(new Error('Failed')));

    renderComponent();

    const user = await fillJokeFormAndSubmit('A funny joke');

    const retryButton = await screen.findByRole('button', { name: 'Retry' });
    expect(mockCreateJokeMutation.mutate).toHaveBeenCalledTimes(1);

    await user.click(retryButton);

    expect(mockCreateJokeMutation.mutate).toHaveBeenCalledTimes(2);
    expect(mockCreateJokeMutation.mutate).toHaveBeenLastCalledWith(
      { content: 'A funny joke', externalId: '' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('no retry button on 401 error (redirect instead)', async () => {
    mockJokeMutationError(new ApiError(401, 'Unauthorized', {}));

    renderComponent();

    await fillJokeFormAndSubmit('A funny joke');

    await waitFor(() => {
      expect(mockAuthStorageClear).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login', search: { redirect: '/admin' } });
    });

    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  describe('edge case: network failure preserves token (no redirect)', () => {
    it('does NOT redirect on NetworkError', async () => {
      mockJokeMutationError(new NetworkError(new Error('Failed')));

      renderComponent();

      await fillJokeFormAndSubmit('A funny joke');

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockAuthStorageClear).not.toHaveBeenCalled();
    });
  });
});
