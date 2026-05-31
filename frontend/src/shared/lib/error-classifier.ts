import { ApiError, NetworkError } from 'src/shared/api/api-error';

export function extractErrorKey(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) return 'admin.error.serverError';
    return error.message;
  }
  if (error instanceof NetworkError) return 'admin.error.networkError';
  return 'An unexpected error occurred.';
}

export function is401(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 401;
}
