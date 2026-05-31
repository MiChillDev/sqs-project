import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { ApiError, NetworkError } from 'src/shared/api/api-error';
import type { AuthStorageValue } from 'src/shared/lib/auth-storage';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import enTranslation from '../../../public/locales/en/translation.json';

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

export {
  ApiError,
  adminRoute,
  afterEach,
  beforeEach,
  cleanup,
  describe,
  enTranslation,
  expect,
  it,
  mockAuthStorageClear,
  mockAuthStorageGet,
  mockCreateJokeMutation,
  mockNavigate,
  mockSourceJokeQuery,
  NetworkError,
  render,
  renderComponent,
  resetMocks,
  screen,
  userEvent,
  vi,
  waitFor,
};
