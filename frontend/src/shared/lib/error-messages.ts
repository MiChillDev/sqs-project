import i18next from 'i18next';

export function getUserSafeError(error: unknown): string {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status;
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
    }
  }
  return i18next.t('toast.unknownError');
}
