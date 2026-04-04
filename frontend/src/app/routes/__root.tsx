import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';

import { ThemeToggle } from '@/shared/components/theme-toggle';
import { useTheme } from '@/shared/hooks/use-theme';

import { QueryClientProviderWrapper } from '../providers/query-client';

export const rootRoute = createRootRoute({
  component: function RootComponent() {
    const { theme, toggleTheme } = useTheme();

    return (
      <QueryClientProviderWrapper>
        <div className="flex min-h-dvh flex-col">
          <header className="flex items-center justify-between border-b px-6 py-3">
            <h1 className="text-lg font-semibold">SQS Preparation</h1>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
        <Toaster position="top-right" richColors theme={theme} />
      </QueryClientProviderWrapper>
    );
  },
  errorComponent: function ErrorComponent({ error }) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
    );
  },
  notFoundComponent: function NotFoundComponent() {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        <p className="mt-2 text-muted-foreground">The page you are looking for does not exist.</p>
      </div>
    );
  },
});
