import { useEffect, useRef } from 'react';
import type { Path, UseFormProps, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { infer as Infer } from 'zod/v4/core';

import { type FormSchema, useZodResolver } from './use-zod-resolver';

export function useZodForm<TSchema extends FormSchema>(
  schema: TSchema,
  options?: Omit<UseFormProps<Infer<TSchema>>, 'resolver'>
): UseFormReturn<Infer<TSchema>> {
  const { i18n } = useTranslation();
  const resolver = useZodResolver(schema);
  const form = useForm<Infer<TSchema>>({ resolver, ...options });

  const touchedFieldsRef = useRef(form.formState.touchedFields);
  touchedFieldsRef.current = form.formState.touchedFields;

  const triggerRef = useRef(form.trigger);
  triggerRef.current = form.trigger;

  // biome-ignore lint/correctness/useExhaustiveDependencies: i18n.language is the intentional trigger for revalidation
  useEffect(() => {
    const touchedKeys = Object.keys(touchedFieldsRef.current).filter(
      (key) => (touchedFieldsRef.current as Record<string, boolean | undefined>)[key]
    ) as Path<Infer<TSchema>>[];
    if (touchedKeys.length > 0) {
      triggerRef.current(touchedKeys);
    }
  }, [i18n.language]);

  return form;
}
