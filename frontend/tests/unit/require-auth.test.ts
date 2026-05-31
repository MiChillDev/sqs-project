/// <reference types="vitest/globals" />

import { isRedirect } from '@tanstack/react-router';
import { requireAuth } from '../../src/shared/guards/require-auth';
import type { AuthStorageValue } from '../../src/shared/lib/auth-storage';

const KEY = 'sqs.auth';

function expectRedirect(pathname: string) {
  const guard = requireAuth();

  let thrown: unknown;
  try {
    guard({ location: { pathname } });
  } catch (error) {
    thrown = error;
  }

  expect(isRedirect(thrown)).toBe(true);
  return thrown;
}

function expectNoRedirect(pathname: string) {
  const guard = requireAuth();
  expect(() => guard({ location: { pathname } })).not.toThrow();
}

function expectRedirectMatch(pathname: string, redirectPath: string) {
  const thrown = expectRedirect(pathname);
  expect((thrown as Record<string, unknown>).options).toMatchObject({
    to: '/login',
    search: { redirect: redirectPath },
  });
}

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

    expectNoRedirect('/admin');
  });

  it('redirects to /login?redirect=/admin when no token exists', () => {
    expectRedirectMatch('/admin', '/admin');
  });

  it('redirects when token is expired (authStorage auto-cleans)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01T00:00:00Z'));

    const expired: AuthStorageValue = {
      token: 'expired-token',
      expiresAt: '2026-05-01T00:00:00',
    };
    localStorage.setItem(KEY, JSON.stringify(expired));

    expectRedirectMatch('/admin', '/admin');
  });

  it('redirects when localStorage contains malformed JSON', () => {
    localStorage.setItem(KEY, 'this-is-not-json');

    expectRedirectMatch('/admin', '/admin');

    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('includes the correct redirect path in the search params', () => {
    expectRedirectMatch('/secure/dashboard', '/secure/dashboard');
  });

  it('allows reusing the same guard across multiple calls', () => {
    const guard = requireAuth();

    let thrown: unknown;
    try {
      guard({ location: { pathname: '/admin' } });
    } catch (error) {
      thrown = error;
    }
    expect(isRedirect(thrown)).toBe(true);

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-25T12:00:00Z'));

    const valid: AuthStorageValue = {
      token: 'valid-token',
      expiresAt: '2026-06-01T00:00:00',
    };
    localStorage.setItem(KEY, JSON.stringify(valid));

    expect(() => guard({ location: { pathname: '/admin' } })).not.toThrow();
  });
});
