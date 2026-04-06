import { createRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { rootRoute } from './__root';

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function IndexPage() {
    const { t } = useTranslation();

    return (
      <div className="mx-auto max-w-200 p-8">
        <h1 className="text-2xl font-bold">{t('home.title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('home.description')}</p>
      </div>
    );
  },
});

export default indexRoute;
