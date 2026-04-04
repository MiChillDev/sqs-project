import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <div style={{ padding: '2rem' }}>
      <h1>SQS Preparation Frontend</h1>
      <p>Project scaffolded successfully. Routing will be added in the next task.</p>
    </div>
  </StrictMode>,
);
