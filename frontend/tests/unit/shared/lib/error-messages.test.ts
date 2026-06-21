import { ApiError, NetworkError } from 'src/shared/api/api-error';
import { describe, expect, it, vi } from 'vitest';

vi.mock('i18next', () => ({ default: { t: (key: string) => key } }));

import { getUserSafeError } from 'src/shared/lib/error-messages';

describe('getUserSafeError', () => {
  it('NetworkError → error.networkError', () => {
    expect(getUserSafeError(new NetworkError())).toBe('error.networkError');
  });

  it.each([
    [400, 'error.badRequest'],
    [401, 'error.unauthorized'],
    [403, 'error.forbidden'],
    [404, 'error.notFound'],
    [500, 'error.serverError'],
  ] as const)('ApiError(%i) → %s', (status, key) => {
    expect(getUserSafeError(new ApiError(status, ''))).toBe(key);
  });

  it.each([502, 503, 599])('ApiError(%i) → error.serverError (5xx range)', (status) => {
    expect(getUserSafeError(new ApiError(status, ''))).toBe('error.serverError');
  });

  it('ApiError(418) → error.clientError (4xx range)', () => {
    expect(getUserSafeError(new ApiError(418, ''))).toBe('error.clientError');
  });

  it('AbortError DOMException → error.timeout', () => {
    expect(getUserSafeError(new DOMException('aborted', 'AbortError'))).toBe('error.timeout');
  });

  it('unknown Error → toast.unknownError', () => {
    expect(getUserSafeError(new Error('fail'))).toBe('toast.unknownError');
  });
});
