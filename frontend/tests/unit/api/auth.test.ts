import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchApi } from './shared';

describe('fetchApi', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('auth option', () => {
    const token = '550e8400-e29b-41d4-a716-446655440000';

    beforeEach(() => {
      localStorage.clear();
    });

    it('adds Authorization header when auth:true and token exists', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
      localStorage.setItem('sqs.auth', JSON.stringify({ token, expiresAt: '2026-06-01T00:00:00' }));

      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });
      vi.stubGlobal('fetch', fetchSpy);

      await fetchApi('/api/v1/admin/users', { auth: true });

      const headers = fetchSpy.mock.calls[0]?.[1]?.headers as Headers;
      expect(headers.get('Authorization')).toBe(`Bearer ${token}`);

      vi.useRealTimers();
    });

    it('does not add Authorization header when auth is false', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
      localStorage.setItem('sqs.auth', JSON.stringify({ token, expiresAt: '2026-06-01T00:00:00' }));

      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });
      vi.stubGlobal('fetch', fetchSpy);

      await fetchApi('/api/v1/jokes', { auth: false });

      const headers = fetchSpy.mock.calls[0]?.[1]?.headers as Headers;
      expect(headers.get('Authorization')).toBeNull();

      vi.useRealTimers();
    });

    it('does not add Authorization header when auth:true but no token in storage', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });
      vi.stubGlobal('fetch', fetchSpy);

      await fetchApi('/api/v1/admin/users', { auth: true });

      const headers = fetchSpy.mock.calls[0]?.[1]?.headers as Headers;
      expect(headers.get('Authorization')).toBeNull();
    });

    it('is backward compatible — existing callers without auth work unchanged', async () => {
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });
      vi.stubGlobal('fetch', fetchSpy);

      await fetchApi('/api/v1/jokes');

      const headers = fetchSpy.mock.calls[0]?.[1]?.headers as Headers;
      expect(headers.get('Authorization')).toBeNull();
    });

    it('preserves caller-provided headers when adding Authorization', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
      localStorage.setItem('sqs.auth', JSON.stringify({ token, expiresAt: '2026-06-01T00:00:00' }));

      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });
      vi.stubGlobal('fetch', fetchSpy);

      await fetchApi('/api/v1/admin/users', {
        auth: true,
        headers: { 'Content-Type': 'application/json' },
      });

      const headers = fetchSpy.mock.calls[0]?.[1]?.headers as Headers;
      expect(headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(headers.get('Content-Type')).toBe('application/json');

      vi.useRealTimers();
    });
  });
});
