/// <reference types="vitest/globals" />

import { fetchApi } from '@/shared/api/api';

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

  it('throws error with status property on non-2xx response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 501,
        statusText: 'Not Implemented',
        json: () => Promise.resolve({ code: 501, message: 'Not Implemented' }),
      })
    );

    await expect(fetchApi('/api/v1/jokes')).rejects.toThrow();
    await expect(fetchApi('/api/v1/jokes')).rejects.toMatchObject({ status: 501 });
  });

  it('uses VITE_API_BASE_URL env var in URL construction', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com');
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal('fetch', fetchSpy);

    await fetchApi('/api/v1/jokes');

    expect(fetchSpy).toHaveBeenCalledWith('https://api.example.com/api/v1/jokes');
  });

  it('handles network error when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(fetchApi('/api/v1/jokes')).rejects.toThrow(TypeError);
    await expect(fetchApi('/api/v1/jokes')).rejects.toThrow('Failed to fetch');
  });

  it('uses empty string as base URL when env var is not set', async () => {
    vi.stubEnv('VITE_API_BASE_URL', undefined);
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    vi.stubGlobal('fetch', fetchSpy);

    await fetchApi('/api/v1/jokes');

    expect(fetchSpy).toHaveBeenCalledWith('/api/v1/jokes');
  });
});
