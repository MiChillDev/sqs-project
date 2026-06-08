import { createRootRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nWatcher } from 'src/shared/components/i18n-watcher';
import { LanguageToggle } from 'src/shared/components/language-toggle';
import { ThemeToggle } from 'src/shared/components/theme-toggle';
import { Toaster } from 'src/shared/components/toaster';
import { Button } from 'src/shared/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from 'src/shared/components/ui/sheet';
import { UserMenu } from 'src/shared/components/user-menu';
import { useTheme } from 'src/shared/hooks/use-theme';

import { getUserSafeError } from 'src/shared/lib/error-messages';

export const rootRoute = createRootRoute({
  component: function RootComponent() {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isHome = location.pathname === '/';

    const navControls = (
      <div className='flex items-center gap-1 text-(--color-playful-text)'>
        <LanguageToggle />
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <UserMenu />
      </div>
    );

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
          <header className='sticky top-0 z-10 flex items-center justify-between relative border-b border-(--color-playful-accent) bg-(--color-playful-bg-start)/80 backdrop-blur-xl px-6 py-3'>
            <svg
              className='absolute bottom-0 left-0 w-full h-1.5 pointer-events-none'
              viewBox='0 0 1200 6'
              preserveAspectRatio='none'
              aria-hidden='true'
            >
              <path
                d='M0,3 Q150,0 300,3 Q450,6 600,3 Q750,0 900,3 Q1050,6 1200,3'
                stroke='var(--color-playful-accent)'
                strokeWidth='2'
                fill='none'
              />
            </svg>
            {isHome ? (
              <h1 className='text-lg font-heading text-(--color-playful-heading)'>
                {t('app.headerTitle')}
              </h1>
            ) : (
              <Link
                to='/'
                className='text-lg font-heading text-(--color-playful-heading) hover:opacity-80 transition-opacity'
              >
                {t('app.headerTitle')}
              </Link>
            )}

            <div className='hidden md:flex'>{navControls}</div>

            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='md:hidden text-(--color-playful-text)'
                  aria-label={t('header.menu')}
                >
                  <Menu className='size-5' />
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                className='w-64 bg-(--color-playful-bg-start) text-(--color-playful-text)'
              >
                <div className='flex flex-col gap-4 mt-8 items-start'>
                  <LanguageToggle />
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                  <UserMenu />
                </div>
              </SheetContent>
            </Sheet>
          </header>
          <main id='main-content' className='flex-1'>
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
