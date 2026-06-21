import { fetchApi } from 'src/shared/api/api';
import { NetworkError } from 'src/shared/api/api-error';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetchOk(data: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(data) })
  );
}

function stubFetchReject(error: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error));
}

function stubFetchError(status: number, body?: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status,
      statusText: 'Error',
      json:
        body !== undefined
          ? () => Promise.resolve(body)
          : () => Promise.reject(new SyntaxError('bad json')),
    })
  );
}

describe('fetchApi', () => {
  it('constructs URL with VITE_API_BASE_URL when set', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com');
    const spy = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    vi.stubGlobal('fetch', spy);

    await fetchApi('/api/v1/test');
    expect(spy).toHaveBeenCalledWith('https://api.example.com/api/v1/test', expect.any(Object));
  });

  it('adds Authorization header when token in storage and auth:true', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    localStorage.setItem(
      'sqs.auth',
      JSON.stringify({ token: 'tok', expiresAt: '2026-06-01T00:00:00' })
    );
    const spy = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    vi.stubGlobal('fetch', spy);

    await fetchApi('/test', { auth: true });
    const headers = spy.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer tok');
    vi.useRealTimers();
  });

  it('returns parsed JSON on success', async () => {
    stubFetchOk({ id: 1 });
    expect(await fetchApi('/test')).toEqual({ id: 1 });
  });

  it('throws ApiError on non-2xx response', async () => {
    stubFetchError(500, { code: 500, message: 'boom' });
    await expect(fetchApi('/test')).rejects.toMatchObject({
      status: 500,
      body: { code: 500, message: 'boom' },
    });
  });

  it('throws ApiError with undefined body when error response is not JSON', async () => {
    stubFetchError(502);
    await expect(fetchApi('/test')).rejects.toMatchObject({ status: 502, body: undefined });
  });

  it('wraps TypeError in NetworkError', async () => {
    stubFetchReject(new TypeError('Failed to fetch'));
    await expect(fetchApi('/test')).rejects.toBeInstanceOf(NetworkError);
  });

  it('re-throws AbortError from fetch rejection', async () => {
    stubFetchReject(new DOMException('aborted', 'AbortError'));
    await expect(fetchApi('/test')).rejects.toThrow('aborted');
  });

  it('timeout aborts the request signal', async () => {
    vi.useFakeTimers();
    let caught: unknown;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        (_url: string, opts?: { signal?: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            const onAbort = () => reject(new DOMException('aborted', 'AbortError'));
            if (opts?.signal?.aborted) onAbort();
            else opts?.signal?.addEventListener('abort', onAbort, { once: true });
          })
      )
    );
    const promise = fetchApi('/test', { timeout: 50 }).catch((e) => {
      caught = e;
    });
    await vi.advanceTimersByTimeAsync(60);
    await promise;
    expect(caught).toBeInstanceOf(DOMException);
    vi.useRealTimers();
  });
});
