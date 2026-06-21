import enTranslation from '../../public/locales/en/translation.json';

export function getTranslation(key: string, translations?: Record<string, unknown>): string {
  const source = translations ?? (enTranslation as unknown as Record<string, unknown>);
  const result = key.split('.').reduce<unknown>((obj, part) => {
    if (obj && typeof obj === 'object' && part in obj) {
      return (obj as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
  return typeof result === 'string' ? result : key;
}
