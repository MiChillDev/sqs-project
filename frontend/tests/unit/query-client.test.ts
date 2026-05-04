/// <reference types="vitest/globals" />

import { ApiError, NetworkError } from '../../src/shared/api/api-error';
import { getUserSafeError } from '../../src/shared/lib/error-messages';

vi.mock('i18next', () => ({
  default: {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'toast.errorTitle': 'An error occurred',
        'toast.unknownError': 'Unknown error',
        'error.badRequest': 'Invalid request. Please check your input.',
        'error.unauthorized': 'Please sign in to continue.',
        'error.forbidden': 'You do not have permission to perform this action.',
        'error.notFound': 'The requested resource was not found.',
        'error.serverError': 'Something went wrong. Please try again later.',
        'error.networkError':
          'Unable to connect to the server. Please check your internet connection.',
        'error.timeout': 'The request timed out. Please try again.',
        'error.clientError': 'The request could not be processed. Please try again.',
      };
      return translations[key] ?? key;
    },
  },
}));

describe('getUserSafeError', () => {
  it('returns sanitized message for ApiError 400', () => {
    expect(getUserSafeError(new ApiError(400, 'Bad Request'))).toBe(
      'Invalid request. Please check your input.'
    );
  });

  it('returns sanitized message for ApiError 401', () => {
    expect(getUserSafeError(new ApiError(401, 'Unauthorized'))).toBe('Please sign in to continue.');
  });

  it('returns sanitized message for ApiError 403', () => {
    expect(getUserSafeError(new ApiError(403, 'Forbidden'))).toBe(
      'You do not have permission to perform this action.'
    );
  });

  it('returns sanitized message for ApiError 404', () => {
    expect(getUserSafeError(new ApiError(404, 'Not Found'))).toBe(
      'The requested resource was not found.'
    );
  });

  it('returns sanitized message for ApiError 500', () => {
    expect(getUserSafeError(new ApiError(500, 'Internal Server Error'))).toBe(
      'Something went wrong. Please try again later.'
    );
  });

  it('returns server error message for ApiError 501', () => {
    expect(getUserSafeError(new ApiError(501, 'Not Implemented'))).toBe(
      'Something went wrong. Please try again later.'
    );
  });

  it('returns server error message for ApiError 502', () => {
    expect(getUserSafeError(new ApiError(502, 'Bad Gateway'))).toBe(
      'Something went wrong. Please try again later.'
    );
  });

  it('returns server error message for ApiError 503', () => {
    expect(getUserSafeError(new ApiError(503, 'Service Unavailable'))).toBe(
      'Something went wrong. Please try again later.'
    );
  });

  it('returns client error message for unrecognized 4xx ApiError status', () => {
    expect(getUserSafeError(new ApiError(418, "I'm a Teapot"))).toBe(
      'The request could not be processed. Please try again.'
    );
  });

  it('returns network error message for NetworkError', () => {
    expect(getUserSafeError(new NetworkError(new TypeError('Failed to fetch')))).toBe(
      'Unable to connect to the server. Please check your internet connection.'
    );
  });

  it('returns network error message for NetworkError without original', () => {
    expect(getUserSafeError(new NetworkError())).toBe(
      'Unable to connect to the server. Please check your internet connection.'
    );
  });

  it('returns timeout message for AbortError DOMException', () => {
    expect(getUserSafeError(new DOMException('The operation was aborted', 'AbortError'))).toBe(
      'The request timed out. Please try again.'
    );
  });

  it('returns default message for Error object', () => {
    expect(getUserSafeError(new Error('Network failure'))).toBe('Unknown error');
  });

  it('returns default message for string input', () => {
    expect(getUserSafeError('something broke')).toBe('Unknown error');
  });

  it('returns default message for null', () => {
    expect(getUserSafeError(null)).toBe('Unknown error');
  });

  it('returns default message for undefined', () => {
    expect(getUserSafeError(undefined)).toBe('Unknown error');
  });
});

describe('handleMutationError', () => {
  let toastErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    const { toast } = await import('sonner');
    toastErrorSpy = vi
      .spyOn(toast, 'error')
      .mockImplementation(() => ({}) as ReturnType<typeof toast.error>);
  });

  afterEach(() => {
    toastErrorSpy.mockRestore();
  });

  it('calls toast.error with sanitized message for ApiError', async () => {
    const { handleQueryClientError } = await import('../../src/app/providers/query-client');
    handleQueryClientError(new ApiError(404, 'Not Found'));

    expect(toastErrorSpy).toHaveBeenCalledWith('An error occurred', {
      description: 'The requested resource was not found.',
    });
  });

  it('calls toast.error with default message for unknown error', async () => {
    const { handleQueryClientError } = await import('../../src/app/providers/query-client');
    handleQueryClientError(new Error('unknown'));

    expect(toastErrorSpy).toHaveBeenCalledWith('An error occurred', {
      description: 'Unknown error',
    });
  });
});
