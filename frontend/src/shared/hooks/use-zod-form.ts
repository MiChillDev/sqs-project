import { useEffect, useRef } from 'react';
import type { Path, Resolver, UseFormProps, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import type { $ZodType } from 'zod/v4/core';

import { useZodResolver } from './use-zod-resolver';

// biome-ignore lint/suspicious/noExplicitAny: schema constraint must accept any zod output shape; callers get the specific inferred type
type FormSchema = $ZodType<any, any>;

export function useZodForm<TSchema extends FormSchema>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
): UseFormReturn<z.infer<TSchema>> {
  const { i18n } = useTranslation();
  const resolver = useZodResolver(schema) as Resolver<z.infer<TSchema>>;
  const form = useForm<z.infer<TSchema>>({ resolver, ...options });

  const touchedFieldsRef = useRef(form.formState.touchedFields);
  touchedFieldsRef.current = form.formState.touchedFields;

  const triggerRef = useRef(form.trigger);
  triggerRef.current = form.trigger;

  // biome-ignore lint/correctness/useExhaustiveDependencies: i18n.language is the intentional trigger for revalidation
  useEffect(() => {
    const touchedKeys = Object.keys(touchedFieldsRef.current).filter(
      (key) => (touchedFieldsRef.current as Record<string, boolean | undefined>)[key]
    ) as Path<z.infer<TSchema>>[];
    if (touchedKeys.length > 0) {
      triggerRef.current(touchedKeys);
    }
  }, [i18n.language]);

  return form;
}
