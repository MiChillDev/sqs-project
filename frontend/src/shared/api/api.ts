import { authStorage } from 'src/shared/lib/auth-storage';
import { ApiError, NetworkError } from './api-error';
import type { components } from './generated/api-types';

export type Joke = components['schemas']['Joke'];
export type SourceJoke = components['schemas']['SourceJoke'];
export type JokeInput = components['schemas']['JokeInput'];
export type HealthCheck = components['schemas']['HealthCheck'];
export type ApiErrorBody = components['schemas']['Error'];
export type LoginRequest = components['schemas']['LoginRequest'];
export type TokenResponse = components['schemas']['TokenResponse'];

export { ApiError, NetworkError } from './api-error';

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? '';
}

const DEFAULT_TIMEOUT_MS = 10000;

interface AbortSetup {
  signal: AbortSignal;
  cleanup: () => void;
}

function createAbortSignal(options?: RequestInit & { timeout?: number }): AbortSetup {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? DEFAULT_TIMEOUT_MS);

  const onCallerAbort = () => controller.abort();
  if (options?.signal?.aborted) {
    controller.abort();
  } else {
    options?.signal?.addEventListener('abort', onCallerAbort, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
      options?.signal?.removeEventListener('abort', onCallerAbort);
    },
  };
}

function buildHeaders(options?: RequestInit & { auth?: boolean }): Headers {
  const headers = new Headers(options?.headers);
  if (options?.auth) {
    const stored = authStorage.get();
    if (stored) {
      headers.set('Authorization', `Bearer ${stored.token}`);
    }
  }
  return headers;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  let body: unknown;
  try {
    body = await response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    // response body not JSON
  }

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, body);
  }

  if (body === undefined) {
    throw new ApiError(response.status, 'Invalid JSON response from server');
  }

  return body;
}

export async function fetchApi<T>(
  path: string,
  options?: RequestInit & { timeout?: number; auth?: boolean }
): Promise<T> {
  const { signal, cleanup } = createAbortSignal(options);

  try {
    const headers = buildHeaders(options);

    let response: Response;
    try {
      response = await fetch(`${getApiBaseUrl()}${path}`, {
        ...options,
        headers,
        signal,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw err;
      }
      throw new NetworkError(err instanceof Error ? err : undefined);
    }

    return (await parseResponseBody(response)) as T;
  } finally {
    cleanup();
  }
}
