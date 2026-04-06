import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';

import { ConfigErrorBanner } from '@/shared/components/config-error-banner';
import { I18nWatcher } from '@/shared/components/i18n-watcher';
import { LanguageToggle } from '@/shared/components/language-toggle';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { useTheme } from '@/shared/hooks/use-theme';

import { getUserSafeError } from '@/shared/lib/error-messages';

export const rootRoute = createRootRoute({
  component: function RootComponent() {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    return (
      <>
        <ConfigErrorBanner />
        <I18nWatcher />
        <div className='flex min-h-dvh flex-col'>
          <a
            href='#main-content'
            className='sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground'
          >
            {t('a11y.skipToContent')}
          </a>
          <header className='flex items-center justify-between border-b px-6 py-3'>
            <h1 className='text-lg font-semibold'>{t('app.headerTitle')}</h1>
            <div className='flex items-center gap-1'>
              <LanguageToggle />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </header>
          <main id='main-content' className='flex-1'>
            <Outlet />
          </main>
        </div>
        <Toaster position='top-right' richColors theme={theme} />
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
