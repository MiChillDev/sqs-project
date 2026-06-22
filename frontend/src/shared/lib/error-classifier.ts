import { ApiError, NetworkError } from 'src/shared/api/api-error';

export function extractErrorKey(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) return 'error.conflict';
    if (error.status >= 500) return 'admin.error.serverError';
    return 'error.clientError';
  }
  if (error instanceof NetworkError) return 'admin.error.networkError';
  return 'toast.unknownError';
}

export function is401(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 401;
}
