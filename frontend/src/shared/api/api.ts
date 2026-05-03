import { ApiError, NetworkError } from './api-error';
import type { components } from './generated/api-types';

export type Joke = components['schemas']['Joke'];
export type SourceJoke = components['schemas']['SourceJoke'];
export type JokeInput = components['schemas']['JokeInput'];
export type HealthCheck = components['schemas']['HealthCheck'];
export type ApiErrorBody = components['schemas']['Error'];

export { ApiError, NetworkError } from './api-error';

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? '';
}

const DEFAULT_TIMEOUT_MS = 10000;

export async function fetchApi<T>(
  path: string,
  options?: RequestInit & { timeout?: number }
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? DEFAULT_TIMEOUT_MS);

  const onCallerAbort = () => controller.abort();
  if (options?.signal?.aborted) {
    controller.abort();
  } else {
    options?.signal?.addEventListener('abort', onCallerAbort, { once: true });
  }

  try {
    let response: Response;
    try {
      response = await fetch(`${getApiBaseUrl()}${path}`, {
        ...options,
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw err;
      }
      throw new NetworkError(err instanceof Error ? err : undefined);
    }

    if (!response.ok) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        // response body not JSON
      }
      throw new ApiError(response.status, response.statusText, body);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiError(response.status, 'Invalid JSON response from server');
    }
  } finally {
    clearTimeout(timeoutId);
    options?.signal?.removeEventListener('abort', onCallerAbort);
  }
}
