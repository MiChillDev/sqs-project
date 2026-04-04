import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { QueryClientProviderWrapper } from '../providers/query-client';

export const rootRoute = createRootRoute({
  component: function RootComponent() {
    return (
      <QueryClientProviderWrapper>
        <Outlet />
        <Toaster position="top-right" richColors />
      </QueryClientProviderWrapper>
    );
  },
  errorComponent: function ErrorComponent({ error }) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Something went wrong</h1>
        <p>{error.message}</p>
      </div>
    );
  },
  notFoundComponent: function NotFoundComponent() {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    );
  },
});
