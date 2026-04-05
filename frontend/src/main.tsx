import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClientProviderWrapper } from './app/providers/query-client';
import { router } from './app/router';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProviderWrapper>
      <RouterProvider router={router} />
    </QueryClientProviderWrapper>
  </StrictMode>,
);
