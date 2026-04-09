import type { $ZodErrorMap } from 'zod/v4/core';
import { de as deLocale, en as enLocale } from 'zod/v4/locales';

const zodLocales: Record<string, () => { localeError: $ZodErrorMap }> = {
  en: enLocale,
  de: deLocale,
};

export function getZodLocale(lang: string): { localeError: $ZodErrorMap } {
  const localeFn = zodLocales[lang] ?? enLocale;
  return localeFn();
}
