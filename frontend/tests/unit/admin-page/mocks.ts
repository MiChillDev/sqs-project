import type { AuthStorageValue } from 'src/shared/lib/auth-storage';
import { vi } from 'vitest';

const { mockAuthStorageClear, mockAuthStorageGet } = vi.hoisted(() => ({
  mockAuthStorageClear: vi.fn(),
  mockAuthStorageGet: vi.fn<() => AuthStorageValue | null>(() => ({
    token: 'valid-token',
    expiresAt: '2099-06-25T10:30:00',
  })),
}));

export const adminMockAuthStorageClear = mockAuthStorageClear;

vi.mock('src/shared/lib/auth-storage', () => ({
  authStorage: {
    get: mockAuthStorageGet,
    set: vi.fn(),
    clear: mockAuthStorageClear,
  },
}));

export const mockCreateJokeMutation = {
  mutate: vi.fn(),
  isPending: false,
};

export const mockSourceJokeQuery = {
  refetch: vi.fn(),
  isFetching: false,
  data: undefined as { content: string } | undefined,
  error: null as Error | null,
};

vi.mock('src/shared/api/hooks', () => ({
  useCreateJoke: () => mockCreateJokeMutation,
  useSourceJoke: () => mockSourceJokeQuery,
}));
