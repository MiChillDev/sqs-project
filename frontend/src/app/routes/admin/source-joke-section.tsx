import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateJoke, useSourceJoke } from 'src/shared/api/hooks';
import { ErrorAlert } from 'src/shared/components/error-alert';
import { Button } from 'src/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/shared/components/ui/card';
import { extractErrorKey } from 'src/shared/lib/error-classifier';
import { handle401 } from 'src/shared/lib/handle-401';

export function SourceJokeSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sourceJoke = useSourceJoke();
  const saveJoke = useCreateJoke();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedExternalId, setSavedExternalId] = useState<string | null>(null);

  const doRefetch = () => {
    setErrorMessage(null);
    sourceJoke.refetch().then((result) => {
      if (result.error) {
        const error = result.error;
        if (handle401(error, navigate)) return;
        setErrorMessage(extractErrorKey(error));
      }
    });
  };

  const handleFetch = () => {
    setSavedExternalId(null);
    doRefetch();
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
    doRefetch();
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
