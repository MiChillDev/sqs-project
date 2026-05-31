import {
  afterEach,
  beforeEach,
  cleanup,
  describe,
  enTranslation,
  expect,
  it,
  mockAuthStorageGet,
  mockAuthStorageSet,
  mockLoginMutation,
  mockNavigate,
  mockUseSearch,
  renderComponent,
  screen,
  userEvent,
  vi,
  waitFor,
} from './shared';

describe('LoginPage — redirect search parameter', () => {
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
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('redirects to /admin by default (no redirect param)', async () => {
    const user = userEvent.setup();
    mockUseSearch(undefined);

    mockLoginMutation.mutateAsync.mockResolvedValue({
      token: 'tok',
      expiresAt: '2026-06-25T10:30:00',
    });

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'john');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'secret');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' });
    });
  });

  it('redirects to the path specified in the redirect search param', async () => {
    const user = userEvent.setup();
    mockUseSearch('/jokes');

    mockLoginMutation.mutateAsync.mockResolvedValue({
      token: 'tok',
      expiresAt: '2026-06-25T10:30:00',
    });

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'john');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'secret');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/jokes' });
    });
  });

  it('already-authenticated bounce uses redirect search param', async () => {
    mockAuthStorageGet.mockReturnValue({
      token: 'tok',
      expiresAt: '2099-06-25T10:30:00',
    });
    mockUseSearch('/admin');

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' });
    });
  });

  it('blocks external URL in redirect param (open redirect prevention)', async () => {
    const user = userEvent.setup();
    mockUseSearch('https://evil.com');

    mockLoginMutation.mutateAsync.mockResolvedValue({
      token: 'tok',
      expiresAt: '2026-06-25T10:30:00',
    });

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'john');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'secret');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' });
    });
  });

  it('blocks protocol-relative URL in redirect param', async () => {
    const user = userEvent.setup();
    mockUseSearch('//evil.com/path');

    mockLoginMutation.mutateAsync.mockResolvedValue({
      token: 'tok',
      expiresAt: '2026-06-25T10:30:00',
    });

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'john');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'secret');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' });
    });
  });

  it('blocks non-absolute path in redirect param', async () => {
    const user = userEvent.setup();
    mockUseSearch('evil/path');

    mockLoginMutation.mutateAsync.mockResolvedValue({
      token: 'tok',
      expiresAt: '2026-06-25T10:30:00',
    });

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'john');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'secret');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' });
    });
  });

  it('honors the /admin redirect param on successful login', async () => {
    const user = userEvent.setup();
    mockUseSearch('/admin');

    mockLoginMutation.mutateAsync.mockResolvedValue({
      token: 'tok',
      expiresAt: '2026-06-25T10:30:00',
    });

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'john');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'secret');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' });
    });
  });
});
