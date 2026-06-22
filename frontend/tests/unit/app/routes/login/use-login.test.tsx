import { renderHook } from '@testing-library/react';
import { ApiError, NetworkError } from 'src/shared/api/api-error';
import { useLogin } from 'src/shared/api/hooks';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createQueryWrapper } from '../../../test-utils';

describe('useLogin', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('posts credentials and returns TokenResponse on success', async () => {
    const tokenResponse = {
      token: 'uuid-token',
      expiresAt: '2026-06-25T10:30:00',
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(tokenResponse),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createQueryWrapper(),
    });

    const value = await result.current.mutateAsync({
      username: 'admin',
      password: 'pass',
    });

    expect(value).toEqual(tokenResponse);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/v1\/auth\/login$/);
    expect(init.method).toBe('POST');
    expect((init.headers as Headers).get('Content-Type')).toBe('application/json');
    expect(init.body).toBe(JSON.stringify({ username: 'admin', password: 'pass' }));
  });

  it('rejects with ApiError on non-2xx response', async () => {
    const errorBody = { code: 404, message: 'User Not Found' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve(errorBody),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createQueryWrapper(),
    });

    try {
      await result.current.mutateAsync({
        username: 'wrong',
        password: 'wrong',
      });
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(404);
      expect((error as ApiError).body).toEqual(errorBody);
      expect((error as ApiError).message).toBe('HTTP 404: Not Found');
    }
  });

  it('rejects with NetworkError on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const { result } = renderHook(() => useLogin(), {
      wrapper: createQueryWrapper(),
    });

    try {
      await result.current.mutateAsync({ username: 'admin', password: 'pass' });
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(NetworkError);
    }
  });
});
