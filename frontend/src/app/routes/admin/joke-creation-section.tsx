import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateJoke } from 'src/shared/api/hooks';
import { ErrorAlert } from 'src/shared/components/error-alert';
import { Button } from 'src/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/shared/components/ui/card';
import { Field, FieldContent, FieldError, FieldLabel } from 'src/shared/components/ui/field';
import { Input } from 'src/shared/components/ui/input';
import { Textarea } from 'src/shared/components/ui/textarea';
import { useZodForm } from 'src/shared/hooks/use-zod-form';
import { extractErrorKey } from 'src/shared/lib/error-classifier';
import { handle401 } from 'src/shared/lib/handle-401';
import { z } from 'zod';

const jokeCreationSchema = z.object({
  content: z.string().min(1).max(500),
  externalId: z.string().optional(),
});

export function JokeCreationSection() {
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
                data-testid='joke-content-textarea'
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
                data-testid='joke-external-id-input'
                id='externalId'
                aria-invalid={!!form.formState.errors.externalId}
                {...form.register('externalId')}
              />
            </FieldContent>
            {form.formState.errors.externalId && (
              <FieldError>{form.formState.errors.externalId.message}</FieldError>
            )}
          </Field>

          {errorMessage && (
            <div data-testid='create-joke-error'>
              <ErrorAlert messageKey={errorMessage} onRetry={handleRetry} />
            </div>
          )}

          {createdJoke && (
            <div
              data-testid='create-joke-success'
              className='rounded-md border border-green-500/50 bg-green-50 px-4 py-3 text-green-800 text-sm dark:bg-green-950 dark:text-green-200'
            >
              {createdJoke}
            </div>
          )}

          <Button
            data-testid='create-joke-button'
            type='submit'
            disabled={createJoke.isPending}
            className='bg-linear-to-r from-playful-accent to-playful-accent-light text-white rounded-full shadow-lg dark:shadow-[0_0_25px_rgba(255,107,53,0.5)] hover:scale-105 transition'
          >
            {createJoke.isPending ? t('admin.submitting') : t('admin.createJoke')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
