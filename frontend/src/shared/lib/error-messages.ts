import i18next from 'i18next';
import { ApiError, NetworkError } from 'src/shared/api/api-error';

export function getUserSafeError(error: unknown): string {
  if (error instanceof NetworkError) {
    return i18next.t('error.networkError');
  }

  if (error instanceof ApiError) {
    const { status } = error;
    switch (status) {
      case 400:
        return i18next.t('error.badRequest');
      case 401:
        return i18next.t('error.unauthorized');
      case 403:
        return i18next.t('error.forbidden');
      case 404:
        return i18next.t('error.notFound');
      case 500:
        return i18next.t('error.serverError');
      default:
        if (status >= 500) {
          return i18next.t('error.serverError');
        }
        if (status >= 400) {
          return i18next.t('error.clientError');
        }
    }
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return i18next.t('error.timeout');
  }

  return i18next.t('toast.unknownError');
}
