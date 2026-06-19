import { createRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/shared/components/ui/button';

import { rootRoute } from './__root';
import { AnimatedWelcome } from './animated-welcome';

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function IndexPage() {
    const { t } = useTranslation();

    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-24 bg-linear-to-br from-playful-bg-start via-playful-bg-mid to-playful-bg-end font-body overflow-hidden'>
        <AnimatedWelcome text={t('welcome.title')} />

        <Button
          asChild
          className='px-10 py-4 text-xl font-heading bg-linear-to-r from-playful-accent to-playful-accent-light text-white rounded-full shadow-lg dark:shadow-[0_0_25px_rgba(255,107,53,0.5)] hover:scale-105 transition'
        >
          <Link data-testid='go-to-jokes-link' to='/jokes'>
            {t('welcome.goToJokes')}
          </Link>
        </Button>
      </div>
    );
  },
});

export default indexRoute;
