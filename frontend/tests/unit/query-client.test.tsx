import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleQueryClientError } from '../../src/app/providers/query-client';
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
  it('returns sanitized message for ApiError with empty statusText', () => {
    expect(getUserSafeError(new ApiError(400, ''))).toBe(
      'Invalid request. Please check your input.'
    );
  });

  it('constructs message without statusText when empty', () => {
    expect(new ApiError(500, '').message).toBe('HTTP 500');
  });

  it('constructs message with statusText when provided', () => {
    expect(new ApiError(500, 'Server Error').message).toBe('HTTP 500: Server Error');
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

  beforeEach(() => {
    toastErrorSpy = vi
      .spyOn(toast, 'error')
      .mockImplementation(() => ({}) as ReturnType<typeof toast.error>);
  });

  afterEach(() => {
    toastErrorSpy.mockRestore();
  });

  it('calls toast.error with sanitized message for ApiError', () => {
    handleQueryClientError(new ApiError(404, 'Not Found'));

    expect(toastErrorSpy).toHaveBeenCalledWith('An error occurred', {
      description: 'The requested resource was not found.',
    });
  });

  it('calls toast.error with default message for unknown error', () => {
    handleQueryClientError(new Error('unknown'));

    expect(toastErrorSpy).toHaveBeenCalledWith('An error occurred', {
      description: 'Unknown error',
    });
  });

  it('logs to console.error in DEV mode', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    handleQueryClientError(new Error('dev error'));

    expect(consoleErrorSpy).toHaveBeenCalledWith('[API Error]', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});

describe('handleMutationClientError skipGlobalErrorToast', () => {
  let toastErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    vi.resetModules();
    const { toast } = await import('sonner');
    toastErrorSpy = vi
      .spyOn(toast, 'error')
      .mockImplementation(() => ({}) as ReturnType<typeof toast.error>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does NOT call toast.error when skipGlobalErrorToast is truthy', async () => {
    const { useMutation } = await import('@tanstack/react-query');
    const { QueryClientProviderWrapper } = await import('../../src/app/providers/query-client');
    const { renderHook, act } = await import('@testing-library/react');

    const { result } = renderHook(
      () =>
        useMutation({
          mutationFn: () => Promise.reject(new Error('test')),
          meta: { skipGlobalErrorToast: true },
        }),
      {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
        ),
      }
    );

    await act(async () => {
      try {
        await result.current.mutateAsync();
      } catch {
        // expected
      }
    });

    expect(toastErrorSpy).not.toHaveBeenCalled();
  });

  it('DOES call toast.error when skipGlobalErrorToast is absent', async () => {
    const { useMutation } = await import('@tanstack/react-query');
    const { QueryClientProviderWrapper } = await import('../../src/app/providers/query-client');
    const { renderHook, act } = await import('@testing-library/react');

    const { result } = renderHook(
      () =>
        useMutation({
          mutationFn: () => Promise.reject(new Error('test')),
        }),
      {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
        ),
      }
    );

    await act(async () => {
      try {
        await result.current.mutateAsync();
      } catch {
        // expected
      }
    });

    expect(toastErrorSpy).toHaveBeenCalled();
  });
});

describe('handleMutationClientError full pipeline', () => {
  let toastErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    vi.resetModules();
    const { toast } = await import('sonner');
    toastErrorSpy = vi
      .spyOn(toast, 'error')
      .mockImplementation(() => ({}) as ReturnType<typeof toast.error>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls toast.error with correct title and description for ApiError 404', async () => {
    const { ApiError } = await import('../../src/shared/api/api-error');
    const { useMutation } = await import('@tanstack/react-query');
    const { QueryClientProviderWrapper } = await import('../../src/app/providers/query-client');
    const { renderHook, act } = await import('@testing-library/react');

    const { result } = renderHook(
      () =>
        useMutation({
          mutationFn: () => Promise.reject(new ApiError(404, 'Not Found', {})),
        }),
      {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
        ),
      }
    );

    await act(async () => {
      try {
        await result.current.mutateAsync();
      } catch {
        // expected
      }
    });

    expect(toastErrorSpy).toHaveBeenCalledWith('An error occurred', {
      description: 'The requested resource was not found.',
    });
  });

  it('calls toast.error with correct title and description for NetworkError', async () => {
    const { NetworkError } = await import('../../src/shared/api/api-error');
    const { useMutation } = await import('@tanstack/react-query');
    const { QueryClientProviderWrapper } = await import('../../src/app/providers/query-client');
    const { renderHook, act } = await import('@testing-library/react');

    const { result } = renderHook(
      () =>
        useMutation({
          mutationFn: () => Promise.reject(new NetworkError(new TypeError('Failed'))),
        }),
      {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
        ),
      }
    );

    await act(async () => {
      try {
        await result.current.mutateAsync();
      } catch {
        // expected
      }
    });

    expect(toastErrorSpy).toHaveBeenCalledWith('An error occurred', {
      description: 'Unable to connect to the server. Please check your internet connection.',
    });
  });
});

describe('QueryClientProviderWrapper', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('renders children', async () => {
    const { QueryClientProviderWrapper } = await import('../../src/app/providers/query-client');
    const { render, screen } = await import('@testing-library/react');

    render(
      <QueryClientProviderWrapper>
        <div data-testid='child'>hello</div>
      </QueryClientProviderWrapper>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
