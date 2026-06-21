import { loginErrorKey, resolveRedirect } from 'src/app/routes/login/login-helpers';
import { ApiError, NetworkError } from 'src/shared/api/api-error';
import { describe, expect, it } from 'vitest';

describe('resolveRedirect', () => {
  it.each([
    undefined,
    '',
    'https://evil.com',
    '//evil.com',
    'javascript:alert(1)',
    'dashboard',
  ])('returns /admin for invalid redirect: %s', (input) => {
    expect(resolveRedirect(input as string)).toBe('/admin');
  });

  it('passes through valid relative paths', () => {
    expect(resolveRedirect('/dashboard')).toBe('/dashboard');
    expect(resolveRedirect('/admin/users/123')).toBe('/admin/users/123');
  });
});

describe('loginErrorKey', () => {
  it.each([
    [400, 'login.errors.invalidCredentials'],
    [401, 'login.errors.invalidCredentials'],
    [500, 'error.serverError'],
    [503, 'error.serverError'],
  ] as const)('ApiError(%i) → %s', (status, key) => {
    expect(loginErrorKey(new ApiError(status, ''))).toBe(key);
  });

  it('NetworkError → error.networkError', () => {
    expect(loginErrorKey(new NetworkError())).toBe('error.networkError');
  });

  it('DOMException AbortError → error.timeout', () => {
    expect(loginErrorKey(new DOMException('aborted', 'AbortError'))).toBe('error.timeout');
  });

  it.each([
    new Error('fail'),
    { message: 'fail' },
    'string error',
  ])('unknown error → toast.unknownError', (error) => {
    expect(loginErrorKey(error)).toBe('toast.unknownError');
  });
});
