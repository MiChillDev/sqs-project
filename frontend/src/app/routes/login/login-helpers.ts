import { ApiError, NetworkError } from 'src/shared/api/api-error';

export function resolveRedirect(redirect?: string): string {
  if (!redirect) return '/admin';
  if (redirect.includes('://') || redirect.includes('//')) return '/admin';
  if (!redirect.startsWith('/')) return '/admin';
  return redirect;
}

export function loginErrorKey(error: unknown): string {
  if (error instanceof NetworkError) return 'error.networkError';
  if (error instanceof DOMException && error.name === 'AbortError') return 'error.timeout';
  if (error instanceof ApiError) {
    if (error.status >= 500) return 'error.serverError';
    return 'login.errors.invalidCredentials';
  }
  return 'toast.unknownError';
}
