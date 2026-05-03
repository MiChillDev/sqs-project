/// <reference types="vitest/globals" />

import { fetchApi } from '../../src/shared/api/api';
import { ApiError, NetworkError } from '../../src/shared/api/api-error';

describe('fetchApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed JSON on successful response', async () => {
    const data = { id: '123', externalId: 'ext-1', content: 'Why did the chicken cross the road?' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(data),
      })
    );

    const result = await fetchApi<typeof data>('/api/v1/jokes');

    expect(result).toEqual(data);
  });

  it('throws ApiError with status and body on non-2xx response', async () => {
    const errorBody = { code: 501, message: 'Not Implemented' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 501,
        statusText: 'Not Implemented',
        json: () => Promise.resolve(errorBody),
      })
    );

    try {
      await fetchApi('/api/v1/jokes');
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(501);
      expect((error as ApiError).body).toEqual(errorBody);
    }
  });

  it('throws ApiError without body when error response is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new SyntaxError('Unexpected token')),
      })
    );

    try {
      await fetchApi('/api/v1/jokes');
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(500);
      expect((error as ApiError).body).toBeUndefined();
    }
  });

  it('throws NetworkError when fetch rejects with TypeError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    try {
      await fetchApi('/api/v1/jokes');
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(NetworkError);
      expect((error as NetworkError).message).toBe('Failed to fetch');
    }
  });

  it('uses VITE_API_BASE_URL as origin prefix', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com');
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal('fetch', fetchSpy);

    await fetchApi('/api/v1/jokes');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/jokes',
      expect.any(Object)
    );
  });

  it('defaults to empty base URL when env var not set', async () => {
    vi.stubEnv('VITE_API_BASE_URL', undefined);
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal('fetch', fetchSpy);

    await fetchApi('/api/v1/jokes');

    expect(fetchSpy).toHaveBeenCalledWith('/api/v1/jokes', expect.any(Object));
  });

  it('throws ApiError when JSON parse fails on successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new SyntaxError('Unexpected token')),
      })
    );

    try {
      await fetchApi('/api/v1/jokes');
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(200);
      expect((error as ApiError).statusText).toBe('Invalid JSON response from server');
    }
  });

  it('throws NetworkError for non-Error fetch rejection', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('something broke'));

    try {
      await fetchApi('/api/v1/jokes');
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(NetworkError);
      expect((error as NetworkError).message).toBe('Network request failed');
    }
  });

  it('throws DOMException AbortError on timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, opts: { signal?: AbortSignal }) => {
        return new Promise((_resolve, reject) => {
          const onAbort = () => reject(new DOMException('The operation was aborted', 'AbortError'));
          if (opts.signal?.aborted) {
            onAbort();
          } else {
            opts.signal?.addEventListener('abort', onAbort, { once: true });
          }
        });
      })
    );

    let caughtError: unknown;
    const fetchPromise = fetchApi('/api/v1/jokes', { timeout: 100 }).catch((err) => {
      caughtError = err;
    });

    await vi.advanceTimersByTimeAsync(150);
    await fetchPromise;

    expect(caughtError).toBeInstanceOf(DOMException);
    expect((caughtError as DOMException).name).toBe('AbortError');

    vi.useRealTimers();
  });

  it('timeout fires even when caller provides a signal', async () => {
    vi.useFakeTimers();
    const callerController = new AbortController();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, opts: { signal?: AbortSignal }) => {
        return new Promise((_resolve, reject) => {
          const onAbort = () => reject(new DOMException('The operation was aborted', 'AbortError'));
          if (opts.signal?.aborted) {
            onAbort();
          } else {
            opts.signal?.addEventListener('abort', onAbort, { once: true });
          }
        });
      })
    );

    let caughtError: unknown;
    const fetchPromise = fetchApi('/api/v1/jokes', {
      signal: callerController.signal,
      timeout: 100,
    }).catch((err) => {
      caughtError = err;
    });

    await vi.advanceTimersByTimeAsync(150);
    await fetchPromise;

    expect(caughtError).toBeInstanceOf(DOMException);
    expect((caughtError as DOMException).name).toBe('AbortError');

    vi.useRealTimers();
  });

  it('caller signal aborts fetch and triggers timeout controller', async () => {
    const callerController = new AbortController();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, opts: { signal?: AbortSignal }) => {
        return new Promise((_resolve, reject) => {
          const onAbort = () => reject(new DOMException('The operation was aborted', 'AbortError'));
          if (opts.signal?.aborted) {
            onAbort();
          } else {
            opts.signal?.addEventListener('abort', onAbort, { once: true });
          }
        });
      })
    );

    callerController.abort();

    try {
      await fetchApi('/api/v1/jokes', { signal: callerController.signal });
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(DOMException);
      expect((error as DOMException).name).toBe('AbortError');
    }
  });

  it('re-throws caller AbortError instead of wrapping in NetworkError', async () => {
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

    try {
      await fetchApi('/api/v1/jokes');
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(error).toBe(abortError);
    }
  });
});
