import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export { cleanup, render, screen, waitFor } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { afterEach, beforeEach, describe, expect, it } from 'vitest';

export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}
