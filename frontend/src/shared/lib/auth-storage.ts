const KEY = 'sqs.auth';

export type AuthStorageValue = { token: string; expiresAt: string };
type StorageHandler = (next: AuthStorageValue | null) => void;

export const authStorage = {
  get(): AuthStorageValue | null {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed.token !== 'string' || typeof parsed.expiresAt !== 'string') {
        if (import.meta.env.DEV) {
          // biome-ignore lint/suspicious/noConsole: intentional dev-only logging
          console.warn(
            '[authStorage] Clearing malformed token — expected { token: string, expiresAt: string }, got:',
            typeof parsed.token,
            typeof parsed.expiresAt
          );
        }
        localStorage.removeItem(KEY);
        return null;
      }
      if (new Date(`${parsed.expiresAt}Z`).getTime() <= Date.now()) {
        localStorage.removeItem(KEY);
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem(KEY);
      return null;
    }
  },
  set(v: AuthStorageValue): void {
    localStorage.setItem(KEY, JSON.stringify(v));
  },
  clear(): void {
    localStorage.removeItem(KEY);
  },
  subscribe(handler: StorageHandler): () => void {
    const listener = (e: StorageEvent) => {
      if (e.key !== KEY && e.key !== null) return;
      handler(authStorage.get());
    };
    globalThis.addEventListener('storage', listener);
    return () => globalThis.removeEventListener('storage', listener);
  },
};
