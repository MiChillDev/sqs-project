import { createRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useHealthCheck } from 'src/shared/api/hooks';
import { Button } from 'src/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/shared/components/ui/card';

import { rootRoute } from './__root';

function ApiTestPage() {
  const { t } = useTranslation();
  const healthQuery = useHealthCheck();

  async function handleTest() {
    const result = await healthQuery.refetch();
    if (result.isSuccess) {
      toast.success(t('connectivityTest.toastTitle'), {
        description: t('connectivityTest.toastDescription'),
      });
    }
  }

  return (
    <div className='mx-auto max-w-200 p-8'>
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
              Status response:{' '}
              {healthQuery.data.status}
              {': '}
              {healthQuery.data.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default createRoute({
  getParentRoute: () => rootRoute,
  path: '/api-test',
  component: ApiTestPage,
});
