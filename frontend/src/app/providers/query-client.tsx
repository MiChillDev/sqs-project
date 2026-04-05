import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18next from 'i18next';
import { lazy, type ReactNode, Suspense } from 'react';
import { toast } from 'sonner';

import { getUserSafeError } from '@/shared/lib/error-messages';

const LazyReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })),
);

export { getUserSafeError };

export function handleMutationError(error: unknown): void {
  toast.error(i18next.t('toast.errorTitle'), {
    description: getUserSafeError(error),
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      refetchOnWindowFocus: true,
    },
    mutations: {
      onError: handleMutationError,
    },
  },
});

export function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <LazyReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
