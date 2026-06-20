import { createRootRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { I18nWatcher } from 'src/shared/components/i18n-watcher';
import { LanguageToggle } from 'src/shared/components/language-toggle';
import { ThemeToggle } from 'src/shared/components/theme-toggle';
import { Toaster } from 'src/shared/components/toaster';
import { UserMenu } from 'src/shared/components/user-menu';
import { useTheme } from 'src/shared/hooks/use-theme';

import { getUserSafeError } from 'src/shared/lib/error-messages';

export const rootRoute = createRootRoute({
  component: function RootComponent() {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const location = useLocation();

    const isHome = location.pathname === '/';

    return (
      <>
        <I18nWatcher />
        <div className='flex min-h-dvh flex-col'>
          <a
            href='#main-content'
            className='sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground'
          >
            {t('a11y.skipToContent')}
          </a>
          <header
            data-testid='site-header'
            className='sticky top-0 z-10 flex items-center justify-between bg-playful-bg-start/80 backdrop-blur-xl px-3 py-2 sm:px-6 sm:py-3'
          >
            <svg
              className='absolute bottom-0 left-0 w-full h-1.5 pointer-events-none'
              aria-hidden='true'
            >
              <defs>
                <pattern
                  id='hand-drawn-wave'
                  x='0'
                  y='0'
                  width='200'
                  height='6'
                  patternUnits='userSpaceOnUse'
                >
                  <path
                    d='M0,3 Q50,2 100,3 Q150,4 200,3'
                    stroke='var(--color-playful-accent)'
                    strokeWidth='2'
                    fill='none'
                  />
                </pattern>
              </defs>
              <rect width='100%' height='6' fill='url(#hand-drawn-wave)' />
            </svg>
            {isHome ? (
              <h1
                data-testid='header-title'
                className='text-base sm:text-lg font-heading text-playful-heading truncate max-w-40 sm:max-w-none'
              >
                {t('app.headerTitle')}
              </h1>
            ) : (
              <Link
                data-testid='header-title'
                to='/'
                className='text-base sm:text-lg font-heading text-playful-heading hover:opacity-80 transition-opacity truncate max-w-40 sm:max-w-none'
              >
                {t('app.headerTitle')}
              </Link>
            )}

            <div className='flex items-center gap-0.5 sm:gap-1 text-playful-text shrink-0'>
              <LanguageToggle />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <UserMenu />
            </div>
          </header>
          <main id='main-content' className='flex-1 flex flex-col'>
            <Outlet />
          </main>
        </div>
        <Toaster />
      </>
    );
  },
  errorComponent: function ErrorComponent({ error }) {
    const { t } = useTranslation();

    return (
      <div className='flex min-h-dvh flex-col'>
        <main id='main-content' className='flex-1 p-8'>
          <h1 className='text-2xl font-bold text-destructive'>{t('error.title')}</h1>
          <p className='mt-2 text-muted-foreground'>{getUserSafeError(error)}</p>
        </main>
      </div>
    );
  },
  notFoundComponent: function NotFoundComponent() {
    const { t } = useTranslation();

    return (
      <div className='flex min-h-dvh flex-col'>
        <main id='main-content' className='flex-1 p-8'>
          <h1 className='text-2xl font-bold'>{t('notFound.title')}</h1>
          <p className='mt-2 text-muted-foreground'>{t('notFound.description')}</p>
        </main>
      </div>
    );
  },
});
