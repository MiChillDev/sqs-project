import { describe, expect, it } from 'vitest';

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
});
