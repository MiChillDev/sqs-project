import { createRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError, NetworkError } from 'src/shared/api/api-error';
import { useLogin } from 'src/shared/api/hooks';
import { Button } from 'src/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/shared/components/ui/card';
import { Field, FieldContent, FieldError, FieldLabel } from 'src/shared/components/ui/field';
import { Input } from 'src/shared/components/ui/input';
import { useZodForm } from 'src/shared/hooks/use-zod-form';
import { authStorage } from 'src/shared/lib/auth-storage';
import { loginSchema } from 'src/shared/lib/login-schema';
import { rootRoute } from './__root';

/* ------------------------------------------------------------------ */
/*  helper: resolve redirect target with open-redirect protection      */
/* ------------------------------------------------------------------ */

/**
 * Resolve the post-login redirect target from a search parameter.
 * Blocks open redirects: external URLs, protocol-relative URLs, and
 * non-absolute paths all fall back to the default `/admin`.
 */
export function resolveRedirect(redirect?: string): string {
  if (!redirect) return '/admin';
  // Block protocol-relative and absolute URLs (open redirect prevention)
  if (redirect.includes('://') || redirect.includes('//')) return '/admin';
  // Only allow local absolute paths
  if (!redirect.startsWith('/')) return '/admin';
  return redirect;
}

/* ------------------------------------------------------------------ */
/*  helper: classify login error → i18n key                           */
/* ------------------------------------------------------------------ */

export function loginErrorKey(error: unknown): string {
  if (error instanceof NetworkError) return 'error.networkError';
  if (error instanceof DOMException && error.name === 'AbortError') return 'error.timeout';
  if (error instanceof ApiError) {
    if (error.status >= 500) return 'error.serverError';
    return 'login.errors.invalidCredentials';
  }
  return 'toast.unknownError';
}

/* ------------------------------------------------------------------ */
/*  internal hook: banner state with stable setter reference           */
/* ------------------------------------------------------------------ */

function useBanner(): [string | null, (v: string | null) => void] {
  const [key, setKey] = useState<string | null>(null);

  const setBannerKey = useCallback((v: string | null) => {
    setKey(v);
  }, []);

  return [key, setBannerKey] as const;
}

/* ------------------------------------------------------------------ */
/*  component                                                         */
/* ------------------------------------------------------------------ */

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();

  const { redirect } = loginRoute.useSearch();
  const target = resolveRedirect(redirect);

  // React to auth changes across tabs — redirect when token appears
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

  // All hooks called unconditionally (Rules of Hooks) before conditional render
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

  // Guard: skip rendering the form when already logged in
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

/* ------------------------------------------------------------------ */
/*  route export                                                      */
/* ------------------------------------------------------------------ */

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginPage,
});

export default loginRoute;
