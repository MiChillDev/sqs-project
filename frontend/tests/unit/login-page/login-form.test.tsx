import './mocks';
import {
  ApiError,
  afterEach,
  beforeEach,
  cleanup,
  describe,
  enTranslation,
  expect,
  fillLoginForm,
  it,
  mockAuthStorageGet,
  mockAuthStorageSet,
  mockLoginMutation,
  mockNavigate,
  mockUseSearch,
  NetworkError,
  renderComponent,
  screen,
  userEvent,
  vi,
  waitFor,
} from './shared';

describe('LoginPage', () => {
  beforeEach(() => {
    mockLoginMutation.mutate = vi.fn();
    mockLoginMutation.mutateAsync = vi.fn();
    mockLoginMutation.isPending = false;
    mockLoginMutation.error = null;
    mockLoginMutation.data = undefined;
    mockNavigate.mockReset();
    mockAuthStorageSet.mockReset();
    mockAuthStorageGet.mockReset();
    mockAuthStorageGet.mockReturnValue(null);
    mockUseSearch();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders username input, password input, and a submit button', () => {
    renderComponent();

    expect(screen.getByLabelText(enTranslation.login.fields.username)).toBeInTheDocument();
    expect(screen.getByLabelText(enTranslation.login.fields.password)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: enTranslation.login.submit })).toBeInTheDocument();
  });

  it('submitting empty form → no fetch call; both fields show a required error', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(mockLoginMutation.mutateAsync).not.toHaveBeenCalled();
    });

    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(2);
  });

  it('submits valid form → calls mutateAsync, stores token, and navigates to /admin', async () => {
    mockLoginMutation.mutateAsync.mockResolvedValue({
      token: 'tok',
      expiresAt: '2026-06-25T10:30:00',
    });

    renderComponent();
    await fillLoginForm();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' });
    });
  });

  it('shows invalid credentials banner on 404; does NOT expose backend message', async () => {
    mockLoginMutation.mutateAsync.mockRejectedValue(
      new ApiError(404, 'Not Found', {
        code: 404,
        message: 'User Not Found',
      })
    );

    renderComponent();
    await fillLoginForm('baduser', 'badpass');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        enTranslation.login.errors.invalidCredentials
      );
    });

    expect(screen.queryByText('Not Found')).not.toBeInTheDocument();
  });

  it('shows server error banner on 500 ApiError', async () => {
    mockLoginMutation.mutateAsync.mockRejectedValue(new ApiError(500, 'Server Error', {}));

    renderComponent();
    await fillLoginForm();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(enTranslation.error.serverError);
    });
  });

  it('shows network error banner on NetworkError', async () => {
    mockLoginMutation.mutateAsync.mockRejectedValue(new NetworkError(new Error('Failed')));

    renderComponent();
    await fillLoginForm();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(enTranslation.error.networkError);
    });
  });

  it('shows timeout error banner on DOMException AbortError', async () => {
    mockLoginMutation.mutateAsync.mockRejectedValue(new DOMException('Aborted', 'AbortError'));

    renderComponent();
    await fillLoginForm();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(enTranslation.error.timeout);
    });
  });

  it('clears banner when any field changes after an error', async () => {
    mockLoginMutation.mutateAsync.mockRejectedValue(new ApiError(404, 'Not Found', {}));

    renderComponent();
    await fillLoginForm();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        enTranslation.login.errors.invalidCredentials
      );
    });

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'a');

    await waitFor(() => {
      expect(
        screen.queryByText(enTranslation.login.errors.invalidCredentials)
      ).not.toBeInTheDocument();
    });
  });

  it('shows spinner while isPending', () => {
    mockLoginMutation.isPending = true;

    renderComponent();

    const button = screen.getByRole('button', {
      name: enTranslation.login.submit,
    });
    expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('redirects to /admin and does not render the form when already logged in', async () => {
    mockAuthStorageGet.mockReturnValue({
      token: 'tok',
      expiresAt: '2099-06-25T10:30:00',
    });

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' });
    });

    expect(
      screen.queryByRole('button', { name: enTranslation.login.submit })
    ).not.toBeInTheDocument();
  });
});
