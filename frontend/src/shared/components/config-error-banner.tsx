import { useState } from 'react';

export function ConfigErrorBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  if (apiUrl !== undefined && apiUrl !== '') return null;

  return (
    <div className="flex items-center justify-between border-b border-destructive/20 bg-destructive/5 px-4 py-3">
      <p className="text-sm text-destructive">
        Configuration error: VITE_API_BASE_URL is not set. API-dependent features are disabled.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="px-2 text-lg text-destructive hover:text-destructive/80"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
