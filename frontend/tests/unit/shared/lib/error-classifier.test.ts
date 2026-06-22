import { ApiError, NetworkError } from 'src/shared/api/api-error';
import { extractErrorKey, is401 } from 'src/shared/lib/error-classifier';
import { describe, expect, it } from 'vitest';

describe('extractErrorKey', () => {
  it.each([
    [500, 'admin.error.serverError'],
    [502, 'admin.error.serverError'],
    [400, 'error.clientError'],
    [403, 'error.clientError'],
    [404, 'error.clientError'],
    [409, 'error.conflict'],
    [422, 'error.clientError'],
  ] as const)('ApiError(%i) → %s', (status, key) => {
    expect(extractErrorKey(new ApiError(status, ''))).toBe(key);
  });

  it('NetworkError → admin.error.networkError', () => {
    expect(extractErrorKey(new NetworkError())).toBe('admin.error.networkError');
  });

  it.each([
    new Error('fail'),
    'string',
    null,
    undefined,
  ])('non-ApiError/NetworkError → toast.unknownError', (input) => {
    expect(extractErrorKey(input)).toBe('toast.unknownError');
  });
});

describe('is401', () => {
  it('true for ApiError(401)', () => {
    expect(is401(new ApiError(401, ''))).toBe(true);
  });

  it.each([
    new ApiError(200, ''),
    new ApiError(403, ''),
    new ApiError(500, ''),
    new NetworkError(),
    new Error('fail'),
    { status: 401 },
  ])('false for non-401', (input) => {
    expect(is401(input)).toBe(false);
  });
});
