/// <reference types="vitest/globals" />

import deTranslations from '../../public/locales/de/translation.json';
import enTranslations from '../../public/locales/en/translation.json';

function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      keys.push(...getKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

describe('Translation Coverage', () => {
  it('has identical keys in English and German translation files', () => {
    const enKeys = getKeys(enTranslations as Record<string, unknown>);
    const deKeys = getKeys(deTranslations as Record<string, unknown>);

    expect(enKeys).toEqual(deKeys);
  });

  it('has no extra keys in German file', () => {
    const enKeys = new Set(getKeys(enTranslations as Record<string, unknown>));
    const deKeys = getKeys(deTranslations as Record<string, unknown>);

    const extraKeys = deKeys.filter((key) => !enKeys.has(key));
    expect(extraKeys).toEqual([]);
  });

  it('has no missing keys in German file', () => {
    const deKeys = new Set(getKeys(deTranslations as Record<string, unknown>));
    const enKeys = getKeys(enTranslations as Record<string, unknown>);

    const missingKeys = enKeys.filter((key) => !deKeys.has(key));
    expect(missingKeys).toEqual([]);
  });
});
