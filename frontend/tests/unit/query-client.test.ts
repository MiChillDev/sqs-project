/// <reference types="vitest/globals" />

import { toast } from 'sonner';

import { handleMutationError } from '@/app/providers/query-client';
import { getUserSafeError } from '@/shared/lib/error-messages';

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
      };
      return translations[key] ?? key;
    },
  },
}));

describe('getUserSafeError', () => {
  it('returns sanitized message for 400', () => {
    expect(getUserSafeError({ status: 400 })).toBe('Invalid request. Please check your input.');
  });

  it('returns sanitized message for 401', () => {
    expect(getUserSafeError({ status: 401 })).toBe('Please sign in to continue.');
  });

  it('returns sanitized message for 403', () => {
    expect(getUserSafeError({ status: 403 })).toBe(
      'You do not have permission to perform this action.',
    );
  });

  it('returns sanitized message for 404', () => {
    expect(getUserSafeError({ status: 404 })).toBe('The requested resource was not found.');
  });

  it('returns sanitized message for 500', () => {
    expect(getUserSafeError({ status: 500 })).toBe('Something went wrong. Please try again later.');
  });

  it('returns default message for unrecognized status code', () => {
    expect(getUserSafeError({ status: 418 })).toBe('Unknown error');
  });

  it('returns default message for Error object without status', () => {
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
    toastErrorSpy = vi.spyOn(toast, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    toastErrorSpy.mockRestore();
  });

  it('calls toast.error with sanitized message for status error', () => {
    handleMutationError({ status: 404 });

    expect(toastErrorSpy).toHaveBeenCalledWith('An error occurred', {
      description: 'The requested resource was not found.',
    });
  });

  it('calls toast.error with default message for unknown error', () => {
    handleMutationError(new Error('unknown'));

    expect(toastErrorSpy).toHaveBeenCalledWith('An error occurred', {
      description: 'Unknown error',
    });
  });
});
