import type { ComponentType } from 'react';
import loginRoute from 'src/app/routes/login';
import { vi } from 'vitest';

export { ApiError, NetworkError } from 'src/shared/api/api-error';

import enTranslation from '../../../public/locales/en/translation.json';

export {
  afterEach,
  beforeEach,
  cleanup,
  describe,
  expect,
  it,
} from '../shared/test-utils';

import { cleanup } from '@testing-library/react';
import { render, screen, userEvent, waitFor } from '../shared/test-utils';

const mockNavigate = (globalThis as Record<string, unknown>).__mockNavigate as {
  mockReset: () => void;
  toHaveBeenCalledWith: (args: unknown) => void;
};
const mockAuthStorageGet = (globalThis as Record<string, unknown>).__loginMockAuthStorageGet as {
  mockReset: () => void;
  mockReturnValue: (v: unknown) => void;
};
const mockAuthStorageSet = (globalThis as Record<string, unknown>).__loginMockAuthStorageSet as {
  mockReset: () => void;
};
const mockLoginMutation = (globalThis as Record<string, unknown>).__mockLoginMutation as {
  mutate: ReturnType<typeof vi.fn>;
  mutateAsync: ReturnType<typeof vi.fn>;
  isPending: boolean;
  error: Error | null;
  data: { token: string; expiresAt: string } | undefined;
};
const mockUseSearch = (redirect: string | undefined = undefined) => {
  const raw = (globalThis as Record<string, unknown>).__mockUseSearch as {
    mockReturnValue: (v: unknown) => void;
  };
  raw.mockReturnValue({ redirect });
};

function renderComponent() {
  const Component = loginRoute.options.component as ComponentType;
  return render(<Component />);
}

async function fillLoginForm(username = 'john', password = 'secret') {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(enTranslation.login.fields.username), username);
  await user.type(screen.getByLabelText(enTranslation.login.fields.password), password);
  await user.click(screen.getByRole('button', { name: enTranslation.login.submit }));
}

async function loginAndExpectRedirect(searchParam: string | undefined, expectedTo: string) {
  mockUseSearch(searchParam);
  mockLoginMutation.mutateAsync.mockResolvedValue({
    token: 'tok',
    expiresAt: '2026-06-25T10:30:00',
  });
  renderComponent();
  await fillLoginForm();
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith({ to: expectedTo });
  });
}

export {
  enTranslation,
  fillLoginForm,
  loginAndExpectRedirect,
  mockAuthStorageGet,
  mockAuthStorageSet,
  mockLoginMutation,
  mockNavigate,
  mockUseSearch,
  renderComponent,
  screen,
  setupLoginTests,
  userEvent,
  vi,
  waitFor,
};

function setupLoginTests() {
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
}
