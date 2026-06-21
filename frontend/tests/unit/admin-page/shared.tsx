import type { ComponentType } from 'react';
import adminRoute from 'src/app/routes/admin';
import { vi } from 'vitest';

export { ApiError, NetworkError } from 'src/shared/api/api-error';

export {
  afterEach,
  beforeEach,
  cleanup,
  describe,
  expect,
  it,
  waitFor,
} from '../shared/test-utils';

import { cleanup } from '@testing-library/react';
import { render, screen, userEvent } from '../shared/test-utils';
import { adminMockAuthStorageClear, mockCreateJokeMutation, mockSourceJokeQuery } from './mocks';

const mockNavigate = (globalThis as Record<string, unknown>).__mockNavigate as {
  mockReset: () => void;
  toHaveBeenCalledWith: (args: unknown) => void;
};

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
  adminMockAuthStorageClear.mockReset();
}

/** Helper: switch to the Create tab. */
async function switchToCreateTab() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('tab', { name: 'Create' }));
}

/** Helper: fill the joke creation form and click submit. Returns the user instance. */
async function fillJokeFormAndSubmit(content: string, externalId?: string) {
  const user = userEvent.setup();
  await user.click(screen.getByRole('tab', { name: 'Create' }));
  await user.type(screen.getByLabelText('Content'), content);
  if (externalId !== undefined) {
    await user.type(screen.getByLabelText('External ID'), externalId);
  }
  await user.click(screen.getByRole('button', { name: 'Create Joke' }));
  return user;
}

/** Helper: set up mockCreateJokeMutation to call onSuccess with the given data. */
function mockJokeMutationSuccess(data: unknown) {
  mockCreateJokeMutation.mutate = vi
    .fn()
    .mockImplementation((_vars: unknown, opts?: { onSuccess?: (d: unknown) => void }) => {
      opts?.onSuccess?.(data);
    });
}

/** Helper: set up mockCreateJokeMutation to call onError with the given error. */
function mockJokeMutationError(error: Error) {
  mockCreateJokeMutation.mutate = vi
    .fn()
    .mockImplementation((_vars: unknown, opts?: { onError?: (e: Error) => void }) => {
      opts?.onError?.(error);
    });
}

function setupAdminTests() {
  beforeEach(resetMocks);
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
}

export {
  adminMockAuthStorageClear,
  adminMockAuthStorageClear as mockAuthStorageClear,
  adminRoute,
  fillJokeFormAndSubmit,
  mockCreateJokeMutation,
  mockJokeMutationError,
  mockJokeMutationSuccess,
  mockNavigate,
  mockSourceJokeQuery,
  renderComponent,
  resetMocks,
  screen,
  setupAdminTests,
  switchToCreateTab,
  userEvent,
};
