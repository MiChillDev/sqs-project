import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getZodLocale } from 'src/shared/lib/zod-locales';
import type { $ZodType } from 'zod/v4/core';

type FormSchema = $ZodType<unknown, FieldValues>;

export function useZodResolver<T extends FormSchema>(schema: T) {
  const { i18n } = useTranslation();

  return useMemo(() => {
    const localeConfig = getZodLocale(i18n.language);
    return zodResolver(schema, { error: localeConfig.localeError });
  }, [schema, i18n.language]);
}
