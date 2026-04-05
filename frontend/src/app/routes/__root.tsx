import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

import { ThemeToggle } from '@/shared/components/theme-toggle';
import { useTheme } from '@/shared/hooks/use-theme';

import { getUserSafeError } from '../providers/query-client';

export const rootRoute = createRootRoute({
  component: function RootComponent() {
    const { theme, toggleTheme } = useTheme();

    return (
      <>
        <div className="flex min-h-dvh flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
          >
            Skip to content
          </a>
          <header className="flex items-center justify-between border-b px-6 py-3">
            <h1 className="text-lg font-semibold">SQS Preparation</h1>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </header>
          <main id="main-content" className="flex-1">
            <Outlet />
          </main>
        </div>
        <Toaster position="top-right" richColors theme={theme} />
      </>
    );
  },
  errorComponent: function ErrorComponent({ error }) {
    useEffect(() => {
      document.title = 'Error | SQS Preparation';
    }, []);

    return (
      <div className="flex min-h-dvh flex-col">
        <main id="main-content" className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">{getUserSafeError(error)}</p>
        </main>
      </div>
    );
  },
  notFoundComponent: function NotFoundComponent() {
    useEffect(() => {
      document.title = '404 | SQS Preparation';
    }, []);

    return (
      <div className="flex min-h-dvh flex-col">
        <main id="main-content" className="flex-1 p-8">
          <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
          <p className="mt-2 text-muted-foreground">The page you are looking for does not exist.</p>
        </main>
      </div>
    );
  },
});
