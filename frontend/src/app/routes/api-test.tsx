import { createRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useJokes } from '@/shared/api/api';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

import { rootRoute } from './__root';

function ApiTestPage() {
  const { t } = useTranslation();
  const mutation = useJokes();

  return (
    <div className='mx-auto max-w-200 p-8'>
      <Card>
        <CardHeader>
          <CardTitle>{t('connectivityTest.title')}</CardTitle>
          <CardDescription>{t('connectivityTest.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
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
