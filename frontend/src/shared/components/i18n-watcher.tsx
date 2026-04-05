import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function I18nWatcher() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: i18n.language is required because t is a stable reference in react-i18next
  useEffect(() => {
    document.title = t('app.documentTitle');
  }, [i18n.language, t]);

  return null;
}
