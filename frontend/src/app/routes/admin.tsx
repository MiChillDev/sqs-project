import { createRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateJoke, useSourceJoke } from 'src/shared/api/hooks';
import { ErrorAlert } from 'src/shared/components/error-alert';
import { Button } from 'src/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/shared/components/ui/card';
import { Field, FieldContent, FieldError, FieldLabel } from 'src/shared/components/ui/field';
import { Input } from 'src/shared/components/ui/input';
import { Textarea } from 'src/shared/components/ui/textarea';
import { requireAuth } from 'src/shared/guards/require-auth';
import { useZodForm } from 'src/shared/hooks/use-zod-form';
import { extractErrorKey } from 'src/shared/lib/error-classifier';
import { handle401 } from 'src/shared/lib/handle-401';
import { z } from 'zod';

import { rootRoute } from './__root';

/* ------------------------------------------------------------------ */
/*  joke creation schema                                              */
/* ------------------------------------------------------------------ */

const jokeCreationSchema = z.object({
  content: z.string().min(1).max(500),
  externalId: z.string().optional(),
});

/* ------------------------------------------------------------------ */
/*  JokeCreationSection                                               */
/* ------------------------------------------------------------------ */

function JokeCreationSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createJoke = useCreateJoke();
  const [createdJoke, setCreatedJoke] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useZodForm(jokeCreationSchema);

  const submitJoke = (data: { content: string; externalId?: string }) => {
    setErrorMessage(null);
    setCreatedJoke(null);

    createJoke.mutate(
      { content: data.content, externalId: data.externalId ?? '' },
      {
        onSuccess: (joke) => {
          setCreatedJoke(joke.content);
          form.reset();
        },
        onError: (error) => {
          if (handle401(error, navigate)) return;
          setErrorMessage(extractErrorKey(error));
        },
      }
    );
  };

  const onSubmit = form.handleSubmit(submitJoke);

  const handleRetry = () => {
    const data = form.getValues();
    submitJoke(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.createJoke')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='flex flex-col gap-4'>
          <Field data-invalid={!!form.formState.errors.content}>
            <FieldLabel htmlFor='content'>{t('admin.contentLabel')}</FieldLabel>
            <FieldContent>
              <Textarea
                id='content'
                rows={4}
                aria-invalid={!!form.formState.errors.content}
                {...form.register('content')}
              />
            </FieldContent>
            {form.formState.errors.content && (
              <FieldError>{form.formState.errors.content.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.externalId}>
            <FieldLabel htmlFor='externalId'>{t('admin.externalIdLabel')}</FieldLabel>
            <FieldContent>
              <Input
                id='externalId'
                aria-invalid={!!form.formState.errors.externalId}
                {...form.register('externalId')}
              />
            </FieldContent>
            {form.formState.errors.externalId && (
              <FieldError>{form.formState.errors.externalId.message}</FieldError>
            )}
          </Field>

          {errorMessage && <ErrorAlert messageKey={errorMessage} onRetry={handleRetry} />}

          {createdJoke && (
            <div className='rounded-md border border-green-500/50 bg-green-50 px-4 py-3 text-green-800 text-sm dark:bg-green-950 dark:text-green-200'>
              {createdJoke}
            </div>
          )}

          <Button type='submit' disabled={createJoke.isPending}>
            {createJoke.isPending ? t('admin.submitting') : t('admin.createJoke')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  SourceJokeSection                                                 */
/* ------------------------------------------------------------------ */

function SourceJokeSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sourceJoke = useSourceJoke();
  const saveJoke = useCreateJoke();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedExternalId, setSavedExternalId] = useState<string | null>(null);

  const handleFetch = () => {
    setErrorMessage(null);
    setSavedExternalId(null);
    sourceJoke.refetch().then((result) => {
      if (result.error) {
        const error = result.error;
        if (handle401(error, navigate)) return;
        setErrorMessage(extractErrorKey(error));
      }
    });
  };

  const handleSave = () => {
    if (!sourceJoke.data) return;
    saveJoke.mutate(
      { content: sourceJoke.data.content, externalId: sourceJoke.data.externalId },
      {
        onSuccess: () => {
          setSavedExternalId(sourceJoke.data?.externalId ?? null);
        },
        onError: (error) => {
          if (handle401(error, navigate)) return;
          setErrorMessage(extractErrorKey(error));
        },
      }
    );
  };

  const handleRetry = () => {
    setErrorMessage(null);
    sourceJoke.refetch().then((result) => {
      if (result.error) {
        const error = result.error;
        if (handle401(error, navigate)) return;
        setErrorMessage(extractErrorKey(error));
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.fetchSourceJoke')}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <Button onClick={handleFetch} disabled={sourceJoke.isFetching}>
          {sourceJoke.isFetching ? t('admin.fetching') : t('admin.fetchSourceJoke')}
        </Button>

        {sourceJoke.data && !sourceJoke.isFetching && (
          <div className='flex flex-col gap-3'>
            <div className='rounded-md border border-green-500/50 bg-green-50 px-4 py-3 text-green-800 text-sm dark:bg-green-950 dark:text-green-200'>
              {sourceJoke.data.content}
            </div>
            {savedExternalId === sourceJoke.data.externalId ? (
              <div className='rounded-md border border-green-500/50 bg-green-50 px-4 py-3 text-green-800 text-sm dark:bg-green-950 dark:text-green-200'>
                {t('admin.saved')}
              </div>
            ) : (
              <Button
                variant='outline'
                size='sm'
                onClick={handleSave}
                disabled={saveJoke.isPending}
                className='self-start'
              >
                {saveJoke.isPending ? t('admin.saving') : t('admin.save')}
              </Button>
            )}
          </div>
        )}

        {errorMessage && !sourceJoke.isFetching && (
          <ErrorAlert messageKey={errorMessage} onRetry={handleRetry} />
        )}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  AdminPage                                                         */
/* ------------------------------------------------------------------ */

function AdminPage() {
  const { t } = useTranslation();

  return (
    <div className='mx-auto max-w-200 p-8'>
      <h1 className='text-2xl font-bold mb-8'>{t('admin.title')}</h1>
      <div className='space-y-8'>
        <JokeCreationSection />
        <SourceJokeSection />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  route export                                                      */
/* ------------------------------------------------------------------ */

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: requireAuth(),
  component: AdminPage,
});

export default adminRoute;
