import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { getTranslation } from '../shared/translation-helper';

export function t(key: string) {
  return getTranslation(key);
}

export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

export function mockFetch(data: unknown, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      statusText: ok ? 'OK' : 'Error',
      json: () => Promise.resolve(data),
    })
  );
}

export function mockFetchPending() {
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
}
