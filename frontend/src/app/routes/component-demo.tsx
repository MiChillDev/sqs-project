import { createRoute } from '@tanstack/react-router';
import type { TFunction } from 'i18next';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { useZodResolver } from '@/shared/hooks/use-zod-resolver';

import { rootRoute } from './__root';

const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
const sizes = ['xs', 'sm', 'default', 'lg'] as const;

function createDemoSchema(t: TFunction) {
  return z.object({
    name: z.string().min(2, { error: () => t('common.validation.nameMin') }),
    email: z.email({ error: () => t('common.validation.emailInvalid') }),
    message: z.string().min(10, { error: () => t('common.validation.messageMin') }),
  });
}

function ComponentDemoPage() {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => createDemoSchema(t), [t]);
  type TestForm = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<TestForm>({
    resolver: useZodResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
    mode: 'onTouched',
  });

  useEffect(() => {
    trigger();
    i18n.language;
  }, [trigger, i18n.language]);

  async function onSubmit(_data: TestForm) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success(t('demo.form.toastTitle'), { description: t('demo.form.toastDescription') });
    reset();
  }

  return (
    <div className='mx-auto max-w-200 space-y-8 p-8'>
      <h1 className='text-2xl font-bold'>{t('demo.title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('demo.cards.buttons.title')}</CardTitle>
          <CardDescription>{t('demo.cards.buttons.description')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-2'>
            {variants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            {sizes.map((size) => (
              <Button key={size} size={size === 'default' ? undefined : size}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('demo.cards.simple.title')}</CardTitle>
          <CardDescription>{t('demo.cards.simple.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>{t('demo.cards.simple.content')}</p>
        </CardContent>
        <CardFooter>
          <Button variant='outline' size='sm'>
            {t('demo.cards.simple.action')}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('demo.cards.action.title')}</CardTitle>
          <CardDescription>{t('demo.cards.action.description')}</CardDescription>
          <CardAction>
            <Button variant='outline' size='sm'>
              {t('demo.cards.action.headerAction')}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>{t('demo.cards.action.content')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('demo.cards.buttons.title')}</CardTitle>
          <CardDescription>{t('demo.cards.buttons.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            <Button
              onClick={() =>
                toast.success(t('demo.toasts.successTitle'), {
                  description: t('demo.toasts.successDescription'),
                })
              }
            >
              {t('demo.toasts.triggerSuccess')}
            </Button>
            <Button
              variant='destructive'
              onClick={() =>
                toast.error(t('demo.toasts.errorTitle'), {
                  description: t('demo.toasts.errorDescription'),
                })
              }
            >
              {t('demo.toasts.triggerError')}
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                toast.warning(t('demo.toasts.warningTitle'), {
                  description: t('demo.toasts.warningDescription'),
                })
              }
            >
              {t('demo.toasts.triggerWarning')}
            </Button>
            <Button
              variant='secondary'
              onClick={() =>
                toast.info(t('demo.toasts.infoTitle'), {
                  description: t('demo.toasts.infoDescription'),
                })
              }
            >
              {t('demo.toasts.triggerInfo')}
            </Button>
            <Button
              variant='ghost'
              onClick={() =>
                toast.message(t('demo.toasts.messageTitle'), {
                  description: t('demo.toasts.messageDescription'),
                })
              }
            >
              {t('demo.toasts.triggerMessage')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <FieldSet>
          <FieldLegend>{t('demo.form.legend')}</FieldLegend>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor='name'>{t('demo.form.fields.name')}</FieldLabel>
              <FieldContent>
                <Input
                  id='name'
                  aria-invalid={!!errors.name}
                  {...register('name')}
                  placeholder={t('demo.form.fields.namePlaceholder')}
                />
              </FieldContent>
              <FieldError errors={[errors.name]} />
            </Field>

            <FieldSeparator />

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor='email'>{t('demo.form.fields.email')}</FieldLabel>
              <FieldContent>
                <Input
                  id='email'
                  type='email'
                  aria-invalid={!!errors.email}
                  {...register('email')}
                  placeholder={t('demo.form.fields.emailPlaceholder')}
                />
              </FieldContent>
              <FieldError errors={[errors.email]} />
            </Field>

            <FieldSeparator />

            <Field data-invalid={!!errors.message}>
              <FieldLabel htmlFor='message'>{t('demo.form.fields.message')}</FieldLabel>
              <FieldContent>
                <Input
                  id='message'
                  aria-invalid={!!errors.message}
                  {...register('message')}
                  placeholder={t('demo.form.fields.messagePlaceholder')}
                />
              </FieldContent>
              <FieldError errors={[errors.message]} />
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className='flex gap-2'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? t('demo.form.submitting') : t('demo.form.submit')}
          </Button>
          <Button type='button' variant='outline' onClick={() => reset()}>
            {t('demo.form.reset')}
          </Button>
        </div>
      </form>
    </div>
  );
}

const componentTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/demo',
  component: ComponentDemoPage,
});

export default componentTestRoute;
