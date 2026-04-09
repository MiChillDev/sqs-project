import { createRoute } from '@tanstack/react-router';
import type { TFunction } from 'i18next';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { ThemeToggle } from '@/shared/components/theme-toggle';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { useTheme } from '@/shared/hooks/use-theme';
import { useZodResolver } from '@/shared/hooks/use-zod-resolver';

import { rootRoute } from './__root';

function createContactSchema(t: TFunction) {
  return z.object({
    name: z.string().min(2, { error: () => t('forms.nameMin') }),
    email: z.email({ error: () => t('forms.emailInvalid') }),
  });
}

const referenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reference',
  component: function ReferencePage() {
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const schema = useMemo(() => createContactSchema(t), [t]);
    type ContactForm = z.infer<typeof schema>;

    const {
      register,
      handleSubmit,
      reset,
      trigger,
      formState: { errors, isSubmitting },
    } = useForm<ContactForm>({
      resolver: useZodResolver(schema),
      defaultValues: { name: '', email: '' },
      mode: 'onTouched',
    });

    useEffect(() => {
      trigger();
      i18n.language;
    }, [trigger, i18n.language]);

    function onSubmit(data: ContactForm) {
      toast.success(t('forms.refToastTitle'), {
        description: t('forms.refToastDescription', { name: data.name }),
      });
      reset();
    }

    return (
      <div className='mx-auto max-w-400 p-8'>
        <h2 className='text-2xl font-bold'>{t('forms.refTitle')}</h2>
        <div className='mt-4 flex gap-2'>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              toast.error(t('forms.refSimErrorTitle'), {
                description: t('forms.refSimErrorDesc'),
              })
            }
          >
            {t('forms.refSimulateError')}
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-6 space-y-4'>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor='name'>{t('forms.name')}</FieldLabel>
            <FieldContent>
              <Input
                id='name'
                aria-invalid={!!errors.name}
                {...register('name')}
                placeholder={t('forms.refNamePlaceholder')}
              />
            </FieldContent>
            <FieldError errors={[errors.name]} />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor='email'>{t('forms.email')}</FieldLabel>
            <FieldContent>
              <Input
                id='email'
                type='email'
                aria-invalid={!!errors.email}
                {...register('email')}
                placeholder={t('forms.refEmailPlaceholder')}
              />
            </FieldContent>
            <FieldError errors={[errors.email]} />
          </Field>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? t('forms.submitting') : t('forms.submit')}
          </Button>
        </form>
      </div>
    );
  },
});

export default referenceRoute;
