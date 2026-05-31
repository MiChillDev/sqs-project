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

const { mockAuthStorageSet, mockAuthStorageGet } = vi.hoisted(() => ({
  mockAuthStorageSet: vi.fn(),
  mockAuthStorageGet: vi.fn<() => AuthStorageValue | null>(() => null),
}));

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

import loginRoute from 'src/app/routes/login';

function mockUseSearch(redirect: string | undefined = undefined) {
  return vi.spyOn(loginRoute, 'useSearch').mockReturnValue({ redirect });
}

function renderComponent() {
  const Component = loginRoute.options.component as ComponentType;
  return render(<Component />);
}

export {
  ApiError,
  afterEach,
  beforeEach,
  cleanup,
  describe,
  enTranslation,
  expect,
  it,
  loginRoute,
  mockAuthStorageGet,
  mockAuthStorageSet,
  mockLoginMutation,
  mockNavigate,
  mockUseSearch,
  NetworkError,
  render,
  renderComponent,
  screen,
  userEvent,
  vi,
  waitFor,
};
