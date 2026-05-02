import { createRoute } from '@tanstack/react-router';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { ThemeToggle } from 'src/shared/components/theme-toggle';
import { Button } from 'src/shared/components/ui/button';
import { Field, FieldContent, FieldError, FieldLabel } from 'src/shared/components/ui/field';
import { Input } from 'src/shared/components/ui/input';
import { useTheme } from 'src/shared/hooks/use-theme';
import { useZodForm } from 'src/shared/hooks/use-zod-form';
import { z } from 'zod';

import { rootRoute } from './__root';

function createContactSchema(t: TFunction) {
  return z.object({
    name: z.string().min(2, { error: () => t('common.validation.nameMin') }),
    email: z.email({ error: () => t('common.validation.emailInvalid') }),
  });
}

const referenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reference',
  component: function ReferencePage() {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const schema = useMemo(() => createContactSchema(t), [t]);
    type ContactForm = z.infer<typeof schema>;

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useZodForm(schema, {
      defaultValues: { name: '', email: '' },
      mode: 'onTouched',
    });

    function onSubmit(data: ContactForm) {
      toast.success(t('reference.form.toastTitle'), {
        description: t('reference.form.toastDescription', { name: data.name }),
      });
      reset();
    }

    return (
      <div className='mx-auto max-w-400 p-8'>
        <h2 className='text-2xl font-bold'>{t('reference.title')}</h2>
        <div className='mt-4 flex gap-2'>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              toast.error(t('reference.form.simErrorTitle'), {
                description: t('reference.form.simErrorDesc'),
              })
            }
          >
            {t('reference.form.simulateError')}
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-6 space-y-4'>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor='name'>{t('reference.form.fields.name')}</FieldLabel>
            <FieldContent>
              <Input
                id='name'
                aria-invalid={!!errors.name}
                {...register('name')}
                placeholder={t('reference.form.fields.namePlaceholder')}
              />
            </FieldContent>
            <FieldError errors={[errors.name]} />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor='email'>{t('reference.form.fields.email')}</FieldLabel>
            <FieldContent>
              <Input
                id='email'
                type='email'
                aria-invalid={!!errors.email}
                {...register('email')}
                placeholder={t('reference.form.fields.emailPlaceholder')}
              />
            </FieldContent>
            <FieldError errors={[errors.email]} />
          </Field>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? t('reference.form.submitting') : t('reference.form.submit')}
          </Button>
        </form>
      </div>
    );
  },
});

export default referenceRoute;
