import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClientProviderWrapper } from '@/app/providers/query-client';
import { router } from '@/app/router';
import { debugLogger } from '@/shared/lib/debug-logger';
import { initI18n } from '@/shared/lib/i18n';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const renderApp = () => {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProviderWrapper>
        <RouterProvider router={router} />
      </QueryClientProviderWrapper>
    </StrictMode>,
  );
};

initI18n()
  .then(renderApp)
  .catch((err) => {
    debugLogger.error('i18n initialization failed:', err);
    renderApp();
  });
