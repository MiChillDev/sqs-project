import { createRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useHealthCheck, useRandomJoke } from 'src/shared/api/hooks';
import { Button } from 'src/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/shared/components/ui/card';

import { rootRoute } from './__root';

function DemoApiPage() {
  const { t } = useTranslation();
  const healthQuery = useHealthCheck();
  const jokeQuery = useRandomJoke();

  async function handleTest() {
    const result = await healthQuery.refetch();
    if (result.isSuccess) {
      toast.success(t('connectivityTest.toastTitle'), {
        description: t('connectivityTest.toastDescription'),
      });
    }
  }

  return (
    <div className='mx-auto max-w-200 space-y-6 p-8'>
      <Card>
        <CardHeader>
          <CardTitle>{t('connectivityTest.title')}</CardTitle>
          <CardDescription>{t('connectivityTest.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleTest} disabled={healthQuery.isFetching}>
            {healthQuery.isFetching
              ? t('connectivityTest.testing')
              : t('connectivityTest.testButton')}
          </Button>
          {healthQuery.isError && (
            <p className='mt-4 text-sm text-destructive'>{t('connectivityTest.error')}</p>
          )}
          {healthQuery.isSuccess && (
            <p className='mt-4 text-sm text-green-600'>
              {t('connectivityTest.statusResponse')} {healthQuery.data.status}
              {': '}
              {healthQuery.data.message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('jokePreview.title')}</CardTitle>
          <CardDescription>{t('jokePreview.description')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button onClick={() => jokeQuery.refetch()} disabled={jokeQuery.isFetching}>
            {jokeQuery.isFetching
              ? t('jokePreview.fetching')
              : jokeQuery.isSuccess
                ? t('jokePreview.refetchButton')
                : t('jokePreview.fetchButton')}
          </Button>
          {jokeQuery.isError && (
            <p className='text-sm text-destructive'>{t('jokePreview.error')}</p>
          )}
          {jokeQuery.isSuccess && (
            <blockquote className='border-l-4 border-primary pl-4 italic'>
              {jokeQuery.data.content}
            </blockquote>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default createRoute({
  getParentRoute: () => rootRoute,
  path: '/demo/api',
  component: DemoApiPage,
});
