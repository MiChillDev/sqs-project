import type { AuthStorageValue } from 'src/shared/lib/auth-storage';
import { vi } from 'vitest';

const { mockAuthStorageClear, mockAuthStorageGet } = vi.hoisted(() => ({
  mockAuthStorageClear: vi.fn(),
  mockAuthStorageGet: vi.fn<() => AuthStorageValue | null>(() => ({
    token: 'valid-token',
    expiresAt: '2099-06-25T10:30:00',
  })),
}));

(globalThis as Record<string, unknown>).__adminMockAuthStorageGet = mockAuthStorageGet;
(globalThis as Record<string, unknown>).__adminMockAuthStorageClear = mockAuthStorageClear;

vi.mock('src/shared/lib/auth-storage', () => ({
  authStorage: {
    get: mockAuthStorageGet,
    set: vi.fn(),
    clear: mockAuthStorageClear,
  },
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

(globalThis as Record<string, unknown>).__mockCreateJokeMutation = mockCreateJokeMutation;
(globalThis as Record<string, unknown>).__mockSourceJokeQuery = mockSourceJokeQuery;

vi.mock('src/shared/api/hooks', () => ({
  useCreateJoke: () => mockCreateJokeMutation,
  useSourceJoke: () => mockSourceJokeQuery,
}));
