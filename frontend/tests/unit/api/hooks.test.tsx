import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ApiError } from 'src/shared/api/api-error';
import { useCreateJoke, useHealthCheck, useRandomJoke, useSourceJoke } from 'src/shared/api/hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('useRandomJoke', () => {
  it('does not fetch on mount (enabled: false)', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    renderHook(() => useRandomJoke(), { wrapper: createWrapper() });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('queryKey and initial state are correct', () => {
    const { result } = renderHook(() => useRandomJoke(), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('refetch calls /api/v1/jokes with signal', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    const joke = { id: '1', externalId: 'ext-1', content: 'Joke content' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(joke),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useRandomJoke(), { wrapper: createWrapper() });

    await result.current.refetch();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/jokes',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });
});

describe('useHealthCheck', () => {
  it('does not fetch on mount (enabled: false)', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    renderHook(() => useHealthCheck(), { wrapper: createWrapper() });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('queryKey and initial state are correct', () => {
    const { result } = renderHook(() => useHealthCheck(), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('refetch calls /api/v1/health with signal', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    const health = { status: 'UP' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(health),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useHealthCheck(), { wrapper: createWrapper() });

    await result.current.refetch();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/health',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });
});

describe('useCreateJoke', () => {
  it('sends a POST request with the joke input on mutateAsync', async () => {
    const joke = { id: '2', externalId: 'ext-2', content: 'A new joke' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(joke),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useCreateJoke(), { wrapper: createWrapper() });

    const data = await result.current.mutateAsync({ content: 'A new joke', externalId: 'ext-2' });

    expect(data).toEqual(joke);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/v1\/jokes$/);
    expect(init.method).toBe('POST');
    expect(init.headers.get('Content-Type')).toBe('application/json');
    expect(init.body).toBe(JSON.stringify({ content: 'A new joke', externalId: 'ext-2' }));
  });

  it('rejects with ApiError when the POST fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ code: 400, message: 'bad input' }),
      })
    );

    const { result } = renderHook(() => useCreateJoke(), { wrapper: createWrapper() });

    await expect(
      result.current.mutateAsync({ content: 'bad joke', externalId: 'bad-ext' })
    ).rejects.toBeInstanceOf(ApiError);
  });
});

describe('useSourceJoke', () => {
  it('does not fetch on mount (enabled: false)', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    renderHook(() => useSourceJoke(), { wrapper: createWrapper() });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('queryKey and initial state are correct', () => {
    const { result } = renderHook(() => useSourceJoke(), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('refetch calls /api/v1/source-joke with signal', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    const data = { content: 'Source content' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useSourceJoke(), { wrapper: createWrapper() });

    await result.current.refetch();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/source-joke',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });
});
