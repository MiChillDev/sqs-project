import type { AuthStorageValue } from 'src/shared/lib/auth-storage';
import { vi } from 'vitest';

const { mockAuthStorageSet, mockAuthStorageGet } = vi.hoisted(() => ({
  mockAuthStorageSet: vi.fn(),
  mockAuthStorageGet: vi.fn<() => AuthStorageValue | null>(() => null),
}));

export const loginMockAuthStorageGet = mockAuthStorageGet;
export const loginMockAuthStorageSet = mockAuthStorageSet;

vi.mock('src/shared/lib/auth-storage', () => ({
  authStorage: {
    get: mockAuthStorageGet,
    set: mockAuthStorageSet,
    clear: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  },
}));

export const mockLoginMutation = {
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isPending: false,
  error: null as Error | null,
  data: undefined as { token: string; expiresAt: string } | undefined,
};

vi.mock('src/shared/api/hooks', () => ({
  useLogin: () => mockLoginMutation,
}));
