import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, type ReactNode, Suspense } from 'react';
import { toast } from 'sonner';

const LazyReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })),
);

export function getUserSafeError(error: unknown): string {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status;
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please sign in to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Something went wrong. Please try again later.';
    }
  }
  return 'An unexpected error occurred.';
}

export function handleMutationError(error: unknown): void {
  toast.error('An error occurred', {
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
