/// <reference types="vitest/globals" />

import { isRedirect } from '@tanstack/react-router';
import { requireAuth } from '../../src/shared/guards/require-auth';
import type { AuthStorageValue } from '../../src/shared/lib/auth-storage';

const KEY = 'sqs.auth';

describe('requireAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('passes when authStorage returns a valid token', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-25T12:00:00Z'));

    const valid: AuthStorageValue = {
      token: 'valid-token',
      expiresAt: '2026-06-01T00:00:00',
    };
    localStorage.setItem(KEY, JSON.stringify(valid));

    const guard = requireAuth();

    expect(() => guard({ location: { pathname: '/admin' } })).not.toThrow();
  });

  it('redirects to /login?redirect=/admin when no token exists', () => {
    const guard = requireAuth();

    let thrown: unknown;
    try {
      guard({ location: { pathname: '/admin' } });
    } catch (error) {
      thrown = error;
    }

    expect(isRedirect(thrown)).toBe(true);
    // TanStack Router v1 wraps redirect details in .options
    expect((thrown as Record<string, unknown>).options).toMatchObject({
      to: '/login',
      search: { redirect: '/admin' },
    });
  });

  it('redirects when token is expired (authStorage auto-cleans)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01T00:00:00Z'));

    const expired: AuthStorageValue = {
      token: 'expired-token',
      expiresAt: '2026-05-01T00:00:00',
    };
    localStorage.setItem(KEY, JSON.stringify(expired));

    const guard = requireAuth();

    let thrown: unknown;
    try {
      guard({ location: { pathname: '/admin' } });
    } catch (error) {
      thrown = error;
    }

    expect(isRedirect(thrown)).toBe(true);
    expect((thrown as Record<string, unknown>).options).toMatchObject({
      to: '/login',
      search: { redirect: '/admin' },
    });
  });

  it('redirects when localStorage contains malformed JSON', () => {
    localStorage.setItem(KEY, 'this-is-not-json');

    const guard = requireAuth();

    let thrown: unknown;
    try {
      guard({ location: { pathname: '/admin' } });
    } catch (error) {
      thrown = error;
    }

    expect(isRedirect(thrown)).toBe(true);
    expect((thrown as Record<string, unknown>).options).toMatchObject({
      to: '/login',
      search: { redirect: '/admin' },
    });

    // authStorage should have cleaned up the malformed entry
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('includes the correct redirect path in the search params', () => {
    const guard = requireAuth();

    let thrown: unknown;
    try {
      guard({ location: { pathname: '/secure/dashboard' } });
    } catch (error) {
      thrown = error;
    }

    expect(isRedirect(thrown)).toBe(true);
    expect((thrown as Record<string, unknown>).options).toMatchObject({
      to: '/login',
      search: { redirect: '/secure/dashboard' },
    });
  });

  it('allows reusing the same guard across multiple calls', () => {
    const guard = requireAuth();

    // First call — no token, should redirect
    let thrown1: unknown;
    try {
      guard({ location: { pathname: '/admin' } });
    } catch (error) {
      thrown1 = error;
    }
    expect(isRedirect(thrown1)).toBe(true);

    // Store a valid token
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-25T12:00:00Z'));

    const valid: AuthStorageValue = {
      token: 'valid-token',
      expiresAt: '2026-06-01T00:00:00',
    };
    localStorage.setItem(KEY, JSON.stringify(valid));

    // Second call — valid token, should pass
    expect(() => guard({ location: { pathname: '/admin' } })).not.toThrow();
  });
});
