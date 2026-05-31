import type { AuthStorageValue } from 'src/shared/lib/auth-storage';
import { vi } from 'vitest';

const { mockAuthStorageSet, mockAuthStorageGet } = vi.hoisted(() => ({
  mockAuthStorageSet: vi.fn(),
  mockAuthStorageGet: vi.fn<() => AuthStorageValue | null>(() => null),
}));

(globalThis as Record<string, unknown>).__loginMockAuthStorageGet = mockAuthStorageGet;
(globalThis as Record<string, unknown>).__loginMockAuthStorageSet = mockAuthStorageSet;

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

(globalThis as Record<string, unknown>).__mockLoginMutation = mockLoginMutation;

vi.mock('src/shared/api/hooks', () => ({
  useLogin: () => mockLoginMutation,
}));
