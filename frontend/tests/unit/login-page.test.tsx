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

const { mockAuthStorageSet, mockAuthStorageGet } = vi.hoisted(() => ({
  mockAuthStorageSet: vi.fn(),
  mockAuthStorageGet: vi.fn<() => AuthStorageValue | null>(() => null),
}));

// -----------------------------
// MOCKS
// -----------------------------

vi.mock('src/shared/lib/auth-storage', () => ({
  authStorage: {
    get: mockAuthStorageGet,
    set: mockAuthStorageSet,
    clear: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  },
}));

const mockLoginMutation = {
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isPending: false,
  error: null as Error | null,
  data: undefined as { token: string; expiresAt: string } | undefined,
};

vi.mock('src/shared/api/hooks', () => ({
  useLogin: () => mockLoginMutation,
}));

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

// -----------------------------
// HELPERS
// -----------------------------

import loginRoute from 'src/app/routes/login';

// Mock useSearch on the route object to control redirect param in tests
function mockUseSearch(redirect: string | undefined = undefined) {
  return vi.spyOn(loginRoute, 'useSearch').mockReturnValue({ redirect });
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

function renderComponent() {
  const Component = loginRoute.options.component as ComponentType;
  return render(<Component />);
}

// -----------------------------
// TESTS
// -----------------------------

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
    mockUseSearch(undefined);
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
    const user = userEvent.setup();

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

  it('shows invalid credentials banner on 404; does NOT expose backend message', async () => {
    const user = userEvent.setup();

    mockLoginMutation.mutateAsync.mockRejectedValue(
      new ApiError(404, 'Not Found', {
        code: 404,
        message: 'User Not Found',
      })
    );

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'baduser');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'badpass');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        enTranslation.login.errors.invalidCredentials
      );
    });

    // anti-enumeration: backend message must NOT be in the DOM
    expect(screen.queryByText('Not Found')).not.toBeInTheDocument();
  });

  it('shows server error banner on 500 ApiError', async () => {
    const user = userEvent.setup();

    mockLoginMutation.mutateAsync.mockRejectedValue(new ApiError(500, 'Server Error', {}));

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'john');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'secret');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(enTranslation.error.serverError);
    });
  });

  it('shows network error banner on NetworkError', async () => {
    const user = userEvent.setup();

    mockLoginMutation.mutateAsync.mockRejectedValue(new NetworkError(new Error('Failed')));

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'john');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'secret');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(enTranslation.error.networkError);
    });
  });

  it('shows timeout error banner on DOMException AbortError', async () => {
    const user = userEvent.setup();

    mockLoginMutation.mutateAsync.mockRejectedValue(new DOMException('Aborted', 'AbortError'));

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'john');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'secret');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(enTranslation.error.timeout);
    });
  });

  it('clears banner when any field changes after an error', async () => {
    const user = userEvent.setup();

    mockLoginMutation.mutateAsync.mockRejectedValue(new ApiError(404, 'Not Found', {}));

    renderComponent();

    await user.type(screen.getByLabelText(enTranslation.login.fields.username), 'john');
    await user.type(screen.getByLabelText(enTranslation.login.fields.password), 'secret');
    await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));

    // banner is visible
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        enTranslation.login.errors.invalidCredentials
      );
    });

    // type a character to change the field → banner should clear
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

// ---------------------------------------------------------------------------
// T3.3: Redirect search parameter tests
// ---------------------------------------------------------------------------

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
