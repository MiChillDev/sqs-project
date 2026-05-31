import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLogin } from 'src/shared/api/hooks';
import { Button } from 'src/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/shared/components/ui/card';
import { Field, FieldContent, FieldError, FieldLabel } from 'src/shared/components/ui/field';
import { Input } from 'src/shared/components/ui/input';
import { useZodForm } from 'src/shared/hooks/use-zod-form';
import { authStorage } from 'src/shared/lib/auth-storage';
import { loginSchema } from 'src/shared/lib/login-schema';
import { loginErrorKey, resolveRedirect } from './login-helpers';
import { loginRoute } from './route';
import { useBanner } from './use-banner';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();

  const { redirect } = loginRoute.useSearch();
  const target = resolveRedirect(redirect);

  const [hasToken, setHasToken] = useState(() => !!authStorage.get());

  useEffect(() => {
    if (hasToken) {
      navigate({ to: target });
    }
  }, [hasToken, navigate, target]);

  useEffect(() => {
    return authStorage.subscribe((next) => {
      setHasToken(!!next);
    });
  }, []);

  const form = useZodForm(loginSchema);

  const watchedUsername = form.watch('username');
  const watchedPassword = form.watch('password');

  const [bannerKey, setBannerKey] = useBanner();
  // biome-ignore lint/correctness/useExhaustiveDependencies: watched fields are the intentional triggers to clear the banner on any field change after an error
  useEffect(() => {
    setBannerKey(null);
  }, [watchedUsername, watchedPassword, setBannerKey]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await login.mutateAsync(data);
      authStorage.set(response);
      navigate({ to: target });
    } catch (error) {
      setBannerKey(loginErrorKey(error));
    }
  });

  if (hasToken) {
    return null;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>{t('login.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className='flex flex-col gap-4'>
            {bannerKey && (
              <div
                role='alert'
                className='rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive text-sm'
              >
                {t(bannerKey)}
              </div>
            )}

            <Field data-invalid={!!form.formState.errors.username}>
              <FieldLabel htmlFor='username'>{t('login.fields.username')}</FieldLabel>
              <FieldContent>
                <Input
                  id='username'
                  autoComplete='username'
                  aria-invalid={!!form.formState.errors.username}
                  {...form.register('username')}
                />
              </FieldContent>
              {form.formState.errors.username && (
                <FieldError>{t('login.errors.required')}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!form.formState.errors.password}>
              <FieldLabel htmlFor='password'>{t('login.fields.password')}</FieldLabel>
              <FieldContent>
                <Input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register('password')}
                />
              </FieldContent>
              {form.formState.errors.password && (
                <FieldError>{t('login.errors.required')}</FieldError>
              )}
            </Field>

            <Button type='submit' disabled={login.isPending}>
              {login.isPending ? (
                <svg
                  className='animate-spin size-4'
                  viewBox='0 0 24 24'
                  fill='none'
                  aria-hidden='true'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                  />
                </svg>
              ) : null}
              {t('login.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
