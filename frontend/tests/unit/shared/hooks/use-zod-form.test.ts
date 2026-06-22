import { act, renderHook } from '@testing-library/react';
import { useZodForm } from 'src/shared/hooks/use-zod-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const testSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

let mockLanguage = 'en';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: mockLanguage },
  }),
}));

vi.mock('src/shared/lib/zod-locales', () => ({
  getZodLocale: () => ({
    localeError: vi.fn(() => ({ message: () => 'error' })),
  }),
}));

describe('useZodForm', () => {
  beforeEach(() => {
    mockLanguage = 'en';
  });

  it('returns a form with resolver configured', () => {
    const { result } = renderHook(() => useZodForm(testSchema));

    expect(result.current).toBeDefined();
    expect(result.current.register).toBeInstanceOf(Function);
    expect(result.current.handleSubmit).toBeInstanceOf(Function);
  });

  it('passes through additional useForm options', () => {
    const { result } = renderHook(() =>
      useZodForm(testSchema, { defaultValues: { name: 'John', email: '' } })
    );

    expect(result.current.getValues('name')).toBe('John');
  });

  it('re-validates touched fields when language changes', async () => {
    const { result, rerender } = renderHook(
      ({ schema }: { schema: typeof testSchema }) => useZodForm(schema),
      { initialProps: { schema: testSchema } }
    );

    const form = result.current;
    const triggerSpy = vi.spyOn(form, 'trigger');

    await act(async () => {
      result.current.setValue('name', '', { shouldTouch: true, shouldDirty: true });
    });

    triggerSpy.mockClear();

    mockLanguage = 'de';
    rerender({ schema: testSchema });

    await act(async () => {
      await Promise.resolve();
    });

    expect(triggerSpy).toHaveBeenCalledWith(['name']);
  });

  it('does not re-validate when no fields are touched', async () => {
    const { result, rerender } = renderHook(
      ({ schema }: { schema: typeof testSchema }) => useZodForm(schema),
      { initialProps: { schema: testSchema } }
    );

    const triggerSpy = vi.spyOn(result.current, 'trigger');

    mockLanguage = 'de';
    rerender({ schema: testSchema });

    await act(async () => {
      await Promise.resolve();
    });

    expect(triggerSpy).not.toHaveBeenCalled();
  });
});
