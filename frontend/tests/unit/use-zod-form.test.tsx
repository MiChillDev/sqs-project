/// <reference types="vitest/globals" />

import { act, renderHook } from '@testing-library/react';
import { z } from 'zod';
import { useZodForm } from '../../src/shared/hooks/use-zod-form';

const testSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

describe('useZodForm', () => {
  it('returns a valid form object with register and handleSubmit', () => {
    const { result } = renderHook(() => useZodForm(testSchema));
    expect(result.current.register).toBeDefined();
    expect(result.current.handleSubmit).toBeDefined();
    expect(result.current.formState).toBeDefined();
  });

  it('respects default values', () => {
    const { result } = renderHook(() =>
      useZodForm(testSchema, {
        defaultValues: { name: 'Test', email: 'test@example.com' },
      })
    );
    expect(result.current.getValues('name')).toBe('Test');
    expect(result.current.getValues('email')).toBe('test@example.com');
  });

  it('uses zod resolver for validation', async () => {
    const { result } = renderHook(() =>
      useZodForm(testSchema, { defaultValues: { name: '', email: '' } })
    );

    await act(async () => {
      result.current.setValue('name', 'a');
    });

    const valid = await result.current.trigger('name');
    expect(valid).toBe(false);
  });

  it('passes validation with valid data', async () => {
    const { result } = renderHook(() =>
      useZodForm(testSchema, {
        defaultValues: { name: 'John', email: 'john@example.com' },
      })
    );

    const valid = await result.current.trigger(['name', 'email']);
    expect(valid).toBe(true);
  });

  it('stores touched fields in ref for language-change revalidation', async () => {
    const { result } = renderHook(() =>
      useZodForm(testSchema, { defaultValues: { name: '', email: '' } })
    );

    await act(async () => {
      result.current.setValue('name', 'ab', { shouldTouch: true });
    });

    expect(result.current.formState.touchedFields.name).toBe(true);
  });
});
