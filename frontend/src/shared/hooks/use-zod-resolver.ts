import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import type { FieldValues, Resolver } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getZodLocale } from 'src/shared/lib/zod-locales';
import type { $ZodType, output } from 'zod/v4/core';

export type FormSchema = $ZodType<FieldValues, FieldValues>;

export function useZodResolver<T extends FormSchema>(schema: T): Resolver<output<T>> {
  const { i18n } = useTranslation();

  return useMemo(() => {
    const localeConfig = getZodLocale(i18n.language);
    return zodResolver(schema, { error: localeConfig.localeError }) as Resolver<output<T>>;
  }, [schema, i18n.language]);
}
