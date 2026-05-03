import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18next from 'i18next';
import { lazy, type ReactNode, Suspense } from 'react';
import { toast } from 'sonner';

import { getUserSafeError } from 'src/shared/lib/error-messages';

const LazyReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools }))
);

export function handleQueryClientError(error: unknown): void {
  if (import.meta.env.DEV) {
    // biome-ignore lint/suspicious/noConsole: intentional dev-only error logging
    console.error('[API Error]', error);
  }
  toast.error(i18next.t('toast.errorTitle'), {
    description: getUserSafeError(error),
  });
}

let queryClient: QueryClient | undefined;

function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      queryCache: new QueryCache({ onError: handleQueryClientError }),
      mutationCache: new MutationCache({ onError: handleQueryClientError }),
      defaultOptions: {
        queries: {
          staleTime: 1000 * 30,
          refetchOnWindowFocus: true,
          retry: 1,
        },
        mutations: {
          retry: 0,
        },
      },
    });
  }
  return queryClient;
}

export function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <LazyReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
