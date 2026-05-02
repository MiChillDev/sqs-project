import { createRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useHealthCheck } from 'src/shared/api/api';
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
  const mutation = useHealthCheck();

  function handleTest() {
    mutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t('connectivityTest.toastTitle'), {
          description: t('connectivityTest.toastDescription'),
        });
      },
    });
  }

  return (
    <div className='mx-auto max-w-200 p-8'>
      <Card>
        <CardHeader>
          <CardTitle>{t('connectivityTest.title')}</CardTitle>
          <CardDescription>{t('connectivityTest.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleTest} disabled={mutation.isPending}>
            {mutation.isPending ? t('connectivityTest.testing') : t('connectivityTest.testButton')}
          </Button>
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
