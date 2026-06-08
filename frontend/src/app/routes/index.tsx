import { createRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/shared/components/ui/button';

import { rootRoute } from './__root';

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function IndexPage() {
    const { t } = useTranslation();

    return (
      <div className='min-h-screen flex flex-col items-center justify-center gap-12 bg-linear-to-br from-(--color-playful-bg-start) via-(--color-playful-bg-mid) to-(--color-playful-bg-end) font-body overflow-hidden'>
        <h1 className='text-[4rem] font-heading text-(--color-playful-heading) drop-shadow-[3px_3px_0px_var(--color-playful-accent)] dark:drop-shadow-[0_0_15px_var(--color-playful-accent)] -rotate-2 tracking-wide'>
          {t('welcome.title')}
        </h1>

        <Button
          asChild
          className='px-10 py-4 text-xl font-heading bg-linear-to-r from-(--color-playful-accent) to-(--color-playful-accent-light) text-white rounded-full shadow-lg dark:shadow-[0_0_25px_rgba(255,107,53,0.5)] hover:scale-105 transition'
        >
          <Link to='/jokes'>{t('welcome.goToJokes')}</Link>
        </Button>
      </div>
    );
  },
});

export default indexRoute;
